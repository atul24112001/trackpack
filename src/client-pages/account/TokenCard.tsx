import LocalAvatar from "@/components/helper/Avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getInitials } from "@/lib/helper";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useNetwork from "@/hooks/useNetwork";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import TransferStatusComponent from "./transfer-status";

const formSchema = z.object({
  publicKey: z.string(),
  amount: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function TokenCard({
  address,
  balance,
  decimals,
  onClick,
  imageSrc,
  unit,
  token,
  reset,
}: Props) {
  const [openSheet, setOpenSheet] = useState(false);
  const [action, setAction] = useState<"send" | "receive" | null>(null);
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

    const sendingAmount = parseInt(values.amount);
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
          sendingAmount,
          wallet.secret,
          address
        );
      } else {
        await transfer(values.publicKey, sendingAmount, wallet.secret);
      }
      setTransferStatus("success");
      reset();
      toggleSheet();
    } catch (error) {
      console.log(error);
      setTransferStatus("failed");
      setTimeout(() => {
        reset();
        toggleSheet();
      }, 2000);
    }
  }

  const toggleSheet = () => setOpenSheet((prev) => !prev);

  return (
    <Sheet open={openSheet} onOpenChange={toggleSheet}>
      <SheetTrigger asChild>
        <div
          onClick={onClick}
          className="flex cursor-pointer gap-3 bg-background-secondary mt-2 px-4 py-3 rounded-lg"
        >
          <div>
            {imageSrc ? (
              <Avatar>
                <AvatarImage src={imageSrc} alt={address} />
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
          <div>
            <h3 className="text-md">{address}</h3>
            <p className="opacity-50 text-sm">{balance / 10 ** decimals}</p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle></SheetTitle>
        {transferStatus === "not-initiated" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full"
            >
              <div className="my-2 flex-1">
                <div className="flex flex-col gap-2 justify-center items-center">
                  {imageSrc ? (
                    <Avatar>
                      <AvatarImage src={imageSrc} alt={address} />
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
                    <h3 className="text-md text-center">
                      {address.length > 15
                        ? `${address.slice(0, 20)}...`
                        : address}
                    </h3>
                    <p className="opacity-50 text-center text-sm">
                      {balance} {unit}
                    </p>
                    {!action && (
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
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full my-4 bg-background-secondary h-[1px]"></div>
                {action === "send" && (
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
                          <FormLabel>
                            Amount (decimals: 10^{decimals})
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {action === "send" && (
                <SheetFooter>
                  <Button
                    className="w-full"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAction(null);
                      form.reset();
                      toggleSheet();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={balance === 0}
                    className="w-full"
                    type="submit"
                  >
                    Send
                  </Button>
                </SheetFooter>
              )}
            </form>
          </Form>
        )}
        {transferStatus !== "not-initiated" && (
          <TransferStatusComponent status={transferStatus} />
        )}
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
