import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../context/useauth"

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Our Events", path: "/events" },
  { label: "Tribal Mela", path: "/tribalmela" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Donate", path: "/donate" },
]

export default function Navbar({ onUserIconClick, onJoinUsClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const { user, isLoggedIn, isAdmin, isVolunteer, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    window.location.href = "/"
  }

  const getRoleBadge = () => {
    if (isAdmin) return { label: "Admin", color: "bg-red-500/20 text-red-400 border border-red-500/30" }
    if (isVolunteer) return { label: "Volunteer", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }
    return { label: "User", color: "bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30" }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white">
            <img src={logo} alt="Voice For Welfare Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-['Syne'] font-bold text-base tracking-widest uppercase">Voice For</span>
            <span className="text-[#FF0000] font-['Syne'] font-bold text-base tracking-widest uppercase">Welfare</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 ml-auto mr-6">
          {navLinks.map((link, i) => {
            const active = location.pathname === link.path
            return (
              <span key={link.label} className="flex items-center">
                {i > 0 && <span className="text-white/20 mx-2 text-sm select-none">|</span>}
                <Link to={link.path} className="relative px-3 py-2 group">
                  <span className={`text-sm font-medium transition-colors ${active ? "text-[#FACC15]" : "text-white/70 hover:text-white"}`}>
                    {link.label}
                  </span>
                  {active && <motion.span layoutId="nav-underline" className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FACC15] rounded-full" />}
                  {!active && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-white/30 rounded-full scale-x-0 group-hover:scale-x-100 transition origin-left" />}
                </Link>
              </span>
            )
          })}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">

          {/* Not logged in — show Join Us button */}
          {!isLoggedIn && (
            <button
              onClick={onJoinUsClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-xs hover:bg-yellow-300 transition-all duration-200"
            >
              Join Us
            </button>
          )}

          {/* Logged in — show profile dropdown */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#FACC15]/40 bg-white/5 hover:bg-white/8 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-[#FACC15] flex items-center justify-center text-black font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/80 text-xs font-medium hidden sm:block max-w-[80px] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/40">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-56 bg-[#111] rounded-2xl overflow-hidden z-50"
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.6)" }}
                  >
                    {/* User info */}
                    <div className="px-4 py-4 border-b border-white/8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center text-black font-bold text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                          <p className="text-white/40 text-[10px] truncate">{user?.email}</p>
                        </div>
                      </div>
                      {/* Role badge */}
                      <div className="mt-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase ${getRoleBadge().color}`}>
                          {getRoleBadge().label}
                        </span>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-2">
                      {/* Admin panel link */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors duration-200 group"
                        >
                          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-red-400">
                            <path d="M8 2a2 2 0 100 4 2 2 0 000-4zM4 10a4 4 0 018 0v1H4v-1z" fill="currentColor" />
                          </svg>
                          <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">Admin Panel</span>
                        </Link>
                      )}

                      {/* Volunteer dashboard */}
                      {(isVolunteer || isAdmin) && (
                        <Link
                          to="/volunteer-dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors duration-200 group"
                        >
                          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-emerald-400">
                            <path d="M8 1l1.5 3h3l-2.5 2 1 3L8 7.5 5 9l1-3L3.5 4h3L8 1z" fill="currentColor" />
                          </svg>
                          <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">My Events</span>
                        </Link>
                      )}

                      {/* Profile */}
                      <Link
                         to="/profile"
                         onClick={() => setProfileOpen(false)}
                         className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors duration-200 group"
                        >
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white/40">
                          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">Profile</span>
                      </Link>

                      {/* Divider */}
                      <div className="h-px bg-white/8 my-1" />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors duration-200 group"
                      >
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-red-400">
                          <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-red-400 text-xs font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Not logged in — show user icon */
            <button
              onClick={onUserIconClick}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#FACC15]/60 hover:bg-white/5 transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-white/70">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-5 h-[1.5px] bg-white transition ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.path} onClick={() => setMenuOpen(false)}
                  className="py-3 px-2 text-sm font-medium border-b border-white/5 last:border-none text-white/70 hover:text-white">
                  {link.label}
                </Link>
              ))}

              {/* Mobile auth buttons */}
              {isLoggedIn ? (
                <div className="pt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center text-black font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{user?.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadge().color}`}>{getRoleBadge().label}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-2 px-2 text-sm text-red-400 font-medium">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="py-2 px-2 text-sm text-red-400 font-medium text-left">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-3 flex gap-2">
                  <button onClick={() => { onUserIconClick(); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium">
                    Sign In
                  </button>
                  <button onClick={() => { onJoinUsClick(); setMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm">
                    Join Us
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}