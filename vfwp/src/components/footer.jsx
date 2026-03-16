import { motion } from "framer-motion";

const contacts = [
  {
    id: "instagram",
    label: "Follow us on",
    value: "@voiceforwelfare",
    href: "https://www.instagram.com/voiceforwelfare",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "from-purple-500 via-pink-500 to-orange-400",
    glowColor: "rgba(236, 72, 153, 0.3)",
  },
  {
    id: "email",
    label: "Mail us at",
    value: "contact@voiceforwelfare.org",
    href: "mailto:contact@voiceforwelfare.org",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-yellow-400 to-orange-400",
    glowColor: "rgba(250, 204, 21, 0.3)",
  },
  {
    id: "phone",
    label: "Call us at",
    value: "+91 7815928581",
    href: "tel:+917815928581",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.01L6.6 10.8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-green-400 to-emerald-500",
    glowColor: "rgba(52, 211, 153, 0.3)",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] border-t border-white/5">
      {/* Ambient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#FACC15]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-0">

        {/* Brand row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16"
        >
        </motion.div>

        {/* Contact items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-3 gap-4 sm:gap-8 mb-16"
        >
          {contacts.map((contact) => (
            <motion.a
              key={contact.id}
              href={contact.href}
              target={contact.id === "instagram" ? "_blank" : undefined}
              rel={contact.id === "instagram" ? "noopener noreferrer" : undefined}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group flex flex-col items-center gap-3 text-center"
            >
              {/* Icon circle */}
              <motion.div
                whileHover={{
                  scale: 1.12,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${contact.color} p-[1px]`}
              >
                {/* Inner dark bg */}
                <div className="w-full h-full rounded-[15px] bg-[#111] flex items-center justify-center text-white group-hover:bg-[#161616] transition-colors duration-300">
                  {contact.icon}
                </div>
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-xl -z-10"
                  style={{ background: contact.glowColor }}
                />
              </motion.div>

              {/* Text */}
              <div className="flex flex-col gap-0.5">
                <span className="text-white/35 text-[10px] sm:text-xs tracking-widest uppercase font-medium">
                  {contact.label}
                </span>
                <span className="text-white/80 text-xs sm:text-sm font-medium group-hover:text-white transition-colors duration-200 break-all sm:break-normal">
                  {contact.value}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs tracking-wide">
            © 2025 Voice For Welfare. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms", "Volunteer"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/20 text-xs hover:text-white/50 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}