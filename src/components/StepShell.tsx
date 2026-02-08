import type { PropsWithChildren } from "react";

export const StepShell = ({ title, description, children }: PropsWithChildren<{ title: string; description?: string }>) => (
  <section className="glass-panel rounded-4xl p-10 shadow-2xl shadow-black/40">
    <div className="mb-8">
      <h2 className="text-3xl italic text-white">{title}</h2>
      {description ? <p className="mt-2 text-white/70">{description}</p> : null}
    </div>
    {children}
  </section>
);
