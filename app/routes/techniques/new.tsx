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
import type { PostTechnique } from '~/types'
import { createTechnique } from '~/models/technique.server'
import { requireUserId } from '~/session.server'
import { useEffect, useRef } from 'react'

interface Cat {
  id: string
  name: string
  slug: string
  categoryImage: string
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request)

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  )

  const formData = await unstable_parseMultipartFormData(request, uploadHandler)

  console.log({ formData })

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const details = (formData.get('details') as string) || undefined
  const uploadedImage = formData.get('techniqueImage') as
    | NodeOnDiskFile
    | undefined
  const techniqueImage = uploadedImage ? uploadedImage?.name : undefined
  const youtubeVideoId = (formData.get('youtubeVideoId') as string) || undefined
  const isBlueBelt = !!formData.get('isBlueBelt')
  const categoryId = formData.get('categoryId') as string

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

  const payload: PostTechnique = {
    name,
    slug,
    details,
    techniqueImage,
    youtubeVideoId,
    isBlueBelt,
    categoryId,
    userId,
  }

  const technique = await createTechnique(payload)

  return redirect(`/techniques/${technique.slug}`)
}

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request)

  const categories = await getCategories()

  return json({ categories })
}

function categoryMapper(category: Cat) {
  return (
    <option
      key={category.slug}
      value={category.id}
    >
      {category.name}
    </option>
  )
}

export default function AddNewTechniquePage() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const nameRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus()
    } else if (actionData?.errors?.slug) {
      slugRef.current?.focus()
    } else if (actionData?.errors?.categoryId) {
      categoryRef.current?.focus()
    }
  }, [actionData])

  return (
    <div className="flex w-3/4 flex-col gap-6 p-6">
      <h1 className="border-b border-gray-300 pb-2 text-2xl">
        Add new technique
      </h1>
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
            <span>Details: </span>
            <textarea
              // ref={bodyRef}
              name="details"
              rows={8}
              className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
              // aria-invalid={actionData?.errors?.body ? true : undefined}
              // aria-errormessage={
              //   actionData?.errors?.body ? 'body-error' : undefined
              // }
            />
          </label>
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
            />
          </label>
        </div>
        <div className="text-right">
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
