import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { letterId } = body;

    if (!letterId) {
      return NextResponse.json(
        { error: 'Missing letterId' },
        { status: 400 }
      );
    }

    // 1. Get the private letter
    const { data: privateLetter, error: fetchError } = await supabase
      .from('letters_private')
      .select('*')
      .eq('id', letterId)
      .single();

    if (fetchError || !privateLetter) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }

    // 2. Check if already published
    if (privateLetter.is_public) {
      return NextResponse.json(
        { error: 'Letter already published', exhibitNumber: privateLetter.public_letter_id },
        { status: 400 }
      );
    }

    // 3. Generate exhibit number
    const { data: exhibitNumberData, error: functionError } = await supabase
      .rpc('generate_exhibit_number');

    if (functionError || !exhibitNumberData) {
      console.error('Function error:', functionError);
      return NextResponse.json(
        { error: 'Failed to generate exhibit number' },
        { status: 500 }
      );
    }

    const exhibitNumber = exhibitNumberData;

    // 4. Create public letter
    const { data: publicLetter, error: insertError } = await supabase
      .from('letters_public')
      .insert({
        exhibit_number: exhibitNumber,
        ai_reply: privateLetter.ai_reply,
        recipient_type: privateLetter.recipient_type,
        private_letter_id: privateLetter.id,
        views: 0,
      })
      .select()
      .single();

    if (insertError || !publicLetter) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create public exhibition' },
        { status: 500 }
      );
    }

    // 5. Update private letter to mark as published
    const { error: updateError } = await supabase
      .from('letters_private')
      .update({
        is_public: true,
        public_letter_id: publicLetter.id,
      })
      .eq('id', letterId);

    if (updateError) {
      console.error('Update error:', updateError);
      // Don't fail here - the public letter is already created
    }

    return NextResponse.json({
      success: true,
      exhibitNumber: exhibitNumber,
      publicLetterId: publicLetter.id,
    });

  } catch (error: any) {
    console.error('Submit to exhibition error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
