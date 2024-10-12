import Each from "@/components/helper/Each";
import { _networks } from "@/lib/wallet";
import React from "react";

export default function SelectNetwork({ onNext, onSelectNetwork }: Props) {
  const networks = ["501", "60"];
  return (
    <div className=" rounded-md px-6 py-4 flex flex-col gap-6 items-center">
      <h1 className="text-2xl md:text-4xl font-bold text-center ">
        Select Network
      </h1>
      <p className="text-center text-foreground-secondary max-w-[70%] font-semibold">
        Backpack supports multiple blockchains. Which do you want to use? You
        can add more later. Search Networks
      </p>
      {/* <input
        placeholder="Search network"
        className="bg-background-secondary rounded-lg border-0 px-4 py-3 w-[70%] focus:outline-0"
      /> */}
      <div className="flex-1 w-[70%]">
        <Each
          of={networks}
          render={(id) => {
            const item: any = _networks[id] || { title: "", image: "" };
            return (
              <div
                onClick={() => {
                  onSelectNetwork(id);
                  onNext();
                }}
                className="cursor-pointer flex items-center gap-4 bg-background-secondary mb-2 rounded-lg border-0 px-4 py-2  focus:outline-0"
              >
                <img
                  width={10}
                  height={10}
                  alt={id}
                  className="w-8 h-8"
                  src={item.image}
                />
                <p className="font-bold">{item.title}</p>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

type Props = {
  onNext: () => void;
  onSelectNetwork: React.Dispatch<React.SetStateAction<string | null>>;
};
