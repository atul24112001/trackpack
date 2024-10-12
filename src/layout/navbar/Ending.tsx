import { Button } from "@/components/ui/button";
import { _createWallet } from "@/lib/wallet";
import {
  accountState,
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import { Plus } from "lucide-react";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function NavbarEnding({
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

    const updatedAccounts = _createWallet(
      activeBlockchain,
      activeAccountId,
      activeAccount.title,
      activeAccount.type
    );

    const wallets = updatedAccounts[activeAccountId].wallets[activeBlockchain];
    setActiveWallet(wallets[wallets.length - 1].publicKey);
    setAccounts(updatedAccounts);
  };

  return accountType === "single-chain" ? (
    <div></div>
  ) : (
    <Button
      onClick={createWallet}
      className="gap-1"
      size="sm"
      variant="default"
    >
      <Plus size={16} /> Add Wallet
    </Button>
  );
}

type Props = {
  activeAccount: Account | null;
  activeAccountId: null | string;
  accountType: AccountType;
};
