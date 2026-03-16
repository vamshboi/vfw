/**
 * ─────────────────────────────────────────────────────────────
 *  VFW Auth Dialog — Integration Example
 *  Shows how to wire AuthDialog into Navbar + CTA buttons
 * ─────────────────────────────────────────────────────────────
 *
 * OPTION A: Local state in a parent component (e.g. App.jsx or Layout.jsx)
 * This is the recommended approach — lift state to the nearest common ancestor
 * of Navbar and any page with a "Join Us" CTA.
 */

// ── App.jsx ──────────────────────────────────────────────────
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthDialog from "./components/auth/AuthDialog";
import Home from "./pages/Home";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");   // "login" | "register"

  // Helper: open on a specific tab
  const openLogin    = () => { setAuthTab("login");    setAuthOpen(true); };
  const openRegister = () => { setAuthTab("register"); setAuthOpen(true); };

  return (
    <BrowserRouter>
      {/* Pass openLogin to Navbar for the user-icon click */}
      <Navbar onUserIconClick={openLogin} onJoinUsClick={openRegister} />

      {/* Pass openRegister down as a prop to any page that has a "Join Us" CTA */}
      <Routes>
        <Route path="/" element={<Home onJoinUs={openRegister} />} />
        {/* …other routes */}
      </Routes>

      {/* Single global dialog instance */}
      <AuthDialog
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </BrowserRouter>
  );
}


// ── Navbar.jsx  (relevant snippet) ───────────────────────────
/*
  <button
    onClick={onUserIconClick}
    aria-label="Open account dialog"
    className="p-2 rounded-full hover:bg-white/8 transition-colors"
  >
    <UserIcon className="w-5 h-5 text-white/70" />
  </button>

  <button
    onClick={onJoinUsClick}
    className="px-5 py-2 rounded-xl bg-yellow-400 text-black font-bold text-sm
               hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all"
  >
    Join Us
  </button>
*/


// ── Home.jsx  (relevant CTA snippet) ─────────────────────────
/*
  <motion.button
    onClick={onJoinUs}
    whileHover={{ scale: 1.03 }}
    className="px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold
               hover:shadow-[0_0_32px_rgba(250,204,21,0.45)] transition-all"
  >
    Join the Movement
  </motion.button>
*/


/**
 * OPTION B: React Context (for larger apps with deep CTA trees)
 * Use this when "Join Us" CTAs are deeply nested and prop-drilling
 * becomes inconvenient.
 */

// ── AuthContext.jsx ───────────────────────────────────────────
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");

  const openLogin    = () => { setAuthTab("login");    setAuthOpen(true); };
  const openRegister = () => { setAuthTab("register"); setAuthOpen(true); };
  const closeAuth    = () => setAuthOpen(false);

  return (
    <AuthContext.Provider value={{ openLogin, openRegister, closeAuth, authOpen, authTab }}>
      {children}
      <AuthDialog isOpen={authOpen} onClose={closeAuth} defaultTab={authTab} />
    </AuthContext.Provider>
  );
}

// Custom hook for easy consumption
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

// Usage anywhere in the tree:
// const { openRegister } = useAuth();
// <button onClick={openRegister}>Join Us</button>