import useNetwork from "@/hooks/useNetwork";
import React, { useEffect, useState } from "react";
import Each from "@/components/helper/Each";
import { useRecoilValue } from "recoil";
import { activeBlockchainState } from "@/store/atom/accounts";
import { _networks } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import TokenCard from "./TokenCard";

export default function WalletDetails({ publicKey }: Props) {
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const blockchain = useRecoilValue(activeBlockchainState);

  const { getBalance, getTokens } = useNetwork();

  useEffect(() => {
    (async () => {
      if (!balance) {
        try {
          const balance = await getBalance(publicKey);
          const tokens = await getTokens(publicKey);
          setTokens(tokens);
          setBalance(balance);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [publicKey, balance]);

  function reset() {
    setTokens(null);
    setBalance(null);
  }

  return (
    <div>
      <p className="text-center opacity-60 mb-2">
        Select a token to see more option
      </p>
      {balance && blockchain && _networks[blockchain] && (
        <TokenCard
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
        {!tokens && (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Props = {
  publicKey: string;
};
