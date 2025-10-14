import "@rainbow-me/rainbowkit/styles.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { TokenSniperGame } from "./games/token-sniper/TokenSniperGame";
import { BlockBusterGame } from "./games/block-buster";
import { WordUpGamePage } from "./games/word-up";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { liskSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import RequireWallet from "./auth/RequireWallet";
import Reacteroids from "./games/asteroids/Reacteroids";
import SpaceInvaders from "./games/space-invaders/SpaceInvadersGame";
import Tetris from "./games/tetris/Tetris";
import { LeaderboardPage } from "./pages/LeaderboardPage";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [liskSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="w-full min-h-screen">
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: "",
                  duration: 5000,
                  removeDelay: 1000,
                  style: {
                    background: "#000000",
                    color: "rgb(131, 232, 63)",
                    border: "1px solid rgb(131, 232, 63)",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "green",
                      secondary: "black",
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/asteroids" element={<Reacteroids />} />
                <Route path="/space-invaders" element={<SpaceInvaders />} />
                <Route path="/tetris" element={<Tetris />} />

                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route element={<RequireWallet redirectTo="/" />}>
                  <Route path="/token-sniper" element={<TokenSniperGame />} />
                  <Route path="/block-chain" element={<BlockBusterGame />} />
                  <Route path="/word-up" element={<WordUpGamePage />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
