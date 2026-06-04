'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface GalleryImage {
  id: string
  image_url: string
  caption: string | null
  sort_order: number
}

interface ImageGalleryProps {
  images: GalleryImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length)
  }, [sortedImages.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
  }, [sortedImages.length])

  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxOpen, closeLightbox, goNext, goPrev])

  if (sortedImages.length === 0) return null

  return (
    <>
      {/* Masonry-like Grid */}
      <div className="columns-2 lg:columns-3 gap-4 space-y-4">
        {sortedImages.map((img, index) => (
          <div
            key={img.id}
            className={cn(
              'break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl',
              'transition-transform duration-300 hover:scale-[1.02]'
            )}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={img.image_url}
              alt={img.caption || `Gallery image ${index + 1}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-xl"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Hover overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-navy/0 group-hover:bg-navy/40',
                'transition-all duration-300 rounded-xl',
                'flex items-end justify-center pb-4'
              )}
            >
              {img.caption && (
                <span
                  className={cn(
                    'text-white text-sm font-medium px-3 py-1.5 rounded-full',
                    'bg-navy/70 backdrop-blur-sm',
                    'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0',
                    'transition-all duration-300'
                  )}
                >
                  {img.caption}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            'bg-black/90 backdrop-blur-sm',
            'animate-in fade-in duration-300'
          )}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className={cn(
              'absolute top-4 right-4 z-50 p-2 rounded-full',
              'bg-white/10 hover:bg-white/20 text-white',
              'transition-colors duration-200'
            )}
            aria-label="Close lightbox"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {sortedImages.length}
          </div>

          {/* Previous Button */}
          {sortedImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full',
                'bg-white/10 hover:bg-white/20 text-white',
                'transition-colors duration-200'
              )}
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {sortedImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full',
                'bg-white/10 hover:bg-white/20 text-white',
                'transition-colors duration-200'
              )}
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main Image */}
          <div
            className={cn(
              'relative max-w-[90vw] max-h-[80vh]',
              'animate-in zoom-in-95 fade-in duration-300'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sortedImages[currentIndex].image_url}
              alt={sortedImages[currentIndex].caption || `Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              sizes="90vw"
              priority
            />
          </div>

          {/* Caption */}
          {sortedImages[currentIndex].caption && (
            <div
              className={cn(
                'absolute bottom-6 left-1/2 -translate-x-1/2',
                'text-white text-base font-medium px-5 py-2.5 rounded-full',
                'bg-black/60 backdrop-blur-sm max-w-[80vw] text-center',
                'animate-in slide-in-from-bottom-4 fade-in duration-300'
              )}
            >
              {sortedImages[currentIndex].caption}
            </div>
          )}
        </div>
      )}
    </>
  )
}
