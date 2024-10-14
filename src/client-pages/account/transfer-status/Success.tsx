import { CircleCheckBig } from "lucide-react";
import React from "react";

export default function Success({ message }: Props) {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <CircleCheckBig className="text-green-400" size={60} />
      </div>
      <p className="text-center opacity-75 mt-2">
        {message || "Transfer successfully"}
      </p>
    </div>
  );
}

type Props = {
  message?: string;
};
