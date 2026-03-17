"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, LangToggle } from "../LanguageContext";

const inputStyle = (error?: boolean): React.CSSProperties => ({
  width: "100%",
  border: `1.5px solid ${error ? "#ef4444" : "#e2e8f0"}`,
  borderRadius: "0.625rem",
  padding: "0.75rem 1rem",
  outline: "none",
  color: "#1e293b",
  fontSize: "0.95rem",
  boxSizing: "border-box",
  backgroundColor: "#f8fafc",
});

const labelStyle: React.CSSProperties = {
  color: "#475569",
  fontSize: "0.875rem",
  fontWeight: 500,
  display: "block",
  marginBottom: "0.4rem",
};

const hintStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "0.78rem",
  marginTop: "0.3rem",
};

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [infoErr, setInfoErr] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [confirmPwErr, setConfirmPwErr] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { router.push("/login"); return; }
    fetch(`http://localhost:8080/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      });
  }, []);

  const handleSaveInfo = async () => {
    setInfoMsg(""); setInfoErr("");
    const userId = localStorage.getItem("userId");
    const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    if (res.ok) setInfoMsg(t.infoUpdated);
    else setInfoErr(t.updateFail);
  };

  const handleChangePassword = async () => {
    setPwMsg(""); setPwErr(""); setConfirmPwErr("");
    if (!currentPw) { setPwErr(t.currentPwEmpty); return; }
    if (!newPw) { setPwErr(t.newPwEmpty); return; }
    if (newPw !== confirmPw) { setConfirmPwErr(t.passwordMismatch); return; }

    const userId = localStorage.getItem("userId");
    const res = await fetch(`http://localhost:8080/api/users/${userId}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    if (res.ok) {
      setPwMsg(t.passwordUpdated);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } else {
      const msg = await res.text();
      setPwErr(msg || "密碼更新失敗");
    }
  };

  return (
    <main className="resp-main" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button
            onClick={() => router.push("/pets")}
            style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", padding: "0.5rem 1rem", color: "#64748b", fontSize: "0.875rem", cursor: "pointer", fontWeight: 500 }}
          >
            {t.back}
          </button>
          <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1.5rem", margin: 0 }}>{t.profileTitle}</h1>
          <div style={{ marginLeft: "auto" }}><LangToggle /></div>
        </div>

        {/* Profile Info Card */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: "1.5rem", padding: "2rem", boxShadow: "0 8px 40px rgba(101,168,118,0.10)", border: "1px solid rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem", marginTop: 0 }}>{t.basicInfoSection}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>{t.name}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle()} placeholder="你的名字" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="text" value={email} disabled style={{ ...inputStyle(), backgroundColor: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed" }} />
            </div>
            <div>
              <label style={labelStyle}>{t.phone}</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle()} placeholder={t.phonePlaceholder} />
            </div>

            {infoMsg && <p style={{ color: "#22c55e", fontSize: "0.875rem", margin: 0 }}>{infoMsg}</p>}
            {infoErr && <p style={hintStyle}>{infoErr}</p>}

            <button
              onClick={handleSaveInfo}
              style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.75rem", borderRadius: "0.625rem", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(101,168,118,0.3)" }}
            >
              {t.saveInfo}
            </button>
          </div>
        </div>

        {/* Change Password Card */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: "1.5rem", padding: "2rem", boxShadow: "0 8px 40px rgba(101,168,118,0.10)", border: "1px solid rgba(255,255,255,0.6)" }}>
          <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem", marginTop: 0 }}>{t.changePassword}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>{t.currentPassword}</label>
              <input type="password" value={currentPw} onChange={(e) => { setCurrentPw(e.target.value); setPwErr(""); }} style={inputStyle(!!pwErr && !newPw)} placeholder="••••••••" />
            </div>
            <div>
              <label style={labelStyle}>{t.newPassword}</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inputStyle()} placeholder="••••••••" />
            </div>
            <div>
              <label style={labelStyle}>{t.confirmNewPassword}</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => {
                  setConfirmPw(e.target.value);
                  if (e.target.value && e.target.value !== newPw) setConfirmPwErr(t.passwordMismatch);
                  else setConfirmPwErr("");
                }}
                style={inputStyle(!!confirmPwErr)}
                placeholder="••••••••"
              />
              {confirmPwErr && <p style={hintStyle}>{confirmPwErr}</p>}
            </div>

            {pwMsg && <p style={{ color: "#22c55e", fontSize: "0.875rem", margin: 0 }}>{pwMsg}</p>}
            {pwErr && <p style={hintStyle}>{pwErr}</p>}

            <button
              onClick={handleChangePassword}
              style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.75rem", borderRadius: "0.625rem", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(101,168,118,0.3)" }}
            >
              {t.changePassword}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
