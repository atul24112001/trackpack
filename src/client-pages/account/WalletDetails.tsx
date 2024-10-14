import useNetwork from "@/hooks/use-network";
import React, { useEffect, useState } from "react";
import Each from "@/components/helper/Each";
import { useRecoilValue } from "recoil";
import {
  activeBlockchainState,
  activeWalletState,
} from "@/store/atom/accounts";
import { _networks } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import TokenCard from "./TokenCard";
import { Button } from "@/components/ui/button";

import CreateTokenForm from "./CreateTokenForm";

export default function WalletDetails({}: Props) {
  const [loading, setLoading] = useState(true);
  const [showCreateTokeForm, setShowCreateTokeForm] = useState(false);

  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const blockchain = useRecoilValue(activeBlockchainState);
  const publicKey = useRecoilValue(activeWalletState);

  const { getBalance, getTokens, wallet } = useNetwork();

  useEffect(() => {
    if (!wallet) {
      window.location.reload();
    }
  }, []);

  async function fetchDetails() {
    if (publicKey) {
      setLoading(true);
      // try {
      const balance = await getBalance(publicKey);
      const tokens = await getTokens(publicKey);
      setTokens(tokens);
      setBalance(balance);
      // } catch (error) {
      //   console.log(error);
      // }
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [publicKey]);

  function reset() {
    fetchDetails();
  }

  const toggleCreateTokenForm = () => {
    setShowCreateTokeForm((prev) => !prev);
  };

  const mode = localStorage.getItem("mode");

  return (
    <div>
      <p className="text-center opacity-60 mb-2">
        Select a token to see more option{" "}
        {mode === "mainnet" ? "" : "in testing mode"}
      </p>
      {!loading && (
        <>
          {balance && blockchain && _networks[blockchain] && (
            <TokenCard
              metadata={{ name: "", symbol: "" }}
              owner="main"
              reset={reset}
              token={false}
              address={_networks[blockchain].title}
              balance={balance.amount}
              imageSrc={_networks[blockchain].image}
              decimals={balance.decimal}
              unit={_networks[blockchain].smallestUnit}
            />
          )}
          <div>
            {tokens && (
              <Each
                of={tokens}
                render={(token) => {
                  return <TokenCard reset={reset} token {...token} />;
                }}
              />
            )}
          </div>

          <div className="mt-4">
            <Button
              onClick={toggleCreateTokenForm}
              variant="outline"
              className="w-full"
            >
              Create Token
            </Button>
          </div>
        </>
      )}
      {loading && (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}

      <CreateTokenForm
        reset={reset}
        showCreateTokeForm={showCreateTokeForm}
        toggleCreateTokenForm={toggleCreateTokenForm}
      />
    </div>
  );
}

type Props = {
  publicKey: string;
};
