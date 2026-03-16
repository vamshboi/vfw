// src/pages/EventsPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useEvents } from "../../context/usevents";
import ActivityTimeline from "../../components/events/activitytimeline";
import EventCard from "../../components/events/eventcard";
import AdminEventForm from "../../components/events/admineventform";

// ── Role switcher (demo only — replace with real auth) ──
const ROLES = ["public", "volunteer", "admin"];

export default function EventsPage() {
  const { events, deleteEvent } = useEvents();
  const [role, setRole] = useState("public");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");

  const isAdmin = role === "admin";

  const filtered =
    filter === "All"
      ? events
      : events.filter((e) => e.status === filter);

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* ── Ambient bg ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#FACC15]/3 blur-[130px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[#FACC15]/3 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-24">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12"
        >
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
              Our Events
            </span>
            <h1 className="font-['Syne'] text-white text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Events &{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg,#FACC15,#FDE68A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Activities
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Demo role switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#111] rounded-xl border border-white/8">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                    role === r
                      ? "bg-[#FACC15] text-black"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FACC15] text-black font-['Syne'] font-bold text-sm rounded-xl hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                New Event
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start">

          {/* LEFT — Activity Timeline */}
          <div className="lg:sticky lg:top-28">
            <ActivityTimeline />
          </div>

          {/* RIGHT — Events Grid */}
          <div className="flex flex-col gap-6">

            {/* Filter tabs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex items-center gap-1 p-1 bg-[#111] rounded-xl border border-white/8 w-fit"
            >
              {["All", "Upcoming", "Completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    filter === f
                      ? "bg-[#FACC15] text-black"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {f}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {f === "All"
                      ? events.length
                      : events.filter((e) => e.status === f).length}
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={i}
                    isAdmin={isAdmin}
                    onDelete={deleteEvent}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white/20">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-white/25 text-sm">No {filter !== "All" ? filter.toLowerCase() : ""} events found.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Admin create modal */}
      {showForm && <AdminEventForm onClose={() => setShowForm(false)} />}
    </div>
  );
}