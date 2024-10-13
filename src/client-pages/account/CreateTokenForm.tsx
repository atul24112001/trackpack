import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import useNetwork from "@/hooks/use-network";
import React, { useRef, useState } from "react";
import Success from "./transfer-status/Success";
import Loader from "@/components/helper/Loader";
import Failed from "./transfer-status/Failed";

export default function CreateTokenForm({
  showCreateTokeForm,
  toggleCreateTokenForm,
  reset,
}: Props) {
  const decimalsRef = useRef<HTMLInputElement>(null);

  const { createNewToken, wallet } = useNetwork();
  const [status, setStatus] = useState<
    "not-initiated" | "processing" | "success" | "failed"
  >("not-initiated");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(decimalsRef.current?.value, wallet);
    if (!wallet) return;
    if (decimalsRef.current?.value) {
      try {
        setStatus("processing");
        await createNewToken(
          wallet.secret,
          parseInt(decimalsRef.current.value)
        );
        setStatus("success");
        reset();
        setTimeout(() => {
          toggleCreateTokenForm();
        }, 2000);
      } catch (error) {
        console.log(error);
        setStatus("failed");
      }
    }
  };

  const creatingToken = status === "processing";

  return (
    <Sheet open={showCreateTokeForm} onOpenChange={toggleCreateTokenForm}>
      <SheetContent>
        <form className="flex flex-col h-full gap-4" onSubmit={submitHandler}>
          <SheetHeader>
            <h1 className="text-xl font-bold">Create token</h1>
          </SheetHeader>
          <div className="flex-1">
            {status === "processing" && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}
            {status === "not-initiated" && (
              <>
                <Label className="font-bold" htmlFor="decimals">
                  Decimals
                </Label>
                <Input
                  max={18}
                  ref={decimalsRef}
                  id="decimals"
                  type="number"
                  placeholder="1"
                  min={0}
                />
              </>
            )}
            {status === "failed" && <Failed />}
            {status === "success" && <Success />}
          </div>
          <SheetFooter>
            <Button
              type="button"
              className="w-full"
              disabled={creatingToken}
              variant="outline"
              onClick={toggleCreateTokenForm}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={creatingToken}>
              Create
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

type Props = {
  showCreateTokeForm: boolean;
  toggleCreateTokenForm: () => void;
  reset: () => void;
};
