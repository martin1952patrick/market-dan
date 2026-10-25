import { createClient } from '@/lib/supabase/client';

export const WATERMARK_TEXT = 'nairobispot.com';

const WATERMARK_MARK = '__ns_wm__';

export type WatermarkPosition =
  | 'top-left' |'top-center' |'top-right' |'center-left' |'center' |'center-right' |'bottom-left' |'bottom-center' |'bottom-right';

export interface WatermarkSettings {
  opacity: number; // 0.1 - 1
  position: WatermarkPosition;
}

export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  opacity: 0.6,
  position: 'center',
};

export const WATERMARK_POSITIONS: { value: WatermarkPosition; label: string }[] = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-center', label: 'Top center' },
  { value: 'top-right', label: 'Top right' },
  { value: 'center-left', label: 'Middle left' },
  { value: 'center', label: 'Center' },
  { value: 'center-right', label: 'Middle right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-center', label: 'Bottom center' },
  { value: 'bottom-right', label: 'Bottom right' },
];

export const WATERMARK_SETTINGS_KEY = 'watermark_settings';

export function normalizeWatermarkSettings(raw: Partial<WatermarkSettings> | null | undefined): WatermarkSettings {
  const opacity = typeof raw?.opacity === 'number' && isFinite(raw.opacity) ? Math.min(1, Math.max(0.1, raw.opacity)) : DEFAULT_WATERMARK_SETTINGS.opacity;
  const position = WATERMARK_POSITIONS.some((p) => p.value === raw?.position)
    ? (raw?.position as WatermarkPosition)
    : DEFAULT_WATERMARK_SETTINGS.position;
  return { opacity, position };
}

/** Flex alignment for the CSS overlay. */
export function positionToFlex(position: WatermarkPosition): { justifyContent: string; alignItems: string } {
  const [v, h] = position === 'center' ? ['center', 'center'] : (position.split('-') as [string, string]);
  const justify = h === 'left' ? 'flex-start' : h === 'right' ? 'flex-end' : 'center';
  const align = v === 'top' ? 'flex-start' : v === 'bottom' ? 'flex-end' : 'center';
  return { justifyContent: justify, alignItems: align };
}

let cachedSettings: WatermarkSettings | null = null;
let inflight: Promise<WatermarkSettings> | null = null;
const listeners = new Set<(s: WatermarkSettings) => void>();

export function getCachedWatermarkSettings(): WatermarkSettings {
  return cachedSettings ?? DEFAULT_WATERMARK_SETTINGS;
}

export function subscribeWatermarkSettings(fn: (s: WatermarkSettings) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setCachedWatermarkSettings(s: WatermarkSettings) {
  cachedSettings = s;
  listeners.forEach((fn) => fn(s));
}

export async function loadWatermarkSettings(force = false): Promise<WatermarkSettings> {
  if (typeof window === 'undefined') return DEFAULT_WATERMARK_SETTINGS;
  if (cachedSettings && !force) return cachedSettings;
  if (inflight && !force) return inflight;
  inflight = (async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('admin_settings').select('value').eq('key', WATERMARK_SETTINGS_KEY).maybeSingle();
      const s = normalizeWatermarkSettings(data?.value as Partial<WatermarkSettings> | null);
      setCachedWatermarkSettings(s);
      return s;
    } catch {
      setCachedWatermarkSettings(DEFAULT_WATERMARK_SETTINGS);
      return DEFAULT_WATERMARK_SETTINGS;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/**
 * Bakes a white, semi-transparent "nairobispot.com" watermark into an image file
 * (using the admin's opacity/position settings) and returns a new File.
 * Non-image files are returned unchanged. Browser only.
 */
export async function watermarkImage(file: File, text: string = WATERMARK_TEXT): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) return file;
  if (file.name.includes(WATERMARK_MARK)) return file;

  const settings = await loadWatermarkSettings();
  const bitmapUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read image for watermarking'));
      el.src = bitmapUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0);

    const w = canvas.width;
    const h = canvas.height;

    const markSize = Math.max(20, Math.round(Math.min(w, h) * 0.09));
    const margin = Math.round(markSize * 0.9);
    const pos = settings.position;
    const [v, hz] = pos === 'center' ? ['center', 'center'] : (pos.split('-') as [string, string]);
    const x = hz === 'left' ? margin : hz === 'right' ? w - margin : w / 2;
    const y = v === 'top' ? margin : v === 'bottom' ? h - margin : h / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 10);
    ctx.font = `700 ${markSize}px sans-serif`;
    ctx.textAlign = hz === 'left' ? 'left' : hz === 'right' ? 'right' : 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255,255,255,${settings.opacity})`;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = Math.max(3, markSize * 0.12);
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, outType, 0.92));
    if (!blob) return file;

    const ext = outType === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${baseName}${WATERMARK_MARK}.${ext}`, { type: outType });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(bitmapUrl);
  }
}
