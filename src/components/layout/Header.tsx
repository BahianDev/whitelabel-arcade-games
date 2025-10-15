import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hotWalletButtonClasses = [
    "pixel-header text-xs md:text-sm lg:text-base font-black tracking-widest uppercase text-white",
    "border-2 px-3 py-2 md:px-4 md:py-2 rounded",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-colors duration-200 bg-transparent hover:bg-white hover:text-black",
  ].join(" ");

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const closeMenu = () => setIsMenuOpen(false);

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
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full items-center justify-between md:w-auto">
            <div>
              <h1
                className="pixel-header text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-5xl font-black tracking-wider"
                style={{ color: "#FFFFFF" }}
              >
                {title}
              </h1>
            </div>

            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="md:hidden inline-flex items-center justify-center rounded border-2 p-2 text-white transition hover:bg-white hover:text-black"
              style={{ borderColor: "#FFFFFF" }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="pixel-header text-xs md:text-sm lg:text-base font-black tracking-widest uppercase text-white border-2 px-3 py-2 rounded transition-all duration-300 bg-transparent hover:bg-white hover:text-black"
              style={{ borderColor: "#FFFFFF", fontFamily: "'Press Start 2P', monospace" }}
            >
              PROFILE
            </Link>
            {onOpenHotWallet && (
              <button
                type="button"
                onClick={() => {
                  onOpenHotWallet();
                  closeMenu();
                }}
                disabled={!isHotWalletAvailable}
                aria-label="Open hot wallet"
                className={hotWalletButtonClasses}
                style={{ borderColor: "#FFFFFF", fontFamily: "'Press Start 2P', monospace" }}
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

        <div
          className={`md:hidden ${
            isMenuOpen ? "mt-6 flex flex-col gap-3" : "hidden"
          }`}
        >
          <Link
            to="/profile"
            onClick={closeMenu}
            className="pixel-header text-xs font-black tracking-widest uppercase text-white border-2 px-3 py-2 text-center transition-colors duration-200 bg-transparent hover:bg-white hover:text-black"
            style={{ borderColor: "#FFFFFF", color: "#FFFFFF", fontFamily: "'Press Start 2P', monospace" }}
          >
            PROFILE
          </Link>
          {onOpenHotWallet && (
            <button
              type="button"
              onClick={() => {
                onOpenHotWallet();
                closeMenu();
              }}
              disabled={!isHotWalletAvailable}
              aria-label="Open hot wallet"
              className="pixel-header text-xs font-black tracking-widest uppercase text-white border-2 px-3 py-2 text-center transition-colors duration-200 bg-transparent hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#FFFFFF", color: "#FFFFFF", fontFamily: "'Press Start 2P', monospace" }}
            >
              Hot Wallet
            </button>
          )}
          <div
            className="border-2 rounded px-3 py-2 text-white"
            style={{ borderColor: "#FFFFFF", fontFamily: "'Press Start 2P', monospace" }}
          >
            <ConnectWallet />
          </div>
          <div className="flex justify-center">
            <MusicControl
              isMusicPlaying={isMusicPlaying}
              onToggle={(event) => {
                toggleMusic(event);
                closeMenu();
              }}
              position="top-right"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
