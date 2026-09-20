import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Bookmark, Trash2, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function History({ inv, onLoad, bookmarks, onRemoveBookmark }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem('traceiq_history') || '[]'));
    } catch { setList([]); }
    loadBookmarks();
  }, [inv]);

  const loadBookmarks = async () => {
    try {
      const bms = await base44.entities.Bookmark.list('-created_date', 50);
      onRemoveBookmark?.('set', bms);
    } catch { /* ignore */ }
  };

  const clearHistory = () => { localStorage.removeItem('traceiq_history'); setList([]); };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700"><HistoryIcon className="h-4 w-4 text-indigo-500" /> Recent Investigations</h3>
          {list.length > 0 && <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-red-500">Clear</button>}
        </div>
        <div className="mt-3 space-y-2">
          {list.length === 0 && <p className="text-sm text-slate-400">No recent investigations.</p>}
          {list.map((h, i) => (
            <button key={i} onClick={() => onLoad(h)} className="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-left hover:border-indigo-200">
              <div>
                <p className="text-sm font-medium text-slate-700">{h.name}</p>
                <p className="text-xs text-slate-400">{new Date(h.date).toLocaleString()} · {h.mode}</p>
              </div>
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Bookmark className="h-4 w-4 text-violet-500" /> Bookmarks</h3>
        <div className="mt-3 space-y-2">
          {(!bookmarks || bookmarks.length === 0) && <p className="text-sm text-slate-400">No bookmarks yet. Bookmark evidence, profiles, conflicts, or graph nodes.</p>}
          {bookmarks?.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2">
              <div><span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] uppercase text-violet-600">{b.item_type}</span><span className="ml-2 text-sm text-slate-700">{b.label}</span></div>
              <button onClick={() => base44.entities.Bookmark.delete(b.id).then(() => onRemoveBookmark?.('remove', b.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
