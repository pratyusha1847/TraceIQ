import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function InvestigationInput({ onInvestigate, loading, mode, setMode }) {
  const [form, setForm] = useState({ name: '', username: '', organization: '', location: '', profession: '', urls: '' });
  const [image, setImage] = useState(null); // { file_uri, preview }
  const [imgBusy, setImgBusy] = useState(false);
  const [imgError, setImgError] = useState('');
  const [urlList, setUrlList] = useState([]);
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleFile = async (file) => {
    setImgError('');
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) { setImgError('Unsupported format. Use JPG, PNG, or WEBP.'); return; }
    if (file.size > MAX_SIZE) { setImgError('File too large. Maximum 5MB.'); return; }
    setImgBusy(true);
    try {
      const up = await base44.integrations.Core.UploadPrivateFile({ file });
      const signed = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: up.file_uri, expires_in: 3600 });
      setImage({ file_uri: up.file_uri, preview: signed.signed_url });
    } catch (e) {
      setImgError('Image upload failed. ' + (e?.message || ''));
    } finally {
      setImgBusy(false);
    }
  };

  const addUrl = () => {
    const v = form.urls.trim();
    if (!v) return;
    setUrlList([...urlList, v]);
    setForm({ ...form, urls: '' });
  };
  const removeUrl = (i) => setUrlList(urlList.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || loading) return;
    onInvestigate({
      name: form.name.trim(),
      username: form.username.trim(),
      organization: form.organization.trim(),
      location: form.location.trim(),
      profession: form.profession.trim(),
      urls: urlList,
      image_uri: image?.file_uri || null,
      image_preview: image?.preview || null,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Person Name <span className="text-red-500">*</span></Label>
          <Input value={form.name} onChange={set('name')} placeholder="e.g. Sundar Pichai" required />
        </div>
        <div className="space-y-1.5">
          <Label>Username (optional)</Label>
          <Input value={form.username} onChange={set('username')} placeholder="e.g. sundarpichai" />
        </div>
        <div className="space-y-1.5">
          <Label>Organization (optional)</Label>
          <Input value={form.organization} onChange={set('organization')} placeholder="e.g. Google" />
        </div>
        <div className="space-y-1.5">
          <Label>Location (optional)</Label>
          <Input value={form.location} onChange={set('location')} placeholder="e.g. Mountain View" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Profession (optional)</Label>
          <Input value={form.profession} onChange={set('profession')} placeholder="e.g. Software Engineer" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Public Profile URLs (optional)</Label>
        <div className="flex gap-2">
          <Input value={form.urls} onChange={set('urls')} placeholder="Paste a public profile URL" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }} />
          <Button type="button" variant="secondary" onClick={addUrl}>Add</Button>
        </div>
        {urlList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {urlList.map((u, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
                <a href={u} target="_blank" rel="noreferrer" className="max-w-[200px] truncate text-indigo-600 hover:underline">{u}</a>
                <button type="button" onClick={() => removeUrl(i)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Image Upload (optional — investigator reference only)</Label>
        {!image ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
          >
            {imgBusy ? <Loader2 className="h-6 w-6 animate-spin text-indigo-500" /> : <Upload className="h-6 w-6 text-slate-400" />}
            <span className="text-sm font-medium text-slate-600">{imgBusy ? 'Uploading...' : 'Drag & Drop or Browse'}</span>
            <span className="text-xs text-slate-400">JPG • PNG • WEBP — max 5MB</span>
          </button>
        ) : (
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <img src={image.preview} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-600"><ImageIcon className="h-4 w-4" /> Image uploaded ✓</p>
              <p className="mt-1 text-xs text-slate-500">Image received. Identity correlation will rely on public-source evidence.</p>
              <div className="mt-2 flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}><RefreshCw className="mr-1 h-3.5 w-3.5" /> Replace</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setImage(null)}><X className="mr-1 h-3.5 w-3.5" /> Remove</Button>
              </div>
            </div>
          </div>
        )}
        {imgError && <p className="text-xs text-red-500">{imgError}</p>}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs">
          <button type="button" onClick={() => setMode('live')} className={`rounded-md px-3 py-1.5 font-medium ${mode === 'live' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Live Mode</button>
          <button type="button" onClick={() => setMode('demo')} className={`rounded-md px-3 py-1.5 font-medium ${mode === 'demo' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}>Demo Mode</button>
        </div>
        <Button type="submit" disabled={loading || !form.name.trim()} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Investigating...</> : <><Search className="mr-2 h-4 w-4" /> Start Investigation</>}
        </Button>
      </div>
    </form>
  );
}
