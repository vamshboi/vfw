// src/components/events/ActivityTimeline.jsx
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEvents } from "../../context/usevents";

const API = import.meta.env.VITE_API_URL;

const CATEGORY_COLORS = {
  Education: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Women Empowerment": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Tribal Art": "bg-[#FACC15]/15 text-[#FACC15] border-[#FACC15]/30",
  "Child Welfare": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Health & Hygiene": "bg-green-500/15 text-green-400 border-green-500/25",
  Community: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Healthcare: "bg-green-500/15 text-green-400 border-green-500/25",
  "Child Protection": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Community Welfare": "bg-purple-500/15 text-purple-400 border-purple-500/25",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Timeline Card for Events ──────────────────────────────────────────────────
function TimelineCard({ event, index, side = "recent" }) {
  const tagClass =
    CATEGORY_COLORS[event.category] ||
    "bg-white/10 text-white/60 border-white/15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.22 } }}
      className="flex gap-4 group"
    >
      <div className="flex flex-col items-center shrink-0 w-5">
        <div className="relative mt-1.5">
          <motion.div
            animate={side === "recent" ? { scale: [1, 1.35, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: index * 0.4 }}
            className="w-3.5 h-3.5 rounded-full bg-[#FACC15] z-10 relative"
          />
          {side === "recent" && (
            <div className="absolute inset-0 rounded-full bg-[#FACC15]/30 animate-ping" />
          )}
        </div>
      </div>

      <div
        className="relative mb-6 flex-1 bg-[#111111] rounded-xl p-4 group-hover:bg-[#161616] transition-colors duration-300"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
      >
        <div className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-[#FACC15]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full" />

        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase">
            {formatDate(event.date)}
          </p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagClass} shrink-0`}>
            {event.category}
          </span>
        </div>

        <h4 className="font-['Syne'] text-white text-sm font-semibold leading-snug mb-1 group-hover:text-[#FACC15] transition-colors duration-300">
          {event.title}
        </h4>

        <div className="flex items-center gap-1.5 mb-2">
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/30 shrink-0">
            <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span className="text-white/35 text-[10px]">{event.location}</span>
        </div>

        <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Report Card ───────────────────────────────────────────────────────────────
function ReportCard({ report, index }) {
  const tagClass =
    CATEGORY_COLORS[report.category] ||
    "bg-white/10 text-white/60 border-white/15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.22 } }}
      className="flex gap-4 group"
    >
      <div className="flex flex-col items-center shrink-0 w-5">
        <div className="relative mt-1.5">
          <motion.div
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: index * 0.4 }}
            className="w-3.5 h-3.5 rounded-full bg-emerald-400 z-10 relative"
          />
          <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
        </div>
      </div>

      <div
        className="relative mb-6 flex-1 bg-[#111111] rounded-xl p-4 group-hover:bg-[#161616] transition-colors duration-300"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
      >
        <div className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full" />

        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-[9px] font-bold tracking-widest uppercase bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
              📄 Report
            </span>
            <p className="text-white/40 text-[10px]">{formatDate(report.date)}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagClass} shrink-0`}>
            {report.category}
          </span>
        </div>

        <h4 className="font-['Syne'] text-white text-sm font-semibold leading-snug mb-1 group-hover:text-emerald-400 transition-colors duration-300">
          {report.title}
        </h4>

        <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2">
          {report.description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Timeline ─────────────────────────────────────────────────────────────
export default function ActivityTimeline() {
  const { events } = useEvents();
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("events");

  // Fetch reports from backend
  useEffect(() => {
    fetch(`${API}/admin/reports/public`)
      .then((r) => r.json())
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setReports([]));
  }, []);

  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const earliest = sorted.slice(0, 3);
  const recent = sorted.slice(-3).reverse();

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [reports]
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
          Activity Timeline
        </span>
        <h2 className="font-['Syne'] text-white text-2xl font-extrabold leading-tight">
          Our Journey
          <br />
          <span
            style={{
              backgroundImage: "linear-gradient(135deg,#FACC15,#FDE68A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            in Action
          </span>
        </h2>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 bg-[#111] rounded-xl border border-white/8 mb-6">
        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === "events" ? "bg-[#FACC15] text-black" : "text-white/40 hover:text-white/70"
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === "reports" ? "bg-emerald-400 text-black" : "text-white/40 hover:text-white/70"
          }`}
        >
          Reports
          {reports.length > 0 && (
            <span className={`text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
              activeTab === "reports" ? "bg-black/20 text-black" : "bg-emerald-500/20 text-emerald-400"
            }`}>
              {reports.length}
            </span>
          )}
        </button>
      </div>

      {/* Events Timeline */}
      {activeTab === "events" && (
        <>
          {/* Recent block */}
          <div className="relative">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              Most Recent
            </p>
            <div className="absolute left-2 top-7 bottom-0 w-px bg-gradient-to-b from-[#FACC15]/50 via-[#FACC15]/20 to-transparent" />
            {recent.map((event, i) => (
              <TimelineCard key={event.id} event={event} index={i} side="recent" />
            ))}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 my-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="text-white/25 text-[10px] tracking-[0.2em] uppercase font-semibold whitespace-nowrap">
              Where It Began
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </motion.div>

          {/* Origins block */}
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-6 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            {earliest.map((event, i) => (
              <TimelineCard key={event.id} event={event} index={i} side="origin" />
            ))}
          </div>
        </>
      )}

      {/* Reports Timeline */}
      {activeTab === "reports" && (
        <div className="relative">
          {sortedReports.length === 0 ? (
            <div className="text-center py-12 text-white/25 text-sm">
              <p>No reports published yet</p>
            </div>
          ) : (
            <>
              <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                Latest Reports
              </p>
              <div className="absolute left-2 top-7 bottom-0 w-px bg-gradient-to-b from-emerald-400/50 via-emerald-400/20 to-transparent" />
              {sortedReports.map((report, i) => (
                <ReportCard key={report.id} report={report} index={i} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}