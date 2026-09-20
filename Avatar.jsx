import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#0EA5E9', '#22C55E', '#F59E0B', '#EC4899'];

function initials(name) {
  if (!name) return '?';
  const parts = name.toString().trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
}

export default function Avatar({ name, src, size = 44, className }) {
  const [err, setErr] = useState(false);
  const showImg = src && !err;
  return (
    <div
      className={cn('relative flex shrink-0 items-center justify-center rounded-full font-semibold text-white overflow-hidden', className)}
      style={{ width: size, height: size, background: showImg ? '#e2e8f0' : colorFor(name), fontSize: size * 0.36 }}
    >
      {showImg ? (
        <img src={src} alt={name || 'avatar'} className="h-full w-full object-cover" onError={() => setErr(true)} />
      ) : (
        initials(name)
      )}
    </div>
  );
}
