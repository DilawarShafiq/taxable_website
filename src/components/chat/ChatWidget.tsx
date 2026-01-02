"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Stop pulsing after first open
  useEffect(() => {
    if (isOpen) {
      setShowPulse(false);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative group
            h-16 w-16 rounded-full
            bg-gradient-to-br from-primary via-primary to-blue-600
            shadow-lg hover:shadow-2xl hover:shadow-primary/25
            transition-all duration-300 ease-out
            hover:scale-110
            flex items-center justify-center
            ${isOpen ? 'rotate-0' : ''}
          `}
          aria-label={isOpen ? "Close chat" : "Open AI chat assistant"}
        >
          {/* Animated rings */}
          {showPulse && !isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              <span className="absolute inset-[-4px] rounded-full border-2 border-primary/20 animate-pulse" />
            </>
          )}

          {/* Hover glow effect */}
          <span className={`
            absolute inset-0 rounded-full
            bg-gradient-to-br from-white/20 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          `} />

          {isOpen ? (
            <X className="h-7 w-7 text-white transition-transform duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* AI Bot Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-white"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {/* Bot head */}
                <rect x="3" y="8" width="18" height="12" rx="3" fill="currentColor" opacity="0.2" />
                <rect x="3" y="8" width="18" height="12" rx="3" />
                {/* Eyes */}
                <circle cx="8.5" cy="14" r="1.5" fill="currentColor" />
                <circle cx="15.5" cy="14" r="1.5" fill="currentColor" />
                {/* Antenna */}
                <path d="M12 8V5" strokeLinecap="round" />
                <circle cx="12" cy="4" r="1" fill="currentColor" />
                {/* Smile */}
                <path d="M9 17.5C9 17.5 10.5 18.5 12 18.5C13.5 18.5 15 17.5 15 17.5" strokeLinecap="round" />
              </svg>

              {/* Sparkle accent */}
              <Sparkles className={`
                absolute -top-1 -right-1 h-4 w-4 text-yellow-300
                transition-all duration-300
                ${isHovered ? 'scale-125 rotate-12' : 'scale-100'}
              `} />
            </div>
          )}
        </button>

        {/* Label tooltip on hover */}
        <div className={`
          absolute bottom-full right-0 mb-3
          px-3 py-2 rounded-lg
          bg-foreground text-background
          text-sm font-medium whitespace-nowrap
          shadow-lg
          transition-all duration-200
          ${isHovered && !isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}>
          <span className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            AI Tax Assistant
          </span>
          <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-foreground" />
        </div>
      </div>
    </>
  );
}
