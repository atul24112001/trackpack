import { MenubarItem } from "@/components/ui/menubar";
import { _createWallet } from "@/lib/wallet";
import {
  accountState,
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import { Plus } from "lucide-react";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function AddNewWallet({
  activeAccountId,
  activeAccount,
  accountType,
}: Props) {
  const activeBlockchain = useRecoilValue(activeBlockchainState);

  const setActiveWallet = useSetRecoilState(activeWalletState);
  const setAccounts = useSetRecoilState(accountState);

  const createWallet = () => {
    if (!activeAccount || !activeAccountId || !activeBlockchain) {
      return;
    }

    const [updatedAccounts, wallet] = _createWallet(
      activeBlockchain,
      activeAccountId,
      activeAccount.title,
      activeAccount.type
    );

    setActiveWallet(wallet.publicKey);
    setAccounts(updatedAccounts);
  };

  return accountType === "single-chain" ? (
    <div></div>
  ) : (
    <MenubarItem onClick={createWallet} className="gap-2">
      <p className="flex-1">Add New Wallet</p> <Plus size={16} />
    </MenubarItem>
  );
}

type Props = {
  activeAccount: Account | null;
  activeAccountId: null | string;
  accountType: AccountType;
};
