type Props = { labels: string[] }

// Code lines the AI types in the second beat, in the same 240 × 150 box as the step drawings.
const code = ['M54 58h36', 'M96 58h28', 'M62 72h58', 'M62 86h34', 'M102 86h22', 'M54 100h30']

/**
 * The loop beside the closing line: I choose a plan, the AI builds it, it is ready. Three beats
 * in the steps' ink-line style, timed by CSS alone (globals.css, "Build loop"), so it costs no
 * JavaScript. Reduced motion and print show the last beat, still; Quick view leaves it out.
 */
export function BuildLoop({ labels }: Props) {
  return (
    <figure className="build-loop">
      <svg aria-hidden="true" viewBox="0 0 240 150">
        <g className="bl-choose">
          <rect className="bl-plan-a" x="34" y="34" width="72" height="72" />
          <path className="bl-plan-a" d="M46 54h48M46 68h30M46 82h40" />
          <rect className="bl-pick" x="134" y="34" width="72" height="72" />
          <path d="M146 54h48M146 68h40M146 82h26" />
          <path className="bl-cursor" d="M0 0v17l4.6-4.2 3.2 7.2 3.2-1.5-3.2-7h6.4z" />
        </g>
        <g className="bl-window">
          <rect x="40" y="24" width="160" height="102" />
          <path d="M40 40h160" />
          <circle cx="50" cy="32" r="2" />
          <circle cx="58" cy="32" r="2" />
          <circle cx="66" cy="32" r="2" />
        </g>
        <g className="bl-code">
          {code.map((d, i) => (
            <path key={d} d={d} pathLength={1} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </g>
        <g className="bl-done">
          <rect x="54" y="52" width="44" height="44" />
          <path d="M110 56h60M110 70h44M110 84h52" />
          <path className="bl-check" d="M160 104l7 7 14-16" pathLength={1} />
        </g>
      </svg>
      <figcaption>
        <ol className="bl-labels">
          {labels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ol>
      </figcaption>
    </figure>
  )
}
