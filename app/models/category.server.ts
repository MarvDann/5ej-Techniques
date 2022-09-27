import { prisma } from '~/db.server'

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
