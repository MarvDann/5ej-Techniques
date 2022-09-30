export interface PostCategory {
  name: string
  slug: string
  userId: string
  categoryImage?: string
}

export interface PostTechnique {
  name: string
  slug: string
  details?: string
  userId: string
  techniqueImage?: string
  youtubeVideoId?: string
  isBlueBelt?: boolean
  categoryId: string
}

export interface PutTechnique extends PostTechnique {
  id: string
}
