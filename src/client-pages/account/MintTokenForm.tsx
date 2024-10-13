import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetFooter } from "@/components/ui/sheet";
import React, { FormEvent, useRef, useState } from "react";
import TransferStatusComponent from "./transfer-status";
import useNetwork from "@/hooks/use-network";

export default function MintTokenForm({
  toggleSheet,
  address,
  decimals,
  reset,
}: Props) {
  const amountRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<TransferStatus>("not-initiated");
  const { mintYourToken, wallet } = useNetwork();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = parseInt(amountRef.current?.value || "asd");
    if (isNaN(value) || !wallet) {
      return;
    }

    try {
      setStatus("processing");
      await mintYourToken(address, wallet.secret, value);
      setStatus("success");
      reset();
    } catch (error) {
      console.log(error);
      setStatus("failed");
    }
    setTimeout(() => {
      toggleSheet();
    }, 2000);
  };

  return (
    <form onSubmit={submitHandler}>
      {status === "not-initiated" && (
        <>
          <div className="mb-4">
            <Label htmlFor="amount">
              Amount{" "}
              <span className="opacity-60">
                10^{decimals} (In smallest unit)
              </span>
            </Label>
            <Input
              ref={amountRef}
              id="amount"
              placeholder="Enter amount"
              min={1}
              type="number"
            />
          </div>
          <SheetFooter className="">
            <Button
              className="w-full"
              type="button"
              variant="outline"
              onClick={() => {
                toggleSheet();
              }}
            >
              Cancel
            </Button>
            <Button className="w-full" type="submit">
              Mint
            </Button>
          </SheetFooter>
        </>
      )}
      {status !== "not-initiated" && (
        <TransferStatusComponent status={status} />
      )}
    </form>
  );
}

type Props = {
  toggleSheet: () => void;
  address: string;
  decimals: number;
  reset: () => void;
};
