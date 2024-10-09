"use client";

import Each from "@/components/helper/Each";
import { _networks } from "@/lib/wallet";
import { accountState, activeBlockchainState } from "@/store/atom/accounts";
import React, { useLayoutEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import Wallet from "./Wallet";
import { useRouter } from "next/navigation";

export default function Account({ activeAccountId }: Props) {
  const accounts = useRecoilValue(accountState);
  const activeBlockchain = useRecoilValue(activeBlockchainState);
  const router = useRouter();

  const activeAccount = useMemo(() => {
    return accounts?.[activeAccountId || ""] || null;
  }, [accounts, activeAccountId]);

  useLayoutEffect(() => {
    if (!activeAccount || !activeBlockchain) {
      router.push("/");
    }
  }, [activeAccount, activeBlockchain]);

  const walletLength =
    activeAccount?.wallets[activeBlockchain || ""]?.length || 0;

  if (!activeAccount || !activeBlockchain) {
    return null;
  }

  return (
    <div className="w-[90%] mt-5 mx-auto">
      {walletLength === 0 && <p className="text-center opacity-75">No data</p>}

      {walletLength !== 0 && (
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
    </div>
  );
}

type Props = {
  activeAccountId: string;
};
