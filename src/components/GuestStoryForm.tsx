"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Camera, Check } from "lucide-react";

type Photo = { id: string; file: File };
function PhotoField({photo, remove}: {photo: Photo; remove: () => void}) {
  const [url,setUrl] = useState("");
  useEffect(() => {
    const preview = URL.createObjectURL(photo.file);
    setUrl(preview);
    return () => URL.revokeObjectURL(preview);
  }, [photo.file]);
  return (
    <div className="guest-photo-field">
      {url && <img src={url} alt="Selected photograph preview" />}
      <div>
        <label>Photo caption <input name="captions" maxLength={180} placeholder="Where was this taken?" /></label>
        <button type="button" className="textlink" onClick={remove} aria-label={`Remove ${photo.file.name}`}>Remove photo</button>
      </div>
    </div>
  );
}

export function GuestStoryForm() {
  const [photos,setPhotos] = useState<Photo[]>([]);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [sent,setSent] = useState("");
  const key = useRef("");
  const receipt = useRef<HTMLDivElement>(null);
  useEffect(() => { if (sent) receipt.current?.focus(); },[sent]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    photos.forEach(({file}) => form.append("photos",file));
    setBusy(true);
    setError("");
    try {
      key.current ||= crypto.randomUUID();
      const response = await fetch("/api/stories",{ method:"POST", headers:{"Idempotency-Key":key.current}, body:form });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || "Please try again.");
      setSent(result.reference);
      setPhotos([]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally { setBusy(false); }
  }
  if (sent) return <div className="receipt" ref={receipt} tabIndex={-1}>
    <Check size={30} aria-hidden="true" /><h2>Your story is with OMI.</h2>
    <p>We’ll review your entry and any photographs before publication.</p>
    <p>Your reference is <strong>{sent}</strong>.</p>
    <Link className="textlink" href="/blog">Back to the guest journal <ArrowRight size={16}/></Link>
  </div>;
  return (
    <form className="guest-form" onSubmit={submit} onChange={() => { key.current = ""; }}>
      <fieldset disabled={busy}>
        <legend>Your journal entry</legend>
        <label>Story title (required)<input name="title" required maxLength={120} placeholder="Give your memory a title" /></label>
        <label>Public name (optional)<input name="byline" maxLength={80} placeholder="A first name or nickname" /><small>Leave blank to appear as “Guest traveler”.</small></label>
        <label>Your tour experience (required)<textarea name="body" required rows={6} maxLength={6000} placeholder="Which place, person or moment stayed with you?" /></label>
        <label>Traveling with OMI (optional)<textarea name="service" rows={3} maxLength={2000} placeholder="How was the planning, driving or support along the way?" /></label>
        <div className="guest-photo-picker">
          <label><span><Camera size={18} aria-hidden="true" /> Add photographs</span>
            <small>Up to three JPEG, PNG or WebP images, 5 MB each.</small>
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={photos.length >= 3}
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                event.target.value = "";
                if (photos.length + files.length > 3 || files.some(file => !file.size || file.size > 5*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(file.type))) {
                  setError("Choose up to three JPEG, PNG or WebP images, 5 MB each."); return;
                }
                setError("");
                setPhotos(prev => [...prev,...files.map(file => ({file,id:crypto.randomUUID()}))]);
              }} />
          </label>
          {photos.map(photo => <PhotoField key={photo.id} photo={photo} remove={() => {
            key.current = ""; setPhotos(prev => prev.filter(p => p.id !== photo.id)); setError("");
          }} />)}
        </div>
        <label className="check consent"><input type="checkbox" name="permission" value="yes" required />
          I traveled with OMI and give permission to publish this story, my public name and any photos I have permission to share.</label>
        {error && <p role="alert">{error}</p>}
        <button className="btn dark" disabled={busy}>{busy ? "Sending your story…" : "Send story for review"} <ArrowRight size={16}/></button>
      </fieldset>
    </form>
  );
}
