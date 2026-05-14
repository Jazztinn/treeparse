export async function exportSvgAsPng(svgEl, filename = 'syntax-tree.png', scale = 2) {
  if (!svgEl) return;

  const clone = svgEl.cloneNode(true);
  const width = parseFloat(svgEl.getAttribute('width')) || svgEl.clientWidth;
  const height = parseFloat(svgEl.getAttribute('height')) || svgEl.clientHeight;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', width);
  clone.setAttribute('height', height);

  // Inline computed styles into clone so PNG matches CSS
  inlineStyles(svgEl, clone);

  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  URL.revokeObjectURL(url);

  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }, 'image/png');
}

function inlineStyles(source, target) {
  const sourceEls = source.querySelectorAll('*');
  const targetEls = target.querySelectorAll('*');
  for (let i = 0; i < sourceEls.length; i++) {
    const cs = window.getComputedStyle(sourceEls[i]);
    const t = targetEls[i];
    const props = ['fill','stroke','stroke-width','stroke-dasharray','font-family','font-size','font-weight','font-style','text-anchor','dominant-baseline'];
    let style = '';
    for (const p of props) {
      const v = cs.getPropertyValue(p);
      if (v) style += `${p}:${v};`;
    }
    t.setAttribute('style', style);
  }
}
