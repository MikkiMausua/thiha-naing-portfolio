'use client'

import { siteConfig } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark Gradient Background */}
      <div className="absolute inset-0 bg-[#0E0E16]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E0E16] via-[#161625] to-[#0F1520]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Decorative Orbs */}
      <div className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full bg-gradient-to-br from-accent/8 to-blue/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-gradient-to-tl from-blue/6 to-accent/4 blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-white/3 to-accent/3 blur-3xl animate-float-slow" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Small Decorator */}
        <div className="opacity-0 animate-fade-in-up inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-white/10 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/60 font-medium tracking-wide">Available for new projects</span>
        </div>

        {/* Main Heading */}
        <h1 className="opacity-0 animate-text-reveal delay-200 text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
          {siteConfig.name}
        </h1>

        {/* Subtitle with gradient */}
        <p className="opacity-0 animate-text-reveal delay-400 text-xl md:text-2xl font-medium mb-4 text-gradient-gold">
          {siteConfig.title}
        </p>

        {/* Tagline */}
        <p className="opacity-0 animate-fade-in-up delay-500 text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          {siteConfig.description.split('.')[0] + '.'}
        </p>

        {/* CTA Buttons */}
        <div className="opacity-0 animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#showcase"
            className="group inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-accent text-[#13131A] font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5"
          >
            View My Work
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-white/15 text-white font-semibold text-base transition-all duration-300 hover:bg-white/5 hover:border-white/30 hover:-translate-y-0.5"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(15px) translateX(-15px); }
          66% { transform: translateY(-25px) translateX(5px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(15px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
