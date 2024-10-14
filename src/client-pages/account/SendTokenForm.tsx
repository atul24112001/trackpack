import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TransferStatusComponent from "./transfer-status";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useNetwork from "@/hooks/use-network";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastAction } from "@/components/ui/toast";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  publicKey: z.string(),
  amount: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SendTokenForm({
  balance,
  address,
  reset,
  toggleSheet,
  token,
  decimals,
}: Props) {
  const [transferStatus, setTransferStatus] =
    useState<TransferStatus>("not-initiated");

  const router = useRouter();
  const { toast } = useToast();
  const { isValidPublicKey, transfer, transferToken, wallet } = useNetwork();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "0",
      publicKey: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    if (!wallet) {
      toast({
        title: "Something went wrong",
        description: "Key pair not found",
        action: (
          <ToastAction
            onClick={() => {
              router.refresh();
            }}
            altText="refresh"
          >
            Refresh
          </ToastAction>
        ),
      });
      return;
    }
    const publicKeyIsValid = await isValidPublicKey(values.publicKey);
    if (!publicKeyIsValid) {
      form.setError("publicKey", {
        message: "Invalid public key.",
      });
    }

    const sendingAmount = parseFloat(values.amount);
    if (isNaN(sendingAmount)) {
      form.setError("amount", {
        message: "Invalid amount",
      });
      return;
    }
    if (sendingAmount > balance) {
      form.setError("amount", {
        message: "Insufficient balance",
      });
      return;
    }

    try {
      setTransferStatus("processing");
      if (token) {
        await transferToken(
          values.publicKey,
          sendingAmount * 10 ** decimals,
          wallet.secret,
          address
        );
      } else {
        await transfer(
          values.publicKey,
          sendingAmount * 10 ** decimals,
          wallet.secret
        );
      }
      setTransferStatus("success");
    } catch (error) {
      console.log(error);
      setTransferStatus("failed");
    }
    setTimeout(() => {
      reset();
      toggleSheet();
    }, 2000);
  }

  return (
    <div className=" h-full ">
      {transferStatus === "not-initiated" && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full ">
            <div className="my-2">
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="publicKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver public key</FormLabel>
                      <FormControl>
                        <Input placeholder="Public key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount x (10^{decimals})</FormLabel>
                      <FormControl>
                        <Input
                          maxLength={decimals}
                          placeholder="0"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <SheetFooter className="">
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  toggleSheet();
                }}
              >
                Cancel
              </Button>
              <Button disabled={balance === 0} className="w-full" type="submit">
                Send
              </Button>
            </SheetFooter>
          </form>
        </Form>
      )}
      {transferStatus !== "not-initiated" && (
        <TransferStatusComponent status={transferStatus} />
      )}
    </div>
  );
}

type Props = {
  balance: number;
  token: boolean;
  address: string;
  reset: () => void;
  toggleSheet: () => void;
  decimals: number;
};
