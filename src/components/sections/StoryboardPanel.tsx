// The six storyboard drawings, one per workflow step, in a 240 × 150 panel. Every stroke has
// pathLength 1, so the pencil pass can draw any of them with the same dash values.
const drawings: string[][] = [
  // 1 · I plan: a sheet with a checklist
  [
    'M84 22h72v106h-72z',
    'M96 46h8v8h-8z',
    'M112 50h32',
    'M96 70h8v8h-8z',
    'M112 74h26',
    'M96 94h8v8h-8z',
    'M112 98h30',
  ],
  // 2 · I review the plan: the sheet under a magnifying glass
  [
    'M64 26h60v94h-60z',
    'M76 48h36',
    'M76 66h30',
    'M76 84h34',
    'M150 70a24 24 0 1 0 0.1 0',
    'M167 88l26 26',
  ],
  // 3 · The AI implements: a code window filling with lines
  [
    'M50 28h140v94h-140z',
    'M50 44h140',
    'M66 62l-8 8 8 8',
    'M84 78l8-16',
    'M100 62l8 8-8 8',
    'M66 94h52',
    'M66 108h76',
    'M128 94h30',
  ],
  // 4 · I review the diff: two panes, a line removed and a line added
  [
    'M40 30h76v90h-76z',
    'M124 30h76v90h-76z',
    'M52 50h52',
    'M52 66h10',
    'M70 66h34',
    'M52 82h44',
    'M136 50h52',
    'M136 66h10M141 61v10',
    'M154 66h34',
    'M136 82h44',
  ],
  // 5 · I run the tests: three passing checks
  [
    'M70 46l8 8 14-16',
    'M104 48h66',
    'M70 76l8 8 14-16',
    'M104 78h56',
    'M70 106l8 8 14-16',
    'M104 108h62',
  ],
  // 6 · Merge: a feature branch with two commits joins the main line
  [
    'M36 104h168',
    'M64 104c18 0 18-44 40-44h32c22 0 22 44 40 44',
    'M64 104a6 6 0 1 0 0.1 0',
    'M110 60a6 6 0 1 0 0.1 0',
    'M136 60a6 6 0 1 0 0.1 0',
    'M176 104a8 8 0 1 0 0.1 0',
  ],
]

/** One storyboard panel: its frame, then its drawing, as pencil strokes the scene can draw. */
export function StoryboardPanel({ index }: { index: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 150" className="board-drawing">
      <path pathLength={1} d="M2 2h236v146h-236z" className="board-frame" />
      {drawings[index]!.map((d) => (
        <path key={d} pathLength={1} d={d} />
      ))}
    </svg>
  )
}
