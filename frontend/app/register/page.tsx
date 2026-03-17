"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, LangToggle } from "../LanguageContext";

const inputStyle = (error: boolean): React.CSSProperties => ({
  width: "100%", border: `1.5px solid ${error ? "#ef4444" : "#e2e8f0"}`,
  borderRadius: "0.625rem", padding: "0.75rem 1rem", outline: "none",
  color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box", backgroundColor: "#f8fafc",
});

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (v && !isValidEmail(v)) setEmailError(t.emailError);
    else setEmailError("");
  };

  const handleConfirmChange = (v: string) => {
    setConfirmPassword(v);
    if (v && v !== password) setPasswordError(t.passwordMismatch);
    else setPasswordError("");
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (confirmPassword && v !== confirmPassword) setPasswordError(t.passwordMismatch);
    else setPasswordError("");
  };

  const handleRegister = async () => {
    if (!isValidEmail(email)) { setEmailError(t.emailError); return; }
    if (password !== confirmPassword) { setPasswordError(t.passwordMismatch); return; }
    if (!password) { setPasswordError(t.passwordEmpty); return; }

    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) { setError(t.registerFail); return; }
    router.push("/login");
  };

  const labelStyle: React.CSSProperties = { color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" };
  const hintStyle: React.CSSProperties = { color: "#ef4444", fontSize: "0.78rem", marginTop: "0.3rem" };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: "1.5rem", padding: "3rem", width: "100%", maxWidth: "420px", boxShadow: "0 8px 40px rgba(101,168,118,0.12)", border: "1px solid rgba(255,255,255,0.6)" }}>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <LangToggle />
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🐾</div>
          <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t.createAccount}</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{t.registerSubtitle}</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "0.625rem", fontSize: "0.875rem", marginBottom: "1rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* 姓名 */}
          <div>
            <label style={labelStyle}>{t.name}</label>
            <input type="text" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} style={inputStyle(false)} />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input type="text" placeholder="you@example.com" value={email} onChange={(e) => handleEmailChange(e.target.value)} style={inputStyle(!!emailError)} />
            {emailError && <p style={hintStyle}>{emailError}</p>}
          </div>

          {/* 密碼 */}
          <div>
            <label style={labelStyle}>{t.password}</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => handlePasswordChange(e.target.value)} style={inputStyle(false)} />
          </div>

          {/* 確認密碼 */}
          <div>
            <label style={labelStyle}>{t.confirmPassword}</label>
            <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => handleConfirmChange(e.target.value)} style={inputStyle(!!passwordError)} />
            {passwordError && <p style={hintStyle}>{passwordError}</p>}
          </div>

          <button onClick={handleRegister} style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.875rem", borderRadius: "0.625rem", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", marginTop: "0.5rem", boxShadow: "0 4px 15px rgba(101,168,118,0.35)" }}>
            {t.registerBtn}
          </button>
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {t.hasAccount}{" "}
            <a href="/login" style={{ color: "#65a876", fontWeight: 600, textDecoration: "none" }}>{t.loginLink}</a>
          </p>
        </div>

      </div>
    </main>
  );
}
