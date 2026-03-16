import { motion } from "framer-motion";

export default function CampaignCard({ title, description, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group relative bg-[#111111] rounded-2xl overflow-hidden card-border cursor-pointer"
      style={{
        boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Hover glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          boxShadow: "inset 0 0 60px rgba(250, 204, 21, 0.06)",
          background: "radial-gradient(ellipse at 50% 0%, rgba(250,204,21,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FACC15]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Placeholder image area */}
      <div className="relative w-full aspect-[16/9] bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* SVG illustration */}
          <div className="w-20 h-20 opacity-20 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500">
            {icon}
          </div>
        </div>
        {/* Placeholder gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e] via-[#181818] to-[#141414]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 relative z-10">
            {icon}
          </div>
        </div>
        {/* Shimmer line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="font-['Syne'] text-white font-semibold text-[0.95rem] leading-snug mb-2 group-hover:text-[#FACC15] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Bottom action row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]/60 group-hover:bg-[#FACC15] transition-colors duration-300" />
            <span className="text-white/30 text-[10px] tracking-widest uppercase font-medium group-hover:text-white/50 transition-colors duration-300">
              Campaign
            </span>
          </div>
          <span className="text-[#FACC15]/0 group-hover:text-[#FACC15]/70 text-xs transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            Learn more →
          </span>
        </div>
      </div>
    </motion.div>
  );
}