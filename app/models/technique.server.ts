import { prisma } from '~/db.server'
import type { PostTechnique } from '~/types'

export function getTechnique(slug: string) {
  return prisma.technique.findFirst({
    where: { slug },
    select: {
      id: true,
      name: true,
      techniqueImage: true,
      details: true,
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  })
}

export function createTechnique({
  name,
  categoryId,
  slug,
  details,
  userId,
  techniqueImage,
  youtubeVideoId,
  isBlueBelt,
}: PostTechnique) {
  return prisma.technique.create({
    data: {
      name,
      slug,
      details,
      techniqueImage,
      youtubeVideoId,
      category: {
        connect: {
          id: categoryId,
        },
      },
      isBlueBelt,
      createdBy: {
        connect: {
          id: userId,
        },
      },
      updatedBy: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export function deleteTechnique(id: string) {
  return prisma.technique.deleteMany({
    where: { id },
  })
}
