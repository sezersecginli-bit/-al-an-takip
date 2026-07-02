import { supabaseAdmin } from "./supabaseAdmin";

// İstek header'ındaki Supabase access token'ını doğrular.
// Geçerliyse kullanıcıyı döner, değilse null döner.
export async function requireAdmin(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
