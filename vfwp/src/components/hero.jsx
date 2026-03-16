import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import swc from "../assets/swc.jpeg"
import vfwog from "../assets/vfwog.jpeg"
import vfw1 from "../assets/vfw1.jpeg"
import vfw2 from "../assets/vfw2.jpeg"

// Placeholder slides — replace with real campaign photos
const slides = [
  {
    id: 1,
    image: swc,
    label: "Child Protection",
    caption: "Protecting Every Child's Tomorrow",
  },
  {
    id: 2,
    image: vfwog,
    label: "Education",
    caption: "Equal Education for Every Child",
  },
  {
    id: 3,
    image: vfw1,
    label: "Community",
    caption: "Building Stronger Communities Together",
  },
  {
    id: 4,
    image: vfw2,
    label: "Empowerment",
    caption: "Empowering Futures with Every Step",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* ── Ambient background effects ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-[#FACC15]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#FACC15]/4 blur-[100px]" />
        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Headline ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            {/* Pill tag
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/8 text-[#FACC15] text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
                Voice For Welfare · Since 2020
              </span>
            </motion.div> */}

            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="font-['Syne'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight max-w-xl"
            >
              <span className="block text-white">Advocating</span>
              <span className="block text-white">for{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-yellow">Change</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 160 8" fill="none">
                    <path d="M2 6 C40 2, 120 2, 158 6" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
              <span className="block mt-1">
                <span className="text-white">Educate and</span>
                <span className="text-gradient-yellow"> Empower</span>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-white/55 text-base lg:text-lg leading-relaxed max-w-lg font-light"
            >
              {/* VFW is striving to make a difference — for the children, for the
              communities, for a world that treats{" "}
              <span className="text-white/80 font-medium">every life</span> with dignity,{" "}
              <span className="text-white/80 font-medium">equity</span>, and hope. */}
              VoiceForWelfare is a youth-led social welfare organization working to empower women and children and support marginalized communities through education, mental health awareness, and social justice initiatives. It aims to create an equal, compassionate, and inclusive society
            </motion.p>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 pt-2"
            >
              {[
                { value: "5+", label: "Active Campaigns" },
                { value: "25K+", label: "Women Impacted" },
                { value: "30k+", label: "Lives Impacted" },
                { value: "650+", label: "Volunteers" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="font-['Syne'] text-2xl font-bold text-[#FACC15]">
                    {stat.value}
                  </span>
                  <span className="text-white/40 text-xs tracking-wide uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 pt-1">
              <a
                href="#donate"
                className="px-7 py-3.5 bg-[#FACC15] text-black font-['Syne'] font-bold text-sm tracking-wide rounded-full hover:bg-yellow-300 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#FACC15]/20"
              >
                Donate Now
              </a>
              <a
                href="#campaigns"
                className="px-7 py-3.5 border border-white/20 text-white/80 font-medium text-sm rounded-full hover:border-white/50 hover:text-white transition-all duration-200"
              >
                Our Work →
              </a>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Carousel ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main slide container */}
            <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-3xl overflow-hidden border border-white/8 shadow-2xl">
              <AnimatePresence >
                {slides.map(
                  (slide, i) =>
                    i === current && (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex flex-col items-center justify-center gap-8 p-10`}
                      >
                        {/* SVG illustration */}
                        <img
                          src={slide.image}
                          alt={slide.label}
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Caption */}
                        {/* <div className="text-center">
                          <p className="font-['Syne'] text-lg font-semibold text-white leading-snug">
                            {slide.caption}
                          </p>
                        </div> */}

                        {/* Decorative corner accents */}
                        <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-[#FACC15]/40 rounded-tl-sm" />
                        <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-[#FACC15]/40 rounded-tr-sm" />
                        <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#FACC15]/40 rounded-bl-sm" />
                        <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#FACC15]/40 rounded-br-sm" />
                      </motion.div>
                    )
                )}
              </AnimatePresence>

              {/* Gradient overlay bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* Slide dots */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${i === current
                      ? "w-6 h-2 bg-[#FACC15]"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                    }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Floating label badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-[#FACC15] text-black px-4 py-2 rounded-2xl font-['Syne'] font-bold text-xs tracking-wide shadow-xl shadow-[#FACC15]/25"
            >
              {slides[current]?.label}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/25 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}