"use client";

import React, { useState } from "react";

import CreateWalletWarning from "./Warning";
import CopyPhrases from "./CopyPhrases";
import AccountForm from "./AccountForm";

type CreateWalletType = "account" | "warning" | "network" | "phrases";

export default function ClientProcessWallet({ newWallet }: Props) {
  const [step, setStep] = useState<CreateWalletType>("account");
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    id: "",
    name: "",
    accountType: "multi-chain",
    network: "501",
  });

  return (
    <div className="h-screen flex justify-center pt-16">
      {step === "account" ? (
        <AccountForm
          setAccount={setAccountDetails}
          newWallet={newWallet}
          onNext={() => {
            setStep("warning");
          }}
        />
      ) : step === "warning" ? (
        <CreateWalletWarning onNext={() => setStep("phrases")} />
      ) : (
        <CopyPhrases accountDetails={accountDetails} newWallet={newWallet} />
      )}
    </div>
  );
}

type Props = {
  newWallet: boolean;
};
