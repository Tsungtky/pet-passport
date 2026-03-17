"use client";

import { useLanguage } from "./LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)" }}>

      {/* Navbar */}
      <nav style={{ padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#65a876" }}>🐾 PetPassport</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/login" style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "0.625rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
            {t.startUsing}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "5rem 2rem 4rem", maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", backgroundColor: "#dcfce7", color: "#166534", padding: "0.3rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          {t.landingBadge}
        </div>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.2, marginBottom: "1.25rem" }}>
          {t.landingHeadline1}<br />
          <span style={{ color: "#65a876" }}>{t.landingHeadline2}</span>
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          {t.landingDesc}
        </p>
        <a href="/login" style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.875rem 2.5rem", borderRadius: "0.75rem", fontWeight: 700, fontSize: "1rem", textDecoration: "none", display: "inline-block", boxShadow: "0 4px 15px rgba(101,168,118,0.4)" }}>
          {t.landingCTA}
        </a>
      </section>

      {/* Feature Cards */}
      <section className="resp-grid-3" style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 2rem 6rem" }}>
        {[
          { icon: "💉", title: t.feature1Title, desc: t.feature1Desc },
          { icon: "🏥", title: t.feature2Title, desc: t.feature2Desc },
          { icon: "📱", title: t.feature3Title, desc: t.feature3Desc },
        ].map((card) => (
          <div key={card.title} style={{ backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", borderRadius: "1.25rem", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div>
            <h3 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{card.title}</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>{card.desc}</p>
          </div>
        ))}
      </section>

    </main>
  );
}
