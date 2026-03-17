import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import logo from "../assets/logo.png"

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Our Events", path: "/events" },
  { label: "Tribal Mela", path: "/tribalmela" },
  { label: "Donate", path: "/donate" },
]

export default function Navbar({ onUserIconClick, onJoinUsClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
            <img
              src={logo}
              alt="Voice For Welfare Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-white font-['Syne'] font-bold text-base tracking-widest uppercase">
              Voice For
            </span>
            <span className="text-[#FF0000] font-['Syne'] font-bold text-base tracking-widest uppercase">
              Welfare
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 ml-auto mr-6">
          {navLinks.map((link, i) => {
            const active = location.pathname === link.path

            return (
              <span key={link.label} className="flex items-center">
                {i > 0 && (
                  <span className="text-white/20 mx-2 text-sm select-none">
                    |
                  </span>
                )}

                <Link to={link.path} className="relative px-3 py-2 group">
                  <span
                    className={`text-sm font-medium transition-colors ${active
                      ? "text-[#FACC15]"
                      : "text-white/70 hover:text-white"
                      }`}
                  >
                    {link.label}
                  </span>

                  {/* Active underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FACC15] rounded-full"
                    />
                  )}

                  {/* Hover underline */}
                  {!active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-white/30 rounded-full scale-x-0 group-hover:scale-x-100 transition origin-left" />
                  )}
                </Link>
              </span>
            )
          })}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">

          {/* Profile */}
          <button
            onClick={onUserIconClick}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#FACC15]/60 hover:bg-white/5 transition"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-5 h-5 text-white/70"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block w-5 h-[1.5px] bg-white transition ${menuOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white transition ${menuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white transition ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""
                }`}
            />
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
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-2 text-sm font-medium border-b border-white/5 last:border-none text-white/70 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
