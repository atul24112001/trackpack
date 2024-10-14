"use client";

import Each from "@/components/helper/Each";
import { _networks } from "@/lib/wallet";
import {
  accountState,
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import React, { useLayoutEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Wallet from "./Wallet";
import { useRouter } from "next/navigation";
import WalletDetails from "./WalletDetails";
import useNetwork from "@/hooks/use-network";

export default function Account({ activeAccountId }: Props) {
  const accounts = useRecoilValue(accountState);
  const activeBlockchain = useRecoilValue(activeBlockchainState);
  const [activeWallet, setActiveWallet] = useRecoilState(activeWalletState);
  const router = useRouter();
  const { wallet } = useNetwork();

  const activeAccount = useMemo(() => {
    return accounts?.[activeAccountId || ""] || null;
  }, [accounts, activeAccountId]);

  useLayoutEffect(() => {
    if (!activeAccount) {
      router.push("/");
    }
  }, [activeAccount, activeBlockchain]);

  useLayoutEffect(() => {
    if (!activeWallet && activeAccount && activeBlockchain) {
      const _activeWallet =
        localStorage.getItem("active-wallet") ||
        activeAccount.wallets?.[activeBlockchain]?.[0]?.publicKey;
      if (_activeWallet) {
        setActiveWallet(_activeWallet);
      }
    }
  }, [activeWallet, activeAccount, activeBlockchain]);

  const walletLength =
    activeAccount?.wallets[activeBlockchain || ""]?.length || 0;

  if (!activeAccount || !activeBlockchain) {
    return null;
  }

  return (
    <div className="w-11/12 md:w-1/2 lg:w-2/5 mt-5 mx-auto">
      {walletLength === 0 && <p className="text-center opacity-75">No data</p>}

      {(!wallet || !activeWallet) && walletLength !== 0 && (
        <Each
          of={activeAccount.wallets[activeBlockchain]}
          render={(wallet) => {
            const network = _networks[activeBlockchain];
            return (
              <Wallet
                item={activeBlockchain}
                network={network}
                publicKey={wallet.publicKey}
                secret={wallet.secret}
              />
            );
          }}
        />
      )}
      {wallet && activeWallet && walletLength > 0 && (
        <WalletDetails publicKey={activeWallet} />
      )}

      {(!activeWallet || !wallet) && (
        <p className="text-center opacity-70 my-2">
          Please select/create a wallet.
        </p>
      )}
    </div>
  );
}

type Props = {
  activeAccountId: string;
};
