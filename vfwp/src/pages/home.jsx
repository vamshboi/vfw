import Hero from "../components/hero";
import CampaignSection from "../components/campaignsection";
import Footer from "../components/footer";
import HighlightCards from "../components/highlightcards";

export default function Home({ onJoinUs }) {
  return (
    <main className="bg-[#0A0A0A] text-white min-h-screen overflow-x-hidden">
      <Hero />
      <CampaignSection />
      <HighlightCards />
      <Footer />
    </main>
  );
}