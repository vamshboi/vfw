import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import sandy from "../assets/sandeep.jpeg";

// ── Data ────────────────────────────────────────────────────────────────────

const milestones = [
  { year: "2023", text: "Founded at Nizam College with 05 volunteers" },
  { year: "2024", text: "Expanded to 3 cities, 200+ families impacted" },
  { year: "2025", text: "Indian Youth Icon Award" },
  { year: "2025", text: "APJ Abdul Kalam International Excellence Award" },
  { year: "2026", text: "Launched Tribal Art Marketplace" },
];

const values = [
  {
    label: "Our Mission",
    text: "To empower women and children and uplift marginalized communities through education, mental health awareness, gender equality, and social action.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="1.8" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Our Vision",
    text: "To build a just, equal, and compassionate society where every woman and child lives with dignity, safety, opportunity, and the freedom to reach their full potential.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="1.8" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      </svg>
    ),
  },
  {
    label: "Community First",
    text: "Every program is co-designed with tribal communities. We don't impose solutions — we build them together.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="1.8" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Transparent & Accountable",
    text: "All donations and expenditures are publicly reported. We publish annual impact reports and financial audits.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="1.8" className="w-5 h-5">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
];

const awards = [
  { icon: "🏆", label: "Indian Youth Icon Award" },
  { icon: "🌟", label: "APJ Abdul Kalam Award" },
];

const tags = ["Women Empowerment", "Child Education", "Tribal Welfare"];

const QUOTE =
  "When you educate a woman, you strengthen a generation — when you empower a child, you transform the future.";

// ── Framer Motion Variants ───────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(text, speed = 28, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function SectionTag({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
      {children}
    </span>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="text-[#FACC15]/70 text-xs font-semibold tracking-[0.25em] uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

// ── 1. Hero ──────────────────────────────────────────────────────────────────

function HeroHeader() {
  return (
    <section className="relative pt-32 pb-3 px-6 lg:px-10 overflow-hidden bg-[#0A0A0A]">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[400px] bg-[#FACC15]/4 blur-[140px] pointer-events-none rounded-full" />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <SectionTag>Our Story</SectionTag>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.06] tracking-tight text-white break-words"
        > 
          
          About{" "}
          <span
            className="text-[#FACC15]"
            style={{
              backgroundImage: "linear-gradient(135deg,#FACC15 0%,#FF0000 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VOICE FOR WELFARE
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
          className="text-white/50 text-base sm:text-lg leading-relaxed max-w-xl font-light"
        >
          03 years of relentless service — from forest hamlets to global recognition.
        </motion.p>

        {/* Accent divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="w-20 h-[3px] bg-gradient-to-r from-[#FACC15] to-[#FDE68A] rounded-full"
        />
      </div>
    </section>
  );
}

// ── 2. Organization Story ────────────────────────────────────────────────────

function TimelineCard() {
  return (
    <div
      className="relative bg-[#111111] rounded-2xl p-5 sm:p-7 flex flex-col gap-6 h-full"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
    >
      {/* Top yellow accent */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/60 to-transparent rounded-full" />

      {/* Founded badge */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="font-['Syne'] text-[#FACC15] text-s font-bold tracking-[0.2em] uppercase">
            EST. 2023
          </span>
          <span className="text-white font-['Syne'] text-xl font-semibold text-base mt-0.5">
            Founded by Sandeep Nayak
          </span>
        </div>
      </div>

      <div className="h-px bg-white/6" />

      {/* Timeline items */}
      <div className="flex flex-col gap-0">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="flex gap-4 group"
          >
            {/* Spine */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FACC15] shrink-0 mt-1.5 group-hover:scale-125 transition-transform duration-300" />
              {i < milestones.length - 1 && (
                <div className="w-px flex-1 bg-white/8 min-h-[28px]" />
              )}
            </div>

            {/* Content */}
            <div className="pb-5 flex-1">
              <span className="font-['Syne'] text-[#FACC15] text-s font-bold tracking-widest uppercase">
                {m.year}
              </span>
              <p className="text-white/80 text-base leading-relaxed mt-0.5">
                {m.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MissionVisionPanel() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Label + heading */}
      <div className="flex flex-col gap-3">
        <SectionTag>Mission &amp; Vision</SectionTag>
        <h2 className="font-['Syne'] text-white text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          Why We{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg,#FACC15,#FDE68A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Exist
          </span>
        </h2>
      </div>

      {/* Value cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {values.map((v, i) => (
          <motion.div
            key={v.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="group relative bg-[#111111] rounded-xl p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(250,204,21,0.06) 0%,transparent 70%)" }} />
            <div className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-[#FACC15]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FACC15]/10 flex items-center justify-center shrink-0">
                {v.icon}
              </div>
              <span className="font-['Syne'] text-white font-semibold text-sm group-hover:text-[#FACC15] transition-colors duration-300">
                {v.label}
              </span>
            </div>
            <p className="text-white text-sm leading-relaxed">{v.text}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        custom={values.length}
        viewport={{ once: true }}
      >
        <a
          href="/donate"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FACC15] text-black font-['Syne'] font-bold text-sm tracking-wide rounded-full hover:bg-yellow-300 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#FACC15]/20"
        >
          Support Our Mission
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </motion.div>
    </div>
  );
}

function OrganizationStory() {
  return (
    <section className="bg-[#0A0A0A] py-0 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Divider label="Our Journey" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 items-start">
          <TimelineCard />
          <MissionVisionPanel />
        </div>
      </div>
    </section>
  );
}

// ── 3. Founder Section ───────────────────────────────────────────────────────

function FounderProfile() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col gap-6"
    >
      {/* Photo */}
      <div className="relative w-full max-w-[320px] mx-auto lg:mx-0">
        {/* Yellow border frame */}
        <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-[#FACC15] via-[#FDE68A] to-[#FACC15]/40 rounded-2xl" />
        <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a]">
          <img
            src={sandy}
            alt="Sandeep Nayak — Founder, Voice For Welfare"
            className="w-full aspect-[4/5] object-cover object-top"
            onError={(e) => {
              // Graceful fallback if image not yet added
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.classList.add("min-h-[280px]", "flex", "items-center", "justify-center");
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Name + Designation */}
      <div className="text-center lg:text-left">
        <h3 className="font-['Syne'] text-white text-xl font-extrabold tracking-tight">
          Sandeep Nayak
        </h3>
        <p className="text-[#FACC15] text-sm font-semibold tracking-widest uppercase mt-1">
          Founder &amp; Director
        </p>
      </div>

      {/* Award badges */}
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {awards.map((a) => (
          <div
            key={a.label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FACC15]/10 border border-[#FACC15]/25 hover:bg-[#FACC15]/18 transition-colors duration-200"
          >
            <span className="text-base leading-none">{a.icon}</span>
            <span className="text-[#FACC15] text-xs font-semibold leading-snug">
              {a.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FounderStory() {
  const { displayed, done } = useTypewriter(QUOTE, 26, 600);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-8">
      {/* Intro paragraph */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-3"
      >
        <SectionTag>Meet the Founder</SectionTag>
        <h2 className="font-['Syne'] text-white text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          The Visionary Behind{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg,#FACC15,#FDE68A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            the Movement
          </span>
        </h2>
        <p className="text-white/55 text-base leading-relaxed font-light max-w-lg">
          Sandeep Nayak founded Voice for Welfare in 2023 at Nizam College,
          Hyderabad, driven by a conviction that no woman or child should be
          denied dignity due to poverty or geography.
        </p>
      </motion.div>

      {/* Typewriter quote card */}
      <motion.div
        variants={fadeUp}
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative bg-[#111111] rounded-2xl p-6 sm:p-8"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
      >
        {/* Decorative quote mark */}
        <div className="absolute top-5 right-6 font-['Syne'] text-[#FACC15]/10 text-8xl font-black leading-none select-none pointer-events-none">
          "
        </div>
        {/* Top glow accent */}
        <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#FACC15]/50 to-transparent rounded-full" />

        <div className="flex gap-3 items-start mb-4">
          <div className="w-1 rounded-full bg-[#FACC15] self-stretch shrink-0" />
          <p className="font-['Syne'] text-white/90 text-base sm:text-lg font-semibold leading-relaxed italic">
            {inView ? (
              <>
                "{displayed}
                {!done && (
                  <span className="inline-block w-[2px] h-[1.1em] bg-[#FACC15] ml-0.5 align-middle animate-pulse" />
                )}
                {done && '"'}
              </>
            ) : (
              <span className="opacity-0">"{QUOTE}"</span>
            )}
          </p>
        </div>

        {done && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[#FACC15] text-sm font-semibold tracking-wide pl-4"
          >
            — Sandeep Nayak
          </motion.p>
        )}
      </motion.div>

      {/* Pill tags */}
      <motion.div
        variants={fadeUp}
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap gap-3"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-wide hover:bg-[#FACC15]/15 transition-colors duration-200 cursor-default"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function FounderSection() {
  return (
    <section className="bg-[#0A0A0A] py-20 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Divider label="The Founder" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <FounderProfile />
          <FounderStory />
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen overflow-x-hidden">
      <HeroHeader />
      <OrganizationStory />
      <FounderSection />
      <Footer />
    </div>
  );
}
