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
  const [visibleExperienceCount, setVisibleExperienceCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const hasStreamedRef = useRef(false);
  const checkScrollPositionRef = useRef<() => void>();

  // Check if user is at bottom of page
  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Show button when NOT at bottom (has more content below)
      // Hide button when AT bottom (within 50px of bottom)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setShowScrollButton(!isAtBottom);
    };

    // Store in ref so streaming effects can call it
    checkScrollPositionRef.current = checkScrollPosition;

    // Check on mount
    checkScrollPosition();

    // Check on scroll
    window.addEventListener('scroll', checkScrollPosition);
    // Check on resize (viewport height change)
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  // ChatGPT-like streaming with natural pacing
  useEffect(() => {
    if (hasStreamedRef.current) return;
    hasStreamedRef.current = true;

    let aboutIndex = 0;
    let experienceIndex = 0;
    let timeoutId: NodeJS.Timeout;

    // Natural character delay with minor randomization (15-30ms)
    const getRandomDelay = () => Math.floor(Math.random() * 15) + 15;

    // Stream the About section character by character
    const streamAbout = () => {
      if (aboutIndex < aboutContent.length) {
        // Stream 3-5 characters at a time for more natural flow
        const charsToAdd = Math.floor(Math.random() * 3) + 3;
        const newContent = aboutContent.slice(0, aboutIndex + charsToAdd);
        setStreamedAbout(newContent);
        aboutIndex += charsToAdd;
        // Check scroll position as content grows
        setTimeout(() => checkScrollPositionRef.current?.(), 0);
        timeoutId = setTimeout(streamAbout, getRandomDelay());
      } else {
        // About section complete, start showing experiences
        setStreamedAbout(aboutContent);
        setTimeout(() => checkScrollPositionRef.current?.(), 0);
        timeoutId = setTimeout(streamExperiences, 300);
      }
    };

    // Reveal experience items one at a time
    const streamExperiences = () => {
      if (experienceIndex < experiences.length) {
        experienceIndex++;
        setVisibleExperienceCount(experienceIndex);
        // Check scroll position as experience items appear
        setTimeout(() => checkScrollPositionRef.current?.(), 0);
        timeoutId = setTimeout(streamExperiences, 400);
      } else {
        // All content complete
        setIsStreaming(false);
        // Final check after streaming completes
        setTimeout(() => checkScrollPositionRef.current?.(), 0);
      }
    };

    // Start the streaming after a brief delay
    timeoutId = setTimeout(streamAbout, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const visibleExperiences = experiences.slice(0, visibleExperienceCount);

  return (
    <>
      <div className="min-h-screen bg-background relative">
        <NWBadge />
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12 pb-96">
          <HeroSection />
          
          {/* Stream container for all content sections */}
          <div 
            id="stream-container" 
            className="w-full mb-12" 
            data-testid="container-stream"
          >
            <div className="space-y-12">
              {streamedAbout && <AboutSection content={streamedAbout} />}
              {visibleExperienceCount > 0 && (
                <ExperienceSection 
                  experiences={visibleExperiences} 
                  showTitle={true}
                />
              )}
            </div>
            
            {/* Keep the fantastic pulsing cursor during streaming */}
            {isStreaming && (
              <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <div className="w-1 h-4 bg-primary animate-pulse" />
              </div>
            )}
          </div>

          {/* Q&A section fades in after streaming completes */}
          {!isStreaming && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <QASection />
            </div>
          )}
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
