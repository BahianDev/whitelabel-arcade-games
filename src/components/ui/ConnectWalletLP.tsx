import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWalletLP = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="enter-button text-3xl md:text-4xl lg:text-5xl font-black tracking-widest pixel-header animate-pulse transition-all duration-300 transform hover:scale-105 bg-transparent border-none cursor-pointer"
                    style={{
                      color: "#FFFFFF",
                      textShadow: `
                  0 0 10px #FFFFFF,
                  0 0 20px #FFFFFF
                `,
                    }}
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="enter-button text-3xl md:text-4xl lg:text-5xl font-black tracking-widest pixel-header animate-pulse transition-all duration-300 transform hover:scale-105 bg-transparent border-none cursor-pointer"
                    style={{
                      color: "#FFFFFF",
                      textShadow: `
                  0 0 10px #FFFFFF,
                  0 0 20px #FFFFFF
                `,
                    }}
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong Network
                  </button>
                );
              }
              return (
                <button
                  className="enter-button text-3xl md:text-4xl lg:text-5xl font-black tracking-widest pixel-header animate-pulse transition-all duration-300 transform hover:scale-105 bg-transparent border-none cursor-pointer"
                  style={{
                    color: "#FFFFFF",
                    textShadow: `
                  0 0 10px #FFFFFF,
                  0 0 20px #FFFFFF
                `,
                  }}
                  onClick={openAccountModal}
                  type="button"
                >
                  {account.displayName}
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
