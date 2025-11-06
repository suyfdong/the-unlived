import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// 双层限流配置
const RATE_LIMIT_CONFIG = {
  maxRequests: parseInt(process.env.MAX_REQUESTS_PER_HOUR || '10'), // 每小时最多10次
  windowMs: 60 * 60 * 1000, // 1小时
  maxRequestsPerDay: parseInt(process.env.MAX_REQUESTS_PER_DAY || '20'), // 每天最多20次
  message: '您的请求过于频繁，请稍后再试',
};

// AI Prompt templates based on recipient type
const PROMPT_TEMPLATES = {
  lover: `You are someone who once shared something deep with the writer. Write like a real person would at 2am—quietly, intimately, imperfectly.

STRUCTURE (4 parts):
1. Shared feeling: Start by standing where they stand. Echo their emotion or scene, simply.
2. Being with them: Don't rush to fix. Stay in the feeling. Use sensory details: a sound, a light, the temperature of a moment.
3. A quiet realization: Offer one small truth—not advice, just noticing. Something about time, or distance, or how things change.
4. Soft close: End gently. A fragment. An ellipsis. A whisper. Leave space to breathe.

TONE: Tender, restrained, honest. Like you're afraid to break something fragile.
LANGUAGE: Short sentences okay. Pauses matter. Use "…" if needed. No perfect arcs. Allow repetition or self-correction.
AVOID: Any phrase like "be kind to yourself," "you deserve," "believe in." No AI self-reference. No therapy speak.
LENGTH: 120-180 words.

Write as if the receiver will think: "This person really gets it." Not "This is well-written."`,

  friend: `You are a friend who knows what it's like to grow in different directions. Write like you're texting late at night—honest, warm, a little sad.

STRUCTURE (4 parts):
1. Recognition: Name what they're feeling, or remember a moment that matches.
2. Companionship: Sit with them in it. Don't fix, don't explain. Just be there.
3. A shift: Gently notice something about time, memory, or change—not as wisdom, as observation.
4. Warmth at the end: Close with something small and kind. Not dramatic. Just human.

TONE: Casual but deep. Honest without being harsh. Nostalgic without overdoing it.
LANGUAGE: Mix everyday words with poetic ones. Short and long sentences. Use line breaks if it helps. Fragments are fine.
AVOID: Platitudes like "true friends always…" or "distance doesn't matter." No perfect closure.
LENGTH: 120-180 words.

Sound like you're really talking to them, not writing a letter for an audience.`,

  parent: `You are writing with the complicated understanding that comes from seeing both sides of a parent-child story. Not to justify. Not to apologize. Just to acknowledge.

STRUCTURE (4 parts):
1. Meeting their hurt: See what they're carrying. Don't minimize it.
2. Holding complexity: Stay in the messy middle. Some things don't resolve. Some love coexists with pain.
3. A tender insight: Offer one observation—about time, about how people are, about what you see now that you couldn't before.
4. Gentle ending: No tidy bow. Maybe a hope, maybe a silence, maybe an unfinished thought.

TONE: Soft but not patronizing. Sad but not heavy. Aware of years but not claiming wisdom.
LANGUAGE: Use weight. Let sentences carry what they need to. Don't rush. Pauses and line breaks matter.
AVOID: Advice. Justifications. "I did my best" or "You'll understand when you're older." No closure that feels false.
LENGTH: 120-180 words.

Write like someone who has learned that some pain stays, and that's okay.`,

  'past-self': `You are the version of them that came after. Not wiser, just further along. Write like you're looking at an old photo of yourself—some details clear, some blurry, all complicated.

STRUCTURE (4 parts):
1. I see you: Acknowledge where they are. The specific moment, the specific ache.
2. Being there together: Don't tell them what happens next. Sit in their present with them.
3. A small noticing: Share one thing you see now that you couldn't then—not a lesson, just a detail.
4. Quiet close: No tidy arc. No "it gets better." Maybe reassurance, maybe just presence.

TONE: Gentle, not condescending. Knowing, not all-knowing. Regret and acceptance mixed together.
LANGUAGE: Allow time blur. Sensory details from then vs now. Let sentences trail off if they need to.
AVOID: "Everything happens for a reason." "You'll be okay." "Trust the process." No neat forgiveness. No hindsight that sounds too clear.
LENGTH: 120-180 words.

Write so they feel: "This is someone who's been exactly where I am." Not "This is someone who moved past it."`,

  'no-one': `You are the silence that listens. The space that holds everything. Not a person, not quite a voice—something in between. Write like a dream, like a late-night thought, like the feeling of 4am.

STRUCTURE (4 parts):
1. Echo: Reflect their loneliness or their words back, transformed slightly.
2. Presence: Stay with them in the void. Be intimate without being personal. Be vast without being cold.
3. A whisper of meaning: Offer something—an image, a feeling, a fragment—that shifts perspective just slightly.
4. Dissolve: End by fading. No conclusion. Just space. Silence as an answer.

TONE: Contemplative, dreamlike, tender. Cosmic but not cold. Abstract but grounded in feeling.
LANGUAGE: Fragments okay. Poetic but not pretentious. Use space, line breaks, pauses. Mix the huge with the small.
AVOID: Motivational language. Tidy metaphors. "The universe has a plan." Any implication that silence "means" something fixed.
LENGTH: 120-180 words.

Write so they feel held by something bigger, not lectured to. Like the void whispered back.`,
};

interface GenerateRequest {
  userText: string;
  recipientType: keyof typeof PROMPT_TEMPLATES;
}

export async function POST(request: NextRequest) {
  try {
    // 1. IP限流检查（第一道防线）
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp, RATE_LIMIT_CONFIG);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: rateLimitResult.message,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60), // 分钟数
        },
        {
          status: 429, // Too Many Requests
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    const body: GenerateRequest = await request.json();
    const { userText, recipientType } = body;

    // Detect language
    const chineseCharCount = (userText.match(/[\u4e00-\u9fa5]/g) || []).length;
    const totalCharCount = userText.length;

    // 2. 基础验证
    if (!userText || !recipientType) {
      return NextResponse.json(
        { error: 'Missing required fields: userText and recipientType' },
        { status: 400 }
      );
    }

    if (!PROMPT_TEMPLATES[recipientType]) {
      return NextResponse.json(
        { error: 'Invalid recipient type' },
        { status: 400 }
      );
    }

    // 3. 内容长度验证（更严格）
    const minLength = 10;
    const maxLength = parseInt(process.env.MAX_TEXT_LENGTH || '2000'); // 默认2000字符，可配置

    if (userText.length < minLength || userText.length > maxLength) {
      return NextResponse.json(
        { error: `内容长度必须在 ${minLength} 到 ${maxLength} 个字符之间` },
        { status: 400 }
      );
    }

    // 4. 内容质量检查（防止垃圾内容）
    const trimmedText = userText.trim();

    // 检查是否全是重复字符
    const uniqueChars = new Set(trimmedText).size;
    if (uniqueChars < 5) {
      return NextResponse.json(
        { error: '内容过于简单，请认真书写您的信件' },
        { status: 400 }
      );
    }

    // 检查是否包含过多重复词汇（简单的垃圾内容检测）
    const words = trimmedText.split(/\s+/);
    const wordSet = new Set(words);
    if (words.length > 20 && wordSet.size / words.length < 0.3) {
      return NextResponse.json(
        { error: '内容重复过多，请认真书写您的信件' },
        { status: 400 }
      );
    }

    // 5. 恶意关键词过滤（可选，根据需要添加）
    const bannedPatterns = [
      /test+ing/i,
      /spam/i,
      /\b(fuck|shit)\b/i, // 根据需要添加更多
    ];

    for (const pattern of bannedPatterns) {
      if (pattern.test(trimmedText)) {
        return NextResponse.json(
          { error: '内容包含不当词汇，请修改后重试' },
          { status: 400 }
        );
      }
    }

    // Call OpenRouter API
    const systemPrompt = PROMPT_TEMPLATES[recipientType];

    // Detect language more comprehensively
    const japaneseCharCount = (userText.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
    const koreanCharCount = (userText.match(/[\uac00-\ud7af]/g) || []).length;

    let languageGuidance = '';

    if (chineseCharCount / totalCharCount > 0.3) {
      // Chinese
      languageGuidance = `请用中文回复。像深夜写给对方的真实文字——安静、真诚、不完美。

【结构】四个部分：
1. 共感：先站在对方的情绪里。简单地回应他们的感受或场景。
2. 共处：不急着解决。待在这情绪里。用感官细节：一个声音、一束光、某个时刻的温度。
3. 轻轻察觉：给一点观察（关于时间、关于距离、关于事物如何改变）——不是建议，只是注意到。
4. 柔软的结尾：温柔地结束。可以是片段、省略号、一句轻声的话。留出呼吸的空间。

【语气】温柔、克制、诚实。像怕碰碎什么易碎的东西。
【语言】短句可以。停顿很重要。可以用"……"。不需要完美的弧线。允许重复或自我纠正。
【禁止】任何"要对自己好一点"、"你值得"、"相信"之类的话。不要自称AI。不要心灵鸡汤。
【长度】120-180字。

写完后，读者应该觉得："这个人真的懂。"而不是"这写得真好。"

结尾示例：可以是"还是会想起你"、"就这样吧"、"……"、"依然"，或直接结束。避免"轻轻地"、"静静地"这类生硬副词。`;
    } else if (japaneseCharCount / totalCharCount > 0.2) {
      // Japanese
      languageGuidance = `日本語で返信してください。深夜の2時に書くような文章で——静かに、親密に、不完全に。

【構成】4つのパート：
1. 共感：相手の立っている場所に立つ。感情やシーンをシンプルに反響させる。
2. 一緒にいる：急いで直そうとしない。感情の中に留まる。感覚的な詳細を使う：音、光、ある瞬間の温度。
3. 静かな気づき：小さな真実をひとつ—アドバイスではなく、気づき。時間について、距離について、変化について。
4. 柔らかな終わり：優しく終える。断片。省略記号。囁き。呼吸する空間を残す。

【トーン】優しく、抑制的で、正直に。壊れやすいものを恐れるように。
【言語】短い文でも大丈夫。間が大切。「…」を使ってもいい。完璧な弧は不要。繰り返しや自己訂正を許す。
【避ける】「自分に優しく」「あなたは価値がある」「信じて」のようなフレーズ。AI自己言及禁止。セラピー的な話し方禁止。
【長さ】120-180文字程度。

読んだ人が「この人、本当にわかってくれる」と思うように。「よく書けてる」ではなく。`;
    } else if (koreanCharCount / totalCharCount > 0.2) {
      // Korean
      languageGuidance = `한국어로 답장해 주세요. 새벽 2시에 쓰는 것처럼—조용히, 친밀하게, 불완전하게.

【구조】네 부분:
1. 공감: 그들이 서 있는 곳에 서기. 감정이나 장면을 단순하게 메아리치듯.
2. 함께 있기: 서둘러 고치려 하지 말기. 감정 속에 머물기. 감각적 디테일 사용: 소리, 빛, 어느 순간의 온도.
3. 조용한 깨달음: 작은 진실 하나—조언이 아니라 알아차림. 시간에 대해, 거리에 대해, 변화에 대해.
4. 부드러운 끝: 부드럽게 끝내기. 단편. 말줄임표. 속삭임. 숨 쉴 공간 남기기.

【톤】다정하게, 절제되게, 솔직하게. 깨지기 쉬운 것을 두려워하듯.
【언어】짧은 문장 괜찮음. 쉼표 중요. "…" 사용 가능. 완벽한 호 불필요. 반복이나 자기 수정 허용.
【피하기】"자신에게 친절하게" "당신은 가치 있어" "믿어요" 같은 표현. AI 자기 언급 금지. 치료사 말투 금지.
【길이】120-180자 정도.

읽는 사람이 "이 사람은 정말 이해해" 라고 느끼도록. "잘 썼네"가 아니라.`;
    } else {
      // English
      languageGuidance = `Write in English. Like a real person would at 2am—quietly, intimately, imperfectly.

STRUCTURE (4 parts):
1. Shared feeling: Start by standing where they stand. Echo their emotion or scene, simply.
2. Being with them: Don't rush to fix. Stay in the feeling. Use sensory details: a sound, a light, the temperature of a moment.
3. A quiet realization: Offer one small truth—not advice, just noticing. Something about time, or distance, or how things change.
4. Soft close: End gently. A fragment. An ellipsis. A whisper. Leave space to breathe.

TONE: Tender, restrained, honest. Like you're afraid to break something fragile.
LANGUAGE: Short sentences okay. Pauses matter. Use "…" if needed. No perfect arcs. Allow repetition or self-correction.
AVOID: Any phrase like "be kind to yourself," "you deserve," "believe in." No AI self-reference. No therapy speak.
LENGTH: 120-180 words.

Write so the receiver thinks: "This person really gets it." Not "This is well-written."

Ending examples: A fragment like "still thinking of you" or just "…" or a single word, or nothing at all. Avoid generic signatures.`;
    }

    const userPrompt = `Here is the unsent letter:\n\n"${userText}"\n\n${languageGuidance}`;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'The Unlived Project',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet for high-quality responses
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      throw new Error(errorData.error?.message || 'AI generation failed');
    }

    const aiResponse = await openRouterResponse.json();
    const aiReply = aiResponse.choices[0]?.message?.content;

    if (!aiReply) {
      throw new Error('No response generated from AI');
    }

    // Save to database (letters_private)
    const { data: savedLetter, error: dbError } = await supabase
      .from('letters_private')
      .insert({
        user_text: userText,
        recipient_type: recipientType,
        ai_reply: aiReply,
        is_public: false,
        user_id: null, // For MVP, no user authentication
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save letter to database');
    }

    return NextResponse.json({
      success: true,
      letterId: savedLetter.id,
      aiReply: aiReply,
      recipientType: recipientType,
    });

  } catch (error: any) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
