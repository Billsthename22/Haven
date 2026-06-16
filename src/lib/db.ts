import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          email: string;
        };
        Insert: {
          id?: string;
          email: string;
        };
        Update: {
          id?: string;
          email?: string;
        };
        Relationships: [];
      };
      PasswordResetToken: {
        Row: {
          id: string;
          email: string;
          tokenHash: string;
          expiresAt: string;
        };
        Insert: {
          id: string;
          email: string;
          tokenHash: string;
          expiresAt: string;
        };
        Update: {
          id?: string;
          email?: string;
          tokenHash?: string;
          expiresAt?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

type SupabaseAdminClient = SupabaseClient<Database>;

let db: SupabaseAdminClient | undefined;

// The admin client bypasses Row Level Security (RLS) so your backend can create users safely
export function getDb() {
  if (db) {
    return db;
  }

  // This client runs ONLY on the backend server where environment variables are secure
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase cloud infrastructure environment variables.");
  }

  db = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return db;
}
