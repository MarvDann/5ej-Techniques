import { useLoaderData } from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { deleteTechnique, getTechnique } from '~/models/technique.server'
import { getUserId, requireUserId } from '~/session.server'
import editorStylesUrl from './editorStyles.css'
import type { LinksFunction } from '@remix-run/node'
import TechniqueTop from '~/components/TechniqueTop'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: editorStylesUrl,
    },
  ]
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, 'slug not found')

  const userId = await getUserId(request)

  const technique = await getTechnique(params.slug)

  if (!technique) {
    return new Response('Not Found', { status: 404 })
  }

  return json({ technique, userId })
}

export async function action({ request }: ActionArgs) {
  await requireUserId(request)

  const formData = await request.formData()

  const id = formData.get('id') as string

  await deleteTechnique(id)

  return redirect('/')
}

export default function TechniqueDetailPage() {
  const data = useLoaderData<typeof loader>()

  const imageUrl = data.technique.techniqueImage
    ? '/uploads/' + data.technique.techniqueImage
    : 'https://placeholder.pics/svg/480x270/D5D5D5-F8F8F8/717171-858585/No%20image%20yet'

  return (
    <div className="flex flex-col">
      <TechniqueTop
        technique={data.technique}
        category={data.technique.category}
        userId={data.userId}
      />
      <div className="gap 2 flex flex-row p-6">
        <div className="flex w-6/12 flex-col gap-2">
          <figure className="flex flex-col content-center border border-gray-200">
            <img
              src={imageUrl}
              alt={data.name}
            />
            <figcaption className="py-1 text-center text-sm">
              {data.technique.name}
            </figcaption>
          </figure>
        </div>
        <div className="flex flex-col gap-2 p-6">
          <h2>Details</h2>
          <div
            className="rich-text flex-grow"
            dangerouslySetInnerHTML={{ __html: data.technique.details }}
          ></div>
        </div>
      </div>
      {data.technique.youtubeVideoId && (
        <div className="p-6">
          <iframe
            className="h-screen w-full"
            src={`https://www.youtube-nocookie.com/embed/${data.technique.youtubeVideoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )
}
