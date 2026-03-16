import { motion } from "framer-motion";
import CampaignCard from "./campaigncard";

const campaigns = [
  {
    title: "Working Against Child Marriages",
    description:
      "Protecting every child's right to grow, learn, and choose their own path — free from the burden of early marriage.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="22" r="9" stroke="#FACC15" strokeWidth="2.5" />
        <circle cx="44" cy="22" r="9" stroke="#FACC15" strokeWidth="2.5" />
        <path d="M8 56c0-8.8 7.2-16 16-16" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 40c8.8 0 16 7.2 16 16" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 44c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 26v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Working Against Children Trafficking",
    description:
      "Breaking the chains of exploitation and ensuring every child is safe, protected, and free from trafficking.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="18" width="44" height="30" rx="4" stroke="#FACC15" strokeWidth="2.5" />
        <path d="M24 18v-6a8 8 0 0116 0v6" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="33" r="5" stroke="white" strokeWidth="2" />
        <path d="M32 38v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Creating Awareness on Menstrual Health",
    description:
      "Normalising menstruation, eliminating stigma, and ensuring every girl has access to hygiene and dignity.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="28" r="12" stroke="#FACC15" strokeWidth="2.5" />
        <path d="M22 44h20M32 40v10" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 22c0-6.6 5.4-12 12-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="28" r="4" fill="#FACC15" fillOpacity="0.3" stroke="#FACC15" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Working Against Child Labour",
    description:
      "Every child deserves a classroom, not a worksite. We fight to end exploitative child labour across communities.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 52V32l20-16 20 16v20" stroke="#FACC15" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="24" y="36" width="16" height="16" rx="2" stroke="#FACC15" strokeWidth="2" />
        <path d="M32 28v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="24" r="3" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Equal Education for All",
    description:
      "Building bridges to knowledge — regardless of gender, caste, or income. Education is a right, not a privilege.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="14" width="48" height="36" rx="4" stroke="#FACC15" strokeWidth="2.5" />
        <path d="M8 26h48M20 14v12M44 14v12" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 36h12M16 42h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="44" cy="39" r="4" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Fighting Gender-Based Violence",
    description:
      "Standing firm against all forms of violence rooted in gender inequality — for a safer world for everyone.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 10l4.9 9.9L48 21.6l-8 7.8 1.9 11-9.9-5.2-9.9 5.2 1.9-11-8-7.8 11.1-1.7L32 10z" stroke="#FACC15" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M20 46c0 0 4 6 12 6s12-6 12-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Reducing Household Child Labour",
    description:
      "Dismantling invisible labour placed unfairly on children — every child deserves time to play and learn.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 28c8-8 24-8 32 0" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 44c0-11 8.96-20 20-20s20 8.96 20 20" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 12v4M12 32h4M48 32h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="46" r="5" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Supporting Education Costs",
    description:
      "No child should miss school because education is out of financial reach. We work to eliminate cost barriers.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="24" r="10" stroke="#FACC15" strokeWidth="2.5" />
        <path d="M14 52c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 24h4l2 4 4-10 2 6h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function CampaignSection() {
  return (
    <section
      id="campaigns"
      className="relative py-20 bg-[#0A0A0A]"
    >
      {/* Top fade from hero */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0A0A0A] to-transparent pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FACC15]/3 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section label — minimal, no big heading per spec */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[#FACC15]/70 text-xs font-semibold tracking-[0.25em] uppercase">
            Our Campaigns
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>

        {/* Campaign grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {campaigns.map((campaign, i) => (
            <CampaignCard
              key={campaign.title}
              title={campaign.title}
              description={campaign.description}
              icon={campaign.icon}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}