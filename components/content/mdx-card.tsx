/* eslint-disable tailwindcss/classnames-order */
import Link from "next/link"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string
  disabled?: boolean
}

export function MdxCard({
  href,
  className,
  children,
  disabled,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "group relative border border-[#1a1a1a]/10 bg-white p-6 transition-all hover:border-[#1a1a1a]/20",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      {...props}
    >
      <div className="flex flex-col justify-between space-y-4">
        <div className="space-y-2 [&>h3]:!mt-0 [&>h3]:font-heading [&>h3]:text-[#1a1a1a] [&>h4]:!mt-0 [&>h4]:font-heading [&>h4]:text-[#1a1a1a] [&>p]:text-[#1a1a1a]/60">
          {children}
        </div>
      </div>
      {href && (
        <Link href={disabled ? "#" : href} className="absolute inset-0">
          <span className="sr-only">View</span>
        </Link>
      )}
    </div>
  )
}
