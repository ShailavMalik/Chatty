const hashString = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const getInitials = (fullName, username) => {
  const source = (fullName || username || "chatty user").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const buildAvatarDataUri = ({ gender, username, fullName }) => {
  const normalizedGender = gender === "female" ? "female" : "male";
  const seed = `${normalizedGender}:${username || "chatty-user"}:${fullName || ""}`;
  const hash = hashString(seed);

  const palettes = {
    male: ["#0f172a", "#1d4ed8", "#0ea5e9", "#2563eb", "#14b8a6"],
    female: ["#5b21b6", "#db2777", "#f43f5e", "#8b5cf6", "#ec4899"],
  };

  const palette = palettes[normalizedGender];
  const primary = palette[hash % palette.length];
  const secondary = palette[(hash >> 3) % palette.length];
  const accent = palette[(hash >> 6) % palette.length];
  const initials = getInitials(fullName, username);
  const glow = normalizedGender === "female" ? "#ffffff22" : "#ffffff18";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${initials} avatar">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="55%" stop-color="${secondary}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="100" fill="url(#bg)" />
      <circle cx="68" cy="72" r="44" fill="${glow}" />
      <circle cx="142" cy="136" r="36" fill="${glow}" />
      <text
        x="100"
        y="114"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="64"
        font-weight="700"
        fill="#ffffff"
        letter-spacing="2"
      >${initials}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
};

export default buildAvatarDataUri;
