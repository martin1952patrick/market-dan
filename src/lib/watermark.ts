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
    const baseSize = Math.max(16, Math.round(Math.min(w, h) * 0.06));

    // Tiled diagonal watermark across the whole image
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.font = `700 ${baseSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = Math.max(2, baseSize * 0.12);
    const stepX = ctx.measureText(text).width + baseSize * 2.2;
    const stepY = baseSize * 4;
    const reach = Math.sqrt(w * w + h * h) / 2 + stepX;
    let row = 0;
    for (let y = -reach; y <= reach; y += stepY) {
      const offset = row % 2 === 0 ? 0 : stepX / 2;
      for (let x = -reach; x <= reach; x += stepX) {
        ctx.fillText(text, x + offset, y);
      }
      row++;
    }
    ctx.restore();

    // Stronger corner mark
    const cornerSize = Math.max(18, Math.round(w * 0.05));
    ctx.font = `700 ${cornerSize}px sans-serif`;
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'right';
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(text, w - cornerSize * 0.6, h - cornerSize * 0.5);

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
