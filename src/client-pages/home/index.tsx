"use client";

import LinkButton from "@/components/local-ui/LinkButton";
import React from "react";

export default function ClientHomePage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-3 ">
        Welcome to Trackpack
      </h1>
      <p className="text-center text-foreground-secondary  mb-10 font-semibold">
        Let&apos;s get started.
      </p>
      <div className="flex flex-col gap-3 ">
        <LinkButton variant="contained" href="/create-wallet">
          Create Wallet
        </LinkButton>
        <LinkButton
          className="bg-background-secondary"
          variant="text"
          href="/import-wallet"
        >
          Import Wallet
        </LinkButton>
      </div>
    </div>
  );
}
