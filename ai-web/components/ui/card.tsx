import * as React from "react";

function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50 shadow-sm ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

export { Card };

