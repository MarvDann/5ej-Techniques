import { Link } from "@remix-run/react"

interface Props {
  name: string
  id: string
}

export default function TechniqueListing({ name, id }: Props) {
  return (
    <Link to={`/techniques/${id}/detail`}>
      <figure className="flex flex-col content-center border border-gray-200">
        <img src="/images/jitz.jpg" alt="Jiu Jitsu" className="w-full" />
        <caption>{name}</caption>
      </figure>
    </Link>
  )
}
