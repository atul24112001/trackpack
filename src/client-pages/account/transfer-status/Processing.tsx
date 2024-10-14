import Loader from "@/components/helper/Loader";
import React from "react";

export default function Processing({ message }: Props) {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <Loader />
      </div>
      <p className="text-center opacity-75">
        {message || "Processing transfer"}
      </p>
    </div>
  );
}

type Props = {
  message?: string;
};
