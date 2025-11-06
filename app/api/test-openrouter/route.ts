import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Test with a minimal API call
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'OpenRouter API request failed');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'OpenRouter API is working',
      availableModels: data.data?.slice(0, 5).map((m: any) => m.id) || [],
      totalModels: data.data?.length || 0
    });
  } catch (error: any) {
    console.error('OpenRouter test error:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
