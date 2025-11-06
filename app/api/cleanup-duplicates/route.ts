import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Get all letters ordered by creation time
    const { data: allLetters, error: fetchError } = await supabase
      .from('letters_public')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError || !allLetters) {
      throw new Error('Failed to fetch letters');
    }

    // Group by ai_reply to find duplicates
    const replyGroups = new Map<string, any[]>();

    allLetters.forEach(letter => {
      const existing = replyGroups.get(letter.ai_reply) || [];
      existing.push(letter);
      replyGroups.set(letter.ai_reply, existing);
    });

    // Find and delete duplicates (keep the newest one)
    const deletedIds: string[] = [];

    for (const [reply, letters] of replyGroups.entries()) {
      if (letters.length > 1) {
        // Keep the first one (newest), delete the rest
        const toDelete = letters.slice(1);

        for (const letter of toDelete) {
          const { error: deleteError } = await supabase
            .from('letters_public')
            .delete()
            .eq('id', letter.id);

          if (!deleteError) {
            deletedIds.push(letter.exhibit_number);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedIds.length} duplicate letters`,
      deletedExhibitNumbers: deletedIds,
      totalLettersNow: allLetters.length - deletedIds.length
    });

  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: error.message || 'Cleanup failed' },
      { status: 500 }
    );
  }
}
