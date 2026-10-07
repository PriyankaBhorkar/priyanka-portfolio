/** Small national flags, drawn as SVG so they look the same on every device. */

const stripesH = (a: string, b: string, c: string) => (
  <>
    <rect width="30" height="6.67" fill={a} />
    <rect y="6.67" width="30" height="6.67" fill={b} />
    <rect y="13.33" width="30" height="6.67" fill={c} />
  </>
);

const flags: Record<string, React.ReactNode> = {
  FR: (
    <>
      <rect width="10" height="20" fill="#0055a4" />
      <rect x="10" width="10" height="20" fill="#ffffff" />
      <rect x="20" width="10" height="20" fill="#ef4135" />
    </>
  ),
  DE: stripesH("#000000", "#dd0000", "#ffce00"),
  AT: stripesH("#ed2939", "#ffffff", "#ed2939"),
  CH: (
    <>
      <rect width="30" height="20" fill="#d52b1e" />
      <rect x="13" y="4" width="4" height="12" fill="#ffffff" />
      <rect x="9" y="8" width="12" height="4" fill="#ffffff" />
    </>
  ),
  CZ: (
    <>
      <rect width="30" height="10" fill="#ffffff" />
      <rect y="10" width="30" height="10" fill="#d7141a" />
      <path d="M0 0L15 10L0 20Z" fill="#11457e" />
    </>
  ),
  HU: stripesH("#ce2939", "#ffffff", "#477050"),
  FI: (
    <>
      <rect width="30" height="20" fill="#ffffff" />
      <rect x="8" width="5" height="20" fill="#003580" />
      <rect y="7.5" width="30" height="5" fill="#003580" />
    </>
  ),
  EE: stripesH("#0072ce", "#000000", "#ffffff"),
};

export function Flag({ code, name, className }: { code: string; name: string; className?: string }) {
  if (!flags[code]) return null;
  return (
    <svg viewBox="0 0 30 20" role="img" aria-label={name} className={className}>
      <title>{name}</title>
      <clipPath id={`flag-${code}`}><rect width="30" height="20" rx="3" /></clipPath>
      <g clipPath={`url(#flag-${code})`}>{flags[code]}</g>
      <rect x="0.4" y="0.4" width="29.2" height="19.2" rx="2.7" fill="none" stroke="#241a2b" strokeOpacity="0.18" strokeWidth="0.8" />
    </svg>
  );
}
