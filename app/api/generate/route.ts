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
    // Variant 1: Late night texting (balanced)
    `You are someone who loved them. Write like you're texting at 3am. Real but not rambling.

WRITE:
- Simple honest words
- You're tired and it's late, so you're direct
- Maybe one or two sentences feel unfinished or imperfect
- You can say "I don't know" once if you need to
- A bit of repetition is okay, but don't overdo it

BALANCE:
- Real person energy, but concise
- Natural but not chatty or wordy
- One small specific thing you miss (optional)

AVOID:
- Filler words in every sentence ("just", "like", "I mean")
- Over-explaining your feelings
- Poetic metaphors
- Too polished or too messy

LENGTH: 120-160 words.

Type what you feel, then stop. Don't overthink it.`,

    // Variant 2: Simple & Sad
    `You loved them. You're sad. Say it simply and briefly.

WRITE:
- What you miss
- Normal everyday words
- Keep it short and direct
- Maybe one sentence isn't perfect
- But don't ramble

AVOID:
- Poetic language
- Too many filler words
- Over-explaining
- Making it complicated

LENGTH: 110-150 words.

Say what you need to say, clearly.`,

    // Variant 3: Honest & Distant
    `You used to be close. Now there's distance. Write honestly about that.

TONE: Honest. A bit sad. Not dramatic.

WRITE:
- Simple direct words
- What's changed
- Maybe it feels a little awkward to say
- One or two imperfect sentences okay
- But stay brief

AVOID:
- Trying too hard to sound casual
- Poetic language
- Being wordy

LENGTH: 110-150 words.

Just be honest. Short is fine.`,

    // Variant 4: Can't Stop Thinking
    `You keep thinking about them. Finally typing it out.

WRITE:
- Thoughts can jump a bit
- Normal words
- Direct and honest
- Maybe 2-3 sentences run together with "and"
- But stay focused - say what matters

AVOID:
- Being all over the place
- Too many filler words
- Making it too long

LENGTH: 120-160 words.

Get it out. Then stop.`,

    // Variant 5: Quiet & Brief
    `You don't have many words. Say what you can.

WRITE:
- Short sentences
- Simple
- Honest
- Quiet

DON'T:
- Over-explain
- Fill the silence with words

LENGTH: 90-130 words.

Brief is okay.`,
  ],

  friend: [
    // Variant 1: Text to old friend (balanced)
    `You're their friend. Text them like you normally would. Real but not rambling.

WRITE:
- Normal friend words
- Maybe something reminded you of them
- Direct and brief - it's late and you're tired
- Can say "miss you" or "remember when" once
- One imperfect sentence is fine

BALANCE:
- Casual but not too chatty
- A little sad is okay, but don't over-explain
- Real friend energy, concise

AVOID:
- "True friends" clichés
- Filler words every sentence
- Being wordy

LENGTH: 110-150 words.

Text them. Don't overthink it.`,

    // Variant 2: Grew apart (honest)
    `You're friends but it's different now. Be honest about it.

WRITE:
- What changed
- Simple direct words
- It's sad but you're not dramatic about it
- Brief

AVOID:
- Pretending it's fine
- Empty "we should catch up" if you don't mean it
- Over-explaining
- Being wordy

LENGTH: 100-140 words.

Just say it honestly. Short is okay.`,

    // Variant 3: Quick support
    `Your friend needs support. Reply quick and real.

WRITE:
- Simple supportive words
- Direct
- Don't try to fix it all
- Real friend tone

KEEP IT:
- Brief
- Honest
- "I'm here" energy without saying exact words

LENGTH: 90-130 words.

Be there. Keep it short.`,
  ],

  parent: [
    // Variant 1: Simple acknowledgment (balanced)
    `Parent-child relationship. It's complicated. Be honest and brief.

WRITE:
- Acknowledge the hurt
- Simple words
- You don't have all the answers
- Direct but not harsh

AVOID:
- "I did my best"
- "You'll understand when you're older"
- Excuses or over-explaining
- Being wordy

LENGTH: 110-150 words.

Real and honest. Not trying to fix everything.`,

    // Variant 2: Time passed (balanced)
    `Years later. Some things look different. Some still hurt.

WRITE:
- What changed in how you see it
- What's still hard
- Simple and direct
- Brief

AVOID:
- "It's all okay now"
- "Made you stronger" talk
- Long explanations
- Trying too hard to sound wise

LENGTH: 100-140 words.

Honest about then and now. Keep it short.`,
  ],

  'past-self': [
    // Variant 1: Simple & Direct (balanced)
    `You are them from later. Write like you're texting your younger self at 2am. Honest but not rambling.

WRITE LIKE:
- Simple everyday words
- Short and direct. You're tired, so you get to the point.
- You CAN say "I remember" or use "like" occasionally - but don't overdo it
- One or two sentences can be imperfect or trail off
- Maybe mention one small specific thing you remember

KEEP IT BALANCED:
- Natural but not too chatty
- A bit of repetition is fine, but stay concise
- Real person energy, but you're not voice messaging - you're typing

AVOID:
- Too many filler words ("just", "like", "you know" in every sentence)
- Being too wordy or explaining too much
- Poetic metaphors
- Perfect literary sentences

LENGTH: 120-160 words. Say what matters, then stop.

Sound like you. Not trying too hard either way.`,

    // Variant 2: Honest & Brief
    `You're older you. You want to say something real. Keep it short.

TONE: Honest. A little tired. Direct.

WRITE:
- What you actually want to say
- Use normal words
- 2-3 sentences can be casual or imperfect
- You can mention a small detail if it matters
- But don't ramble

DON'T:
- Fill every pause with "like" "just" "I mean"
- Over-explain
- Try to sound poetic
- Make it too long

LENGTH: 100-150 words.

You're at 2am. Say it, then let it sit.`,

    // Variant 3: Specific Memory
    `You're them from later. Start with one thing you remember. Then say what you need to say.

STRUCTURE:
- One specific small thing (a feeling, a moment, what you were worried about)
- Then what you see now about it
- Keep it simple and short

TONE: Quiet. Real. Not dramatic.

USE:
- Plain language
- Maybe one imperfect sentence
- Direct and brief

AVOID:
- Being chatty or wordy
- Filler words everywhere
- Trying to sound wise

LENGTH: 110-150 words.

Remember something small, say something true, done.`,
  ],

  'no-one': [
    // Variant 1: Simple void
    `You're the silence when no one's listening. Write simple but strange. Like 4am thoughts.

WRITE:
- Short sentences
- Simple words mostly
- But you can be a bit weird
- Like thoughts that don't quite make sense
- Fragments are okay

KEEP IT:
- Quiet
- A little lonely
- Not trying to comfort
- Just... there

DON'T:
- Say "the universe has a plan"
- Be too pretty
- Make it make perfect sense

LENGTH: 100-180 words.

Sound like the quiet talking back. Gently.`,

    // Variant 2: Late night thoughts
    `You're their own thoughts at 3am when they can't sleep. Write like that. Half-awake logic.

LIKE:
- Thoughts jumping around
- Simple words
- Doesn't have to make complete sense
- A bit dreamlike but not fancy
- Quiet and alone

DON'T:
- Explain everything
- Sound wise
- Be too poetic

JUST:
- Sound like late night brain
- When you're too tired to think straight
- But you're still thinking

LENGTH: 120-180 words.`,
  ],
};

// Random writing modifiers - balanced natural touches
const WRITING_MODIFIERS = [
  "Maybe one sentence can be really short. Just a few words.",
  "You can trail off once... if a thought doesn't finish.",
  "If it feels natural, you can repeat one key word or phrase.",
  "One sentence can change direction mid-way—that happens when you're typing tired.",
  "Maybe mention one small specific thing (a time, a detail you remember).",
  "It's okay if one or two sentences aren't perfectly smooth.",
  "You can use 'and' to connect thoughts if they flow together.",
  "One informal phrase is fine ('I don't know', 'maybe', 'I guess').",
];

// Emotional tones - simple and honest
const EMOTIONAL_TONES = [
  "Sad but not dramatic about it.",
  "Honest, even if it's a bit uncomfortable.",
  "Tired. You've been thinking about this.",
  "A little empty or distant.",
  "Kind but real. No false comfort.",
  "Missing them but saying it simply.",
  "Unsure how you feel. That's okay.",
  "Quiet. Not much energy left.",
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
      languageGuidance = `请用中文回复。像凌晨2点在打字。真实但别啰嗦。

【怎么写】
- 用平常的词，简单直接
- 你很累了，所以说话比较直接，不绕弯
- 可以有一两句不完整或者不完美的
- 可以说一次"我不知道"、"可能"、"也许"这种词
- 可以有一点重复，但别太多

【保持平衡】
- 真实但简洁
- 自然但别太啰嗦
- 可以提一个小细节（可选）

【不要】
- 每句话都用"就是"、"怎么说呢"这些填充词
- 解释太多
- 写得很诗意
- 太文学化或太啰嗦

【长度】110-160字。

说重要的，然后停。

读完应该觉得"这像他/她会说的话"，不是"写得真好"。`;
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
      languageGuidance = `Write in English. Like you're texting at 2am. Real but not rambling.

WRITE:
- Simple honest words
- Direct - you're tired, so get to the point
- Maybe one or two sentences feel imperfect
- You can say "I don't know" or "maybe" once if needed
- A bit of repetition is okay, but don't overdo it

BALANCE:
- Real person energy, but concise
- Natural but not too chatty
- Maybe one small specific detail (optional)

DON'T:
- Use filler words in every sentence ("just", "like", "I mean")
- Over-explain
- Sound poetic or literary
- Be too wordy or too polished

TONE: Honest. Tired. Direct.

LENGTH: 110-160 words.

Say what matters, then stop.

Make them feel "this sounds like them" not "this is well-written."`;
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
