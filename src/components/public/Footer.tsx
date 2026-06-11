import { siteConfig } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-[#0A0A10]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href="#"
            className="text-sm text-white/30 transition-colors duration-300 hover:text-accent"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
