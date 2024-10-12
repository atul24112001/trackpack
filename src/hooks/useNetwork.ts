import { _networks } from "@/lib/wallet";
import {
  accountState,
  activeAccountState,
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export default function useNetwork() {
  const activeBlockchain = useRecoilValue(activeBlockchainState);
  const accounts = useRecoilValue(accountState);
  const activeAccountId = useRecoilValue(activeAccountState);
  const activeWalletPublicKey = useRecoilValue(activeWalletState);

  const targetNetwork = useMemo(() => {
    if (activeBlockchain) {
      return _networks[activeBlockchain];
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
      return {
        publicKey: "",
        secret: "",
      };
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
  };
}
