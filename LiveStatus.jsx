import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveStatus({ steps }) {
  if (!steps.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-slate-700">Live Investigation Status</p>
      <ol className="space-y-2">
        {steps.map((s) => (
          <li key={s.step} className="flex items-center gap-2.5 text-sm">
            {s.status === 'done' ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-3 w-3" /></span>
            ) : s.status === 'running' ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"><Loader2 className="h-3 w-3 animate-spin" /></span>
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-slate-300 text-[10px]">{s.step}</span>
            )}
            <span className={cn(s.status === 'done' ? 'text-slate-700' : s.status === 'running' ? 'text-indigo-600 font-medium' : 'text-slate-400')}>{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
