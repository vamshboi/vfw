import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/useauth";
import { Link } from "react-router-dom";

const API = "https://vfw-server.onrender.com/api";

const SKILLS = [
  "Teaching / Education",
  "Medical / Healthcare",
  "Digital / Technology",
  "Art & Culture",
  "Legal Aid",
  "Community Outreach",
  "Fundraising",
  "Photography / Media",
  "Social Work",
  "Other",
];

const WHY_OPTIONS = [
  "I want to give back to society",
  "I have relevant skills to contribute",
  "I want to gain hands-on experience",
  "I'm passionate about tribal welfare",
  "I want to make a meaningful impact",
];

export default function VolunteerPage() {
  const { isLoggedIn, user, token } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: "",
    skills: [],
    reason: "",
    whyJoin: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.city.trim()) e.city = "City is required";
    if (form.skills.length === 0) e.skills = "Select at least one skill";
    if (!form.reason.trim()) e.reason = "Please tell us why you want to join";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (!isLoggedIn) {
      alert("Please login first to apply as a volunteer!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/volunteer/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          skills: form.skills,
          reason: `${form.whyJoin ? form.whyJoin + " — " : ""}${form.reason}`,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        alert(data.message || "Submission failed");
      }
    } catch (err) {
      alert("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const inputClass = (err) => `w-full bg-[#0d0d0d] border ${err ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FACC15]/50 focus:ring-1 focus:ring-[#FACC15]/15 transition-all duration-200`;

  if (success) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0d0d0d] rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ boxShadow: "0 0 0 1px rgba(250,204,21,0.15), 0 40px 100px rgba(0,0,0,0.8)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

          <div className="w-20 h-20 rounded-full bg-[#FACC15]/15 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
              <path d="M5 12l5 5L20 7" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className="font-['Syne'] text-white text-2xl font-extrabold mb-2">Application Submitted! 🎉</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-2">
            Thank you, <span className="text-[#FACC15] font-semibold">{form.name}</span>!
          </p>
          <p className="text-white/40 text-xs leading-relaxed mb-8">
            Our team will review your application and get back to you within 2-3 working days.
          </p>

          <div className="flex flex-col gap-3">
            <Link to="/"
              className="w-full py-3 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 text-center block">
              Back to Home
            </Link>
            <Link to="/events"
              className="w-full py-3 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 hover:text-white/70 transition-all duration-200 text-center block">
              Browse Events
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#FACC15]/3 blur-[130px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[#FACC15]/2 blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
            Join Our Movement
          </span>
          <h1 className="font-['Syne'] text-white text-4xl sm:text-5xl font-extrabold mb-4">
            Volunteer with{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg,#FACC15,#FDE68A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              VFW
            </span>
          </h1>
          <p className="text-white/45 text-base leading-relaxed max-w-xl mx-auto">
            Your time and skills can transform a life. Join 620+ volunteers already making a difference across India.
          </p>
        </motion.div>

        {/* Why Volunteer Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: "🌍", title: "Real Ground Impact", desc: "Work directly with tribal families in remote areas" },
            { icon: "📜", title: "Certificate & Recognition", desc: "Official volunteer certificates and letters of recommendation" },
            { icon: "🤝", title: "Skill Development", desc: "Hands-on experience in community outreach and social impact" },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-[#0d0d0d] rounded-2xl p-5 text-center"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
              <span className="text-3xl mb-3 block">{card.icon}</span>
              <p className="font-['Syne'] text-white font-bold text-sm mb-1">{card.title}</p>
              <p className="text-white/40 text-xs leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Not logged in warning */}
        {!isLoggedIn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/25 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-yellow-400/80 text-xs leading-relaxed">
              Please <button onClick={() => {}} className="font-bold underline">login</button> first before submitting your application.
            </p>
          </motion.div>
        )}

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#0d0d0d] rounded-2xl overflow-hidden relative"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15] to-transparent" />

          <div className="p-8 flex flex-col gap-6">
            <div>
              <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1">Step 1</p>
              <h3 className="font-['Syne'] text-white text-lg font-extrabold">Personal Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input className={inputClass(errors.name)} placeholder="Full Name *"
                  value={form.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
              </div>
              <div>
                <input className={inputClass(errors.email)} placeholder="Email Address *" type="email"
                  value={form.email} onChange={(e) => set("email", e.target.value)} />
                {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
              </div>
              <div>
                <input className={inputClass(errors.phone)} placeholder="Phone Number *" type="tel"
                  value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input className={inputClass(errors.city)} placeholder="City *"
                  value={form.city} onChange={(e) => set("city", e.target.value)} />
                {errors.city && <p className="text-red-400 text-[11px] mt-1">{errors.city}</p>}
              </div>
            </div>

            <div className="h-px bg-white/8" />

            {/* Skills */}
            <div>
              <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1">Step 2</p>
              <h3 className="font-['Syne'] text-white text-lg font-extrabold mb-4">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <button key={skill} onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      form.skills.includes(skill)
                        ? "bg-[#FACC15] text-black"
                        : "bg-white/5 border border-white/10 text-white/50 hover:border-[#FACC15]/40 hover:text-white/80"
                    }`}>
                    {skill}
                  </button>
                ))}
              </div>
              {errors.skills && <p className="text-red-400 text-[11px] mt-2">{errors.skills}</p>}
            </div>

            <div className="h-px bg-white/8" />

            {/* Why join */}
            <div>
              <p className="text-[#FACC15] text-[10px] font-bold tracking-widest uppercase mb-1">Step 3</p>
              <h3 className="font-['Syne'] text-white text-lg font-extrabold mb-4">Why Do You Want to Join?</h3>

              {/* Quick select options */}
              <div className="flex flex-col gap-2 mb-4">
                {WHY_OPTIONS.map((opt) => (
                  <button key={opt} onClick={() => set("whyJoin", opt)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 ${
                      form.whyJoin === opt
                        ? "bg-[#FACC15]/10 border border-[#FACC15]/40 text-white"
                        : "bg-white/3 border border-white/8 text-white/50 hover:border-white/20"
                    }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      form.whyJoin === opt ? "border-[#FACC15] bg-[#FACC15]" : "border-white/20"
                    }`}>
                      {form.whyJoin === opt && (
                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </div>
                    {opt}
                  </button>
                ))}
              </div>

              {/* Free text */}
              <div>
                <label className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-2 block">
                  Tell us more about yourself *
                </label>
                <textarea
                  className={`${inputClass(errors.reason)} resize-none`}
                  rows={4}
                  placeholder="Share your motivation, past experience, or anything else you'd like us to know..."
                  value={form.reason}
                  onChange={(e) => set("reason", e.target.value)}
                />
                {errors.reason && <p className="text-red-400 text-[11px] mt-1">{errors.reason}</p>}
              </div>
            </div>

            <div className="h-px bg-white/8" />

            {/* Impact note */}
            <div className="flex items-start gap-3 p-4 bg-[#FACC15]/5 rounded-xl border border-[#FACC15]/15">
              <span className="text-xl mt-0.5">💛</span>
              <p className="text-white/50 text-xs leading-relaxed">
                By submitting this form, you agree to be part of Voice For Welfare's volunteer network.
                Our team will review your application and contact you within <strong className="text-white/70">2-3 working days</strong>.
              </p>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#FACC15] text-black font-['Syne'] font-bold text-sm hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-[#FACC15]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>🚀 Submit Application</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}