import type { Skill } from '@/types'

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.skill_category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return (
    <section id="skills" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Skills &amp; Expertise</h2>
          <div className="w-[60px] h-[3px] bg-gradient-to-r from-accent to-blue mx-auto" />
        </div>

        {/* Skills by Category */}
        <div className="space-y-10 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div key={category}>
              <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
                {category}
              </p>
              <div className="flex flex-wrap gap-3">
                {grouped[category]
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-white/80 transition-all duration-300 hover:bg-accent/10 hover:border-accent/30 hover:text-white cursor-default"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
