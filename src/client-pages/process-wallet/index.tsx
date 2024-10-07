"use client";

import React, { useState } from "react";

import CreateWalletWarning from "./Warning";
import CopyPhrases from "./CopyPhrases";
import SelectNetwork from "./SelectNetwork";

type CreateWalletType = "warning" | "network" | "phrases";

export default function ClientProcessWallet({ newWallet }: Props) {
  const [step, setStep] = useState<CreateWalletType>("network");
  const [selectedNetwork, setSelectedNetwork] = useState<null | string>(null);

  return (
    <div className="h-screen flex justify-center pt-16">
      {step === "warning" ? (
        <CreateWalletWarning onNext={() => setStep("phrases")} />
      ) : step === "network" ? (
        <SelectNetwork
          onSelectNetwork={setSelectedNetwork}
          onNext={() => setStep("warning")}
        />
      ) : (
        <CopyPhrases newWallet={newWallet} selectedNetwork={selectedNetwork} />
      )}
    </div>
  );
}

type Props = {
  newWallet: boolean;
};
