import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useauth";
import { useEvents } from "../context/usevents";
import { Navigate } from "react-router-dom";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MyEvents() {
  const { isLoggedIn, isVolunteer, isAdmin, user } = useAuth();
  const { events } = useEvents();
  const [filter, setFilter] = useState("Upcoming");
  const [applied, setApplied] = useState([]);

  if (!isLoggedIn) return <Navigate to="/" />;
  if (!isVolunteer && !isAdmin) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-5 px-6">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <span className="text-3xl">🔒</span>
        </div>
        <h2 className="font-['Syne'] text-white text-xl font-bold">Volunteer Access Required</h2>
        <p className="text-white/40 text-sm text-center max-w-sm">
          You need to be a volunteer to access this page. Apply to become a volunteer first!
        </p>
        <Link to="/volunteer" className="px-6 py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200">
          Apply as Volunteer →
        </Link>
      </div>
    );
  }

  const upcomingEvents = events.filter((e) => e.status === "Upcoming");
  const completedEvents = events.filter((e) => e.status === "Completed");
  const appliedEvents = events.filter((e) => applied.includes(e.id));

  const filtered = filter === "Upcoming" ? upcomingEvents : filter === "Completed" ? completedEvents : appliedEvents;

  const handleApply = (id) => {
    if (!applied.includes(id)) setApplied((prev) => [...prev, id]);
  };

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#FACC15]/3 blur-[130px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Volunteer Dashboard
          </span>
          <h1 className="font-['Syne'] text-white text-4xl font-extrabold">
            My Events
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Welcome, <span className="text-[#FACC15] font-semibold">{user?.name}</span>! Apply for upcoming events and track your participation.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Upcoming", value: upcomingEvents.length, color: "bg-[#FACC15]/20 text-[#FACC15]" },
            { label: "Applied", value: applied.length, color: "bg-emerald-500/20 text-emerald-400" },
            { label: "Completed", value: completedEvents.length, color: "bg-white/10 text-white/50" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d0d0d] rounded-2xl p-4 text-center"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <p className={`font-['Syne'] text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0d0d0d] rounded-xl border border-white/8 w-fit mb-6">
          {["Upcoming", "Applied", "Completed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === f ? "bg-[#FACC15] text-black" : "text-white/40 hover:text-white/70"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl opacity-20">📅</span>
            <p className="text-white/25 text-sm">
              {filter === "Applied" ? "You haven't applied to any events yet" : `No ${filter.toLowerCase()} events`}
            </p>
            {filter === "Applied" && (
              <button onClick={() => setFilter("Upcoming")} className="text-[#FACC15]/60 text-xs hover:text-[#FACC15] transition-colors">
                Browse upcoming events →
              </button>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((event, i) => {
              const isApplied = applied.includes(event.id);
              const isUpcoming = event.status === "Upcoming";

              return (
                <motion.div key={event.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#0d0d0d] rounded-2xl p-5 relative overflow-hidden"
                  style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/30 to-transparent" />

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase ${
                          isUpcoming ? "bg-[#FACC15] text-black" : "bg-white/10 text-white/50 border border-white/10"
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 text-white/40">
                          {event.category}
                        </span>
                        {isApplied && (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ Applied
                          </span>
                        )}
                      </div>

                      <h3 className="font-['Syne'] text-white font-bold text-base mb-1">{event.title}</h3>

                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-[#FACC15]">
                            <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
                            <path d="M1 7h14M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                          <span className="text-white/50 text-xs">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-[#FACC15]">
                            <path d="M8 1a4.5 4.5 0 0 1 4.5 4.5C12.5 8.75 8 14.5 8 14.5S3.5 8.75 3.5 5.5A4.5 4.5 0 0 1 8 1z" stroke="currentColor" strokeWidth="1.4" />
                            <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                          <span className="text-white/50 text-xs">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{event.description}</p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Link to={`/events/${event.id}`}
                        className="px-4 py-2 rounded-xl border border-white/10 text-white/50 text-xs font-medium hover:border-white/20 hover:text-white/70 transition-all duration-200 text-center">
                        View Details
                      </Link>
                      {isUpcoming && (
                        <button
                          onClick={() => handleApply(event.id)}
                          disabled={isApplied}
                          className={`px-4 py-2 rounded-xl text-xs font-['Syne'] font-bold transition-all duration-200 ${
                            isApplied
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                              : "bg-[#FACC15] text-black hover:bg-yellow-300 shadow-lg shadow-[#FACC15]/20"
                          }`}>
                          {isApplied ? "✓ Applied" : "Apply Now"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}