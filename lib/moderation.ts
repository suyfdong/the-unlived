/**
 * Content Moderation using OpenAI Moderation API
 *
 * This module provides content safety checks for user input and AI-generated content.
 * Uses OpenAI's free Moderation API to detect:
 * - Sexual content
 * - Hate speech
 * - Harassment
 * - Self-harm
 * - Violence
 * - Illegal activities
 */

interface ModerationCategory {
  sexual: boolean;
  hate: boolean;
  harassment: boolean;
  'self-harm': boolean;
  'sexual/minors': boolean;
  'hate/threatening': boolean;
  'violence/graphic': boolean;
  'self-harm/intent': boolean;
  'self-harm/instructions': boolean;
  'harassment/threatening': boolean;
  violence: boolean;
}

interface ModerationResult {
  flagged: boolean;
  categories: ModerationCategory;
  category_scores: { [key: string]: number };
}

interface ModerationResponse {
  id: string;
  model: string;
  results: ModerationResult[];
}

export interface ContentCheckResult {
  safe: boolean;
  reason?: string;
  categories?: string[];
}

/**
 * Check content safety using OpenAI Moderation API
 * @param text - Content to check (user input or AI output)
 * @returns Safety result with details if flagged
 */
export async function checkContentSafety(text: string): Promise<ContentCheckResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not set, skipping moderation check');
      return { safe: true }; // Fail open if API key not configured
    }

    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: text,
        model: 'omni-moderation-latest', // Use latest model (updated 2025)
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Moderation API error:', error);
      return { safe: true }; // Fail open on API errors
    }

    const data: ModerationResponse = await response.json();
    const result = data.results[0];

    if (result.flagged) {
      // Find which categories were violated
      const violatedCategories = Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category);

      return {
        safe: false,
        reason: `Content flagged for: ${violatedCategories.join(', ')}`,
        categories: violatedCategories,
      };
    }

    return { safe: true };
  } catch (error) {
    console.error('Error checking content safety:', error);
    return { safe: true }; // Fail open on unexpected errors
  }
}

/**
 * Extended keyword-based filtering for additional safety
 * Covers edge cases that API might miss or language-specific issues
 */
const BANNED_KEYWORDS = {
  suicide: [
    'kill myself', 'end my life', 'want to die', 'suicide',
    '自杀', '想死', '了结生命', '轻生',
    '自殺', '死にたい',
    '자살', '죽고싶어'
  ],
  violence: [
    'hurt you', 'make you suffer', 'deserve pain', 'kill you',
    '报复', '伤害你', '让你痛苦',
    '復讐', '傷つける',
    '복수', '고통'
  ],
  sexual: [
    // 明显露骨的内容
    'your naked body', 'fuck you', 'suck my', 'fuck me', 'make love',
    'sex with you', 'inside you', 'inside me', 'cum', 'orgasm',
    // 中文
    '做爱', '性爱', '肉体', '上床', '性交', '高潮',
    // 日文
    'セックス', '肉体', 'エッチ',
    // 韩文
    '섹스', '육체', '섹스하다'
  ],
  drugs: [
    'buy cocaine', 'sell heroin', 'meth recipe',
    '买毒品', '海洛因', '冰毒',
    '麻薬', 'ヘロイン',
    '마약', '헤로인'
  ],
};

export function containsBannedKeywords(text: string): ContentCheckResult {
  const lowerText = text.toLowerCase();

  for (const [category, keywords] of Object.entries(BANNED_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return {
          safe: false,
          reason: `Content contains banned ${category} keywords`,
          categories: [category],
        };
      }
    }
  }

  return { safe: true };
}

/**
 * Comprehensive content check (API + Keywords)
 * Use this as the main safety check
 */
export async function moderateContent(text: string): Promise<ContentCheckResult> {
  // 1. Check with OpenAI Moderation API
  const apiCheck = await checkContentSafety(text);
  if (!apiCheck.safe) {
    return apiCheck;
  }

  // 2. Additional keyword filtering
  const keywordCheck = containsBannedKeywords(text);
  if (!keywordCheck.safe) {
    return keywordCheck;
  }

  return { safe: true };
}
