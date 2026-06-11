import Card from '@/components/ui/Card'
import type { Experience as ExperienceType } from '@/types'

interface ExperienceProps {
  experiences: ExperienceType[]
}

export default function Experience({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience</h2>
          <div className="w-[60px] h-[3px] bg-gradient-to-r from-accent to-blue mx-auto" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-blue/30 to-transparent md:-translate-x-px" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0
              return (
                <div key={exp.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/30 -translate-x-1/2 top-8 z-10" />

                  {/* Card Container */}
                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'
                    }`}
                  >
                    <Card>
                      <div className="flex flex-col gap-1 mb-3">
                        <h3 className="text-lg font-semibold text-white">{exp.job_title}</h3>
                        <p className="text-accent font-medium">{exp.company}</p>
                        <p className="text-sm text-white/40">{exp.period}</p>
                      </div>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="space-y-2">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue/60 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
