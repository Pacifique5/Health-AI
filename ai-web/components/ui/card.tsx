import * as React from "react";

function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

export { Card };

