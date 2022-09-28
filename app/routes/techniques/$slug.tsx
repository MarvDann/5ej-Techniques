import { Form, useLoaderData } from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { deleteTechnique, getTechnique } from '~/models/technique.server'
import { getUserId } from '~/session.server'

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
  const formData = await request.formData()

  const id = formData.get('id') as string

  console.log({ techniqueId: id })

  await deleteTechnique(id)

  return redirect('/')
}

export default function TechniqueDetailPage() {
  const data = useLoaderData<typeof loader>()

  const imageUrl = data.technique.techniqueImage
    ? '/uploads/' + data.technique.techniqueImage
    : 'https://placeholder.pics/svg/480x270/D5D5D5-F8F8F8/717171-858585/No%20image%20yet'

  return (
    <>
      <div className="gap 2 flex flex-row p-6">
        <div className="flex w-6/12 flex-col gap-2">
          <h1 className="text-navy-600 text-xl">{data.technique.name}</h1>
          <figure className="flex flex-col content-center border border-gray-200">
            <img
              src={imageUrl}
              alt={data.name}
            />
            <figcaption className="py-1 text-center">
              {data.technique.name}
            </figcaption>
          </figure>
        </div>
        <div className="flex flex-col gap-2 p-6">
          <h2>Details</h2>
          <div
            className="flex-grow"
            dangerouslySetInnerHTML={{ __html: data.technique.details }}
          ></div>
          <div>
            {data.userId && (
              <Form method="post">
                <input
                  type="hidden"
                  name="id"
                  value={data.technique.id}
                />
                <button
                  type="submit"
                  className="rounded-md bg-red-700 px-3 py-1 text-sm font-semibold text-white"
                >
                  Delete technique
                </button>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
