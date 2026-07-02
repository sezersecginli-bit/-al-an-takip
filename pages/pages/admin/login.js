import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("E-posta veya şifre hatalı.");
    } else {
      router.replace("/admin");
    }
  };

  return (
    <>
      <Head>
        <title>Yönetici Girişi - PDKS</title>
      </Head>
      <main className="min-h-screen bg-canvas flex items-center justify-center px-5">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-panel border border-line rounded-card p-7">
          <p className="font-mono text-xs tracking-wider text-brand uppercase mb-1">PDKS</p>
          <h1 className="font-display text-xl font-semibold text-ink mb-6">Yönetici Girişi</h1>

          <label className="block text-sm font-medium text-ink/70 mb-1">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 rounded-lg border border-line px-3 py-2.5 text-sm focus:border-brand outline-none"
            placeholder="yonetici@atolye.com"
          />

          <label className="block text-sm font-medium text-ink/70 mb-1">Şifre</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-5 rounded-lg border border-line px-3 py-2.5 text-sm focus:border-brand outline-none"
            placeholder="••••••••"
          />

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand text-white font-medium py-2.5 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>

          <p className="text-xs text-ink/40 mt-5 text-center">
            Yönetici hesabı Supabase panelinden oluşturulur (Authentication → Users → Add user).
          </p>
        </form>
      </main>
    </>
  );
}
