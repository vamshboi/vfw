import { motion } from "framer-motion";
// import RegisterForm from "./registration";

const highlights = [
    {
        title: "Tribal Mela",
        description:
            "A marketplace where tribal communities can showcase and sell their handmade products so supporters can directly contribute to their livelihoods.",
        href: "/tribal-arts",
        cta: "Explore Marketplace",
        icon: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="32" cy="32" r="30" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="4 3" />
                <path d="M20 44 C20 44 24 36 32 36 C40 36 44 44 44 44" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
                <path d="M26 28 C26 24.7 28.7 22 32 22 C35.3 22 38 24.7 38 28 C38 31.3 35.3 34 32 34 C28.7 34 26 31.3 26 28Z" stroke="#FACC15" strokeWidth="2" />
                <path d="M14 20 L20 26 M44 20 L50 26 M14 44 L20 38 M44 44 L50 38" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="32" cy="14" r="3" stroke="#FACC15" strokeWidth="1.5" />
                <circle cx="14" cy="32" r="3" stroke="#FACC15" strokeWidth="1.5" />
                <circle cx="50" cy="32" r="3" stroke="#FACC15" strokeWidth="1.5" />
            </svg>
        ),
        accentFrom: "from-yellow-500/20",
        accentTo: "to-amber-900/10",
    },
    {
        title: "Activities",
        description:
            "A timeline view of all activities and initiatives conducted by Voice For Welfare to create meaningful social impact.",
        href: "/activities",
        cta: "View Timeline",
        icon: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="32" cy="32" r="30" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="32" y1="14" x2="32" y2="50" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
                <circle cx="32" cy="20" r="4" stroke="#FACC15" strokeWidth="2" fill="#FACC15" fillOpacity="0.15" />
                <circle cx="32" cy="32" r="4" stroke="#FACC15" strokeWidth="2" fill="#FACC15" fillOpacity="0.15" />
                <circle cx="32" cy="44" r="4" stroke="#FACC15" strokeWidth="2" fill="#FACC15" fillOpacity="0.15" />
                <path d="M36 20 H46" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M18 32 H28" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M36 44 H46" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M36 22 H42" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
                <path d="M22 34 H28" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
                <path d="M36 46 H42" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
            </svg>
        ),
        accentFrom: "from-white/5",
        accentTo: "to-zinc-800/20",
    },
    {
        title: "Join Us",
        description:
            "Become part of the Voice For Welfare family and volunteer with us to make a meaningful difference in communities.",
        href: "/join-us",
        cta: "Become a Volunteer",
        icon: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="32" cy="32" r="30" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="4 3" />
                <circle cx="22" cy="26" r="7" stroke="#FACC15" strokeWidth="2" />
                <circle cx="42" cy="26" r="7" stroke="#FACC15" strokeWidth="2" />
                <path d="M10 50 C10 42 15.4 36 22 36" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
                <path d="M42 36 C48.6 36 54 42 54 50" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 42 C28 38.7 29.8 36 32 36 C34.2 36 36 38.7 36 42" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 50 C28 46 29.8 42 32 42 C34.2 42 36 46 36 50" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
                <path d="M32 14 L32 10 M38 16 L41 13 M26 16 L23 13" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accentFrom: "from-yellow-400/15",
        accentTo: "to-yellow-900/5",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function HighlightCards() {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16">
            {/* Divider label */}
            <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-[#FACC15]/70 text-xs font-semibold tracking-[0.25em] uppercase whitespace-nowrap">
                    Get Involved
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {highlights.map((card, i) => (
                    <motion.div
                        key={card.title}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        whileHover={{ y: -8, transition: { duration: 0.28, ease: "easeOut" } }}
                        className="group relative bg-[#111111] rounded-2xl overflow-hidden cursor-pointer"
                        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
                    >
                        {/* Top gradient accent on hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Radial glow overlay */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                            style={{
                                background:
                                    "radial-gradient(ellipse at 50% 0%, rgba(250,204,21,0.07) 0%, transparent 70%)",
                                boxShadow: "inset 0 0 60px rgba(250,204,21,0.05)",
                            }}
                        />

                        {/* Illustration area */}
                        <div
                            className={`relative w-full aspect-[16/9] bg-gradient-to-br ${card.accentFrom} ${card.accentTo} flex items-center justify-center overflow-hidden`}
                        >
                            <div className="w-28 h-28 opacity-30 group-hover:opacity-55 group-hover:scale-110 transition-all duration-500">
                                {card.icon}
                            </div>
                            {/* Bottom shimmer */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col gap-3">
                            <h3 className="font-['Syne'] text-white font-semibold text-[1rem] leading-snug group-hover:text-[#FACC15] transition-colors duration-300">
                                {card.title}
                            </h3>
                            <p className="text-white/40 text-xs leading-relaxed">
                                {card.description}
                            </p>

                            {/* CTA row */}
                            <div className="pt-1 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]/50 group-hover:bg-[#FACC15] transition-colors duration-300" />
                                    <span className="text-white/30 text-[10px] tracking-widest uppercase font-medium group-hover:text-white/50 transition-colors duration-300">
                                        VFW
                                    </span>
                                </div>

                                <a
                                    href={card.href}
                                    className="text-[#FACC15]/0 group-hover:text-[#FACC15]/80 text-xs font-medium transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                                >
                                    {card.cta} →
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}