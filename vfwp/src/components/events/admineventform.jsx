// src/components/events/AdminEventForm.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvents } from "../../context/usevents";
import { CATEGORIES } from "../../data/eventsdata";

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: CATEGORIES[0],
  status: "Upcoming",
  images: [],
};

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-semibold tracking-widest uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-[11px]">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#FACC15]/50 focus:ring-1 focus:ring-[#FACC15]/20 transition-all duration-200";

export default function AdminEventForm({ onClose }) {
  const { addEvent } = useEvents();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    addEvent({ ...form });
    setSuccess(true);
    setTimeout(onClose, 1200);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg bg-[#111111] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.6)" }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1">
                  Admin
                </p>
                <h3 className="font-['Syne'] text-white text-lg font-extrabold">
                  Create New Event
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-200"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-10"
              >
                <div className="w-14 h-14 rounded-full bg-[#FACC15]/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                    <path d="M5 12l5 5L20 7" stroke="#FACC15" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="font-['Syne'] text-white font-semibold text-base">
                  Event Created!
                </p>
                <p className="text-white/40 text-sm">
                  It now appears in the timeline and grid.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="Event Title" error={errors.title}>
                  <input
                    className={inputClass}
                    placeholder="e.g. Education Drive 2025"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date" error={errors.date}>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.date}
                      onChange={(e) => set("date", e.target.value)}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      className={inputClass}
                      value={form.status}
                      onChange={(e) => set("status", e.target.value)}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </Field>
                </div>

                <Field label="Location" error={errors.location}>
                  <input
                    className={inputClass}
                    placeholder="e.g. Hyderabad, Telangana"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </Field>

                <Field label="Category">
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Description" error={errors.description}>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Describe the event..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </Field>

                <Field label="Image URL (optional)">
                  <input
                    className={inputClass}
                    placeholder="https://..."
                    onChange={(e) =>
                      set("images", e.target.value ? [e.target.value] : [])
                    }
                  />
                </Field>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 hover:text-white/70 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}