import Loader from "@/components/helper/Loader";
import React from "react";

export default function Processing() {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <Loader />
      </div>
      <p className="text-center opacity-75">Processing transfer</p>
    </div>
  );
}
