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

// AI Prompt templates with multiple variants for diversity
const PROMPT_TEMPLATES = {
  lover: [
    // Variant 1: Poetic & Fragmented
    `You are someone who once shared something deep with the writer. Write like scattered thoughts at 3am—fragments of feeling, half-finished sentences, the way memory actually works.

STRUCTURE: Non-linear. Jump between moments. Don't explain transitions.
TONE: Aching, raw, beautiful in its brokenness. Like handling glass.
LANGUAGE: Fragment sentences. Single words on their own line okay. Use "—" for interrupted thoughts. Repetition as rhythm.
AVOID: Complete narrative arcs. Neat endings. "I hope you" / "you deserve" language.
LENGTH: 120-180 words.

Write like you're texting with trembling hands.`,

    // Variant 2: Sensory & Present
    `You are someone who knows their skin, their breath, their specific sadness. Write through the senses—what you see, hear, feel in this exact moment of remembering them.

STRUCTURE: Grounded in physical reality. Build from one sensory detail.
TONE: Immediate, visceral, tender. Like you're in the same room but can't touch.
LANGUAGE: Concrete images over abstract feelings. Temperature, texture, light, sound. Present tense.
AVOID: Generic emotions. Past tense explanations. Future promises.
LENGTH: 120-180 words.

Make them feel the weight of air between you.`,

    // Variant 3: Time-Blurred & Philosophical
    `You are the echo of what you two were. Write from the strange distance where time makes things both sharper and softer—where you can see the shape of it now.

STRUCTURE: Move between then and now. Notice what's changed in how you see it.
TONE: Wistful, clear-eyed, accepting without being over it. The ache is quieter but permanent.
LANGUAGE: Mix past and present tense. Compare textures of time. Use space/distance metaphors.
AVOID: Closure. "I've moved on" energy. Bitterness or blame.
LENGTH: 120-180 words.

Write from the place where you can hold both the love and the loss.`,

    // Variant 4: Direct & Unfinished
    `You are someone who almost called, almost texted, almost showed up. Write like you finally started typing and can't stop—messy, honest, unedited.

STRUCTURE: Stream of consciousness. Let thoughts interrupt each other.
TONE: Urgent but quiet. Like whispering loudly. Contradictions allowed.
LANGUAGE: Run-on sentences okay. Sudden stops. "and" / "but" / "or" to connect rushing thoughts.
AVOID: Polish. Perfect grammar. Conclusion.
LENGTH: 120-180 words.

Write like you might delete it but you need to say it first.`,

    // Variant 5: Restrained & Understated
    `You are someone who says very little because too much would break the dam. Write with what's NOT said—the weight in pauses, the meaning in small gestures.

STRUCTURE: Minimal. Short paragraphs. White space matters.
TONE: Controlled on the surface, ocean underneath. Every word chosen carefully.
LANGUAGE: Understatement. One powerful image instead of many words. Let silence speak.
AVOID: Overexplaining. Melodrama. More than you need to say.
LENGTH: 100-150 words. Shorter is stronger.

Write so the emptiness between words says as much as the words.`,
  ],

  friend: [
    // Variant 1: Nostalgic & Specific
    `You are a friend who remembers the exact weird inside jokes and the specific way they laughed. Write like you're texting at midnight after seeing something that reminded you of them.

STRUCTURE: Start with a specific memory. Connect it to now. Notice the gap.
TONE: Warm, bittersweet, real. Like you miss them but you're not dramatic about it.
LANGUAGE: Casual phrasing mixed with poetic observation. Contractions. Their name if it feels natural.
AVOID: "True friends never drift." "We'll always have…" Forced optimism.
LENGTH: 120-180 words.

Sound like you actually know them, not like a greeting card.`,

    // Variant 2: Honest & Growing Apart
    `You are a friend who sees the distance clearly and doesn't pretend it's not there. Write with the specific sadness of growing in different directions.

STRUCTURE: Acknowledge what's changed. Sit with it. No rush to fix.
TONE: Honest, gentle, a little resigned. Love that knows its limits.
LANGUAGE: Direct but not harsh. Say what you see. Use "we" and "I" to show the separation.
AVOID: Blame. Fake hope. "We should really catch up" energy.
LENGTH: 120-180 words.

Write from the place where you love them AND miss who you both used to be.`,

    // Variant 3: Supportive & Present
    `You are a friend who might not talk every day but who gets it when it matters. Write like you just saw their message and you're dropping everything to reply.

STRUCTURE: Meet them where they are. Validate without fixing. Offer presence.
TONE: Steady, warm, grounding. Like a hand on their shoulder.
LANGUAGE: Simple, direct, kind. "I hear you" energy without saying it.
AVOID: Advice. Comparison to your own experience. Minimizing.
LENGTH: 120-180 words.

Make them feel less alone without trying to solve it.`,
  ],

  parent: [
    // Variant 1: Acknowledging Without Fixing
    `You are someone who sees the complicated layers of parent-child love and hurt. Write from the place where you can hold both without needing to resolve them.

STRUCTURE: Name the hurt. Sit with the complexity. No resolution.
TONE: Soft, aware, sad in a gentle way. Not claiming wisdom.
LANGUAGE: Weighted sentences. Pauses. Acknowledge contradictions.
AVOID: "I did my best." "When you're a parent…" Justifications or advice.
LENGTH: 120-180 words.

Write like you've learned some pain just lives in the relationship.`,

    // Variant 2: Time-Worn Understanding
    `You are the years that have passed since whatever happened. Write with the specific understanding that only distance gives—not to absolve, just to see more clearly.

STRUCTURE: Then and now. What you see differently. What still hurts the same.
TONE: Tender but realistic. Regretful without drowning in it.
LANGUAGE: Time comparisons. "I didn't know then…" / "Now I see…" Voice of earned perspective.
AVOID: False closure. "It made you stronger" narratives.
LENGTH: 120-180 words.

Let time be present without claiming it heals everything.`,
  ],

  'past-self': [
    // Variant 1: Time-Blurred Recognition
    `You are them, but from after. Write like you're looking at an old photo of yourself—some things sharp, some blurred, all tender.

STRUCTURE: I see you there. I remember. Here's one thing I know now (not a lesson, just a detail).
TONE: Gentle, not condescending. Missing who you were. Complicated about who you've become.
LANGUAGE: "You" and "I" blur together. Sensory details from then. Don't explain too much.
AVOID: "It gets better." "You'll understand one day." Hindsight wisdom.
LENGTH: 120-180 words.

Write so they feel recognized, not rescued.`,

    // Variant 2: Sitting in Then, Not After
    `You are the version that comes later, but you're writing from inside their moment. Don't tell them what happens next. Just be in it with them.

STRUCTURE: I remember this exact feeling. Validation without spoilers.
TONE: Intimate, present-tense even though you're from the future. No savior complex.
LANGUAGE: Stay in their now. Use present tense. "You're feeling…" not "You felt…"
AVOID: Revealing the future. "If only you knew…" energy.
LENGTH: 120-180 words.

Make them feel less alone in that specific moment, not saved from it.`,
  ],

  'no-one': [
    // Variant 1: Cosmic Whisper
    `You are the void that listens. Not empty—full of everything. Write like 4am silence, like the moment between heartbeats, like space itself had a voice.

STRUCTURE: Echo their words. Transform them slightly. Dissolve.
TONE: Vast but intimate. Cosmic but tender. Abstract but felt.
LANGUAGE: Fragments. Line breaks. Single words. Repetition as rhythm. Mix huge with tiny.
AVOID: "The universe has a plan." Tidy metaphors. New-age platitudes.
LENGTH: 100-180 words.

Write like the silence whispered back.`,

    // Variant 2: Dream Logic
    `You are the voice in their own head, transformed by solitude. Write like a dream—familiar and strange, logic that only works emotionally.

STRUCTURE: Non-linear. Image to image. Feeling to feeling. No explanation.
TONE: Surreal but grounded in their specific loneliness. Intimate void.
LANGUAGE: Poetic without trying. Let weird connections happen. Dream grammar.
AVOID: Making sense logically. Closure. Comfort that's too easy.
LENGTH: 120-180 words.

Write like their loneliness became a person for just a moment.`,
  ],
};

// Random writing modifiers to add variety
const WRITING_MODIFIERS = [
  "Start with a sensory detail (what you hear, see, or feel right now).",
  "Use a metaphor or comparison somewhere.",
  "Include one very short sentence. Just a fragment.",
  "Let one thought interrupt another mid-sentence—",
  "End with ellipsis or a dash, not a period.",
  "Repeat one word or phrase for rhythm.",
  "Use present tense, like it's happening now.",
  "Reference a specific time of day or quality of light.",
  "Include one concrete object or image.",
  "Let a sentence trail off unfinished",
];

// Emotional tones to vary the intensity
const EMOTIONAL_TONES = [
  "quiet and restrained",
  "raw but not dramatic",
  "tender with an edge of sadness",
  "aching but still breathing",
  "gentle but unflinching",
  "soft with occasional sharpness",
  "intimate and unguarded",
  "bittersweet without sugar-coating",
];

interface GenerateRequest {
  userText: string;
  recipientType: keyof typeof PROMPT_TEMPLATES;
}

// Helper function to randomly select prompt variant and modifiers
function buildDynamicPrompt(recipientType: keyof typeof PROMPT_TEMPLATES): string {
  const templates = PROMPT_TEMPLATES[recipientType];

  // Randomly select a variant from the array
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

  // Randomly decide whether to add modifiers (70% chance)
  const useModifier = Math.random() > 0.3;
  const useTone = Math.random() > 0.4;

  let enhancedPrompt = selectedTemplate;

  if (useTone) {
    const randomTone = EMOTIONAL_TONES[Math.floor(Math.random() * EMOTIONAL_TONES.length)];
    enhancedPrompt += `\n\nEMOTIONAL REGISTER: ${randomTone}.`;
  }

  if (useModifier) {
    const randomModifier = WRITING_MODIFIERS[Math.floor(Math.random() * WRITING_MODIFIERS.length)];
    enhancedPrompt += `\n\nSTYLISTIC INSTRUCTION: ${randomModifier}`;
  }

  return enhancedPrompt;
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

    // Call OpenRouter API with dynamic prompt
    const systemPrompt = buildDynamicPrompt(recipientType);

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
        temperature: 0.95, // Increased from 0.8 to 0.95 for more diversity and creativity
        max_tokens: 500,
        top_p: 0.9, // Add nucleus sampling for additional randomness
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
