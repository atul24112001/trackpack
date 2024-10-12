import { CircleCheckBig } from "lucide-react";
import React from "react";

export default function Success() {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <CircleCheckBig className="text-green-400" size={60} />
      </div>
      <p className="text-center opacity-75 mt-2">Transfer successfully</p>
    </div>
  );
}
