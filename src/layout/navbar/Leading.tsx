import LocalAvatar from "@/components/helper/Avatar";
import Each from "@/components/helper/Each";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/helper";
import {
  accountState,
  activeAccountState,
  activeWalletState,
} from "@/store/atom/accounts";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function NavbarLeading({
  activeAccount,
  activeAccountId,
}: Props) {
  const accounts = useRecoilValue(accountState);
  const setActiveWallet = useSetRecoilState(activeWalletState);
  const setActiveAccountId = useSetRecoilState(activeAccountState);
  const router = useRouter();

  const changeAccountHandler = (id: string) => {
    if (!accounts) {
      return;
    }
    setActiveAccountId(id);
    const activeWallet =
      accounts[id].wallets[localStorage.getItem("network") || ""]?.[0]
        ?.publicKey;
    if (activeWallet) {
      setActiveWallet(activeWallet);
    }
    router.push(`/${id}`);
  };

  if (!activeAccount) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="bg-[#e57ab030] text-[#e57ab0] flex justify-center items-center">
          <AvatarFallback>{getInitials(activeAccount.title, 2)}</AvatarFallback>
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
                    changeAccountHandler(item);
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
            <Plus width={18} /> Create Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push("/settings");
            }}
            style={{ flex: 1, gap: 3 }}
          >
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Props = {
  activeAccount: Account | null;
  activeAccountId: null | string;
};
