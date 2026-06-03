'use client'

import { siteConfig } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-navy">
        <div className="absolute inset-0 animate-gradient-shift bg-[length:400%_400%] bg-gradient-to-br from-navy via-blue to-indigo-900" />
      </div>

      {/* Floating Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-blue/30 to-indigo-500/20 blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-indigo-400/25 to-blue/15 blur-3xl opacity-15 animate-float-delayed" />
      <div className="absolute top-1/2 right-1/3 w-56 h-56 rounded-full bg-gradient-to-r from-white/10 to-blue/10 blur-3xl opacity-20 animate-float-slow" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Small Decorator */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/70 font-medium">Available for new projects</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          {siteConfig.name}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 font-medium mb-4">
          {siteConfig.title}
        </p>

        {/* Tagline */}
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          {siteConfig.description.split('.')[0] + '.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#showcase"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-navy font-semibold text-base transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5"
          >
            View My Work
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white/30 text-white font-semibold text-base transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(15px) translateX(-15px);
          }
          66% {
            transform: translateY(-25px) translateX(5px);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(15px);
          }
        }
        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
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
