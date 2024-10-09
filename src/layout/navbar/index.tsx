"use client";

import Each from "@/components/helper/Each";
import {
  accountState,
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import { Check, ChevronDown, Copy, CopyCheck } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { _networks } from "@/lib/wallet";
import { decryptMessage } from "@/lib/bcrypt";
import { useParams, useRouter } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";
// import { MenubarTrigger } from "@radix-ui/react-menubar";
import NavbarLeading from "./Leading";
import NavbarEnding from "./Ending";

export default function Navbar() {
  const [copied, setCopied] = useState(false);
  const [accounts, setAccounts] = useRecoilState(accountState);
  const [activeBlockchain, setActiveBlockchain] = useRecoilState(
    activeBlockchainState
  );
  const [activeWallet, setActiveWallet] = useRecoilState(activeWalletState);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!accounts) {
      const stateString = localStorage.getItem("state");
      if (stateString) {
        const state = JSON.parse(stateString);
        const _accountMap = JSON.parse(decryptMessage(state));
        const targetNetwork = localStorage.getItem("network");
        setAccounts(_accountMap);
        setActiveBlockchain(targetNetwork || "501");
        // setActiveWallet(localStorage.getItem("active-wallet"));
      }
    }
  }, []);

  useEffect(() => {
    if (accounts && activeBlockchain) {
      if ((Object.keys(accounts)?.length || 0) > 0) {
        const newActiveAccount =
          params.accountId ||
          localStorage.getItem("activeAccount") ||
          Object.keys(accounts)[0];

        if (typeof newActiveAccount == "string") {
          router.push(`/${newActiveAccount}`);
        }
      }
    }
  }, [accounts, params.accountId]);

  useEffect(() => {
    if (accounts && activeBlockchain) {
      const newActiveWallet =
        accounts[localStorage.getItem("activeAccount") || ""]?.wallets?.[
          activeBlockchain
        ]?.[0]?.publicKey;
      if (newActiveWallet) {
        localStorage.setItem("active-wallet", newActiveWallet);
        setActiveWallet(newActiveWallet);
      }
    }
  }, [activeBlockchain]);

  const activeAccountId = useMemo(() => {
    if (typeof params.accountId === "string") {
      return params.accountId;
    }
    return null;
  }, [params.accountId]);

  const activeAccount = useMemo(() => {
    return accounts?.[activeAccountId || ""] || null;
  }, [accounts, activeAccountId]);

  const changeNetworkHandler = (item: string) => {
    if (!accounts || !activeAccountId) {
      return;
    }
    setActiveBlockchain(item);
    const newActiveWallet =
      accounts[activeAccountId].wallets[item]?.[0].publicKey;
    if (newActiveWallet) {
      setActiveWallet(newActiveWallet);
      localStorage.setItem("active-wallet", newActiveWallet);
    }
    localStorage.setItem("network", item);
  };

  if (!activeAccount) {
    return null;
  }

  return (
    <div className="w-[90%] mt-5 mx-auto flex justify-between items-center">
      <NavbarLeading
        activeAccount={activeAccount}
        activeAccountId={activeAccountId}
      />
      <Menubar className="px-1 py-0 rounded-full">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center rounded-tl-full rounded-bl-full">
            <ChevronDown size={20} />
            {activeBlockchain && _networks[activeBlockchain] && (
              <img
                className="w-5 h-5"
                alt="active_blockchain"
                src={_networks[activeBlockchain].image}
              />
            )}
          </MenubarTrigger>
          <MenubarContent>
            <Each
              of={Object.keys(_networks)}
              render={(item) => {
                const network = _networks[item];
                return (
                  <MenubarItem onClick={() => changeNetworkHandler(item)}>
                    <img className="w-6 h-6" alt={item} src={network.image} />
                    <p
                      style={{
                        textOverflow: "ellipsis",
                        margin: "0 12px",
                        width: "80px",
                        flex: 1,
                      }}
                    >
                      {network.title}
                    </p>
                    {item === activeBlockchain && (
                      <Check size={18} color="royalblue" />
                    )}
                  </MenubarItem>
                );
              }}
            />
          </MenubarContent>
        </MenubarMenu>
        <MenubarSeparator className="w-[2px] bg-background-secondary h-full" />
        <MenubarMenu>
          <MenubarTrigger className="">
            <p className="ml-1 px-1">
              {activeWallet?.substring(0, 4)}...{activeWallet?.substring(40)}
            </p>
          </MenubarTrigger>
          {activeBlockchain && (
            <MenubarContent>
              <Each
                of={activeAccount.wallets[activeBlockchain]}
                render={(item) => {
                  return (
                    <MenubarItem className="gap-2">
                      <p
                        onClick={() => {
                          setActiveWallet(item.publicKey);
                          localStorage.setItem("active-wallet", item.publicKey);
                        }}
                        className="text-ellipsis flex-1 "
                      >
                        {item.publicKey.substring(0, 4)}...{" "}
                        {item.publicKey.substring(40)}
                      </p>
                      {item.publicKey === activeWallet && (
                        <Check size={18} color="royalblue" />
                      )}
                      <Copy
                        onClick={() => {
                          window.navigator.clipboard.writeText(item.publicKey);
                        }}
                        size={14}
                      />
                    </MenubarItem>
                  );
                }}
              />
            </MenubarContent>
          )}
        </MenubarMenu>
        <MenubarSeparator className="w-[2px] bg-background-secondary h-full" />
        <MenubarMenu>
          <MenubarTrigger
            onClick={() => {
              window.navigator.clipboard.writeText(activeWallet || "");
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="rounded-tr-full rounded-br-full"
          >
            {copied ? (
              <CopyCheck size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <NavbarEnding
        activeAccount={activeAccount}
        activeAccountId={activeAccountId}
      />
    </div>
  );
}
