import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      combos: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string | null;
          category: string;
          available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image_url?: string | null;
          category: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string | null;
          category?: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
