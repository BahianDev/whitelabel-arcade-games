import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  Coins,
  MessageSquare,
  Trophy,
  Wallet,
  Wallet2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ConnectWallet } from "../components/ui/ConnectWallet";

const POINTS_CONVERSION_RATE = 100; // 100 points = 1 arcade token

type SwapDirection = "points-to-tokens" | "tokens-to-points";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(3260);
  const [lifetimePoints] = useState(18420);
  const [weeklyPoints] = useState(420);
  const [arcadeTokens, setArcadeTokens] = useState(32);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState<SwapDirection>(
    "points-to-tokens"
  );

  const calculatedPreview = useMemo(() => {
    const numericAmount = Number(swapAmount);

    if (!numericAmount || numericAmount <= 0) {
      return { label: "--", helper: "Enter an amount to see the result" };
    }

    if (swapDirection === "points-to-tokens") {
      const tokens = numericAmount / POINTS_CONVERSION_RATE;
      return {
        label: `${tokens.toFixed(2)} TOKENS`,
        helper: `Every ${POINTS_CONVERSION_RATE} pts = 1 token`,
      };
    }

    const resultPoints = numericAmount * POINTS_CONVERSION_RATE;
    return {
      label: `${resultPoints.toLocaleString()} POINTS`,
      helper: `1 token = ${POINTS_CONVERSION_RATE} pts`,
    };
  }, [swapAmount, swapDirection]);

  const handleDiscordConnect = () => {
    setDiscordConnected((prev) => {
      const next = !prev;
      toast[next ? "success" : "error"](
        next ? "Discord connected!" : "Discord disconnected."
      );
      return next;
    });
  };

  const handleSwap = (event: React.FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(swapAmount);

    if (!numericAmount || numericAmount <= 0) {
      return toast.error("Enter a valid amount to swap");
    }

    if (swapDirection === "points-to-tokens") {
      if (numericAmount > points) {
        return toast.error("Not enough points for this swap");
      }

      const tokens = numericAmount / POINTS_CONVERSION_RATE;
      setPoints((prev) => prev - numericAmount);
      setArcadeTokens((prev) => prev + tokens);
      toast.success(`Converted ${numericAmount} pts to ${tokens.toFixed(2)} tokens`);
    } else {
      if (numericAmount > arcadeTokens) {
        return toast.error("Not enough tokens for this swap");
      }

      const resultPoints = numericAmount * POINTS_CONVERSION_RATE;
      setArcadeTokens((prev) => prev - numericAmount);
      setPoints((prev) => prev + resultPoints);
      toast.success(`Converted ${numericAmount} tokens to ${resultPoints} pts`);
    }

    setSwapAmount("");
  };

  return (
    <div
      className="min-h-screen bg-black font-mono relative overflow-x-hidden"
      style={{ color: "#FFFFFF" }}
    >
      <Header title="SANSA ARCADE" />

      <div className="relative z-10 container mx-auto px-4 pt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-sm md:text-base font-mono font-bold hover:opacity-80 transition-all duration-200 bg-transparent border-none cursor-pointer"
          style={{
            color: "#FFFFFF",
            fontFamily: "'Press Start 2P', monospace",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ARCADE</span>
        </button>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 space-y-10">
        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="tracking-widest text-xs md:text-sm text-white/80">
                PILOT ID: 0xA1C3-77FF
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mt-3 pixel-header"
                style={{ textShadow: "0 0 10px #FFFFFF" }}
              >
                ▓▓▓ PLAYER PROFILE ▓▓▓
              </h2>
            </div>
            <div className="mt-6 md:mt-0 flex items-center space-x-4">
              <div
                className="border-2 px-4 py-3 rounded-lg text-center"
                style={{ borderColor: "#FFFFFF" }}
              >
                <p className="text-xs tracking-widest text-white/70">RANK</p>
                <p className="text-lg font-bold flex items-center justify-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span>CAPTAIN</span>
                </p>
              </div>
              <div
                className="border-2 px-4 py-3 rounded-lg text-center"
                style={{ borderColor: "#FFFFFF" }}
              >
                <p className="text-xs tracking-widest text-white/70">CLAN</p>
                <p className="text-lg font-bold">STAR RACERS</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div
              className="border-2 rounded-lg p-6 shadow-lg"
              style={{ borderColor: "#FFFFFF" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest text-white/70">
                  TOTAL POINTS
                </p>
                <Wallet className="w-5 h-5 text-green-300" />
              </div>
              <p className="text-3xl font-black tracking-wider">
                {points.toLocaleString()} pts
              </p>
              <p className="text-xs text-white/60 mt-4">
                Earned across all SANSA arcade missions.
              </p>
            </div>
            <div
              className="border-2 rounded-lg p-6 shadow-lg"
              style={{ borderColor: "#FFFFFF" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest text-white/70">
                  LIFETIME SCORE
                </p>
                <Coins className="w-5 h-5 text-green-300" />
              </div>
              <p className="text-3xl font-black tracking-wider">
                {lifetimePoints.toLocaleString()} pts
              </p>
              <p className="text-xs text-white/60 mt-4">
                Supreme score registered since day one.
              </p>
            </div>
            <div
              className="border-2 rounded-lg p-6 shadow-lg"
              style={{ borderColor: "#FFFFFF" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest text-white/70">
                  WEEKLY GAIN
                </p>
                <Wallet2 className="w-5 h-5 text-green-300" />
              </div>
              <p className="text-3xl font-black tracking-wider">
                +{weeklyPoints.toLocaleString()} pts
              </p>
              <p className="text-xs text-white/60 mt-4">
                Finish more missions to climb the leaderboard.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div
            className="border-2 rounded-lg p-6 flex flex-col space-y-6"
            style={{ borderColor: "#FFFFFF" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-wider flex items-center space-x-3">
                <Wallet className="w-6 h-6 text-green-300" />
                <span>Connect your wallet</span>
              </h3>
              <span className="text-xs text-white/60 tracking-widest">
                STATUS: {points > 0 ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <p className="text-sm text-white/70">
              Manage your SANSA rewards wallet and sync balances across all
              arcade experiences. Connect to unlock exclusive drops and
              mission briefings.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ConnectWallet />
              <button
                type="button"
                onClick={() => navigate("/leaderboard")}
                className="px-4 py-2 border-2 rounded text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-200"
                style={{
                  borderColor: "#FFFFFF",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                VIEW LEADERBOARD
              </button>
            </div>
            <div className="text-xs text-white/50">
              Connected networks: Lisk Sepolia Testnet • Sync status: Stable
            </div>
          </div>

          <div
            className="border-2 rounded-lg p-6 flex flex-col space-y-6"
            style={{ borderColor: "#FFFFFF" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-wider flex items-center space-x-3">
                <MessageSquare className="w-6 h-6 text-indigo-300" />
                <span>Discord link</span>
              </h3>
              <span className="text-xs text-white/60 tracking-widest">
                STATUS: {discordConnected ? "CONNECTED" : "OFFLINE"}
              </span>
            </div>
            <p className="text-sm text-white/70">
              Sync your Discord profile to squad up with the community,
              receive mission alerts and share high scores directly from the
              arcade.
            </p>
            <button
              type="button"
              onClick={handleDiscordConnect}
              className="px-6 py-3 border-2 rounded font-bold tracking-widest transition-all duration-200 hover:bg-white hover:text-black"
              style={{
                borderColor: discordConnected ? "#83E83F" : "#FFFFFF",
                color: discordConnected ? "#83E83F" : "#FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              {discordConnected ? "DISCONNECT" : "CONNECT"}
            </button>
            <div className="text-xs text-white/50">
              Linked server: SANSA Command Center • Permissions: Score Sync &
              Mission Briefings
            </div>
          </div>
        </section>

        <section
          className="border-2 rounded-lg p-6"
          style={{ borderColor: "#FFFFFF" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold tracking-wider flex items-center space-x-3">
              <ArrowLeftRight className="w-6 h-6 text-green-300" />
              <span>Swap center</span>
            </h3>
            <div className="flex items-center space-x-4 text-xs tracking-widest text-white/60">
              <span>Points balance: {points.toLocaleString()} pts</span>
              <span>Tokens balance: {arcadeTokens.toFixed(2)} SAN</span>
            </div>
          </div>

          <form
            onSubmit={handleSwap}
            className="grid gap-6 md:grid-cols-[2fr_1fr]"
          >
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col space-y-3">
                  <span className="text-xs tracking-widest text-white/70">
                    SWAP DIRECTION
                  </span>
                  <select
                    value={swapDirection}
                    onChange={(event) =>
                      setSwapDirection(event.target.value as SwapDirection)
                    }
                    className="bg-black border-2 px-4 py-3 text-sm tracking-widest focus:outline-none"
                    style={{
                      borderColor: "#FFFFFF",
                      fontFamily: "'Press Start 2P', monospace",
                    }}
                  >
                    <option value="points-to-tokens">
                      POINTS ➜ TOKENS
                    </option>
                    <option value="tokens-to-points">
                      TOKENS ➜ POINTS
                    </option>
                  </select>
                </label>
                <label className="flex flex-col space-y-3">
                  <span className="text-xs tracking-widest text-white/70">
                    AMOUNT
                  </span>
                  <input
                    value={swapAmount}
                    onChange={(event) => setSwapAmount(event.target.value)}
                    placeholder={
                      swapDirection === "points-to-tokens"
                        ? "Enter points"
                        : "Enter tokens"
                    }
                    className="bg-black border-2 px-4 py-3 text-sm tracking-widest focus:outline-none"
                    style={{
                      borderColor: "#FFFFFF",
                      fontFamily: "'Press Start 2P', monospace",
                    }}
                  />
                </label>
              </div>

              <div
                className="border-2 rounded-lg p-4 flex items-center justify-between"
                style={{ borderColor: "#FFFFFF" }}
              >
                <div>
                  <p className="text-xs tracking-widest text-white/70">OUTPUT</p>
                  <p className="text-lg md:text-xl font-bold">
                    {calculatedPreview.label}
                  </p>
                </div>
                <span className="text-xs tracking-widest text-white/50">
                  {calculatedPreview.helper}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div className="border-2 rounded-lg p-4 text-xs tracking-widest text-white/60 space-y-3"
                style={{ borderColor: "#FFFFFF" }}
              >
                <p>TRANSMISSION LOG:</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Swaps are instant across SANSA missions.</li>
                  <li>
                    Minimum trade size: {POINTS_CONVERSION_RATE} pts or 1 token.
                  </li>
                  <li>Bonus multipliers unlock on weekend events.</li>
                </ul>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-4 border-2 rounded font-bold tracking-widest transition-all duration-200 hover:bg-white hover:text-black"
                style={{
                  borderColor: "#FFFFFF",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                EXECUTE SWAP
              </button>
            </div>
          </form>
        </section>

        <section
          className="border-2 rounded-lg p-6"
          style={{ borderColor: "#FFFFFF" }}
        >
          <h3 className="text-2xl font-bold tracking-wider mb-6">Recent logs</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {["Asteroid Run", "Word Up Marathon", "Block Chain"].map(
              (mission, index) => (
                <div
                  key={mission}
                  className="border-2 rounded-lg p-4"
                  style={{ borderColor: "#FFFFFF" }}
                >
                  <p className="text-xs tracking-widest text-white/60">
                    MISSION {index + 1}
                  </p>
                  <p className="text-lg font-bold mt-2">{mission}</p>
                  <p className="text-xs text-white/50 mt-3">
                    Rewarded +{(index + 1) * 150} pts · Crew bonus active
                  </p>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-white/50 mt-6">
            Need more points? Challenge your squad on the
            <Link
              to="/leaderboard"
              className="underline ml-1 hover:text-green-300 transition-colors duration-200"
            >
              leaderboard
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
