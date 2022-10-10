import { prisma } from '~/db.server'
import type { PostCategory, PutCategory } from '~/types'

export function getCategory(slug: string) {
  return prisma.category.findFirst({
    where: { slug },
    select: {
      id: true,
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

export function updateCategory({
  id,
  name,
  slug,
  categoryImage,
  userId,
}: PutCategory) {
  return prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      categoryImage: categoryImage || '',
      updatedBy: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findFirst({
    where: { id },
    select: {
      id: true,
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

  if (category?.techniques.length) {
    throw new Error(
      `There are ${category.techniques.length} techniques in this category.`
    )
  }

  return prisma.category.deleteMany({
    where: { id },
  })
}
