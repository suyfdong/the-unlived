import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error, count } = await supabase
      .from('letters_public')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      totalCount: count,
      letters: data?.map(l => ({
        id: l.id,
        exhibit_number: l.exhibit_number,
        recipient_type: l.recipient_type,
        created_at: l.created_at,
        reply_preview: l.ai_reply.substring(0, 50) + '...'
      }))
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
