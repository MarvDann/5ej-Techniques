import { Link } from '@remix-run/react'

interface Props {
  name: string
  slug: string
  imgUrl: string | null
}

export default function CategoryListing({ name, slug, imgUrl }: Props) {
  const imageUrl = imgUrl
    ? `/uploads/${imgUrl}`
    : 'https://placeholder.pics/svg/480x270/D5D5D5-F8F8F8/717171-858585/No%20image%20yet'

  return (
    <Link to={`/categories/${slug}`}>
      <figure className="flex flex-col content-center border border-gray-200">
        <img
          src={imageUrl}
          alt={name}
          className="w-full"
        />
        <figcaption className="py-1 text-center">{name}</figcaption>
      </figure>
    </Link>
  )
}
