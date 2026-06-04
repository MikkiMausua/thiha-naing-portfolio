'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/constants'

export default function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const phone = '09-957369881'
  const contactEmail = 'thihanaingg6@gmail.com'

  const handleSend = () => {
    const subject = encodeURIComponent(`Message from ${name || 'Portfolio Visitor'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )
    window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`, '_self')
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40',
          'w-14 h-14 rounded-full bg-navy text-white',
          'flex items-center justify-center',
          'shadow-lg hover:shadow-xl',
          'transition-all duration-300 hover:scale-110',
          !isOpen && 'animate-pulse'
        )}
        aria-label="Open contact form"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
            'animate-in fade-in duration-200'
          )}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Modal */}
      <div
        className={cn(
          'fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6',
          'w-full sm:w-[400px] max-h-[90vh]',
          'bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl',
          'overflow-hidden overflow-y-auto',
          'transition-all duration-300 ease-out',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-light bg-bg">
          <h3 className="text-lg font-bold text-navy">Get in Touch</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-light transition-colors text-charcoal"
            aria-label="Close contact form"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Contact Info */}
          <div className="space-y-3">
            <a
              href={`tel:${phone.replace(/-/g, '')}`}
              className="flex items-center gap-3 text-charcoal hover:text-blue transition-colors group"
            >
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium">{phone}</span>
            </a>

            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-3 text-charcoal hover:text-blue transition-colors group"
            >
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center group-hover:bg-blue/20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium">{contactEmail}</span>
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-light" />

          {/* Form */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border border-gray-light',
                'text-sm text-navy placeholder:text-gray',
                'focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue',
                'bg-bg transition-all duration-200'
              )}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border border-gray-light',
                'text-sm text-navy placeholder:text-gray',
                'focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue',
                'bg-bg transition-all duration-200'
              )}
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border border-gray-light',
                'text-sm text-navy placeholder:text-gray',
                'focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue',
                'bg-bg transition-all duration-200 resize-none'
              )}
            />
            <button
              onClick={handleSend}
              className={cn(
                'w-full py-2.5 rounded-lg font-semibold text-sm',
                'bg-navy text-white',
                'hover:bg-charcoal transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue/50 focus:ring-offset-2'
              )}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
