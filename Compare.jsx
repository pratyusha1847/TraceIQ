import React, { useState } from 'react';
import { compareProfiles } from '@/lib/identityResolution';
import StatusBadge from './StatusBadge';
import Avatar from './Avatar';

export default function Compare({ inv }) {
  const profiles = inv.profiles || [];
  const [a, setA] = useState(0);
  const [b, setB] = useState(Math.min(1, profiles.length - 1));
  if (profiles.length < 2) return <p className="text-sm text-slate-400">Need at least two discovered profiles to compare.</p>;
  const pa = profiles[a], pb = profiles[b];
  const res = compareProfiles(pa, pb);
  const rows = [
    ['Name', pa.display_name, pb.display_name],
    ['Username', pa.username, pb.username],
    ['Organization', pa.organization, pb.organization],
    ['Location', pa.location, pb.location],
    ['Bio', pa.bio, pb.bio],
    ['Platform', pa.platform, pb.platform],
    ['Source', pa.profile_url, pb.profile_url],
  ];
  const resultColor = { MATCH: 'verified', POSSIBLE_MATCH: 'partial', SEPARATE: 'not_verified', INSUFFICIENT_EVIDENCE: 'insufficient_evidence' }[res.result];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select value={a} onChange={(e) => setA(+e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm">
          {profiles.map((p, i) => <option key={i} value={i}>{p.platform}: {p.username || p.display_name}</option>)}
        </select>
        <select value={b} onChange={(e) => setB(+e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm">
          {profiles.map((p, i) => <option key={i} value={i}>{p.platform}: {p.username || p.display_name}</option>)}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[pa, pb].map((p, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <Avatar name={p.display_name || p.username} src={p.profile_image} size={44} />
              <div><p className="text-sm font-semibold">{p.display_name || p.username}</p><p className="text-xs text-slate-500">{p.platform}</p></div>
            </div>
            <div className="mt-2"><StatusBadge status={p.source_status} /></div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 text-left text-xs text-slate-500"><th className="p-2">Field</th><th className="p-2">Profile A</th><th className="p-2">Profile B</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="p-2 font-medium text-slate-600">{r[0]}</td>
                <td className="p-2 text-slate-700">{r[1] || '—'}</td>
                <td className="p-2 text-slate-700">{r[2] || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
        <div>
          <p className="text-xs text-slate-500">Identity Resolution Result</p>
          <div className="mt-1"><StatusBadge status={resultColor} /></div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Match Score</p>
          <p className="text-2xl font-bold text-indigo-600">{Math.round(res.score * 100)}%</p>
        </div>
      </div>
    </div>
  );
}
