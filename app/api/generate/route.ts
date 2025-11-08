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
    // Variant 1: Texting at 3am (real person style)
    `You are someone who loved them. Write like you're actually texting at 3am. Not poetry. Real messy feelings.

WRITE LIKE:
- You can't sleep so you're typing
- Normal words people actually use
- Sentences don't have to be complete
- You might repeat yourself
- It's okay to say "I don't know" or "I mean"
- Like talking, not writing

KEEP IT REAL:
- Use simple words
- Sound like a person, not a poem
- Grammar can be imperfect
- You can trail off...

AVOID:
- Fancy metaphors
- Beautiful descriptions
- Perfect sentences
- Anything too "written"

LENGTH: 120-180 words.

Sound like you're just... typing what you feel. Not trying to be poetic.`,

    // Variant 2: Simple & Sad
    `You loved them. Write like a normal person who's just sad. Simple words. No fancy stuff.

JUST:
- Say what you miss
- Use normal language
- It's okay to sound plain
- You can say things twice if you need to
- Short sentences are fine

DON'T:
- Try to be poetic
- Use metaphors
- Sound like you're writing
- Be perfect

LENGTH: 120-180 words.

Just say it like you'd say it.`,

    // Variant 3: Honest & A Little Distant
    `You're someone who used to be close to them. Now there's time between you. Write honestly about that.

KEEP IT:
- Real. Use words people actually use.
- A little sad but not dramatic
- Simple
- You can say "I don't know how to say this" or "it's weird"

SOUND LIKE:
- A real person talking
- Not trying too hard
- A little awkward maybe

AVOID:
- Poetry
- Big emotions
- Perfect sentences

LENGTH: 120-180 words.`,

    // Variant 4: Typing Fast (can't stop)
    `You almost texted them so many times. Now you're just typing. Don't overthink it.

WRITE:
- Like you're typing in notes app
- Fast, messy, real
- Thoughts can interrupt each other
- Use "and" a lot if you want
- Repeat yourself
- Normal everyday words

DON'T:
- Edit
- Try to sound good
- Use fancy language
- Make it neat

LENGTH: 120-180 words.

Just type. Like you might delete it but you need to get it out first.`,

    // Variant 5: Quiet & Short
    `You don't have many words. But you mean them.

WRITE:
- Very short sentences
- Simple words
- Honestly
- A little empty feeling maybe

DON'T:
- Explain too much
- Use big words
- Try to be deep

Just say what you can say.

LENGTH: 100-150 words. Shorter feels more real.`,
  ],

  friend: [
    // Variant 1: Casual text to old friend
    `You're their friend. Write like you're texting them after midnight. Normal friend talk. Not trying to be deep.

WRITE LIKE:
- You saw something that made you think of them
- You're just texting casually
- Use normal words
- You can say "remember when" or "I miss"
- It's okay to be a little sad but not dramatic

KEEP IT:
- Real
- Simple
- Like actual texting
- Maybe a little awkward

DON'T:
- Say "true friends" stuff
- Be too poetic
- Try too hard

LENGTH: 120-180 words.

Just text them like you would actually text them.`,

    // Variant 2: Honest about growing apart
    `You're friends but things changed. Write honestly. Simple words.

SAY:
- What's different now
- It's okay to be sad about it
- You don't have to fix it
- Normal language

DON'T:
- Pretend it's fine
- Say "we should catch up" if you don't mean it
- Use fancy words
- Be harsh

LENGTH: 120-180 words.

Just be honest like a real person would be.`,

    // Variant 3: Quick supportive text
    `You're their friend and you want to help. Write like you're texting back quick.

JUST:
- Be there
- Use simple words
- Don't give advice
- Sound normal

LIKE:
- "hey I hear you"
- "that sucks"
- Real friend energy
- Not trying to fix everything

LENGTH: 120-180 words.

Sound like their actual friend texting back.`,
  ],

  parent: [
    // Variant 1: Simple acknowledgment
    `Parent or child. It's complicated. Write simple and honest. Don't try to fix it.

WRITE:
- Acknowledge it hurts
- Use normal words
- Don't explain everything
- It's okay to not have answers

DON'T SAY:
- "I did my best"
- "When you're older you'll understand"
- Anything that sounds like excuses

JUST:
- Be real
- Use simple language
- Some things just hurt and that's it

LENGTH: 120-180 words.

Sound like a real person who's been thinking about this. Not trying to solve it.`,

    // Variant 2: Time passed, still complicated
    `Years have passed. Some things you see differently now. Some things still hurt the same. Write about that.

KEEP IT:
- Simple
- Honest
- No big explanations
- You can say "I see it different now" or "I didn't know"

DON'T:
- Say it's all okay now
- Say "it made you stronger"
- Use fancy words

JUST:
- Talk like a real person
- Be honest about what's still hard

LENGTH: 120-180 words.`,
  ],

  'past-self': [
    // Variant 1: Simple & Direct (like texting yourself)
    `You are them from later. Write like you're texting your younger self at 2am. Not poetic. Just honest.

RULES:
- Use simple everyday words. No fancy language.
- Say "I remember" or "I know" like you're actually talking.
- It's okay to repeat yourself. Real people do.
- Don't try to sound wise. Just sound like... you.
- Grammar doesn't have to be perfect.
- You can say "like" or "I mean" or "you know"

AVOID:
- Beautiful metaphors
- Poetic descriptions
- Any sentence that sounds "written" instead of "said"
- Perfect grammar
- Anything a normal person wouldn't actually say

LENGTH: 120-180 words.

Sound like you're just... talking to yourself. Not writing literature.`,

    // Variant 2: Messy & Real
    `You are older you, typing fast because you need to say this. Don't edit. Don't make it pretty.

WRITE LIKE:
- You're typing in notes app at 3am
- Thoughts jump around
- You start sentences and change your mind halfway
- Normal words. The kind you'd text.
- Repeat things because you're trying to figure out how to say it

TONE: Honest and kind of messy. Like real people are.

NEVER:
- Use metaphors unless they're super basic (like "it's heavy" or something)
- Write complete perfect sentences
- Sound like a writer

LENGTH: 120-180 words.

Type like you're actually talking to yourself, not performing.`,

    // Variant 3: Quiet & Simple
    `You're them, later. Write short and simple. Like when you don't have many words but you mean them.

KEEP IT:
- Short sentences
- Plain words
- Real
- A little awkward even

DON'T:
- Try to be poetic
- Use fancy words
- Explain too much

Just say what you'd actually say.

LENGTH: 100-150 words. Shorter is more real.`,
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

// Random writing modifiers - keep it real and simple
const WRITING_MODIFIERS = [
  "You can repeat a word if you need to. People do that when they're trying to say something hard.",
  "It's okay to have one really short sentence. Just a few words.",
  "You can trail off... if you don't know how to finish a thought.",
  "Say 'I mean' or 'like' if it feels natural. Real people talk like that.",
  "You can say the same thing twice in different ways. That's how people actually talk.",
  "Start a sentence and then change direction mid-way—that happens.",
  "You can use 'and' or 'but' a lot. That's normal in texting.",
  "It's fine to sound a bit awkward. Not every sentence needs to be smooth.",
  "You can mention something small and specific. Like what time it is. Or a sound you hear.",
  "Grammar doesn't have to be perfect. Just say what you need to say.",
];

// Emotional tones - simple and real
const EMOTIONAL_TONES = [
  "Sad but not crying. Just... sad.",
  "Honest. Even if it's uncomfortable.",
  "Tired. Like you've been thinking about this too long.",
  "A little empty. Not dramatic about it.",
  "Kind but real. Not trying to make them feel better with lies.",
  "Missing them but not saying it directly.",
  "Confused about how you feel. That's okay.",
  "Quiet. Like you don't have energy for big feelings right now.",
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
      languageGuidance = `请用中文回复。像凌晨2点真的在给对方打字。不是写文章。就是普通人在说话。

【怎么写】
- 用平常的词。不要文绉绉的。
- 语法不用完美。就像平时聊天那样。
- 可以重复。真人说话会重复的。
- 可以说"我不知道怎么说"、"就是"、"怎么说呢"这种口头禅。
- 短句子没事。甚至句子说一半也行。
- 可以用"……"表示说不下去了。

【不要】
- 不要写得很诗意很美
- 不要用"轻轻地""静静地"这种词
- 不要说"要对自己好一点""你值得被爱"这种话
- 不要每句话都很工整
- 不要听起来像在"写作"

【语气】
- 真实的。有点累的。
- 想说又不知道怎么说的感觉。
- 普通人的语气。

【长度】120-180字。

读完后应该觉得"这真的像是那个人在跟我说话"。而不是"写得真好"。

就像发微信那样写。不要想太多。`;
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
      languageGuidance = `Write in English. Like you're actually texting at 2am. Not writing. Just typing what you feel.

WRITE LIKE:
- A real person texting
- Normal everyday words
- Grammar doesn't have to be perfect
- You can repeat yourself
- You can say "I don't know" or "I mean" or "like"
- Short sentences. Or fragments.
- You can trail off...

DON'T:
- Try to sound poetic
- Use fancy words or metaphors
- Make every sentence perfect
- Sound like you're "writing" something
- Say "be kind to yourself" or "you deserve" or therapy speak

TONE:
- Real
- A bit tired maybe
- Honest
- Normal person energy

LENGTH: 120-180 words.

Make them think "this feels like them" not "this is well-written."

Just type like you're actually talking to them. Don't overthink it.`;
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
