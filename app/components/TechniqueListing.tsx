import { Link } from '@remix-run/react'

interface Props {
  name: string
  slug: string
}

export default function TechniqueListing({ name, slug }: Props) {
  return (
    <Link to={`/techniques/${slug}`}>
      <figure className="flex flex-col content-center border border-gray-200">
        <img
          src="/images/jitz.jpg"
          alt="Jiu Jitsu"
          className="w-full"
        />
        <caption>{name}</caption>
      </figure>
    </Link>
  )
}
