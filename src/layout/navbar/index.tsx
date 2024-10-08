"use client";

import Each from "@/components/helper/Each";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LocalAvatar from "@/components/helper/Avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/helper";
import { accountState } from "@/store/atom/accounts";
import { Check, Plus } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";

import { _createWallet, _networks } from "@/lib/wallet";
import { decryptMessage } from "@/lib/bcrypt";
import { useParams, useRouter } from "next/navigation";

export default function Navbar() {
  const [accounts, setAccounts] = useRecoilState(accountState);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!accounts) {
      const stateString = localStorage.getItem("state");
      if (stateString) {
        const state = JSON.parse(stateString);
        const _accountMap = JSON.parse(decryptMessage(state));
        setAccounts(_accountMap);
        if (Object.keys(_accountMap).length > 0) {
          router.push(`/${params.accountId || Object.keys(_accountMap)[0]}`);
        }
      }
    }
  }, [params.accountId]);

  const activeAccountId = useMemo(() => {
    if (typeof params.accountId === "string") {
      return params.accountId;
    }
    return null;
  }, [params.accountId]);

  const activeAccount = useMemo(() => {
    return accounts?.[activeAccountId || ""] || null;
  }, [accounts, activeAccountId]);

  const createWallet = (selectedNetwork: string) => {
    if (!activeAccount || !activeAccountId) {
      return;
    }

    if (activeAccount.wallets[selectedNetwork]) {
      return;
    }

    const encryptedSeed = JSON.parse(localStorage.getItem("seed") || "");
    if (encryptedSeed) {
      const seed = decryptMessage(encryptedSeed);
      const updatedAccounts = _createWallet(
        seed,
        selectedNetwork,
        activeAccountId,
        activeAccount.title
      );
      setAccounts(updatedAccounts);
    }
  };

  if (!activeAccount) {
    return null;
  }

  return (
    <div className="w-[90%] mt-5 mx-auto flex justify-between items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarFallback>
              {getInitials(activeAccount.title, 2)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuGroup>
            <Each
              of={Object.keys(accounts || {})}
              render={(item) => {
                return (
                  <DropdownMenuItem
                    onClick={() => {
                      router.push(`/${item}`);
                    }}
                  >
                    <LocalAvatar
                      title={getInitials(accounts?.[item].title || "", 2)}
                    />
                    <p
                      style={{
                        textOverflow: "ellipsis",
                        margin: "0 12px",
                        flex: 1,
                      }}
                    >
                      {accounts?.[item].title.substring(0, 14)}...
                    </p>
                    {activeAccountId === item && (
                      <Check size={18} color="royalblue" />
                    )}
                  </DropdownMenuItem>
                );
              }}
            />
            <DropdownMenuItem
              onClick={() => {
                router.push("/");
              }}
              style={{
                flex: 1,
                gap: 3,
                justifyContent: "start",
                padding: "8px 8px",
              }}
            >
              <Plus width={18} /> Add Account
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => {}} style={{ flex: 1, gap: 3 }}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("security-deadline");
                window.location.href = "/";
                window.location.reload();
              }}
              style={{ flex: 1, gap: 3 }}
            >
              Lock
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <div>Center</div> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-1" size="sm" variant="default">
            <Plus size={16} /> Add Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Each
            of={Object.keys(_networks)}
            render={(item) => {
              const network = _networks[item];
              return (
                <DropdownMenuItem
                  onClick={() => {
                    createWallet(item);
                  }}
                >
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
                  {(activeAccount.wallets[item]?.length || 0) > 0 && (
                    <Check size={18} color="royalblue" />
                  )}
                </DropdownMenuItem>
              );
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
