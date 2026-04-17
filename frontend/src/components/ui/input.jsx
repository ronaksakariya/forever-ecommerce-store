import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-3 text-sm text-[#000000] outline-none transition placeholder:text-[#000000]/50 focus:border-[#000000] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
