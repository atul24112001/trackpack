import React, { useEffect, useState } from "react";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useRouter } from "next/navigation";

import startCase from "lodash/startCase";
import Button from "@/components/ui/Button";
import { decryptMessage, encryptMessage } from "@/lib/bcrypt";
import Each from "@/components/helper/Each";
import { _createWallet } from "@/lib/wallet";

export default function CopyPhrases({ selectedNetwork, newWallet }: Props) {
  const [mnemonic, setMnemonic] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!mnemonic) {
      if (newWallet) {
        const generatedMnemonics = generateMnemonic();
        setMnemonic(generatedMnemonics.split(" "));
      } else {
        setMnemonic(Array(15).fill(""));
      }
    }
  }, []);

  const mnemonicChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMnemonic((prev) => {
      if (prev) {
        prev[parseInt(e.target.name, 10)] = e.target.value;
      }
      return [...(prev || [])];
    });
  };

  const createWallet = () => {
    if (!mnemonic || !selectedNetwork) {
      return;
    }
    if (mnemonic.filter((w) => w.trim() !== "").join(" ").length < 12) {
      return;
    }
    const seed = mnemonicToSeedSync(mnemonic.join(" "));
    const accountId = crypto.randomUUID();
    _createWallet(
      seed.toString("hex"),
      selectedNetwork,
      accountId,
      "Account " + accountId
    );
    router.replace("/");
  };

  const copyToClipboard = async () => {
    if (!mnemonic) {
      return;
    }
    try {
      await navigator.clipboard.writeText(mnemonic.join(" "));
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="rounded-md px-6 py-4">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-3 ">
        Secret Recovery Phrase Warning
      </h1>
      <p className="text-center text-foreground-secondary  mb-10 font-semibold">
        On the next page, you will receive your secret recovery phrase.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3  gap-3 mb-5 relative">
        {mnemonic && (
          <Each
            of={mnemonic}
            render={(item, index) => {
              return (
                <div className="bg-[#ffffff20] text-center  rounded-md px-3 py-1 font-bold">
                  {index + 1}.&nbsp;
                  {!newWallet ? (
                    <input
                      onChange={mnemonicChangeHandler}
                      name={index.toString()}
                      className="border-0 bg-transparent focus:outline-0"
                    />
                  ) : (
                    startCase(item)
                  )}
                </div>
              );
            }}
          />
        )}
      </div>
      {newWallet && (
        <Button
          className={`text-md bg-background-secondary mb-2 ${
            copied ? "text-green-500" : ""
          }`}
          fullWidth
          variant={copied ? "text" : "contained"}
          onClick={copyToClipboard}
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      )}
      {(copied || !newWallet) && (
        <Button className={`text-md `} fullWidth onClick={createWallet}>
          Create wallet
        </Button>
      )}
    </div>
  );
}

type Props = {
  selectedNetwork: string | null;
  newWallet: boolean;
};
