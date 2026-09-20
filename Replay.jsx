import React from 'react';
import { Check } from 'lucide-react';

export default function Replay({ inv }) {
  const steps = inv.replay || [];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-700">Investigation Replay</h3>
      <p className="mt-1 text-xs text-slate-400">The pipeline stages executed for this investigation.</p>
      <ol className="mt-5 space-y-3">
        {steps.map((s) => (
          <li key={s.step} className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-3.5 w-3.5" /></span>
            <span className="font-mono text-xs text-slate-400">{s.step}</span>
            <span className="text-sm text-slate-700">{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
