import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ConfidenceJourney({ inv }) {
  const steps = inv.confidenceJourney || [];
  if (!steps.length) return <p className="text-sm text-slate-400">No confidence journey data.</p>;
  const max = 100;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-700">Confidence Journey</h3>
      <p className="mt-1 text-xs text-slate-400">How evidence changes confidence — generated from actual evidence.</p>
      <div className="mt-5 space-y-1">
        {steps.map((s, i) => {
          const Icon = s.delta > 0 ? TrendingUp : s.delta < 0 ? TrendingDown : Minus;
          const color = s.delta > 0 ? 'text-emerald-600' : s.delta < 0 ? 'text-red-500' : 'text-slate-400';
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="w-44 shrink-0 text-xs text-slate-600">{s.label}</span>
              <div className="relative h-6 flex-1 rounded-md bg-slate-50">
                <div className="h-full rounded-md bg-gradient-to-r from-indigo-400 to-violet-500 transition-all" style={{ width: `${s.confidence}%` }} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-700">{s.confidence}%</span>
              </div>
              <span className={`flex w-12 items-center justify-end gap-0.5 text-xs font-medium ${color}`}>
                {s.delta !== 0 && <Icon className="h-3 w-3" />}{s.delta > 0 ? `+${s.delta}` : s.delta || ''}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-slate-700">Final Confidence</span>
        <span className="text-lg font-bold text-indigo-600">{steps[steps.length - 1].confidence}%</span>
      </div>
    </div>
  );
}
