import { _networks } from "@/lib/wallet";
import {
  accountState,
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export default function useNetwork() {
  const activeBlockchain = useRecoilValue(activeBlockchainState);
  const accounts = useRecoilValue(accountState);
  const activeWalletPublicKey = useRecoilValue(activeWalletState);

  const params = useParams();
  const activeAccountId =
    typeof params.accountId === "string"
      ? params.accountId
      : params.accountId[0];

  const targetNetwork = useMemo(() => {
    if (activeBlockchain) {
      return _networks[activeBlockchain] || "";
    }
    return _networks["501"];
  }, [activeBlockchain]);

  const wallet = useMemo(() => {
    if (
      !accounts ||
      !activeAccountId ||
      !activeWalletPublicKey ||
      !activeBlockchain
    ) {
      return null;
    }
    const activeWallet = accounts[activeAccountId]?.wallets[
      activeBlockchain
    ].find((wallet) => wallet.publicKey === activeWalletPublicKey);
    return activeWallet;
  }, [accounts, activeAccountId, activeWalletPublicKey, activeBlockchain]);

  return {
    getBalance: targetNetwork.getBalance,
    getTokens: targetNetwork.getTokens,
    isValidPublicKey: targetNetwork.isValidPublicKey,
    wallet,
    transfer: targetNetwork.transfer,
    transferToken: targetNetwork.transferToken,
    createNewToken: targetNetwork.createNewToken,
    mintYourToken: targetNetwork.mintYourToken,
    requestAirDrop: targetNetwork.requestAirdrop,
  };
}
