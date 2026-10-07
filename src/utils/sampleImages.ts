/**
 * Pre-generated clean base64 data URLs for instant offline sample photos
 * Eliminates CORS issues entirely when loading sample photos into Canvas
 */

// Generate a clean portrait base64 SVG data URL for instant CORS-free testing
export function createSamplePortraitDataUrl(gender: 'female' | 'male' | 'vintage'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (gender === 'female') {
    // Warm studio background
    const bg = ctx.createLinearGradient(0, 0, 600, 800);
    bg.addColorStop(0, '#334155');
    bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 800);

    // Warm ambient light
    const glow = ctx.createRadialGradient(300, 300, 50, 300, 300, 350);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 600, 800);

    // Shoulders (Casual shirt)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(300, 850, 240, 280, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(260, 480, 80, 100);

    // Face oval
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(300, 380, 140, 180, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(300, 300, 160, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(250, 370, 15, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(350, 370, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lips
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(300, 440, 35, 15, 0, 0, Math.PI * 2);
    ctx.fill();

  } else if (gender === 'vintage') {
    // Black & White vintage photo background
    ctx.fillStyle = '#262626';
    ctx.fillRect(0, 0, 600, 800);

    // Grain texture
    ctx.fillStyle = '#d4d4d4';
    ctx.beginPath();
    ctx.ellipse(300, 820, 220, 260, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#a3a3a3';
    ctx.beginPath();
    ctx.ellipse(300, 380, 130, 170, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#171717';
    ctx.beginPath();
    ctx.ellipse(250, 370, 12, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(350, 370, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Male Casual
    const bg = ctx.createLinearGradient(0, 0, 600, 800);
    bg.addColorStop(0, '#1e293b');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 800);

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(300, 840, 250, 290, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(300, 380, 145, 185, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(300, 280, 150, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(250, 370, 14, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(350, 370, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
}
