import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEvents } from "../../context/usevents";
import { useAuth } from "../../context/useauth";
import EventFormBuilder from "../../components/events/eventformbuilder";
import EventRegistrationForm from "../../components/events/eventregistrationform";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Image Slideshow ──────────────────────────────────────────────────────────
function ImageSlideshow({ images, title }) {
  const [current, setCurrent] = useState(0);
  const hasImages = images && images.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#111]"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
        <AnimatePresence mode="wait">
          {hasImages ? (
            <motion.img key={current} src={images[current]} alt={`${title} — ${current + 1}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#1e1e1e] to-[#141414]">
              <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-20">
                <rect x="8" y="14" width="48" height="36" rx="4" stroke="#FACC15" strokeWidth="2" />
                <path d="M8 26h48" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="22" cy="20" r="3" stroke="white" strokeWidth="1.5" />
                <path d="M8 42l12-10 10 8 8-6 18 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-white/20 text-xs tracking-widest uppercase font-semibold">Event Photos Coming Soon</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#FACC15]/40 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#FACC15]/40 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#FACC15]/40 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#FACC15]/40 rounded-br-sm pointer-events-none" />

        {hasImages && images.length > 1 && (
          <>
            <button onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center backdrop-blur-sm transition-all duration-200">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M10 3L5 8l5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => setCurrent((p) => (p + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center backdrop-blur-sm transition-all duration-200">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M6 3l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === current ? "border-[#FACC15]" : "border-transparent opacity-50 hover:opacity-75"
              }`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {hasImages && images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-1.5 bg-[#FACC15]" : "w-1.5 h-1.5 bg-white/20"
              }`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const { id } = useParams();
  const { events } = useEvents();
  const navigate = useNavigate();
  const { isAdmin, isVolunteer, isLoggedIn } = useAuth();

  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);

  const event = events.find((e) => String(e.id) === String(id));

  if (!event) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center gap-5 px-6">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white/20">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="font-['Syne'] text-white text-xl font-bold">Event not found</h2>
        <Link to="/events" className="text-[#FACC15] text-sm hover:underline">← Back to Events</Link>
      </div>
    );
  }

  const isUpcoming = event.status === "Upcoming";

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-[#FACC15]/3 blur-[130px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-24">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors duration-200 group"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Events
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* LEFT — Slideshow */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <ImageSlideshow images={event.images} title={event.title} />
          </motion.div>

          {/* RIGHT — Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6">

            {/* Status + category */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase ${
                isUpcoming ? "bg-[#FACC15] text-black" : "bg-white/10 text-white/50 border border-white/10"
              }`}>{event.status}</span>
              <span className="text-[10px] font-semibold px-3 py-1 rounded-full border border-white/10 text-white/40 tracking-wide">
                {event.category}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-['Syne'] text-white text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-3">
                {event.title}
              </h1>
              <div className="w-14 h-[3px] bg-gradient-to-r from-[#FACC15] to-[#FDE68A] rounded-full" />
            </div>

            {/* Meta info */}
            <div className="flex flex-col gap-3 p-5 bg-[#111] rounded-2xl"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FACC15]/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[#FACC15]">
                    <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 7h14M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Date</p>
                  <p className="text-white text-sm font-medium">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FACC15]/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[#FACC15]">
                    <path d="M8 1a4.5 4.5 0 0 1 4.5 4.5C12.5 8.75 8 14.5 8 14.5S3.5 8.75 3.5 5.5A4.5 4.5 0 0 1 8 1z" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Location</p>
                  <p className="text-white text-sm font-medium">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-3">
              <h3 className="font-['Syne'] text-white font-semibold text-sm tracking-wide uppercase text-white/50">
                About This Event
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">{event.description}</p>
            </div>

            {/* Impact summary */}
            {!isUpcoming && (
              <div className="p-5 bg-[#FACC15]/5 rounded-2xl border border-[#FACC15]/15">
                <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-2">Impact Summary</p>
                <p className="text-white/55 text-xs leading-relaxed">
                  This event was successfully conducted by Voice For Welfare volunteers and community members,
                  creating measurable change in the lives of those involved.
                </p>
              </div>
            )}

            {/* ── Role-based CTAs ── */}

            {/* ADMIN controls */}
            {isAdmin && (
              <div className="flex flex-col gap-3 p-5 bg-[#111] rounded-2xl border border-white/8">
                <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase">Admin Controls</p>
                <div className="flex gap-3 flex-wrap">
                  <button className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium border border-white/8 transition-all duration-200">
                    Edit Event
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-medium border border-red-500/20 transition-all duration-200">
                    Delete Event
                  </button>
                </div>
                {isUpcoming && (
                  <button
                    onClick={() => setShowFormBuilder(true)}
                    className="w-full py-2.5 rounded-xl bg-[#FACC15]/10 hover:bg-[#FACC15]/20 text-[#FACC15] text-sm font-semibold border border-[#FACC15]/25 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Create Registration Form
                  </button>
                )}
              </div>
            )}

            {/* VOLUNTEER — Register for upcoming event */}
            {isVolunteer && !isAdmin && isUpcoming && (
              <div className="flex flex-col gap-3 p-5 bg-[#FACC15]/8 rounded-2xl border border-[#FACC15]/25">
                <p className="text-[#FACC15] text-xs font-semibold">
                  🌟 You're a Volunteer — register for this event!
                </p>
                <button
                  onClick={() => setShowRegForm(true)}
                  className="w-full py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20"
                >
                  Register for This Event →
                </button>
              </div>
            )}

            {/* USER / not logged in */}
            {!isAdmin && !isVolunteer && (
              <div className="flex flex-col gap-3 p-5 bg-[#111] rounded-2xl border border-white/8">
                <p className="text-white/40 text-xs leading-relaxed">
                  {isLoggedIn
                    ? "Want to participate? Apply to become a volunteer to register for events!"
                    : "Want to be part of this initiative? Join our volunteer network and help us create real impact."}
                </p>
                <Link
                  to={isLoggedIn ? "/volunteer" : "/"}
                  className="block w-full py-3 text-center rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20"
                >
                  {isLoggedIn ? "Apply as Volunteer →" : "Join Us →"}
                </Link>
              </div>
            )}

          </motion.div>
        </div>
      </div>

      {/* Admin Form Builder Modal */}
      <AnimatePresence>
        {showFormBuilder && (
          <EventFormBuilder
            eventId={event.id}
            onClose={() => setShowFormBuilder(false)}
            onSaved={() => setShowFormBuilder(false)}
          />
        )}
      </AnimatePresence>

      {/* Volunteer Registration Form Modal */}
      <AnimatePresence>
        {showRegForm && (
          <EventRegistrationForm
            event={event}
            onClose={() => setShowRegForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}