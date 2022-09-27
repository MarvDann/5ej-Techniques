import { PrismaClient } from '@prisma/client'
import type { Category } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { PostCategory } from '~/types'
import { initialCategories } from './fixtures'

const prisma = new PrismaClient()

async function seed() {
  const email = 'marvdann76@remix.run'

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = await bcrypt.hash('racheliscool', 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  })

  await prisma.note.create({
    data: {
      title: 'My first note',
      body: 'Hello, world!',
      userId: user.id,
    },
  })

  await prisma.note.create({
    data: {
      title: 'My second note',
      body: 'Hello, world!',
      userId: user.id,
    },
  })

  const categories = await Promise.all(
    initialCategories.map((category: PostCategory) =>
      prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          categoryImage: category.categoryImage,
          createdByUserId: user.id,
          updatedByUserId: user.id,
        },
      })
    )
  )

  const sideControl = categories.find(
    (cat: Category) => cat.slug === 'side-control'
  )

  await prisma.technique.create({
    data: {
      name: 'North South Arm Bar',
      slug: 'north-south-arm-bar',
      details:
        '<ul class="m-4 list-disc text-sm text-gray-500"><li>Start from side control</li><li>Clear nearside arm</li><li>Unwind crossface arm and place elbow on jaw</li><li>Switch knees so that hip is close to head</li><li>Pushing down on the jaw, step over head and lift far side arm</li><li>Kneel straight down close feet together and sit back on head</li><li>Gable grip hands and rock the baby so hand position is other side of the arm</li><li>Take kimura grip on forearm</li><li>Keep tricep on your chest and disconnect their shoulder socket</li><li>Look towards where their back is facing and finish the kimura</li></ul>',
      techniqueImage: 'fernao.png',
      categoryId: sideControl!.id,
      createdByUserId: user.id,
      updatedByUserId: user.id,
      isBlueBelt: true,
    },
  })

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
