import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWallet = () => {
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
                    className="pixel-header text-base font-black tracking-widest uppercase text-white border-2 px-3 py-2 text-center transition-colors duration-200 bg-transparent hover:bg-white hover:text-black"
                    style={{
                      borderColor: "#FFFFFF",
                      fontFamily: "'Press Start 2P', monospace",
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
                    className="pixel-header text-base font-black tracking-widest uppercase text-white border-2 px-3 py-2 text-center transition-colors duration-200 bg-transparent hover:bg-white hover:text-black"
                    style={{
                      borderColor: "#FFFFFF",
                      fontFamily: "'Press Start 2P', monospace",
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
                  className="pixel-header text-base font-black tracking-widest uppercase text-white border-2 px-3 py-2 text-center transition-colors duration-200 bg-transparent hover:bg-white hover:text-black"
                  style={{
                    borderColor: "#FFFFFF",
                    fontFamily: "'Press Start 2P', monospace",
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
