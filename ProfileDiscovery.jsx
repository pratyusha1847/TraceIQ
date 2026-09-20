import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Bookmark, ExternalLink, UserCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Avatar from './Avatar';
import { Button } from '@/components/ui/button';

const ICONS = {
  GitHub: Github, LinkedIn: Linkedin, 'X/Twitter': Twitter, Instagram, YouTube: Youtube,
  'Personal Website': Globe, 'Organization Website': Globe, 'Research Profile': UserCircle2,
  'Conference/Event': Globe, Publication: Globe, Wikidata: Globe, 'Other Public Source': Globe,
};

export default function ProfileDiscovery({ inv, onBookmark, bookmarks }) {
  const [expanded, setExpanded] = useState(null);
  const profiles = inv.profiles || [];
  const aliases = inv.aliases || [];
  const isBookmarked = (label) => (bookmarks || []).some((b) => b.label === label && b.item_type === 'profile');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">Discovered Profiles ({profiles.length})</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {profiles.length === 0 && <p className="text-sm text-slate-400">No profiles discovered.</p>}
          {profiles.map((p, i) => {
            const Icon = ICONS[p.platform] || Globe;
            const open = expanded === i;
            return (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <Avatar name={p.display_name || p.username} src={p.profile_image} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span className="truncate text-sm font-semibold text-slate-800">{p.display_name || p.username || p.platform}</span>
                    </div>
                    <p className="truncate text-xs text-slate-500">@{p.username || 'unknown'} · {p.platform}</p>
                    <div className="mt-1.5"><StatusBadge status={p.source_status} /></div>
                  </div>
                  <button onClick={() => onBookmark?.('profile', p.username || p.platform, p)} className="text-slate-300 hover:text-indigo-500">
                    <Bookmark className={`h-4 w-4 ${isBookmarked(p.username || p.platform) ? 'fill-indigo-500 text-indigo-500' : ''}`} />
                  </button>
                </div>
                {p.bio && <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">{p.bio}</p>}
                {(p.organization || p.location) && <p className="mt-1 text-xs text-slate-400">{[p.organization, p.location].filter(Boolean).join(' · ')}</p>}
                <div className="mt-2 flex items-center gap-2">
                  {p.profile_url && <a href={p.profile_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"><ExternalLink className="h-3 w-3" /> View Source</a>}
                  {(p.evidence?.length > 0) && <button onClick={() => setExpanded(open ? null : i)} className="text-xs text-slate-500 hover:text-slate-700">{open ? 'Hide' : 'Expand'} Evidence ({p.evidence.length})</button>}
                </div>
                {open && p.evidence?.length > 0 && (
                  <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2 text-xs text-slate-600">
                    {p.evidence.map((e, j) => <li key={j} className="flex gap-1.5"><span className="text-indigo-400">•</span>{e}</li>)}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {aliases.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Alias DNA ({aliases.length})</h3>
          <p className="mt-1 text-xs text-slate-400">Username similarity alone does not prove identity.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {aliases.map((a, i) => (
              <div key={i} className="rounded-lg border border-violet-100 bg-violet-50/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-violet-700">{a.username}</span>
                  <StatusBadge status={a.source_status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{a.platform} · {a.similarity_reason || 'Possible alias'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
