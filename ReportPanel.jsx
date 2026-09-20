import React from 'react';
import { FileText, FileJson, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportPDF, exportJSON } from '@/lib/reportBuilder';

export default function ReportPanel({ inv }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700"><FileText className="h-4 w-4 text-indigo-500" /> Intelligence Report</h3>
        <p className="mt-1 text-xs text-slate-400">Dynamically generated from the current investigation data — includes subject, sources, identity DNA, evidence chain, conflicts, missing evidence, confidence journey, coverage, and a privacy statement.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => exportPDF(inv)} className="bg-indigo-600 hover:bg-indigo-700"><FileText className="mr-2 h-4 w-4" /> Export PDF</Button>
          <Button onClick={() => exportJSON(inv)} variant="secondary"><FileJson className="mr-2 h-4 w-4" /> Export JSON</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><ShieldCheck className="h-4 w-4" /> Report Contents</div>
        <ul className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
          {['Investigation subject','Input information','Profile sources','Identity DNA','Platform footprint','Organizations','Projects','Events','Timeline','Evidence chain','Identity-resolution result','Conflicts','Missing evidence','Confidence journey','Investigation coverage','Source references','Privacy/trust statement'].map((x) => <li key={x} className="flex gap-1.5"><span className="text-emerald-500">✓</span>{x}</li>)}
        </ul>
      </div>
    </div>
  );
}
