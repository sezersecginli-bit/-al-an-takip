import { createClient } from "@supabase/supabase-js";

// Bu istemci SADECE tarayıcıda çalışır ve SADECE Supabase Auth
// (yönetici girişi) için kullanılır. Veritabanı okuma/yazma işlemleri
// güvenlik için her zaman /pages/api altındaki sunucu route'ları
// üzerinden, service role key ile yapılır.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
