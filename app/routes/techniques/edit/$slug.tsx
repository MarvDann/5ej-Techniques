import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'
import type { ActionArgs, LoaderArgs, NodeOnDiskFile } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { getCategories } from '~/models/category.server'
import type { PutTechnique } from '~/types'
import { getTechnique, updateTechnique } from '~/models/technique.server'
import { requireUserId } from '~/session.server'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import QuillEditor from '~/components/QuillEditor.client'
import stylesUrl from 'react-quill/dist/quill.snow.css'
import type { LinksFunction } from '@remix-run/node'
import invariant from 'tiny-invariant'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ]
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request)

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      directory: 'public/uploads',
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  )

  const formData = await unstable_parseMultipartFormData(request, uploadHandler)

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const details = (formData.get('details') as string) || undefined
  const uploadedImage = formData.get('techniqueImage') as
    | NodeOnDiskFile
    | undefined
  const existingImage = (formData.get('existingImage') as string) || undefined
  const techniqueImage = uploadedImage?.name
    ? uploadedImage.name
    : existingImage
  const youtubeVideoId = (formData.get('youtubeVideoId') as string) || undefined
  const isBlueBelt = !!formData.get('isBlueBelt')
  const categoryId = formData.get('categoryId') as string
  const id = formData.get('id') as string

  if (typeof name !== 'string' || name.length === 0) {
    return json(
      { errors: { name: 'Name is required', slug: null, categoryId: null } },
      { status: 400 }
    )
  }

  if (typeof slug !== 'string' || slug.length === 0) {
    return json(
      { errors: { name: null, slug: 'Page id is required', categoryId: null } },
      { status: 400 }
    )
  }

  if (typeof categoryId !== 'string' || categoryId.length === 0) {
    return json(
      {
        errors: { name: null, slug: null, categoryId: 'Category is required' },
      },
      { status: 400 }
    )
  }

  const payload: PutTechnique = {
    name,
    slug,
    details,
    techniqueImage,
    youtubeVideoId,
    isBlueBelt,
    categoryId,
    userId,
    id,
  }

  const technique = await updateTechnique(payload)

  return redirect(`/techniques/${technique.slug}`)
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, 'slug not found')

  const userId = await requireUserId(request)

  const categories = await getCategories()

  const technique = await getTechnique(params.slug)

  if (!technique) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ categories, technique, userId })
}

function categoryMapper(category: any) {
  return (
    <option
      key={category.slug}
      value={category.id}
    >
      {category.name}
    </option>
  )
}

export default function EditTechniquePage() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const nameRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)
  const [details, setDetails] = useState<string | null>(data.technique.details)
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    data.technique.category.id
  )
  const [name, setName] = useState(data.technique.name)
  const [slug, setSlug] = useState(data.technique.slug)

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus()
    } else if (actionData?.errors?.slug) {
      slugRef.current?.focus()
    } else if (actionData?.errors?.categoryId) {
      categoryRef.current?.focus()
    }
  }, [actionData])

  const handleEditorChange = (value: string) => {
    setDetails(value)
  }

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(event.target.value)
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value

    setName(newName)

    setSlug(newName.toLowerCase().replace(/\s+/g, '-'))
  }

  return (
    <div className="flex w-3/4 flex-col gap-6 p-6">
      <h1 className="border-b border-gray-300 pb-2 text-2xl">Edit technique</h1>
      <Form
        method="post"
        className="flex flex-col gap-6"
        encType="multipart/form-data"
      >
        <div>
          <label className="flex flex-col gap-1">
            <span>Technique name: </span>
            <input
              ref={nameRef}
              name="name"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              required
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-errormessage={
                actionData?.errors?.name ? 'name-error' : undefined
              }
              value={name}
              onChange={handleNameChange}
            />
          </label>
          {actionData?.errors?.name && (
            <div
              className="pt-1 text-red-700"
              id="name-error"
            >
              {actionData.errors.name}
            </div>
          )}
        </div>
        <div>
          <label className="flex flex-col gap-2 align-middle">
            <span>Category: </span>
            <select
              required
              className="flex-1 rounded-md border-2 border-blue-500 px-3 py-1.5 text-lg leading-loose"
              name="categoryId"
              ref={categoryRef}
              onChange={handleCategoryChange}
              value={selectedCategoryId}
            >
              <option value="">Select Category</option>
              {data.categories!.map(categoryMapper)}
            </select>
          </label>
          {actionData?.errors?.categoryId && (
            <div
              className="pt-1 text-red-700"
              id="category-error"
            >
              {actionData.errors.categoryId}
            </div>
          )}
        </div>
        <div key="slug">
          <label className="flex flex-col gap-1">
            <span>Page url branch: </span>
            <input
              ref={slugRef}
              name="slug"
              required
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.slug ? true : undefined}
              aria-errormessage={
                actionData?.errors?.slug ? 'title-error' : undefined
              }
              value={slug}
            />
          </label>
          {actionData?.errors?.slug && (
            <div
              className="pt-1 text-red-700"
              id="slug-error"
            >
              {actionData.errors.slug}
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-col gap-1 pb-4">
            <label htmlFor="details">
              <span>Details: </span>
            </label>
            <QuillEditor
              onChange={handleEditorChange}
              value={details || ''}
            />
            <input
              type="hidden"
              value={details || ''}
              name="details"
            />
          </div>
          {/* {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )} */}
        </div>
        <div>
          <label className="flex flex-col gap-1">
            <span>Image filename: </span>
            <input
              name="techniqueImage"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              type="file"
              // aria-invalid={actionData?.errors?.title ? true : undefined}
              // aria-errormessage={
              //   actionData?.errors?.title ? "title-error" : undefined
              // }
            />
            {data.technique.techniqueImage ? (
              <img
                src={`/uploads/${data.technique.techniqueImage}`}
                alt={data.technique.name}
              />
            ) : null}
          </label>
          {/* {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )} */}
        </div>
        <div>
          <label className="flex flex-col gap-1">
            <span>Youtube video ID: </span>
            <input
              // ref={titleRef}
              name="youtubeVideoId"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              // aria-invalid={actionData?.errors?.title ? true : undefined}
              // aria-errormessage={
              //   actionData?.errors?.title ? "title-error" : undefined
              // }
              defaultValue={data.technique.youtubeVideoId || ''}
            />
          </label>
          {/* {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )} */}
        </div>
        <div>
          <label className="flex flex-row gap-2 align-middle">
            <span>Is on blue belt test?</span>
            <input
              type="checkbox"
              name="isBlueBelt"
              value="yes"
              defaultChecked={data.technique.isBlueBelt}
            />
          </label>
        </div>
        <div className="text-right">
          <input
            type="hidden"
            name="existingImage"
            value={data.technique.techniqueImage || ''}
          />
          <input
            type="hidden"
            name="id"
            value={data.technique.id}
          />
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
    </div>
  )
}
