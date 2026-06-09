import { cn } from "@/lib/utils";

export function Button({ className, size, variant, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-none",
        size === "sm" ? "h-7 px-2 text-xs" : "h-9 px-4 py-2 text-sm",
        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}
