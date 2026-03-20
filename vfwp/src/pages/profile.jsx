import { motion } from "framer-motion";
import { useAuth } from "../context/useauth";
import { Navigate, Link } from "react-router-dom";

export default function Profile() {
  const { user, isLoggedIn, isAdmin, isVolunteer, logout } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" />;

  const getRoleBadge = () => {
    if (isAdmin) return { label: "Admin", color: "bg-red-500/20 text-red-400 border border-red-500/30" };
    if (isVolunteer) return { label: "Volunteer", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" };
    return { label: "User", color: "bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30" };
  };

  const getRoleDescription = () => {
    if (isAdmin) return "You have full access to manage the organization, users, events, and content.";
    if (isVolunteer) return "You can apply for upcoming events and participate in VFW activities.";
    return "You can donate, order from Tribal Mela, and apply to become a volunteer.";
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#FACC15]/3 blur-[130px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
            My Profile
          </span>
          <h1 className="font-['Syne'] text-white text-4xl font-extrabold">Account Details</h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#0d0d0d] rounded-2xl overflow-hidden mb-5"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

          {/* Avatar section */}
          <div className="p-8 flex flex-col items-center text-center border-b border-white/8">
            <div className="w-20 h-20 rounded-full bg-[#FACC15] flex items-center justify-center text-black font-['Syne'] font-extrabold text-3xl mb-4 shadow-lg shadow-[#FACC15]/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-['Syne'] text-white text-2xl font-extrabold mb-1">{user?.name}</h2>
            <p className="text-white/40 text-sm mb-3">{user?.email}</p>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase ${getRoleBadge().color}`}>
              {getRoleBadge().label}
            </span>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-4">
            {[
              { label: "Full Name", value: user?.name, icon: "👤" },
              { label: "Email Address", value: user?.email, icon: "✉️" },
              { label: "Phone", value: user?.phone || "Not provided", icon: "📞" },
              { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—", icon: "📅" },
              { label: "Role", value: getRoleBadge().label, icon: "🎯" },
            ].map((field) => (
              <div key={field.label} className="flex items-center gap-4 p-4 bg-black rounded-xl"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
                <span className="text-xl shrink-0">{field.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-0.5">{field.label}</p>
                  <p className="text-white text-sm font-medium truncate">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Role description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-5 bg-[#FACC15]/5 rounded-2xl border border-[#FACC15]/15 mb-5 flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div>
            <p className="text-[#FACC15] text-xs font-bold tracking-widest uppercase mb-1">Your Access Level</p>
            <p className="text-white/50 text-sm leading-relaxed">{getRoleDescription()}</p>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#0d0d0d] rounded-2xl p-5 mb-5" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-4">Quick Links</p>
          <div className="flex flex-col gap-2">
            {isAdmin && (
              <Link to="/admin"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors duration-200 group">
                <div className="flex items-center gap-3">
                  <span>⚙️</span>
                  <span className="text-red-400 text-sm font-semibold">Admin Panel</span>
                </div>
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-red-400/50 group-hover:translate-x-0.5 transition-transform">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
            {(isVolunteer || isAdmin) && (
              <Link to="/volunteer-dashboard"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors duration-200 group">
                <div className="flex items-center gap-3">
                  <span>📅</span>
                  <span className="text-emerald-400 text-sm font-semibold">My Events</span>
                </div>
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-emerald-400/50 group-hover:translate-x-0.5 transition-transform">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
            <Link to="/tribalmela"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors duration-200 group">
              <div className="flex items-center gap-3">
                <span>🛍️</span>
                <span className="text-white/60 text-sm font-semibold">Tribal Mela</span>
              </div>
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white/25 group-hover:translate-x-0.5 transition-transform">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/donate"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FACC15]/10 border border-[#FACC15]/20 hover:bg-[#FACC15]/15 transition-colors duration-200 group">
              <div className="flex items-center gap-3">
                <span>❤️</span>
                <span className="text-[#FACC15] text-sm font-semibold">Donate</span>
              </div>
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[#FACC15]/50 group-hover:translate-x-0.5 transition-transform">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-red-500/20 text-red-400 font-['Syne'] font-bold text-sm hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Logout
        </motion.button>
      </div>
    </div>
  );
}