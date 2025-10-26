import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { NWBadge } from "@/components/NWBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { QASection } from "@/components/QASection";
import { aboutContent, experiences } from "@/content/portfolio";

export default function Home() {
  const [streamedAbout, setStreamedAbout] = useState("");
  const [visibleExperienceCount, setVisibleExperienceCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const contentEndRef = useRef<HTMLDivElement>(null);
  const hasStreamedRef = useRef(false);

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (isStreaming && contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [streamedAbout, visibleExperienceCount, isStreaming]);

  useEffect(() => {
    if (hasStreamedRef.current) return;
    hasStreamedRef.current = true;

    let aboutIndex = 0;
    let experienceIndex = 0;
    const charsPerInterval = 5;
    const intervalMs = 20;

    // Stream the About section character by character
    const streamAbout = () => {
      if (aboutIndex < aboutContent.length) {
        const newContent = aboutContent.slice(0, aboutIndex + charsPerInterval);
        setStreamedAbout(newContent);
        aboutIndex += charsPerInterval;
        setTimeout(streamAbout, intervalMs);
      } else {
        // About section complete, start showing experiences
        setStreamedAbout(aboutContent);
        setTimeout(streamExperiences, 300);
      }
    };

    // Reveal experience items one at a time
    const streamExperiences = () => {
      if (experienceIndex < experiences.length) {
        experienceIndex++;
        setVisibleExperienceCount(experienceIndex);
        setTimeout(streamExperiences, 400);
      } else {
        // All content complete
        setIsStreaming(false);
      }
    };

    // Start the streaming after a brief delay
    setTimeout(streamAbout, 500);
  }, []);

  const visibleExperiences = experiences.slice(0, visibleExperienceCount);

  return (
    <>
      <div className="min-h-screen bg-background relative">
        <NWBadge />
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12 pb-12">
          <HeroSection />
          
          <div className="w-full mb-12" data-testid="container-portfolio-content">
            <div className="space-y-12">
              {streamedAbout && <AboutSection content={streamedAbout} />}
              {visibleExperienceCount > 0 && (
                <ExperienceSection 
                  experiences={visibleExperiences} 
                  showTitle={true}
                />
              )}
            </div>
            <div ref={contentEndRef} />
            {isStreaming && (
              <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <div className="w-1 h-4 bg-primary animate-pulse" />
              </div>
            )}
          </div>

          {!isStreaming && <QASection />}
        </div>
      </div>
    </>
  );
}
