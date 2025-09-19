import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  Award,
  Users,
  Calendar,
  TrendingDown,
  ArrowLeft,
} from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { leaderboardManager } from "../utils/leaderboard";
import { LeaderboardEntry } from "../types/leaderboard";
import { useReadContract, useWatchContractEvent } from "wagmi";

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [scanlineOffset, setScanlineOffset] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);

  const CONTRACT_ADDRESS =
    "0x7B1880D35FbBDadA4c6c2a7255C253852787006A" as `0x${string}`;

  const CONTRACT_ABI = [
    {
      inputs: [],
      name: "getLeaderboard",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
    refetch: refetchLeaderboard,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getLeaderboard",
  });

  // Atualiza a lista quando o evento on-chain ocorrer
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "LeaderboardChanged",
    onLogs: () => {
      // Recarrega a listagem quando algum score mudar
      refetchLeaderboard();
    },
  });

  useEffect(() => {
    if (!leaderboardData) return;

    // O contrato retorna [address[], uint256[]]
    const [addresses, scores] = leaderboardData as readonly [
      readonly `0x${string}`[],
      readonly bigint[]
    ];

    const entries: any[] = addresses.map((addr, i) => {
      const raw = scores[i] ?? 0n;

      // Atenção: para pontuações muito grandes, Number() pode estourar.
      // Se você espera valores enormes, troque 'points' para string e ajuste o render.
      const pointsNum = Number(raw);

      return {
        rank: i + 1,
        player: {
          id: addr,
          name: formatWalletAddress(addr), // usa seu helper pra exibir como "0x1234...ABCD"
          walletAddress: addr,
          points: pointsNum,
          dailyLogins: 0, // não vem do contrato; placeholder
        },
        daysInactive: 0, // não vem do contrato; placeholder
      };
    });

    console.log(entries);

    setLeaderboard(entries);
  }, [leaderboardData]);

  // Animate CRT scanlines
  useEffect(() => {
    const interval = setInterval(() => {
      setScanlineOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-green-400 font-bold">
            {rank}
          </span>
        );
    }
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getInactivityWarning = (daysInactive: number) => {
    if (daysInactive === 0) return null;
    if (daysInactive === 1) return "⚠️ 1 day inactive";
    return `⚠️ ${daysInactive} days inactive`;
  };

  return (
    <div
      className="min-h-screen bg-black font-mono relative overflow-x-hidden"
      style={{ color: "#FFFFFF" }}
    >
      {/* Green overlay */}
      <div className="fixed inset-0 bg-black opacity-20 z-5"></div>

      {/* CRT Scanlines Effect */}
      {/* Matrix-style background pattern */}


      {/* Header */}
      <Header title="MORPH MANIA" />

      {/* Back Button */}
      <div className="relative z-10 container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-lg font-mono font-bold hover:opacity-80 transition-all duration-200 bg-transparent border-none cursor-pointer"
          style={{
            color: "#FFFFFF",
            fontFamily: "'Press Start 2P', monospace",
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>BACK TO ARCADE</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 tracking-wider pixel-header"
            style={{
              color: "#FFFFFF",
              textShadow: "0 0 10px #FFFFFF",
            }}
          >
            🏆 LEADERBOARD 🏆
          </h2>
          <div
            className="w-full h-1 mb-6"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 0 10px #FFFFFF",
            }}
          ></div>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-5 h-5" style={{ color: "#FFFFFF" }} />
                <span
                  className="text-sm font-mono"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  TOTAL PLAYERS
                </span>
              </div>
              <div
                className="text-2xl font-bold"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                {leaderboardManager.getTotalPlayers()}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="w-5 h-5" style={{ color: "#FFFFFF" }} />
                <span
                  className="text-sm font-mono"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  ACTIVE PLAYERS
                </span>
              </div>
              <div
                className="text-2xl font-bold"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "'Press Start 2P', monospace",
                }}
              >
                {leaderboardManager.getActivePlayers()}
              </div>
            </div>
          </div>
        </div>

        {/* Join Form */}
        {showJoinForm && (
          <div
            className="mb-8 max-w-md mx-auto p-6 border-2 bg-black"
            style={{ borderColor: "#FFFFFF" }}
          >
            <h3
              className="text-xl font-bold mb-4 text-center"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              JOIN THE COMPETITION
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-mono mb-2"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  PLAYER NAME
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 bg-black border-2 focus:outline-none font-mono"
                  style={{
                    borderColor: "#FFFFFF",
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-mono mb-2"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  WALLET ADDRESS
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-black border-2 focus:outline-none font-mono"
                  style={{
                    borderColor: "#FFFFFF",
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                  placeholder="0x..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowJoinForm(false)}
                  className="flex-1 px-4 py-2 border-2 font-mono font-bold hover:opacity-90 transition-all duration-200 bg-transparent cursor-pointer"
                  style={{
                    borderColor: "#FFFFFF",
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div
          className="relative p-6 bg-black max-w-6xl mx-auto"
          style={{
            border: "2px solid #FFFFFF",
          }}
        >

          {/* Hover Glow Effect */}
          <div
            className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none"
            style={{
              borderColor: "#FFFFFF",
            }}
          ></div>

          {/* Table Header */}
          <div
            className="grid grid-cols-5 gap-4 mb-4 pb-4 border-b-2"
            style={{ borderColor: "#FFFFFF" }}
          >
            <div
              className="text-center font-bold"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              RANK
            </div>
            <div
              className="text-left font-bold"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              PLAYER
            </div>
            <div
              className="text-left font-bold"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              WALLET
            </div>
            <div
              className="text-center font-bold"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              POINTS
            </div>
            <div
              className="text-center font-bold"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              LOGINS
            </div>
          </div>

          {/* Table Body */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLeaderboardLoading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⏳</div>
                <p
                  className="font-mono"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  LOADING LEADERBOARD...
                </p>
              </div>
            ) : isLeaderboardError ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚠️</div>
                <p
                  className="font-mono"
                  style={{
                    color: "#ff6b6b",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  FAILED TO LOAD LEADERBOARD
                </p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏆</div>
                <p
                  className="font-mono"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
                  }}
                >
                  NO PLAYERS YET
                  <br />
                  BE THE FIRST TO JOIN!
                </p>
              </div>
            ) : (
              leaderboard.map((entry) => (
                <div
                  key={entry.player.id}
                  className="grid grid-cols-5 gap-4 py-3 px-2 border border-white hover:border-white transition-colors duration-200"
                >
                  <div className="flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className="font-bold"
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "'Press Start 2P', monospace",
                      }}
                    >
                      {entry.player.name}
                    </span>
                    {entry.daysInactive > 0 && (
                      <span className="text-xs text-red-400 flex items-center space-x-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>{getInactivityWarning(entry.daysInactive)}</span>
                      </span>
                    )}
                  </div>

                  <div
                    className="font-mono text-sm"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Press Start 2P', monospace",
                    }}
                  >
                    {formatWalletAddress(entry.player.walletAddress)}
                  </div>

                  <div
                    className="text-center font-bold"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Press Start 2P', monospace",
                    }}
                  >
                    {entry.player.points.toLocaleString()}
                  </div>

                  <div
                    className="text-center font-bold"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Press Start 2P', monospace",
                    }}
                  >
                    {entry.player.dailyLogins}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Decay Warning */}
          <div className="mt-6 p-4 border-2 border-yellow-600 bg-yellow-900 bg-opacity-20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5 text-yellow-400" />
              <span
                className="font-bold text-yellow-400"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                DEFLATIONARY SYSTEM
              </span>
            </div>
            <p
              className="text-sm text-yellow-300"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              • Daily login awards 10 points
              <br />
              • Missing a day = -2.5% points decay
              <br />• Stay active to maintain your rank!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
    </div>
  );
};
