"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, LangToggle } from "../LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError(t.loginError);
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    router.push("/pets");
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: "1.5rem", padding: "3rem", width: "100%", maxWidth: "420px", boxShadow: "0 8px 40px rgba(101,168,118,0.12)", border: "1px solid rgba(255,255,255,0.6)" }}>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <LangToggle />
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🐾</div>
          <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1.75rem", marginBottom: "0.5rem" }}>PetPassport</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{t.loginSubtitle}</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "0.625rem", fontSize: "0.875rem", marginBottom: "1rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", padding: "0.75rem 1rem", outline: "none", color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box", backgroundColor: "#f8fafc" }}
            />
          </div>
          <div>
            <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>{t.password}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", padding: "0.75rem 1rem", outline: "none", color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box", backgroundColor: "#f8fafc" }}
            />
          </div>
          <button
            onClick={handleLogin}
            style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.875rem", borderRadius: "0.625rem", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", marginTop: "0.5rem", boxShadow: "0 4px 15px rgba(101,168,118,0.35)" }}
          >
            {t.loginBtn}
          </button>
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {t.noAccount}{" "}
            <a href="/register" style={{ color: "#65a876", fontWeight: 600, textDecoration: "none" }}>{t.signUpLink}</a>
          </p>
        </div>

      </div>
    </main>
  );
}
