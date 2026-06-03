import { siteConfig } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href="#"
            className="text-sm text-white/40 transition-colors duration-200 hover:text-white/80"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
