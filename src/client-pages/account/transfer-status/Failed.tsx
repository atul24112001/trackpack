import { XCircle } from "lucide-react";
import React from "react";

export default function Failed() {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <XCircle className="text-red-400" size={60} />
      </div>
      <p className="text-center opacity-75 mt-2">Transfer failed</p>
    </div>
  );
}
