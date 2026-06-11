import Card from '@/components/ui/Card'
import { siteConfig } from '@/lib/constants'

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <div className="w-[60px] h-[3px] bg-gradient-to-r from-accent to-blue mx-auto mb-6" />
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Have a project in mind? Let&apos;s discuss how I can help grow your brand.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Email Card */}
          <Card hover>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white/40 mb-1">Email Me</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-white font-semibold transition-colors duration-300 hover:text-accent"
              >
                {siteConfig.email}
              </a>
            </div>
          </Card>

          {/* Phone Card */}
          <Card hover>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white/40 mb-1">Call Me</p>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="text-white font-semibold transition-colors duration-300 hover:text-blue"
              >
                {siteConfig.phone}
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
