import { Button } from "@/components/ui/button";
import { _createWallet } from "@/lib/wallet";
import { accountState, activeBlockchainState } from "@/store/atom/accounts";
import { Plus } from "lucide-react";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function NavbarEnding({
  activeAccountId,
  activeAccount,
}: Props) {
  const activeBlockchain = useRecoilValue(activeBlockchainState);

  const setAccounts = useSetRecoilState(accountState);

  const createWallet = () => {
    if (!activeAccount || !activeAccountId || !activeBlockchain) {
      console.log("returning");
      return;
    }

    const updatedAccounts = _createWallet(
      activeBlockchain,
      activeAccountId,
      activeAccount.title
    );

    setAccounts(updatedAccounts);
  };

  return (
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
};
