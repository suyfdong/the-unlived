import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 使用服务端密钥创建Supabase客户端（有完整权限，绕过RLS）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { letterId } = await request.json();

    if (!letterId) {
      return NextResponse.json(
        { error: 'Missing letterId' },
        { status: 400 }
      );
    }

    // 先获取当前的views值
    const { data: letter, error: fetchError } = await supabase
      .from('letters_public')
      .select('views')
      .eq('id', letterId)
      .single();

    if (fetchError || !letter) {
      console.error('Failed to fetch letter:', fetchError);
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }

    // 增加views
    const newViews = (letter.views || 0) + 1;

    const { error: updateError } = await supabase
      .from('letters_public')
      .update({ views: newViews })
      .eq('id', letterId);

    if (updateError) {
      console.error('Failed to update views:', updateError);
      return NextResponse.json(
        { error: 'Failed to update views' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      views: newViews,
    });

  } catch (error: any) {
    console.error('Increment views error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
