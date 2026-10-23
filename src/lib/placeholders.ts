function initialsOf(name: string) {
  const clean = name.replace(/[[\]]/g, "").trim();
  const letters = clean
    .split(/[\s&·\-/]+/)
    .map((p) => p[0])
    .filter((ch) => ch && /[A-Za-zÀ-ÿ0-9]/.test(ch));
  if (letters.length === 0) return "??";
  return (letters[0] + (letters[1] ?? "")).toUpperCase();
}

export function portraitURI(name: string): string {
  const initials = initialsOf(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760">
    <defs>
      <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="2.4" cy="2.4" r="2.1" fill="#0b0a08" fill-opacity="0.3"/>
      </pattern>
      <linearGradient id="pastel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f4bdb4"/>
        <stop offset="50%" stop-color="#b9e3ec"/>
        <stop offset="100%" stop-color="#c3e8cf"/>
      </linearGradient>
    </defs>
    <rect width="600" height="760" fill="#f2ece0"/>
    <circle cx="300" cy="300" r="210" fill="url(#pastel)" opacity="0.9"/>
    <circle cx="300" cy="300" r="210" fill="url(#dots)" opacity="0.55"/>
    <rect x="0" y="560" width="600" height="200" fill="url(#dots)" opacity="0.4"/>
    <text x="300" y="380" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="180" font-weight="700" fill="#0b0a08">${initials}</text>
    <rect x="36" y="36" width="86" height="12" fill="#0b0a08"/>
    <rect x="478" y="712" width="86" height="12" fill="#b9c9f2" stroke="#0b0a08" stroke-width="2"/>
    <text x="36" y="726" font-family="'Courier New', monospace" font-size="20" letter-spacing="4" fill="#0b0a08" fill-opacity="0.6">FOTO · AMPLIKAA</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export function reelPosterURI(client: string, tag: string): string {
  const initials = initialsOf(client);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="960" viewBox="0 0 540 960">
    <defs>
      <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2.2" cy="2.2" r="1.9" fill="#0b0a08" fill-opacity="0.26"/>
      </pattern>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f4bdb4"/>
        <stop offset="50%" stop-color="#b9c9f2"/>
        <stop offset="100%" stop-color="#c3e8cf"/>
      </linearGradient>
    </defs>
    <rect width="540" height="960" fill="#ece5d7"/>
    <rect x="0" y="0" width="540" height="960" fill="url(#dots)"/>
    <circle cx="270" cy="430" r="150" fill="url(#g)" opacity="0.95"/>
    <circle cx="270" cy="430" r="150" fill="url(#dots)" opacity="0.5"/>
    <text x="270" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="150" font-weight="700" fill="#0b0a08">${initials}</text>
    <g transform="translate(270 700)">
      <circle r="54" fill="#b9e3ec" stroke="#0b0a08" stroke-width="6"/>
      <path d="M-14 -22 L26 0 L-14 22 Z" fill="#0b0a08"/>
    </g>
    <rect x="0" y="852" width="540" height="108" fill="#f6f1e7"/>
    <rect x="0" y="850" width="540" height="4" fill="#0b0a08"/>
    <text x="34" y="906" font-family="'Courier New', monospace" font-size="22" letter-spacing="5" fill="#0b0a08">${tag.toUpperCase().slice(0, 26)}</text>
    <text x="34" y="940" font-family="'Courier New', monospace" font-size="18" letter-spacing="3" fill="#0b0a08" fill-opacity="0.65">@${client.toLowerCase().replace(/[^a-z0-9._]/g, "")}</text>
    <rect x="34" y="34" width="72" height="10" fill="#0b0a08"/>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
