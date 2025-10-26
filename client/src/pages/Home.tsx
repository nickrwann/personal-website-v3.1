import { useState, useEffect, useRef } from "react";
import { NWBadge } from "@/components/NWBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { QASection } from "@/components/QASection";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { aboutContent, experiences } from "@/content/portfolio";
export default function Home() {
  const [streamedAbout, setStreamedAbout] = useState("");
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(-1);
  const [streamedExperienceText, setStreamedExperienceText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const hasStreamedRef = useRef(false);

  // Use IntersectionObserver to detect if bottom sentinel is visible
  // Show scroll button only when sentinel is NOT visible (content below viewport)
  useEffect(() => {
    const sentinel = document.getElementById('bottom-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Show button when sentinel is NOT visible (content below viewport)
        setShowScrollButton(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  // ChatGPT-like streaming with natural pacing
  useEffect(() => {
    if (hasStreamedRef.current) return;
    hasStreamedRef.current = true;

    let aboutIndex = 0;
    let experienceIndex = 0;
    let experienceTextIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let isActive = true; // Track if effect is still active

    // Human-readable streaming speed: 1 character every 10ms (100 chars/sec)
    const charDelay = 10;

    // Stream the About section character by character
    const streamAbout = () => {
      if (!isActive) return; // Don't update state if effect cleaned up
      
      if (aboutIndex < aboutContent.length) {
        // Stream 1 character at a time for human-readable pacing
        const newContent = aboutContent.slice(0, aboutIndex + 1);
        setStreamedAbout(newContent);
        aboutIndex += 1;
        timeoutId = setTimeout(streamAbout, charDelay);
      } else {
        // About section complete, start showing experiences
        setStreamedAbout(aboutContent);
        timeoutId = setTimeout(startNextExperience, 300);
      }
    };

    // Start streaming the next experience
    const startNextExperience = () => {
      if (!isActive) return; // Don't update state if effect cleaned up
      
      if (experienceIndex < experiences.length) {
        // Show the experience container (title, company, period)
        setCurrentExperienceIndex(experienceIndex);
        setStreamedExperienceText("");
        experienceTextIndex = 0;
        // Brief delay before streaming description
        timeoutId = setTimeout(streamExperienceDescription, 50);
      } else {
        // All experiences complete
        setIsStreaming(false);
      }
    };

    // Stream the current experience's description
    const streamExperienceDescription = () => {
      if (!isActive) return; // Don't update state if effect cleaned up
      
      const currentExp = experiences[experienceIndex];
      
      // Only stream string descriptions, skip JSX descriptions
      if (typeof currentExp.description === 'string') {
        // Stream character-by-character
        if (experienceTextIndex < currentExp.description.length) {
          const newText = currentExp.description.slice(0, experienceTextIndex + 1);
          setStreamedExperienceText(newText);
          experienceTextIndex += 1;
          timeoutId = setTimeout(streamExperienceDescription, charDelay);
          return;
        }
      }
      
      // Description complete (string finished streaming or JSX shown immediately)
      // Don't set to empty string - the mapping logic will use null for completed experiences
      experienceIndex++;
      timeoutId = setTimeout(startNextExperience, 300);
    };

    // Start the streaming after a brief delay
    timeoutId = setTimeout(streamAbout, 500);

    return () => {
      isActive = false; // Mark effect as inactive
      clearTimeout(timeoutId);
      // Reset the ref so streaming can run again if component remounts
      hasStreamedRef.current = false;
    };
  }, []);

  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  // Build visible experiences array with streaming state
  const visibleExperiences = experiences
    .slice(0, currentExperienceIndex + 1)
    .map((exp, index) => ({
      ...exp,
      // Only use streamed text for current experience if it's a string description
      streamedDescription: 
        index === currentExperienceIndex && typeof exp.description === 'string'
          ? streamedExperienceText
          : null,
      isStreaming: 
        index === currentExperienceIndex && 
        isStreaming && 
        typeof exp.description === 'string' &&
        streamedExperienceText.length < (exp.description as string).length,
    }));

  return (
    <>
      <div className="min-h-screen bg-background relative">
        <NWBadge />
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12 pb-6">
          <HeroSection />
          
          {/* Stream container for all content sections */}
          <div 
            id="stream-container" 
            className="w-full mb-12" 
            data-testid="container-stream"
          >
            <div className="space-y-12">
              {streamedAbout && (
                <AboutSection 
                  content={streamedAbout} 
                  isStreaming={isStreaming && streamedAbout.length < aboutContent.length}
                />
              )}
              {currentExperienceIndex >= 0 && (
                <ExperienceSection 
                  experiences={visibleExperiences} 
                  showTitle={true}
                />
              )}
            </div>
          </div>

          {/* Q&A section fades in after streaming completes */}
          {!isStreaming && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <QASection />
            </div>
          )}
          
          {/* Bottom sentinel for scroll-to-bottom button detection */}
          <div id="bottom-sentinel" className="h-1" />
        </div>
        
        {/* ChatGPT-style scroll-to-bottom button */}
        <ScrollToBottomButton 
          show={showScrollButton} 
          onClick={handleScrollToBottom}
        />
      </div>
    </>
  );
}
