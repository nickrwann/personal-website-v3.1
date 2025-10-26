import { useState, useEffect, useRef } from "react";
import { NWBadge } from "@/components/NWBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { QASection } from "@/components/QASection";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { aboutContent, experiences } from "@/content/portfolio";
import type { ChatInputRef } from "@/components/ChatInput";

export default function Home() {
  const [streamedAbout, setStreamedAbout] = useState("");
  const [visibleExperienceCount, setVisibleExperienceCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);
  
  const streamContainerRef = useRef<HTMLDivElement>(null);
  const contentEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  const hasStreamedRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Check if user is at bottom using IntersectionObserver
  useEffect(() => {
    if (!contentEndRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAtBottom = entry.isIntersecting;
        setShowScrollButton(!isAtBottom && isStreaming);
        
        if (isAtBottom) {
          setUserHasScrolledUp(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(contentEndRef.current);

    return () => observer.disconnect();
  }, [isStreaming]);

  // Track user scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (currentScrollTop < lastScrollTopRef.current && isStreaming) {
        // User scrolled up during streaming
        setUserHasScrolledUp(true);
      }
      
      lastScrollTopRef.current = currentScrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isStreaming]);

  // Auto-scroll only if user hasn't scrolled up
  useEffect(() => {
    if (isStreaming && !userHasScrolledUp && contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [streamedAbout, visibleExperienceCount, isStreaming, userHasScrolledUp]);

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
        timeoutId = setTimeout(streamAbout, getRandomDelay());
      } else {
        // About section complete, start showing experiences
        setStreamedAbout(aboutContent);
        timeoutId = setTimeout(streamExperiences, 300);
      }
    };

    // Reveal experience items one at a time
    const streamExperiences = () => {
      if (experienceIndex < experiences.length) {
        experienceIndex++;
        setVisibleExperienceCount(experienceIndex);
        timeoutId = setTimeout(streamExperiences, 400);
      } else {
        // All content complete
        setIsStreaming(false);
        setShowScrollButton(false);
        
        // Auto-focus chat input after streaming completes
        setTimeout(() => {
          chatInputRef.current?.focus();
        }, 500);
      }
    };

    // Start the streaming after a brief delay
    timeoutId = setTimeout(streamAbout, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleScrollToBottom = () => {
    contentEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setUserHasScrolledUp(false);
  };

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
          
          {/* Stream container for all content sections */}
          <div 
            id="stream-container" 
            ref={streamContainerRef}
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
            <div ref={contentEndRef} />
            
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
              <QASection ref={chatInputRef} />
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
