import React, { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const Key = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...rest } = props;

  return (
    <div
      className={twMerge(
        "inline-flex size-14 items-center justify-center rounded-2xl border border-black bg-black px-3 py-1.5 text-white",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Key;
