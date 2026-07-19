export const SOCIALS = [
  {
    label: "Telegram",
    href: "https://t.me/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.04 15.31 8.9 19.2c.4 0 .57-.17.78-.37l1.87-1.79 3.88 2.84c.71.39 1.22.19 1.41-.66l2.56-12.02c.23-1.05-.38-1.46-1.07-1.2L3.62 11.8c-1.03.4-1.02.97-.18 1.23l3.86 1.2 8.95-5.65c.42-.26.8-.12.49.14l-7.7 6.59Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.54-1.5h1.66V3.6c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.03 1.46-4.03 4.15v2.27H7.5V13h2.75v8h3.25Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.8" />
        <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.5 3h3l-6.6 7.6L21.7 21h-6.1l-4.8-6.3L5.3 21h-3l7-8.1L2.5 3h6.2l4.3 5.7L17.5 3Zm-1.1 16.2h1.7L7.8 4.7H6L16.4 19.2Z" />
      </svg>
    ),
  },
  {
    label: "Youtube",
    href: "https://youtube.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2-5.2 3.2Z" />
      </svg>
    ),
  },
];

export function formatDateDMY(raw) {
  const m = String(raw || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return raw || "";
  return `${m[3]}-${m[2]}-${m[1]}`;
}
