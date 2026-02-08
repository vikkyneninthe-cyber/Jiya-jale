import type { CreativeBrief } from "../types";

export const ExecutionPanel = ({ brief, renders }: { brief: CreativeBrief; renders: { label: string; url: string }[] }) => (
  <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
    <div className="glass-panel rounded-3xl p-6">
      <h3 className="text-2xl italic text-white">Creative Brief</h3>
      <div className="mt-6 space-y-4 text-sm text-white/70">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Headline</p>
          <p className="mt-2 text-white">{brief.headline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Primary Copy</p>
          <p className="mt-2 text-white/80">{brief.primary_copy}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">CTA</p>
          <p className="mt-2 text-white/80">{brief.cta}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Strategy</p>
          <p className="mt-2 text-white/80">{brief.strategy}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Performance Index</p>
          <p className="mt-2 text-2xl text-emerald-200">{brief.performance_index}</p>
          <p className="mt-2 text-xs text-emerald-200/70">{brief.performance_rationale}</p>
        </div>
      </div>
    </div>
    <div className="space-y-6">
      {renders.map((render) => (
        <div key={render.label} className="glass-panel rounded-3xl p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">{render.label}</p>
          {render.url ? (
            <img src={render.url} alt={render.label} className="w-full rounded-2xl border border-white/10" />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-white/50">Pending render</div>
          )}
        </div>
      ))}
    </div>
  </div>
);
