import React from "react";
import { twMerge } from "tailwind-merge";

const FeatureCard = (props: {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  const { title, description, children, className } = props;

  return (
    <div
      className={twMerge(
        "flex h-full flex-col cursor-pointer rounded-3xl border border-black bg-white p-4 transition-all duration-300 hover:shadow-lg sm:p-5 md:p-6",
        className,
      )}
    >
      <div className="aspect-video shrink-0">{children}</div>
      <div className="flex grow flex-col">
        <h3 className="mt-4 font-heading text-2xl font-medium md:mt-6 md:text-3xl">{title}</h3>
        <p className="mt-2 grow text-sm text-black/60 md:text-base">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
