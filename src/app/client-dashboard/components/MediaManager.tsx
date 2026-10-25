'use client';
import React, { useState, useRef } from 'react';
import { Upload, Trash2, Image, Video, AlertCircle, Play, Film } from 'lucide-react';
import { ClientProfile, MediaItem } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import AppImage from '@/components/ui/AppImage';
import { Toaster, toast } from 'sonner';
import { watermarkImage } from '@/lib/watermark';
import { dbService } from '@/lib/services/dbService';

interface Props {
  profile: ClientProfile;
}

export default function MediaManager({ profile }: Props) {
  const { addMedia, removeMedia, siteSettings } = useAppStore();
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Always read from profile (which comes from AppContext in parent)
  const media = profile.media;
  const photoLimit = profile.photoLimit ?? siteSettings?.defaultPhotoLimit ?? 3;
  const videoLimit = profile.videoLimit ?? siteSettings?.defaultVideoLimit ?? 1;
  const limit = photoLimit + videoLimit;
  const used = media.length;

  const imageCount = media.filter((m) => m.type === 'image').length;
  const videoCount = media.filter((m) => m.type === 'video').length;
  const photosLeft = Math.max(0, photoLimit - imageCount);
  const videosLeft = Math.max(0, videoLimit - videoCount);
  const remaining = photosLeft + videosLeft;
  const quotaPct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 100;

  const handleUploadClick = () => {
    if (remaining <= 0) {
      toast.error('Upload limit reached', { description: 'Contact support to increase your media quota.' });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;

    // Keep only files that fit within the separate photo / video limits
    let imgSlots = photosLeft;
    let vidSlots = videosLeft;
    const accepted: File[] = [];
    let skipped = 0;
    for (const f of files) {
      if (f.type.startsWith('video')) {
        if (vidSlots > 0) { accepted.push(f); vidSlots--; } else skipped++;
      } else if (imgSlots > 0) {
        accepted.push(f); imgSlots--;
      } else {
        skipped++;
      }
    }
    if (skipped > 0) {
      toast.error(`${skipped} file${skipped > 1 ? 's' : ''} skipped`, {
        description: `Your limit is ${photoLimit} photo${photoLimit !== 1 ? 's' : ''} and ${videoLimit} video${videoLimit !== 1 ? 's' : ''}.`,
      });
    }
    if (accepted.length === 0) return;
    const canAdd = accepted.length;

    setUploading(true);
    const newItems: MediaItem[] = [];
    for (let i = 0; i < canAdd; i++) {
      const original = accepted[i];
      const isVideo = original.type.startsWith('video');
      // Stamp every uploaded image with the "nairobispot.com" watermark
      const file = isVideo ? original : await watermarkImage(original);
      const remoteUrl = await dbService.uploadListingMedia(file, profile.id);
      newItems.push({
        id: `media-upload-${Date.now()}-${i}`,
        type: isVideo ? 'video' : 'image',
        url: remoteUrl ?? URL.createObjectURL(file),
        alt: `Uploaded ${isVideo ? 'video' : 'image'} — ${original.name}`,
      });
    }
    addMedia(profile.id, newItems);
    setUploading(false);
    const imgCount = newItems.filter((n) => n.type === 'image').length;
    const vidCount = newItems.filter((n) => n.type === 'video').length;
    const parts = [];
    if (imgCount > 0) parts.push(`${imgCount} image${imgCount > 1 ? 's' : ''}`);
    if (vidCount > 0) parts.push(`${vidCount} video${vidCount > 1 ? 's' : ''}`);
    toast.success(`${parts.join(' and ')} uploaded`, {
      description: 'Images carry the nairobispot.com watermark and are now visible on your listing.',
    });
  };

  const confirmDelete = (id: string) => setDeleteTarget(id);

  const executeDelete = () => {
    if (!deleteTarget) return;
    removeMedia(profile.id, deleteTarget);
    toast.success('Media removed from your listing');
    setDeleteTarget(null);
    if (playingVideo === deleteTarget) setPlayingVideo(null);
  };

  const toggleVideoPlay = (id: string) => {
    const vid = videoRefs.current[id];
    if (!vid) return;
    if (playingVideo === id) {
      vid.pause();
      setPlayingVideo(null);
    } else {
      // Pause any other playing video
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }
      vid.play();
      setPlayingVideo(id);
    }
  };

  return (
    <div className="max-w-3xl">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Media & Photos</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Upload images and videos to showcase your furniture. Buyers are 3× more likely to contact sellers with photos.
        </p>
      </div>

      {/* Quota bar */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Upload Quota</span>
          <span className="text-sm font-mono tabular-nums font-semibold" style={{ color: quotaPct >= 100 ? '#DC2626' : 'var(--primary)' }}>
            {used} / {limit} used
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="h-full rounded-full quota-bar-fill transition-all duration-500" style={{ width: `${quotaPct}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {remaining > 0
              ? `${photosLeft} photo${photosLeft !== 1 ? 's' : ''} and ${videosLeft} video${videosLeft !== 1 ? 's' : ''} remaining — images (JPG, PNG, WebP) or videos (MP4, MOV)`
              : 'All upload slots are used. Contact support to request an increase.'}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {imageCount > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <Image size={12} /> {imageCount}
              </span>
            )}
            {videoCount > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--primary)' }}>
                <Film size={12} /> {videoCount} video{videoCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div
        onClick={handleUploadClick}
        className={`rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center mb-6 transition-colors cursor-pointer ${remaining <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
        style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(194,105,42,0.03)' }}
      >
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} disabled={remaining <= 0} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8" style={{ color: 'var(--primary)' }} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Uploading files…</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                <Upload size={22} />
              </div>
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>
              {remaining > 0 ? `Upload up to ${photosLeft} photo${photosLeft !== 1 ? 's' : ''} and ${videosLeft} video${videosLeft !== 1 ? 's' : ''}` : 'Upload limit reached'}
            </p>
            <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Click to browse — JPG, PNG, WebP, MP4, MOV supported</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                <Image size={12} /> Images
              </span>
              <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
                <Video size={12} /> Videos
              </span>
            </div>
          </>
        )}
      </div>

      {/* Media grid */}
      {media.length === 0 ? (
        <div className="rounded-xl border p-10 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <Image size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>No media uploaded yet</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Add photos and videos to make your listing stand out to buyers browsing in your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {media.map((item, i) => (
            <div key={`media-item-${item.id}`} className="relative rounded-xl overflow-hidden border group" style={{ borderColor: 'var(--border)' }}>
              <div className="aspect-square overflow-hidden bg-black">
                {item.type === 'video' ? (
                  <video
                    ref={(el) => { videoRefs.current[item.id] = el; }}
                    src={item.url}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    onEnded={() => setPlayingVideo(null)}
                  />
                ) : (
                  <AppImage src={item.url} alt={item.alt} width={300} height={300} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                )}
              </div>

              {/* Type badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: item.type === 'video' ? 'rgba(124,58,237,0.85)' : 'rgba(28,20,16,0.65)', color: '#FAF8F5' }}>
                {item.type === 'video' ? <Video size={11} /> : <Image size={11} />}
                {item.type}
              </div>

              {/* Position badge */}
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i === 0 ? 'var(--primary)' : 'rgba(28,20,16,0.55)', color: '#FAF8F5' }}>
                {i + 1}
              </div>

              {/* Video play/pause overlay */}
              {item.type === 'video' && (
                <button
                  onClick={() => toggleVideoPlay(item.id)}
                  className="absolute inset-0 flex items-center justify-center transition-opacity"
                  style={{ backgroundColor: playingVideo === item.id ? 'transparent' : 'rgba(28,20,16,0.35)' }}
                  aria-label={playingVideo === item.id ? 'Pause video' : 'Play video'}
                >
                  {playingVideo !== item.id && (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.9)' }}>
                      <Play size={18} className="ml-1" style={{ color: '#FAF8F5' }} />
                    </div>
                  )}
                </button>
              )}

              {/* Delete button */}
              <button
                onClick={() => confirmDelete(item.id)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                aria-label="Delete media"
              >
                <Trash2 size={13} />
              </button>

              {i === 0 && (
                <div className="absolute bottom-2 left-2 text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: 'var(--primary)', color: '#FAF8F5' }}>Cover</div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs mt-4" style={{ color: 'var(--muted-foreground)' }}>
        The first image is used as the cover photo on your listing card. Videos can be played directly in the grid.
      </p>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Remove this media?</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>This file will be removed from your public listing. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors" style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}>Remove File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}