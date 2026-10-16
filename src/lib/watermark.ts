export const WATERMARK_TEXT = 'Nairobi Spot';

const WATERMARK_MARK = '__ns_wm__';

/**
 * Bakes a white, semi-transparent "Nairobi Spot" watermark into an image file
 * (tiled diagonally across the whole photo plus a stronger corner mark) and
 * returns a new File. Non-image files are returned unchanged. Browser only.
 */
export async function watermarkImage(file: File, text: string = WATERMARK_TEXT): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) return file;
  if (file.name.includes(WATERMARK_MARK)) return file;

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

    // Single, centered white semi-transparent watermark
    const markSize = Math.max(20, Math.round(Math.min(w, h) * 0.09));
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 10);
    ctx.font = `700 ${markSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
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
