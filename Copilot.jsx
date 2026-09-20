import React, { useState } from 'react';
import { MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { askCopilot } from '@/lib/investigation';

const SUGGESTIONS = [
  'What connects this GitHub profile to the person?',
  'Why is this only a possible match?',
  'What conflicts were detected?',
  'What evidence is missing?',
  'Which sources support this relationship?',
  'What is the strongest evidence?',
  'Show me the investigation summary.',
];

export default function Copilot({ inv }) {
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([]);

  const ask = async (question) => {
    if (!question.trim() || busy) return;
    setBusy(true);
    setLog((l) => [...l, { role: 'user', text: question }]);
    const ans = await askCopilot(inv, question);
    setLog((l) => [...l, { role: 'ai', text: ans }]);
    setQ('');
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Sparkles className="h-4 w-4 text-cyan-500" /> TRACEIQ Copilot</div>
      <p className="mt-1 text-xs text-slate-400">AI investigation assistant — answers from evidence only, cites evidence IDs / source URLs.</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => <button key={s} onClick={() => ask(s)} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600">{s}</button>)}
      </div>
      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
        {log.length === 0 && <p className="text-xs text-slate-400">Ask a question to begin.</p>}
        {log.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>{m.text}</div>
          </div>
        ))}
        {busy && <div className="flex justify-start"><div className="rounded-xl bg-slate-50 px-3 py-2"><Loader2 className="h-4 w-4 animate-spin text-indigo-500" /></div></div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask(q)} placeholder="Ask about this investigation..." className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm" />
        <Button size="sm" onClick={() => ask(q)} disabled={busy} className="bg-indigo-600 hover:bg-indigo-700"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
