import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({ checked = false, className, ...props }) {
  return (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        data-slot="checkbox"
        className={cn(
          "peer size-4 cursor-pointer appearance-none rounded border border-[#000000] bg-[#FAF9F6] transition checked:bg-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/20",
          className,
        )}
        {...props}
      />
      <Check className="pointer-events-none absolute hidden size-3 text-[#FAF9F6] peer-checked:block" />
    </span>
  );
}

export { Checkbox };
