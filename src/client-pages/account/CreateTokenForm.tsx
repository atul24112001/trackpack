import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import useNetwork from "@/hooks/use-network";
import React, { useState } from "react";
import Success from "./transfer-status/Success";
import Loader from "@/components/helper/Loader";
import Failed from "./transfer-status/Failed";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string(),
  symbol: z.string().toUpperCase().max(10).min(3),
  uri: z.string().url(),
  decimals: z.number().min(0).max(18),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateTokenForm({
  showCreateTokeForm,
  toggleCreateTokenForm,
  reset,
}: Props) {
  const { createNewToken, wallet } = useNetwork();
  const [status, setStatus] = useState<
    "not-initiated" | "processing" | "success" | "failed"
  >("not-initiated");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      decimals: 9,
      name: "",
      symbol: "",
      uri: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    if (!wallet) return;
    try {
      setStatus("processing");
      await createNewToken(
        wallet.secret,
        values.decimals,
        values.name,
        values.symbol.toUpperCase(),
        values.uri
      );
      setStatus("success");
      reset();
    } catch (error) {
      console.log(error);
      setStatus("failed");
    }
    setTimeout(() => {
      toggleCreateTokenForm();
      form.reset();
      setStatus("not-initiated");
    }, 2000);
  };

  const creatingToken = status === "processing";

  return (
    <Sheet open={showCreateTokeForm} onOpenChange={toggleCreateTokenForm}>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full gap-4"
          >
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
                <div className="flex flex-col gap-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token name</FormLabel>
                        <FormControl>
                          <Input placeholder="Token 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="decimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decimals</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="9"
                            {...field}
                            onChange={(e) =>
                              field.onChange({
                                ...e,
                                target: {
                                  ...e.target,
                                  value: parseInt(e.target.value),
                                },
                              })
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="TOKEN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="uri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Json uri{" "}
                          <a
                            target="_blank"
                            className="text-blue-400 underline"
                            href="https://trackpack.s3.ap-south-1.amazonaws.com/metadata.json"
                          >
                            (Sample Json)
                          </a>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://trackpack.s3.ap-south-1.amazonaws.com/metadata.json"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
        </Form>
      </SheetContent>
    </Sheet>
  );
}

type Props = {
  showCreateTokeForm: boolean;
  toggleCreateTokenForm: () => void;
  reset: () => void;
};
