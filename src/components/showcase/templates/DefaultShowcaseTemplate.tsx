import React from 'react'
import type { ShowcaseItem, GalleryImage } from '@/types'
import StandardLayout from '../StandardLayout'

interface DefaultShowcaseTemplateProps {
  project: ShowcaseItem
  galleryImages: GalleryImage[]
}

export default function DefaultShowcaseTemplate({ project, galleryImages }: DefaultShowcaseTemplateProps) {
  return <StandardLayout project={project} galleryImages={galleryImages} />
}
