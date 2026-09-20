import React, { useState, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, Search, Filter, Eye, X, Bookmark } from 'lucide-react';
import { TYPE_META } from '@/lib/graphBuilder';
import StatusBadge from './StatusBadge';

const FILTERS = ['All', 'Social', 'Organizations', 'Projects', 'Events', 'Publications', 'Websites', 'Strong Evidence', 'Conflicts', 'Unverified'];
const TYPE_FILTER = { Social: 'profile', Organizations: 'organization', Projects: 'project', Events: 'event', Publications: 'publication', Websites: 'website' };

export default function FootprintUniverse({ inv, onBookmark, bookmarks }) {
  const graph = inv.graph || { nodes: [], edges: [] };
  const [scale, setScale] = useState(0.55);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [hideWeak, setHideWeak] = useState(false);
  const drag = useRef({ active: false, x: 0, y: 0 });

  const visibleNodes = useMemo(() => {
    let nodes = graph.nodes;
    if (TYPE_FILTER[filter]) nodes = nodes.filter((n) => n.type === TYPE_FILTER[filter] || n.type === 'person');
    if (filter === 'Conflicts') nodes = nodes.filter((n) => n.isConflict || n.type === 'person');
    if (filter === 'Strong Evidence') nodes = nodes.filter((n) => n.type === 'person' || (n.data?.source_status === 'verified'));
    if (filter === 'Unverified') nodes = nodes.filter((n) => n.type === 'person' || n.data?.source_status === 'not_verified');
    if (query) nodes = nodes.filter((n) => (n.label || '').toLowerCase().includes(query.toLowerCase()));
    return nodes;
  }, [graph.nodes, filter, query]);

  const visibleIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = graph.edges.filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to) && (!hideWeak || e.strength !== 'WEAK'));

  const edgeStyle = (e) => {
    if (e.rel === 'CONFLICT') return { stroke: '#EF4444', strokeDasharray: '6 4', strokeWidth: 2 };
    if (e.strength === 'STRONG') return { stroke: '#4F46E5', strokeWidth: 2 };
    if (e.strength === 'MODERATE') return { stroke: '#7C3AED', strokeWidth: 1.5 };
    if (e.strength === 'CONFLICTING') return { stroke: '#EF4444', strokeDasharray: '5 4', strokeWidth: 2 };
    return { stroke: '#A855F7', strokeDasharray: '4 4', strokeWidth: 1.2 };
  };

  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.max(0.2, Math.min(2, s - e.deltaY * 0.001)));
  };
  const onDown = (e) => { drag.current = { active: true, x: e.clientX, y: e.clientY }; };
  const onMove = (e) => {
    if (!drag.current.active) return;
    setTx((x) => x + (e.clientX - drag.current.x));
    setTy((y) => y + (e.clientY - drag.current.y));
    drag.current.x = e.clientX; drag.current.y = e.clientY;
  };
  const onUp = () => { drag.current.active = false; };

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#F6F7FF] p-3">
      <div className="flex flex-wrap items-center gap-2 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search node..." className="h-8 w-44 rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-xs" />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-md px-2 py-1 text-xs ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{f}</button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={hideWeak} onChange={(e) => setHideWeak(e.target.checked)} /> Hide weak evidence
        </label>
        <div className="flex items-center gap-1">
          <button onClick={() => setScale((s) => Math.max(0.2, s - 0.15))} className="rounded-md border border-slate-200 bg-white p-1.5"><ZoomOut className="h-3.5 w-3.5" /></button>
          <button onClick={() => setScale((s) => Math.min(2, s + 0.15))} className="rounded-md border border-slate-200 bg-white p-1.5"><ZoomIn className="h-3.5 w-3.5" /></button>
          <button onClick={() => { setScale(0.55); setTx(0); setTy(0); }} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs">Reset</button>
        </div>
      </div>

      <div className="relative h-[460px] overflow-hidden rounded-xl bg-white" onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} style={{ cursor: drag.current.active ? 'grabbing' : 'grab' }}>
        <svg width="100%" height="100%" viewBox="-500 -340 1000 680">
          <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
            {visibleEdges.map((e, i) => {
              const from = graph.nodes.find((n) => n.id === e.from);
              const to = graph.nodes.find((n) => n.id === e.to);
              if (!from || !to) return null;
              const st = edgeStyle(e);
              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} {...st} opacity={0.7} />;
            })}
            {visibleNodes.map((n) => {
              const meta = TYPE_META[n.type] || { color: '#94A3B8' };
              const r = n.type === 'person' ? 26 : n.isConflict ? 14 : 16;
              const isSel = selected?.id === n.id;
              return (
                <g key={n.id} transform={`translate(${n.x} ${n.y})`} className="cursor-pointer" onClick={() => setSelected(n)}>
                  {isSel && <circle r={r + 6} fill="none" stroke="#4F46E5" strokeWidth={2} strokeDasharray="3 3" />}
                  <circle r={r} fill={n.isConflict ? '#EF4444' : meta.color} stroke="#fff" strokeWidth={2} />
                  <text textAnchor="middle" y={r + 12} fontSize={11} fill="#334155" className="select-none">{(n.label || '').slice(0, 18)}</text>
                </g>
              );
            })}
          </g>
        </svg>
        {selected && (
          <div className="absolute right-3 top-3 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-slate-800">{selected.label}</span>
              <button onClick={() => setSelected(null)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <p className="mt-1 text-xs capitalize text-slate-500">{selected.type}</p>
            {selected.data?.source_status && <div className="mt-2"><StatusBadge status={selected.data.source_status} /></div>}
            {selected.data?.bio && <p className="mt-2 text-xs text-slate-600">{selected.data.bio}</p>}
            {selected.data?.profile_url && <a href={selected.data.profile_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"><Eye className="h-3 w-3" /> View source</a>}
            {selected.type !== 'person' && <button onClick={() => onBookmark?.('node', selected.label, selected.data)} className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"><Bookmark className="h-3 w-3" /> Bookmark</button>}
          </div>
        )}
      </div>

      {inv.hiddenBridges?.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
          <p className="text-xs font-semibold text-amber-700">Hidden Bridge Discovery</p>
          <div className="mt-2 space-y-1.5">
            {inv.hiddenBridges.map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-700">Potential Bridge</span>
                {b.path.map((p, j) => (<React.Fragment key={j}>{j > 0 && <span className="text-amber-400">↓</span>}<span>{p}</span></React.Fragment>))}
                <span className="text-slate-400">— {b.evidence}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
