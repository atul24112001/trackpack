"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect, useState } from "react";

export default function ClientSettingsPage() {
  const router = useRouter();
  const [testMode, setTestMode] = useState(false);

  useLayoutEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode) {
      setTestMode(mode === "test");
    }
  }, []);

  return (
    <div>
      <nav className="py-4 flex gap-2 items-center">
        <Button onClick={router.back} variant="ghost" size="icon">
          <ArrowLeft />
        </Button>
        <h1 className="font-bold text-xl">Settings</h1>
      </nav>
      <div className="border-background-secondary border-[1px]  px-3 py-2 rounded-lg">
        <div className="flex justify-between">
          <h2 className="font-semibold text-lg">Test mode</h2>
          <div className="flex items-center space-x-2">
            <Switch
              checked={testMode}
              onCheckedChange={(e) => {
                setTestMode(e);
                localStorage.setItem("mode", e ? "test" : "mainnet");
              }}
              type="button"
              id="testing-mode"
            />
          </div>
        </div>
        <p className="opacity-75 text-sm">
          If test mode is on, Solana will be running on devnet and Ethereum will
          run on gorila.
        </p>
      </div>
    </div>
  );
}
