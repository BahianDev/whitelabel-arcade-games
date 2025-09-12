import { useState } from "react";
import { useSendTransaction, useBalance } from "wagmi";
import { parseEther } from "viem";
import { useHotWallet } from "../../hooks/useHotWallet";

export const HotWalletModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const hot = useHotWallet();
  const [amount, setAmount] = useState("0.0001");
  const { sendTransaction } = useSendTransaction();
  const { data: balanceData } = useBalance({
    address: hot?.address as `0x${string}`,
  });

  if (!open || !hot) return null;

  const fundHotWallet = () =>
    sendTransaction({
      to: hot.address as `0x${string}`,
      value: parseEther(amount),
    });

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center"
      style={{
        zIndex: 100,
      }}
    >
      <div
        className="relative bg-black p-6 w-96 space-y-8"
        style={{
          color: "#FFFFFF",
          border: "2px solid #FFFFFF",
          boxShadow: "0 0 20px #FFFFFF",
        }}
      >
        <button onClick={onClose} className="absolute text-2xl top-2 right-2">
          ✕
        </button>

        <h2 className="text-xl font-bold">Hot Wallet</h2>
        <p className="break-all">
          <b>Address:</b> {hot.address}
        </p>
        <p className="break-all">
          <b>Private Key:</b> {hot.privateKey}
        </p>
        <p>
          <b>Balance:</b>{" "}
          {balanceData
            ? `${balanceData.formatted} ${balanceData.symbol}`
            : "carregando..."}
        </p>

        <label className="block">
          Amount for gas (ETH):
          <input
            className="border w-full px-2 py-3 bg-black mt-2"
            style={{
              color: "#FFFFFF",
              border: "1px solid #FFFFFF",
            }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <button
          onClick={fundHotWallet}
          className="w-full bg-[#FFFFFF] text-black font-bold text-lg py-2 rounded-md"
        >
          Fund Hot Wallet
        </button>
      </div>
    </div>
  );
};
