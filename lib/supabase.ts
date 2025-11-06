import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export interface LetterPrivate {
  id: string;
  user_text: string;
  recipient_type: string;
  ai_reply: string;
  created_at: string;
  user_id: string | null;
  is_public: boolean;
  public_letter_id: string | null;
}

export interface LetterPublic {
  id: string;
  exhibit_number: string;
  ai_reply: string;
  recipient_type: string;
  created_at: string;
  views: number;
  private_letter_id: string | null;
}
