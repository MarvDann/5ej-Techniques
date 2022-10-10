import { Form, useActionData, useLoaderData } from '@remix-run/react'
import type { LoaderArgs, ActionArgs, NodeOnDiskFile } from '@remix-run/node'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'
import { requireUserId } from '~/session.server'
import type { PutCategory } from '~/types'
import { getCategory, updateCategory } from '~/models/category.server'
import invariant from 'tiny-invariant'

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
  const name = formData.get('name')
  const slug = formData.get('slug')
  const uploadedImage = formData.get('categoryImage') as
    | NodeOnDiskFile
    | undefined
  const existingImage = (formData.get('existingImage') as string) || undefined
  const categoryImage = uploadedImage?.name ? uploadedImage.name : existingImage

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

  const payload: PutCategory = {
    name,
    slug,
    userId,
    categoryImage,
    id,
  }

  const category = await updateCategory(payload)

  return redirect('/categories/' + category.slug)
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, 'slug not found')

  const userId = await requireUserId(request)

  const category = await getCategory(params.slug)

  if (!category) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ category, userId })
}

export default function EditCategoryPage() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const nameRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(data.category.name)
  const [slug, setSlug] = useState(data.category.slug)

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus()
    } else if (actionData?.errors?.slug) {
      slugRef.current?.focus()
    }
  }, [actionData])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value

    setName(newName)

    setSlug(newName.toLowerCase().replace(/\s+/g, '-'))
  }

  return (
    <div className="flex w-3/4 flex-col gap-6 p-6">
      <h1 className="border-b border-gray-300 pb-2 text-2xl">Edit Category</h1>
      <Form
        method="post"
        className="flex flex-col gap-6"
        encType="multipart/form-data"
      >
        <div>
          <label className="flex flex-col gap-1">
            <span>Category name: </span>
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
          <label className="flex flex-col gap-1">
            <span>Image filename: </span>
            <input
              name="categoryImage"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              type="file"
              // aria-invalid={actionData?.errors?.title ? true : undefined}
              // aria-errormessage={
              //   actionData?.errors?.title ? "title-error" : undefined
              // }
            />
            {data.category.categoryImage ? (
              <img
                src={`/uploads/${data.category.categoryImage}`}
                alt={data.category.name}
              />
            ) : null}
          </label>
          {/* {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )} */}
        </div>
        <div className="text-right">
          <input
            type="hidden"
            name="existingImage"
            value={data.category.categoryImage || ''}
          />
          <input
            type="hidden"
            name="id"
            value={data.category.id}
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
