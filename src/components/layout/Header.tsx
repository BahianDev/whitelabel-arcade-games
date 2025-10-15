import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectWallet } from "../ui/ConnectWallet";
import { MusicControl } from "../ui/MusicControl";
import { audioManager } from "../../utils/audio";

interface HeaderProps {
  title: string;
  onOpenHotWallet?: () => void;
  isHotWalletAvailable?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenHotWallet,
  isHotWalletAvailable = true,
}) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const hotWalletButtonClasses = [
    "pixel-header text-xs md:text-sm lg:text-base font-black tracking-widest uppercase",
    "border-2 px-3 py-2 md:px-4 md:py-2 rounded",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-colors duration-200 bg-transparent hover:bg-white hover:text-black",
  ].join(" ");

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
            {/* <img src="/logo.png" className="w-10 h-10 mr-10"/> */}
            <div>
              <h1
                className="pixel-header text-3xl md:text-4xl lg:text-6xl xl:text-5xl font-black tracking-wider"
                style={{ color: "#FFFFFF" }}
              >
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <Link
              to="/profile"
              className="top-6 right-28 z-40 flex items-center justify-center px-4 py-2 md:px-5 md:py-3 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              style={{
                background: "transparent",
                border: "2px solid #FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
                color: "#FFFFFF",
              }}
            >
              PROFILE
            </Link>
            {onOpenHotWallet && (
              <button
                type="button"
                onClick={onOpenHotWallet}
                disabled={!isHotWalletAvailable}
                aria-label="Open hot wallet"
                className={`top-6 right-28 z-40 flex items-center justify-center  h-12 w-56 p-4 md:p-6 transition-all duration-300 transform hover:scale-105 aspect-square cursor-pointer opacity-75`}
                style={{
                  background: "transparent",
                  border: "2px solid #FFFFFF",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                Hot Wallet
              </button>
            )}
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
