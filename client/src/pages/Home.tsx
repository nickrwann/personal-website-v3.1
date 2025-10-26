import { useState, useEffect } from "react";
import { NWBadge } from "@/components/NWBadge";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { QASection } from "@/components/QASection";
import { aboutContent, experiences, experiencesIntro } from "@/content/portfolio";

export default function Home() {
  const [streamedAbout, setStreamedAbout] = useState("");
  const [streamedExperiences, setStreamedExperiences] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    const streamContent = async () => {
      const fullContent = aboutContent + "\n\n" + experiencesIntro;
      let index = 0;
      const charsPerInterval = 8;
      const intervalMs = 30;

      const interval = setInterval(() => {
        if (index < aboutContent.length) {
          setStreamedAbout(aboutContent.slice(0, index + charsPerInterval));
          index += charsPerInterval;
        } else if (index < fullContent.length) {
          setStreamedAbout(aboutContent);
          setStreamedExperiences(experiencesIntro.slice(0, index - aboutContent.length + charsPerInterval));
          index += charsPerInterval;
        } else {
          clearInterval(interval);
          setStreamedAbout(aboutContent);
          setStreamedExperiences(experiencesIntro);
          setIsStreaming(false);
        }
      }, intervalMs);

      return () => clearInterval(interval);
    };

    streamContent();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background relative">
        <NWBadge />
        <div className="max-w-3xl mx-auto px-4 py-12 pb-12">
          <HeroSection />
          <AboutSection content={streamedAbout} />
          <ExperienceSection experiences={experiences} content={streamedExperiences} />
          <QASection />
        </div>
      </div>
    </>
  );
}
