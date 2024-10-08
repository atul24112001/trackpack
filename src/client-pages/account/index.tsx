"use client";

import Each from "@/components/helper/Each";
import { _networks } from "@/lib/wallet";
import { accountState } from "@/store/atom/accounts";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import bs58 from "bs58";
import Wallet from "./Wallet";
import { useRouter } from "next/navigation";

export default function Account({ activeAccountId }: Props) {
  const accounts = useRecoilValue(accountState);
  const router = useRouter();

  const activeAccount = useMemo(() => {
    return accounts?.[activeAccountId || ""] || null;
  }, [accounts, activeAccountId]);

  if (!activeAccount) {
    router.push("/");
    return;
  }

  return (
    <div className="w-[90%] mt-5 mx-auto">
      <Each
        of={Object.keys(activeAccount.wallets)}
        render={(item) => {
          const wallet = activeAccount.wallets[item];
          const network = _networks[item];
          const secret = bs58.encode(
            new Uint8Array(Object.values(wallet[0].secret))
          );
          return (
            <Wallet
              item={item}
              network={network}
              publicKey={wallet[0].publicKey}
              secret={secret}
            />
          );
        }}
      />
    </div>
  );
}

type Props = {
  activeAccountId: string;
};
