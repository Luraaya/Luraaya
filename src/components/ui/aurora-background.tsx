"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <main className="w-full overflow-x-hidden bg-zinc-50">
      <div
        className={cn(
          // eigener Stacking Context, damit mix-blend-difference sauber begrenzt ist
          "transition-bg relative flex w-full min-h-[75svh] sm:min-h-[80vh] flex-col items-center justify-center overflow-x-hidden bg-zinc-50 text-slate-950 [isolation:isolate]",
          className
        )}
        {...props}
      >
        {/* harte, konstante helle Basis */}
        <div className="absolute inset-0 bg-zinc-50" />

        {/* Aurora-Effekt */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={
            {
              "--aurora":
                "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
              "--white-gradient":
                "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

              // Original-Farbwerte (keine Alpha-Werte, keine Pastell-Overrides)
              "--blue-300": "#93c5fd",
              "--blue-400": "#60a5fa",
              "--blue-500": "#3b82f6",
              "--indigo-300": "#a5b4fc",
              "--violet-200": "#ddd6fe",
              "--white": "#fff",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          {/* Puffer gegen Clip-Ränder */}
          <div className="absolute inset-0 p-8 sm:p-12">
            <div
              className={cn(
                `pointer-events-none absolute -inset-[10px]
                 after:animate-aurora
                 [background-image:var(--white-gradient),var(--aurora)]
                 [background-size:300%,_200%]
                 [background-position:50%_50%,50%_50%]

                 /* ORIGINAL-REIHENFOLGE – entscheidend */
                 opacity-50
                 blur-[10px]
                 invert filter
                 will-change-transform

                 [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
                 [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]

                 after:absolute
                 after:inset-0
                 after:[background-image:var(--white-gradient),var(--aurora)]
                 after:[background-size:200%,_100%]
                 after:[background-attachment:scroll]
                 sm:after:[background-attachment:fixed]
                 after:mix-blend-difference
                 after:content-[""]`,
                // Mask nur ab sm, um Mobile-Artefakte zu vermeiden
                showRadialGradient &&
                  `sm:[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
              )}
            />
          </div>
        </div>

        {/* Inhalt immer über dem Effekt */}
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </main>
  );
}
