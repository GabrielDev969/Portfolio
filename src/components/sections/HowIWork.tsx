import type { SiteContent } from '@/content/schema'
import { SectionHeading } from '../ui/SectionHeading'
import { StepDrawing } from './StepDrawing'
import { StepsDraw } from './StepsDraw'

type Props = { content: SiteContent }

/**
 * How I work (design/STORYBOARD.md §4): the workflow as six numbered steps, each with a small
 * line drawing, then the one line that sums it up. The drawings are complete in the markup;
 * StepsDraw traces them once as they arrive. Quick view keeps the numbered list and the line.
 */
export function HowIWork({ content }: Props) {
  const { sections, workflow } = content

  return (
    <section id="how-i-work" data-section aria-labelledby="how-i-work-title">
      <SectionHeading id="how-i-work-title" title={sections.howIWork.title} />
      <div className="page-grid pb-[clamp(5rem,10vw,9rem)] quick:pb-8">
        <StepsDraw>
          <ol className="steps">
            {workflow.steps.map((step, i) => (
              <li key={step} className="step">
                <StepDrawing index={i} />
                <p className="step-caption">
                  <span className="step-number">{i + 1}</span>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </StepsDraw>
        <p className="col-span-12 mt-[clamp(3rem,7vw,6rem)] font-text text-heading text-balance italic md:col-span-10 quick:mt-6 quick:text-body quick:font-semibold quick:not-italic">
          {workflow.closing}
        </p>
      </div>
    </section>
  )
}
