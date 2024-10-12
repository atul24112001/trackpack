import Each from "@/components/helper/Each";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { _networks } from "@/lib/wallet";
import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  setAccount: Dispatch<SetStateAction<AccountDetails>>;
  onNext: () => void;
  newWallet: boolean;
};

export default function AccountForm({ setAccount, onNext }: Props) {
  const [data, setData] = useState({
    accountType: "",
    name: "",
    network: "",
  });

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accountType = (data.accountType?.toString() || "").trim();
    const name = (data["name"]?.toString() || "").trim();
    const network = (data["network"]?.toString() || "").trim();

    if (!name.trim() || !accountType.trim()) {
      return;
    }
    setAccount({
      id: crypto.randomUUID(),
      accountType:
        accountType === "multi-chain" ? "multi-chain" : "single-chain",
      name,
      network,
    });
    onNext();
  };

  const changeHandler = (name: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full md:max-w-[50%] rounded-md px-6 py-4">
      <div className="flex flex-col items-center gap-6 mb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-center ">Account</h1>
        <p className="text-center text-foreground-secondary  font-semibold">
          Trackpack supports multiple blockchains. Which do you want to use? You
          can add more later. If you are new just select multi-chain.
        </p>
      </div>

      <form
        onSubmit={formSubmitHandler}
        className="flex flex-col items-center gap-2"
      >
        <Input
          onChange={(e) => changeHandler("name", e.target.value)}
          type="text"
          name="name"
          placeholder="Name"
        />
        <Select
          onValueChange={(value) => changeHandler("network", value)}
          name="network"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <Each
                of={Object.keys(_networks)}
                render={(item) => {
                  const network = _networks[item];
                  return (
                    <SelectItem value={item}>
                      <div className="flex gap-2 items-center">
                        <img
                          width={10}
                          height={10}
                          alt={item}
                          className="w-4 h-4"
                          src={network.image}
                        />
                        <p>{network.title}</p>
                      </div>
                    </SelectItem>
                  );
                }}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(v) => changeHandler("accountType", v)}
          name="accountType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="multi-chain">Multi-chain</SelectItem>
              <SelectItem value="single-chain">Single-chain</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button className="w-full mt-4">Next</Button>
      </form>
    </div>
  );
}
