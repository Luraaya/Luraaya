"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main className="w-full overflow-x-hidden bg-zinc-50">
      <div
        className={cn(
          "transition-bg relative flex w-full min-h-[75svh] sm:min-h-[80vh] flex-col items-center justify-center bg-zinc-50 text-slate-950 overflow-x-hidden",
          className
        )}
        {...props}
      >
        {/* Clip-Container: bleibt exakt im Viewport */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={
            {
              "--aurora":
                "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
                "--white-gradient":
                "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

              "--blue-300": "#bafffcff",
              "--blue-400": "#b6e4ffff",
              "--blue-500": "#b6b7ffa6",
              "--indigo-300": "#d9defaff",
              "--violet-200": "#ddd6fe",
              "--black": "#000",
              "--white": "#fff",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          {/* Puffer: verhindert sichtbaren Clip-Rand beim Blur */}
          <div className="absolute inset-0 p-8 sm:p-12">
            <div
              className={cn(
                `absolute -inset-8 sm:-inset-12
                 after:animate-aurora after:[animation-duration:35s] sm:after:[animation-duration:60s]
                 [background-image:var(--white-gradient),var(--aurora)]
                 [background-size:300%,_300%]
                 [background-position:50%_50%,50%_50%]
                 opacity-70
                 blur-[10px]
                 will-change-transform
                 [--aurora:repeating-linear-gradient(90deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
                 [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
                 after:absolute
                 after:inset-0
                 after:[background-image:var(--white-gradient),var(--aurora)]
                 after:[background-size:200%,_100%]
                 after:[background-attachment:scroll]
                 sm:after:[background-attachment:fixed]
                 after:mix-blend-normal
                 after:content-[""]`,
                // Mask nur ab sm anwenden, weil sie auf Mobile oft wie "Rahmen" wirkt
                showRadialGradient &&
                  `sm:[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
              )}
            />
          </div>
        </div>

        {children}
      </div>
    </main>
  );
};
