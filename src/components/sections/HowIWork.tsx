import type { SiteContent } from '@/content/schema'
import { SectionHeading } from '../ui/SectionHeading'
import { BuildLoop } from './BuildLoop'
import { StepDrawing } from './StepDrawing'
import { StepsDraw } from './StepsDraw'

type Props = { content: SiteContent }

/**
 * How I work (design/STORYBOARD.md §4): the six steps as a grid of numbered cards (the number
 * in mono, a small hairline drawing, the step), then the closing line in an accent-bordered
 * callout beside the loop of the work: I choose, the AI builds, it is ready. The drawings are
 * complete in the markup; StepsDraw traces them once as they arrive. Quick view keeps the
 * numbered list and the line.
 */
export function HowIWork({ content }: Props) {
  const { sections, workflow } = content

  return (
    <section id="how-i-work" data-section aria-labelledby="how-i-work-title">
      <SectionHeading id="how-i-work-title" title={sections.howIWork.title} index={3} total={4} />
      <div className="page-grid gap-y-6 pb-[clamp(5rem,10vw,9rem)] quick:pb-8">
        <StepsDraw>
          <ol className="steps">
            {workflow.steps.map((step, i) => (
              <li key={step} className="step card">
                <p className="step-caption">
                  <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                  <span className="step-name">{step}</span>
                </p>
                <StepDrawing index={i} />
              </li>
            ))}
          </ol>
        </StepsDraw>
        <div className="callout callout-split col-span-12">
          <p className="callout-text closing">{workflow.closing}</p>
          <div className="quick:hidden">
            <BuildLoop labels={workflow.loop} />
          </div>
        </div>
      </div>
    </section>
  )
}
