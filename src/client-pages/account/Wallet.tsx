import { _copyToClipBoard } from "@/lib/utils";
import { activeWalletState } from "@/store/atom/accounts";
import { Copy, CopyCheck, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

export default function Wallet({ item, network, publicKey, secret }: Props) {
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const setActiveWallet = useSetRecoilState(activeWalletState);

  const toggleSecretVisibility = (e: any) => {
    e.stopPropagation();
    setShowSecret((prev) => !prev);
  };

  const copyPublicKeyHandler = (e: any) => {
    e.stopPropagation();
    _copyToClipBoard(publicKey, () => {
      setCopiedPublicKey(true);
      setTimeout(() => {
        setCopiedPublicKey(false);
      }, 2000);
    });
  };

  const copyPrivateKeyHandler = (e: any) => {
    e.stopPropagation();
    _copyToClipBoard(secret, () => {
      setCopiedSecret(true);
      setTimeout(() => {
        setCopiedSecret(false);
      }, 2000);
    });
  };

  return (
    <div
      onClick={() => {
        setActiveWallet(publicKey);
      }}
      className="cursor-pointer bg-background-secondary px-6 py-4 mb-4 rounded-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <img className="w-9 h-9" alt={item} src={network.image} />
        <h1 className="text-2xl font-bold">{network.title}</h1>
      </div>
      <div className="flex justify-between items-center mb-2 gap-4">
        <input
          disabled
          type="text"
          className="bg-transparent flex-1 focus:outline-0"
          value={publicKey}
        />
        {copiedPublicKey ? (
          <CopyCheck className="text-green-500" size={20} />
        ) : (
          <Copy
            className="cursor-pointer hover:opacity-85"
            onClick={copyPublicKeyHandler}
            size={20}
          />
        )}
      </div>
      <div className="flex justify-between items-center gap-4">
        <input
          disabled
          type={showSecret ? "text" : "password"}
          className="bg-transparent flex-1 focus:outline-0"
          value={secret}
        />
        <div className="flex items-center gap-2">
          {copiedSecret ? (
            <CopyCheck className="text-green-500" size={20} />
          ) : (
            <Copy
              className="cursor-pointer hover:opacity-85"
              onClick={copyPrivateKeyHandler}
              size={20}
            />
          )}
          {showSecret ? (
            <EyeOff
              className="cursor-pointer hover:opacity-85"
              onClick={toggleSecretVisibility}
              size={22}
            />
          ) : (
            <Eye
              className="cursor-pointer hover:opacity-85"
              onClick={toggleSecretVisibility}
              size={22}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type Props = {
  item: string;
  network: {
    title: string;
    image: string;
  };
  publicKey: string;
  secret: string;
};
