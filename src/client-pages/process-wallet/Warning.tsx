import React, { useState } from "react";
import { LockKeyhole, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CreateWalletWarning({ onNext }: Props) {
  const [agreesTerms, setAgreesTerms] = useState(false);

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-[98%] md:w-[50%] lg:w-[40%]">
      <h1 className="text-4xl font-bold text-center ">
        Secret Recovery Phrase Warning
      </h1>
      <p className="text-center text-foreground-secondary max-w-[70%] mb-3 font-semibold">
        On the next page, you will receive your secret recovery phrase.
      </p>
      <div className="flex items-center gap-4 bg-background-secondary px-6 py-4 rounded-md max-w-[80%]">
        <TriangleAlert color="#fcfc31" width="60px" />
        <p className="text-foreground-secondary font-semibold">
          This is the{" "}
          <span className="text-foreground inline">&nbsp;ONLY&nbsp;</span> way
          to recover your account if you lose access to your device or password.
        </p>
      </div>
      <div className="flex items-center gap-4 bg-background-secondary px-6 py-4 rounded-md max-w-[80%]">
        <LockKeyhole color="#44da22" width="60px" />
        <p className="text-foreground-secondary font-semibold">
          Write it down, store it in a safe place, and{" "}
          <span className="text-foreground">&nbsp;NEVER&nbsp;</span> share it
          with anyone.
        </p>
      </div>

      <div className="flex items-baseline gap-4 max-w-[80%] mt-4">
        <input
          onChange={() => setAgreesTerms((prev) => !prev)}
          id="i_understand_checkbox"
          className="bg-background"
          type="checkbox"
        />
        <label className="font-semibold" htmlFor="i_understand_checkbox">
          I understand that I am responsible for saving my secret recovery
          phrases, and it is the only way to recover my wallet
        </label>
      </div>
      <Button
        disabled={!agreesTerms}
        className="w-[80%]"
        onClick={() => onNext()}
      >
        Next
      </Button>
    </div>
  );
}

type Props = {
  onNext: () => void;
};
