export const downloadQR = (svgId: string) => {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width; canvas.height = img.height;
    canvas.getContext('2d')?.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = `SIMU_QR_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg));
};
