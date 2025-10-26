import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { NWBadge } from "@/components/NWBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { QASection } from "@/components/QASection";
import { aboutContent, experiences, experiencesIntro } from "@/content/portfolio";

export default function Home() {
  const [streamedAbout, setStreamedAbout] = useState("");
  const [streamedExperiences, setStreamedExperiences] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const contentEndRef = useRef<HTMLDivElement>(null);
  const hasStreamedRef = useRef(false);

  useEffect(() => {
    if (isStreaming && contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [streamedAbout, streamedExperiences, isStreaming]);

  useEffect(() => {
    if (hasStreamedRef.current) return;
    hasStreamedRef.current = true;

    console.log("Starting content stream...");
    
    const fullContent = aboutContent + "\n\n" + experiencesIntro;
    let index = 0;
    const charsPerInterval = 8;
    const intervalMs = 30;
    let timeoutId: NodeJS.Timeout;

    const streamNext = () => {
      if (index < aboutContent.length) {
        const newContent = aboutContent.slice(0, index + charsPerInterval);
        flushSync(() => {
          setStreamedAbout(newContent);
        });
        index += charsPerInterval;
        timeoutId = setTimeout(streamNext, intervalMs);
      } else if (index < fullContent.length) {
        flushSync(() => {
          setStreamedAbout(aboutContent);
          setStreamedExperiences(experiencesIntro.slice(0, index - aboutContent.length + charsPerInterval));
        });
        index += charsPerInterval;
        timeoutId = setTimeout(streamNext, intervalMs);
      } else {
        console.log("Stream complete");
        flushSync(() => {
          setStreamedAbout(aboutContent);
          setStreamedExperiences(experiencesIntro);
          setIsStreaming(false);
        });
      }
    };

    timeoutId = setTimeout(streamNext, intervalMs);

    return () => {
      console.log("Cleaning up timeout");
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background relative">
        <NWBadge />
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12 pb-12">
          <HeroSection />
          
          <div className="w-full overflow-x-auto mb-12" data-testid="container-portfolio-content">
            <div className="space-y-12">
              <AboutSection content={streamedAbout} />
              <ExperienceSection experiences={experiences} content={streamedExperiences} />
            </div>
            <div ref={contentEndRef} />
          </div>

          <QASection />
        </div>
      </div>
    </>
  );
}
