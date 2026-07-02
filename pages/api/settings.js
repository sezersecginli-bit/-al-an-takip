import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { requireAdmin } from "../../lib/requireAdmin";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Ayarların "geo_required" ve saatleri okunması scan sayfası için
      // de gereklidir; bu yüzden GET herkese açık ama sadece güvenli
      // alanları döndürür (koordinatları da döndürüyoruz çünkü mesafe
      // hesaplaması istemci tarafında gösterilebilir; hassas değildir).
      const { data, error } = await supabaseAdmin
        .from("work_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (error) throw error;
      return res.status(200).json({ settings: data });
    }

    const user = await requireAdmin(req);
    if (!user) return res.status(401).json({ error: "Yetkisiz erişim." });

    if (req.method === "PATCH") {
      const {
        work_start,
        work_end,
        late_tolerance_minutes,
        early_leave_tolerance_min,
        geo_required,
        workplace_lat,
        workplace_lng,
        geo_radius_meters,
      } = req.body;

      const update = {};
      if (work_start !== undefined) update.work_start = work_start;
      if (work_end !== undefined) update.work_end = work_end;
      if (late_tolerance_minutes !== undefined) update.late_tolerance_minutes = late_tolerance_minutes;
      if (early_leave_tolerance_min !== undefined) update.early_leave_tolerance_min = early_leave_tolerance_min;
      if (geo_required !== undefined) update.geo_required = geo_required;
      if (workplace_lat !== undefined) update.workplace_lat = workplace_lat;
      if (workplace_lng !== undefined) update.workplace_lng = workplace_lng;
      if (geo_radius_meters !== undefined) update.geo_radius_meters = geo_radius_meters;

      const { data, error } = await supabaseAdmin
        .from("work_settings")
        .update(update)
        .eq("id", 1)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json({ settings: data });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
}
