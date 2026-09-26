import React from 'react'

export const AceternityBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-zinc-950">
      {/* Radial Gradient Ambient Glows (Aceternity style) */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] md:w-[900px] md:h-[450px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-[120px] opacity-75"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-20 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[110px]"
        aria-hidden="true"
      />

      {/* Grid Pattern with Radial Fade Mask */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
