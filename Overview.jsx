import React from 'react';
import { Sparkles, Fingerprint, Target, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Avatar from './Avatar';

export default function Overview({ inv, onSection }) {
  const res = inv.identityResolution || {};
  const cv = inv.coverage || {};
  const id = inv.identity || {};
  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/60 to-white p-6">
          <div className="flex items-start gap-4">
            <Avatar name={inv.input?.name} size={64} />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{inv.input?.name}</h2>
              <p className="text-sm text-slate-500">{id.profession || inv.input?.profession || 'Profession unavailable'}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={res.result?.toLowerCase().replace(' ', '_')} />
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  <Target className="h-3 w-3" /> {Math.round((res.score || 0) * 100)}% confidence
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600">{inv.mode?.toUpperCase()} MODE</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{inv.llmExplanation || inv.investigationSummary || 'No explanation generated.'}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Target className="h-4 w-4 text-indigo-500" /> Coverage</div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-bold text-indigo-600">{cv.percent || 0}%</span>
            <span className="mb-1 text-xs text-slate-400">of {cv.sourcesChecked} sources</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${cv.percent || 0}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
            <Stat label="Verified" value={cv.verified} color="text-emerald-600" />
            <Stat label="Partial" value={cv.partial} color="text-sky-600" />
            <Stat label="Unavailable" value={cv.unavailable} color="text-amber-600" />
            <Stat label="Not Found" value={cv.notFound} color="text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Fingerprint className="h-4 w-4 text-violet-500" /> Identity DNA</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DNAField label="Aliases" values={id.aliases} />
          <DNAField label="Usernames" values={id.usernames} />
          <DNAField label="Organizations" values={id.organizations} />
          <DNAField label="Education" values={id.education} />
          <DNAField label="Skills" values={id.skills} />
          <DNAField label="Locations" values={id.locations} />
          <DNAField label="Projects" values={id.projects} />
          <DNAField label="Events" values={id.events} />
          <DNAField label="Publications" values={id.publications} />
          <DNAField label="Websites" values={id.websites} />
          <DNAField label="Platforms" values={id.platforms} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Sparkles className="h-4 w-4 text-cyan-500" /> Investigation Summary</div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{inv.investigationSummary || 'No summary available.'}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1"><span className="text-slate-500">{label}</span><span className={`font-semibold ${color}`}>{value}</span></div>;
}

function DNAField({ label, values }) {
  const v = (values || []).filter(Boolean);
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      {v.length ? (
        <div className="mt-1.5 flex flex-wrap gap-1">{v.map((x, i) => <span key={i} className="rounded-md bg-white px-2 py-0.5 text-xs text-slate-700 border border-slate-200">{x}</span>)}</div>
      ) : <p className="mt-1 text-xs text-slate-300">Not found</p>}
    </div>
  );
}
