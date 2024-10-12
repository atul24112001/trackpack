import ClientSettingsPage from "@/client-pages/settings";
import React from "react";

export default function ServerSettingsPage() {
  return (
    <div className="h-screen flex justify-center ">
      <div className="w-11/12 md:w-1/2 lg:w-2/5">
        <ClientSettingsPage />
      </div>
    </div>
  );
}
