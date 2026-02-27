import { cn } from "@/lib/utils"

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: "default" | "warning" | "danger" | "info"
}

// ✅💡⚠️🚫🚨
export function Callout({
  children,
  icon,
  type = "default",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn("mt-6 flex items-start border px-4 py-3", {
        "border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] text-[#1a1a1a]/70":
          type === "default",
        "border-[#2D5A27]/20 bg-[#2D5A27]/5 text-[#1a1a1a]/70":
          type === "info",
        "border-red-200 bg-red-50 text-red-900":
          type === "danger",
        "border-orange-200 bg-orange-50 text-orange-900":
          type === "warning",
      })}
      {...props}
    >
      {icon && <span className="mr-3 text-xl">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
