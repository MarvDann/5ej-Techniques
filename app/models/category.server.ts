import { prisma } from '~/db.server'
import type { PostCategory } from '~/types'

export function getCategory(slug: string) {
  return prisma.category.findFirst({
    where: { slug },
    select: {
      name: true,
      slug: true,
      categoryImage: true,
      techniques: {
        select: {
          name: true,
          slug: true,
          techniqueImage: true,
        },
      },
    },
  })
}

export function getCategories() {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      categoryImage: true,
    },
  })
}

export function createCategory({
  name,
  slug,
  categoryImage,
  userId,
}: PostCategory) {
  return prisma.category.create({
    data: {
      name,
      slug,
      categoryImage: categoryImage || '',
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
