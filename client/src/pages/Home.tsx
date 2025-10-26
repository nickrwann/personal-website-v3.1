import { NWBadge } from "@/components/NWBadge";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { QASection } from "@/components/QASection";

export default function Home() {
  return (
    <>
      <NWBadge />
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-12 pb-48">
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <QASection />
        </div>
      </div>
    </>
  );
}
