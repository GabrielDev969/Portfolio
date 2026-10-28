import type { SiteContent } from '@/content/schema'
import { ChapterCard } from '../cinema/ChapterCard'
import { StoryboardDraw } from './StoryboardDraw'
import { StoryboardPanel } from './StoryboardPanel'

type Props = { content: SiteContent }

/**
 * Act III · How I work (design/STORYBOARD.md §7): the workflow as a storyboard sheet, six
 * panels in order, each a line drawing with a pencilled caption, then the one line that sums
 * it up. The drawings are complete in the markup; StoryboardDraw pencils them in as the sheet
 * scrolls past. Quick view keeps the numbered list and the closing line.
 */
export function HowIWork({ content }: Props) {
  const { chapters, workflow } = content

  return (
    <section
      id="how-i-work"
      data-section
      data-act={chapters.howIWork.act}
      data-act-title={chapters.howIWork.title}
      aria-labelledby="how-i-work-title"
    >
      <ChapterCard id="how-i-work-title" {...chapters.howIWork} />
      <div className="page-grid pb-[clamp(6rem,12vw,12rem)] quick:pb-8">
        <StoryboardDraw>
          <ol className="board">
            {workflow.steps.map((step, i) => (
              <li key={step} className="board-panel">
                <StoryboardPanel index={i} />
                <p className="board-caption">
                  <span className="board-number">{i + 1}</span>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </StoryboardDraw>
        <p className="col-span-12 mt-[clamp(3rem,7vw,6rem)] font-text text-scene text-balance italic md:col-span-10 md:col-start-2 quick:col-start-1 quick:mt-6 quick:text-body quick:font-semibold quick:not-italic">
          {workflow.closing}
        </p>
      </div>
    </section>
  )
}
