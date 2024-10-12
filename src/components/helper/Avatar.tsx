import React, { CSSProperties } from "react";

export default function Avatar({ title, onClick, className, style }: Props) {
  return (
    <div
      style={style}
      onClick={onClick}
      className={`cursor-pointer inline-flex justify-center items-center  rounded-full w-7 h-7 hover:opacity-75 bg-[#e57ab030] text-[#e57ab0] ${className}`}
    >
      {title}
    </div>
  );
}

type Props = {
  title: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};
