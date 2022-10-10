import { Form, useActionData } from '@remix-run/react'
import type { LoaderArgs, ActionArgs, NodeOnDiskFile } from '@remix-run/node'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'
import { requireUserId } from '~/session.server'
import type { PostCategory } from '~/types'
import { createCategory } from '~/models/category.server'

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

  const categoryImage = uploadedImage ? uploadedImage?.name : undefined

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

  const payload: PostCategory = {
    name,
    slug,
    userId,
    categoryImage,
  }

  const category = await createCategory(payload)

  return redirect('/categories/' + category.slug)
}

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request)

  return null
}

export default function AddCategoryPage() {
  const actionData = useActionData<typeof action>()
  const nameRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

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
      <h1 className="border-b border-gray-300 pb-2 text-2xl">
        Add new Category
      </h1>
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
          </label>
          {/* {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )} */}
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
