import { createClient } from "@supabase/supabase-js";

// Bu istemci SADECE Next.js API route'ları (sunucu tarafı) içinde
// import edilmelidir. SUPABASE_SERVICE_ROLE_KEY tarayıcıya asla
// gönderilmemelidir (NEXT_PUBLIC_ öneki YOK, bu bilinçli bir seçim).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
