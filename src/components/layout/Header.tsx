import React, { useState } from "react";
import { ConnectWallet } from "../ui/ConnectWallet";
import { MusicControl } from "../ui/MusicControl";
import { audioManager } from "../../utils/audio";


interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const toggleMusic = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other actions

    try {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        await audioManager.startHomepageMusic();
      }

      // CRITICAL FIX: Use specific homepage music toggle
      const isPlaying = audioManager.toggleHomepageMusic();
      setIsMusicPlaying(isPlaying);
      console.log("Homepage music toggled:", isPlaying ? "playing" : "muted");
    } catch (error) {
      console.warn("Failed to toggle homepage music:", error);
    }
  };

  return (
    <header
      className="relative z-10 border-b-2"
      style={{ borderColor: "#FFFFFF", background: "transparent" }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Left side */}
          <div className="flex items-center">
              <img src="/logo.png" className="w-10 h-10 mr-10"/>
            <div>
              <h1
                className="pixel-header text-3xl md:text-4xl lg:text-6xl xl:text-5xl font-black tracking-wider"
                style={{ color: "#FFFFFF" }}
              >
                {title}
              </h1>
            </div>
          </div>
          <div className="flex space-x-5">
            <ConnectWallet />
            <MusicControl
              isMusicPlaying={isMusicPlaying}
              onToggle={toggleMusic}
              position="top-right"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
