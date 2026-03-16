// src/components/events/EventCard.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventCard({ event, index, onDelete, isAdmin }) {
  const isUpcoming = event.status === "Upcoming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group relative bg-[#111111] rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%,rgba(250,204,21,0.07) 0%,transparent 70%)",
        }}
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/9] bg-[#1a1a1a] overflow-hidden shrink-0">
        {event.images && event.images.length > 0 ? (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e1e1e] to-[#141414]">
            <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 opacity-20 group-hover:opacity-35 transition-opacity duration-400">
              <rect x="8" y="14" width="48" height="36" rx="4" stroke="#FACC15" strokeWidth="2" />
              <path d="M8 26h48M20 14v12M44 14v12" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M18 36h14M18 42h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="44" cy="39" r="5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase ${
              isUpcoming
                ? "bg-[#FACC15] text-black"
                : "bg-white/10 text-white/50 border border-white/10"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Admin delete */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(event.id);
            }}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors duration-200"
            title="Delete event"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2 flex-1 relative z-10">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase">
            {formatDate(event.date)}
          </span>
          <span className="text-white/25 text-[10px] border border-white/10 px-2 py-0.5 rounded-full">
            {event.category}
          </span>
        </div>

        <h3 className="font-['Syne'] text-white font-semibold text-sm leading-snug group-hover:text-[#FACC15] transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/30 shrink-0">
            <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span className="text-white/35 text-[11px] truncate">{event.location}</span>
        </div>

        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* View details link */}
        <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]/50 group-hover:bg-[#FACC15] transition-colors duration-300" />
            <span className="text-white/25 text-[10px] tracking-widest uppercase font-medium">VFW</span>
          </div>
          <Link
            to={`/events/${event.id}`}
            className="text-[#FACC15]/0 group-hover:text-[#FACC15]/80 text-xs font-medium transition-all duration-300 translate-x-2 group-hover:translate-x-0"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}