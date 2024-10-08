import React, { PropsWithChildren } from "react";

export default function IconButton({
  children,
  onClick,
}: PropsWithChildren<Props>) {
  return (
    <button
      onClick={onClick}
      className="inline-flex justify-center rounded-full items-center p-1 hover:bg-[#cccccc3e]"
    >
      {children}
    </button>
  );
}

type Props = {
  onClick: () => void;
};
