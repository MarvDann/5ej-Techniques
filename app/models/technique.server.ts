import { prisma } from '~/db.server'

export function getTechnique(slug: string) {
  return prisma.technique.findFirst({
    where: { slug },
    select: {
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
