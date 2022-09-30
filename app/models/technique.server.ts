import { prisma } from '~/db.server'
import type { PostTechnique, PutTechnique } from '~/types'

export function getTechnique(slug: string) {
  return prisma.technique.findFirst({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      techniqueImage: true,
      details: true,
      category: {
        select: {
          slug: true,
          name: true,
          id: true,
        },
      },
      youtubeVideoId: true,
      isBlueBelt: true,
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

export function updateTechnique({
  name,
  categoryId,
  slug,
  details,
  userId,
  techniqueImage,
  youtubeVideoId,
  isBlueBelt,
  id,
}: PutTechnique) {
  return prisma.technique.update({
    where: { id },
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
