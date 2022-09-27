import { Link } from '@remix-run/react'

interface Props {
  name: string
  slug: string
  imgUrl: string
}

export default function CategoryListing({ name, slug, imgUrl }: Props) {
  return (
    <Link to={`/categories/${slug}`}>
      <figure className="flex flex-col content-center border border-gray-200">
        <img
          src={`/images/${imgUrl}`}
          alt={name}
          className="w-full"
        />
        <figcaption className="py-1 text-center">{name}</figcaption>
      </figure>
    </Link>
  )
}
