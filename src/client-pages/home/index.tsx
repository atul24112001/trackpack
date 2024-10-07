"use client";

import LinkButton from "@/components/ui/LinkButton";
import { decryptMessage } from "@/lib/bcrypt";
import { accountState, activeAccountState } from "@/store/atom/accounts";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import Account from "./Account";

export default function ClientHomePage() {
  const [accountsMap, setAccountsMap] = useRecoilState(accountState);
  const [activeAccount, setActiveAccount] = useRecoilState(activeAccountState);

  useEffect(() => {
    if (!accountsMap) {
      const stateString = localStorage.getItem("state");
      if (stateString) {
        const state = JSON.parse(stateString);
        const _accountMap = JSON.parse(decryptMessage(state));
        setAccountsMap(_accountMap);
        if (Object.keys(_accountMap).length > 0) {
          setActiveAccount(Object.keys(_accountMap)[0]);
        }
      }
    }
  }, []);

  return activeAccount ? (
    <Account />
  ) : (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-3 ">
        Welcome to Trackpack
      </h1>
      <p className="text-center text-foreground-secondary  mb-10 font-semibold">
        Let's get started.
      </p>
      <div className="flex flex-col gap-3 ">
        <LinkButton variant="contained" href="/create-wallet">
          Create Wallet
        </LinkButton>
        <LinkButton
          className="bg-background-secondary"
          variant="text"
          href="/import-wallet"
        >
          Import Wallet
        </LinkButton>
      </div>
    </div>
  );
}
