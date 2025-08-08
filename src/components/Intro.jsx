import React from "react";
import { motion } from "framer-motion";
import "../heavenly_roasts.css"; // New global-ish styles (kept scoped by class prefixes)

export default function IntroLanding() {
  const features = [
    {
      title: "Unified Drive Mesh",
      desc: "We securely link multiple Google Drives into one clean, searchable space for internal teams.",
      icon: "🕸️",
    },
    {
      title: "Unlimited* Internal Storage",
      desc: "Scale without friction. Your team ships; Snapika quietly handles the bytes.",
      icon: "♾️",
    },
    {
      title: "Granular Access",
      desc: "Invite-only. Roles, scopes, and audit-safe access that fits your org’s reality.",
      icon: "🔐",
    },
    {
      title: "Glass-Smooth Uploads",
      desc: "Parallel, resumable uploads with real-time progress. Feels instant. Works everywhere.",
      icon: "⚡",
    },
    {
      title: "Zero-Nag Auth",
      desc: "Google OAuth with first-class token hygiene and minimal friction.",
      icon: "✅",
    },
    {
      title: "Observability Built-In",
      desc: "Per-folder stats, usage heatmaps, and traceable events.",
      icon: "📊",
    },
  ];

  return (
    <div className="snapika-landing">
      {/* Smoky backdrop */}
      <div className="snapika-smoke" aria-hidden="true" />
      <div className="snapika-smoke layer2" aria-hidden="true" />
      <div className="snapika-vignette" aria-hidden="true" />

      {/* HERO */}
      <header className="snapika-hero">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="snapika-badge"
        >
          INTERNAL · INVITE‑ONLY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
          className="snapika-title"
        >
          Snapika
          <span className="sparkle">★</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="snapika-subtitle"
        >
          Unlimited <em>internal</em> Google cloud storage—one unified interface linked
          across multiple drives. Built for teams that just want uploading to feel
          <b> effortless</b>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="snapika-cta-row"
        >
          <a href="/dashboard" className="btn btn-primary">
            Enter Snapika
          </a>
          <a
            href="https://github.com/kathan9898"
            className="btn btn-ghost"
            target="_blank"
            rel="noreferrer"
          >
            Request Access via GitHub
          </a>
        </motion.div>

        <div className="snapika-note">
          Not for sale. Limited seats for internal collaborators. Ask nicely. 💌
        </div>

        {/* Mini status ticker */}
        <div className="snapika-ticker" role="status" aria-live="polite">
          <div className="tick">• Secure OAuth sessions</div>
          <div className="tick">• Linked Drives active</div>
          <div className="tick">• Upload nodes healthy</div>
          <div className="tick">• Observability online</div>
        </div>
      </header>

      {/* GLASS FEATURE GRID */}
      <section className="snapika-grid">
        {features.map((f, i) => (
          <motion.article
            className="glass-card"
            key={f.title}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
          >
            <div className="card-icon" aria-hidden="true">
              {f.icon}
            </div>
            <h3 className="card-title">{f.title}</h3>
            <p className="card-desc">{f.desc}</p>
          </motion.article>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="snapika-footer">
        <div className="foot-left">
          © {new Date().getFullYear()} Snapika — Internal stack for drive‑linked storage.
        </div>
        <div className="foot-right">
          <a
            href="https://github.com/kathan9898"
            target="_blank"
            rel="noreferrer"
            className="foot-link"
          >
            GitHub
          </a>
          <span className="dot">•</span>
          <a href="/dashboard" className="foot-link">
            Privacy
          </a>
          <span className="dot">•</span>
          <a href="/dashboard" className="foot-link">
            Status
          </a>
        </div>
      </footer>
    </div>
  );
}
