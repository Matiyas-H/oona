import React, { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const Tag = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...rest } = props;

  return (
    <div
      className={twMerge(
        "inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 uppercase text-blue-500",
        className,
      )}
    >
      <span className="text-sm">{children}</span>
    </div>
  );
};

export default Tag;
