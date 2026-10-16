export const WATERMARK_TEXT = 'Nairobi Spot';

/**
 * Draws the "Nairobi Spot" watermark onto an image file and returns a new File.
 * Non-image files are returned unchanged. Runs only in the browser.
 */
export async function watermarkImage(file: File, text: string = WATERMARK_TEXT): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) return file;

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

    const fontSize = Math.max(18, Math.round(canvas.width * 0.05));
    ctx.font = `700 ${fontSize}px sans-serif`;
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'right';

    // Corner mark
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(text, canvas.width - fontSize * 0.6, canvas.height - fontSize * 0.5);

    // Diagonal centre mark
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.round(fontSize * 1.8)}px sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, outType, 0.9));
    if (!blob) return file;

    const ext = outType === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${baseName}.${ext}`, { type: outType });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(bitmapUrl);
  }
}
