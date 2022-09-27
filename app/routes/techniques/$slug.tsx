import { useLoaderData } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getTechnique } from '~/models/technique.server'

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, 'slug not found')

  const technique = await getTechnique(params.slug)

  if (!technique) {
    return new Response('Not Found', { status: 404 })
  }

  return json({ technique })
}

export default function TechniqueDetailPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="gap 2 flex flex-row p-6">
      <div className="flex w-6/12 flex-col gap-2">
        <h1 className="text-navy-600 text-xl">{data.technique.name}</h1>
        <figure className="flex flex-col content-center border border-gray-200">
          <img
            src={`/images/${data.technique.techniqueImage}`}
            alt={data.name}
          />
          <figcaption className="py-1 text-center">
            {data.technique.name}
          </figcaption>
        </figure>
      </div>
      <div className="p-6">
        <h2>Details</h2>
        <div dangerouslySetInnerHTML={{ __html: data.technique.details }}></div>
      </div>
    </div>
  )
}
