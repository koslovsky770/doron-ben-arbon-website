/**
 * Decorative marks recreated from the Figma template
 * (section markers, star, spirograph rosette) plus the DORON logo mark.
 * All of them inherit colour via `currentColor` so a single Tailwind
 * text-* class re-tints them.
 */

type SvgProps = React.SVGProps<SVGSVGElement>;

/** The circular-arrow-around-a-house mark from the existing DORON logo. */
export function LogoMark({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role="img"
      aria-label="דורון — תיווך מסחרי"
      {...props}
    >
      {/* open ring */}
      <path
        d="M62.6 18.6A34 34 0 1 0 78.9 32.2"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* arrow head closing the ring, pointing up-right */}
      <path
        d="M71 31 L79.5 24 L86 33.5"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* house */}
      <path
        d="M29 57.5 L50 40 L71 57.5"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.5 55.5 V72 M64.5 55.5 V72"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <rect x="46.5" y="57" width="7" height="6" rx="1.5" fill="currentColor" />
      <rect x="46.5" y="65.5" width="7" height="6" rx="1.5" fill="currentColor" />
    </svg>
  );
}

/** The slanted bar that sits before a section title. */
export function SlashMark({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden {...props}>
      <rect
        x="13"
        y="-1"
        width="13"
        height="42"
        rx="2.5"
        transform="rotate(27 19.5 20)"
        fill="currentColor"
      />
    </svg>
  );
}

/** The six-point asterisk used on centred section titles. */
export function AsteriskMark({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden {...props}>
      <g stroke="currentColor" strokeWidth="5.5" strokeLinecap="round">
        <path d="M20 4 V36" />
        <path d="M6.1 12 L33.9 28" />
        <path d="M6.1 28 L33.9 12" />
      </g>
    </svg>
  );
}

export function StarMark({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden {...props}>
      <path d="M12 1.6l3.1 6.5 7 1-5.1 5 1.2 7.1-6.2-3.4-6.2 3.4 1.2-7.1-5.1-5 7-1z" />
    </svg>
  );
}

export function Stars({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={"flex items-center gap-[2px] " + (className ?? "")} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <StarMark key={i} className="h-[15px] w-[15px] text-[#F5B02E]" />
      ))}
    </div>
  );
}

/**
 * Spirograph rosette — the large ring of overlapping ellipses that the
 * template uses behind the About and CTA blocks.
 */
export function SpiroRing({
  lines = 32,
  className,
  strokeWidth = 0.55,
  ...props
}: SvgProps & { lines?: number; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-hidden {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <ellipse
          key={i}
          cx="200"
          cy="200"
          rx="197"
          ry="119"
          transform={`rotate(${(i * 180) / lines} 200 200)`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      ))}
    </svg>
  );
}

/** Google’s four-colour G, used to attribute the reviews carousel. */
export function GoogleG({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden {...props}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
