import React, { useEffect, useState } from "react";
import { generateMnemonic } from "bip39";
import { useRouter } from "next/navigation";

import startCase from "lodash/startCase";
// import Button from "@/components/local-ui/Button";
import { encryptMessage } from "@/lib/bcrypt";
import Each from "@/components/helper/Each";
import { _createWallet } from "@/lib/wallet";
import { _copyToClipBoard } from "@/lib/utils";
import { useSetRecoilState } from "recoil";
import {
  accountState,
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import { Button } from "@/components/ui/button";
import Loader from "@/components/helper/Loader";

export default function CopyPhrases({ newWallet, accountDetails }: Props) {
  const [mnemonic, setMnemonic] = useState<string[] | null>(null);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [copied, setCopied] = useState(false);

  const setAccounts = useSetRecoilState(accountState);
  const setActiveBlockchain = useSetRecoilState(activeBlockchainState);
  const setActiveWallet = useSetRecoilState(activeWalletState);

  const router = useRouter();

  useEffect(() => {
    if (!mnemonic) {
      if (newWallet) {
        const generatedMnemonics = generateMnemonic();
        setMnemonic(generatedMnemonics.split(" "));
      } else {
        setMnemonic(Array(12).fill(""));
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
    setCreatingAccount(true);
    if (!mnemonic || !accountDetails.network) {
      return;
    }
    if ((mnemonic.filter((w) => w.trim() !== "")?.length || 0) < 12) {
      return;
    }

    localStorage.setItem(
      "mnemonic",
      JSON.stringify(
        encryptMessage(mnemonic.filter((w) => w.trim() !== "").join(" "))
      )
    );
    const [updatedAccounts, wallet] = _createWallet(
      accountDetails.network,
      accountDetails.id,
      accountDetails.name,
      accountDetails.accountType
    );
    setAccounts(updatedAccounts);
    setActiveBlockchain(accountDetails.network);
    setActiveWallet(wallet.publicKey);
    setTimeout(() => {
      setCreatingAccount(false);
      router.push(`/${accountDetails.id}`);
    }, 2000);
  };

  const copyToClipboard = async () => {
    if (!mnemonic) {
      return;
    }
    _copyToClipBoard(mnemonic.join(" "), () => {
      setCopied(true);
    });
  };

  return (
    <div className="rounded-md px-6 py-4">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-3 ">
        Secret Recovery Phrase Warning
      </h1>
      <p className="text-center text-foreground-secondary  mb-10 font-semibold">
        On the next page, you will receive your secret recovery phrase.
      </p>
      {!creatingAccount && (
        <>
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
              className={`w-full text-md bg-background-secondary mb-2 ${
                copied ? "text-green-500" : ""
              }`}
              // fullWidth
              variant={copied ? "secondary" : "default"}
              onClick={copyToClipboard}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
          {(copied || !newWallet) && (
            <Button
              disabled={creatingAccount}
              className={`text-md  w-full`}
              onClick={createWallet}
            >
              Create wallet
            </Button>
          )}
        </>
      )}
      {creatingAccount && (
        <div className="flex justify-center flex-col items-center">
          <Loader className="stroke-white" />
          <p>Creating account</p>
        </div>
      )}
    </div>
  );
}

type Props = {
  newWallet: boolean;
  accountDetails: AccountDetails;
};
