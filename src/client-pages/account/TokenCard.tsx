import LocalAvatar from "@/components/helper/Avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getInitials } from "@/lib/helper";
import { ArrowDown, ArrowUp, Pickaxe, PlaneLanding } from "lucide-react";
import React, { useState } from "react";
import useNetwork from "@/hooks/use-network";
import SendTokenForm from "./SendTokenForm";
import MintTokenForm from "./MintTokenForm";
import AirdropTokenForm from "./AirdropTokenForm";
// import { getTransactions } from "@/lib/generator/solana";
// import Each from "@/components/helper/Each";
// import Transaction from "./Transaction";

export default function TokenCard({
  address,
  balance,
  decimals,
  onClick,
  imageSrc,
  token,
  reset,
  owner,
  metadata,
}: Props) {
  const [openSheet, setOpenSheet] = useState(false);
  // const [transactions, setTransactions] = useState<any>(null);
  const [action, setAction] = useState<
    "send" | "receive" | "airdrop" | "mint" | null
  >(null);
  const { wallet } = useNetwork();

  const toggleSheet = () => setOpenSheet((prev) => !prev);

  // useEffect(() => {
  //   if (!action && openSheet && wallet?.publicKey) {
  //     (async () => {
  //       const response = await getTransactions(wallet.publicKey);
  //       setTransactions(response);
  //     })();
  //   }
  // }, [openSheet]);

  console.log({ metadata });

  return (
    <Sheet open={openSheet} onOpenChange={toggleSheet}>
      <SheetTrigger asChild>
        <div
          onClick={onClick}
          className="flex cursor-pointer gap-3 bg-background-secondary mt-2 px-4 py-3 rounded-lg"
        >
          <div>
            {imageSrc || metadata.image ? (
              <Avatar>
                <AvatarImage src={metadata.image || imageSrc} alt={address} />
              </Avatar>
            ) : (
              <LocalAvatar
                title={getInitials(address, 2, "")}
                className="text-xl"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-md ">{metadata.name}</h3>
            <p className="opacity-50 text-sm">
              {balance / 10 ** decimals} {metadata.symbol}
            </p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle></SheetTitle>
        <div className="flex flex-col gap-2 justify-center items-center">
          {imageSrc || metadata.image ? (
            <Avatar>
              <AvatarImage src={metadata.image || imageSrc} alt={address} />
            </Avatar>
          ) : (
            <LocalAvatar
              title={getInitials(address, 2, "")}
              className="text-xl"
              style={{
                width: "50px",
                height: "50px",
              }}
            />
          )}
          <div>
            <h3 className="text-md text-center">{metadata.name}</h3>
            <p className="opacity-50 text-center text-sm">
              {balance / 10 ** decimals} {metadata.symbol.slice(0, 10)}
            </p>
            <div className="flex my-2 justify-center gap-2">
              <Button
                type="button"
                onClick={() => setAction("send")}
                variant="secondary"
                size="icon"
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                onClick={() => setAction("receive")}
                variant="secondary"
                size="icon"
              >
                <ArrowDown />
              </Button>
              {owner === "main" &&
                localStorage.getItem("mode") !== "mainnet" && (
                  <Button
                    type="button"
                    onClick={() => setAction("airdrop")}
                    variant="secondary"
                    size="icon"
                  >
                    <PlaneLanding />
                  </Button>
                )}
              {owner === wallet?.publicKey &&
                localStorage.getItem("mode") !== "mainnet" && (
                  <Button
                    type="button"
                    onClick={() => setAction("mint")}
                    variant="secondary"
                    size="icon"
                  >
                    <Pickaxe />
                  </Button>
                )}
            </div>
          </div>
        </div>
        <div className="w-full my-4 bg-background-secondary h-[1px]"></div>
        {action === "send" && (
          <SendTokenForm
            address={address}
            balance={balance}
            decimals={decimals}
            reset={() => {
              reset();
              setAction(null);
            }}
            toggleSheet={toggleSheet}
            token={token}
          />
        )}
        {action === "mint" && (
          <MintTokenForm
            address={address}
            toggleSheet={toggleSheet}
            decimals={decimals}
            reset={() => {
              reset();
              setAction(null);
            }}
          />
        )}
        {action === "airdrop" && (
          <AirdropTokenForm
            toggleSheet={toggleSheet}
            decimals={decimals}
            reset={() => {
              reset();
              setAction(null);
            }}
          />
        )}
        {/* <div className="overflow-y-auto h-1/2">
          {!action && (
            <Each
              of={transactions}
              render={(item) =>
                item ? <Transaction transactionData={item} /> : null
              }
            />
          )}
        </div> */}
      </SheetContent>
    </Sheet>
  );
}

interface Props extends Token {
  onClick?: () => void;
  imageSrc?: string;
  unit?: string;
  token: boolean;
  reset: () => void;
}
