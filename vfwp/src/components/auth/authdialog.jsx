import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./loginform";
import RegisterForm from "./registration";

/* ─────────────────────────────────────────────
   Tab pill component
───────────────────────────────────────────── */
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "login", label: "Sign In" },
    { id: "register", label: "Join Us" },
  ];

  return (
    <div
      className="flex relative rounded-xl p-1 mb-8"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Sliding pill */}
      <motion.div
        layout
        layoutId="tab-pill"
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="absolute top-1 bottom-1 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)",
          width: "calc(50% - 4px)",
          left: active === "login" ? "4px" : "calc(50%)",
          boxShadow: "0 2px 12px rgba(250,204,21,0.30)",
        }}
      />
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`relative z-10 flex-1 py-2.5 text-sm font-bold tracking-wider uppercase transition-colors duration-200 ${
            active === t.id ? "text-black" : "text-white/40 hover:text-white/70"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   VFW Brand mark (top of dialog)
───────────────────────────────────────────── */
function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 mb-7">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #FACC15, #F59E0B)", boxShadow: "0 4px 16px rgba(250,204,21,0.30)" }}
      >
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <p className="text-white font-black text-base leading-none tracking-tight">Voice For Welfare</p>
        <p className="text-yellow-400/60 text-[10px] font-medium tracking-widest uppercase mt-0.5">Making change real</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Decorative grid background for overlay
───────────────────────────────────────────── */
function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(250,204,21,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(250,204,21,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Main AuthDialog
───────────────────────────────────────────── */
export default function AuthDialog({ isOpen, onClose, defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);
  const dialogRef = useRef(null);
  const firstFocusRef = useRef(null);

  // Reset tab when opened
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setTimeout(() => firstFocusRef.current?.focus(), 100);
    }
  }, [isOpen, defaultTab]);

  // ESC key close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    },
    []
  );

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            aria-modal="true"
            role="dialog"
            aria-label="Authentication dialog"
          >
            <GridOverlay />

            {/* ── Dialog card ── */}
            <motion.div
              key="dialog"
              ref={dialogRef}
              onKeyDown={handleKeyDown}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
              className="relative w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #141414 0%, #0f0f0f 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(250,204,21,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Top gold accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.6), transparent)" }}
              />

              {/* Close button */}
              <motion.button
                ref={firstFocusRef}
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Content */}
              <div className="p-8">
                <BrandMark />
                <TabBar active={tab} onChange={setTab} />

                {/* Form area with slide animation */}
                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, x: tab === "login" ? -24 : 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: tab === "login" ? 24 : -24 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {tab === "login" ? (
                        <LoginForm
                          onSwitchTab={() => setTab("register")}
                          onClose={onClose}
                        />
                      ) : (
                        <RegisterForm
                          onSwitchTab={() => setTab("login")}
                          onClose={onClose}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom decoration */}
              <div
                className="px-8 py-4 text-center"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}
              >
                <p className="text-[10px] text-white/20 tracking-widest uppercase">
                  Voice For Welfare · Empowering Communities
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}