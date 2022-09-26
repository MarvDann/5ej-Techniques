import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import { requireUserId } from "~/session.server"

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)

  invariant(params.techniqueId, "techniqueId not found")

  return json({ name: "North South Arm Bar" })
}

export default function TechniqueDetailPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="gap 2 flex flex-row p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-navy-600 text-xl">North South Arm Bar</h1>
        <figure className="flex flex-col content-center border border-gray-200">
          <img src="/images/fernao.png" alt={data.name} />
          <caption>Fernao (the beast) Teixeira</caption>
        </figure>
      </div>
      <div className="p-6">
        <h2>Details</h2>
        <ul className="m-4 list-disc text-sm text-gray-500">
          <li>Start from side control</li>
          <li>Clear nearside arm</li>
          <li>Unwind crossface arm and place elbow on jaw</li>
          <li>Switch knees so that hip is close to head</li>
          <li>Pushing down on the jaw, step over head and lift far side arm</li>
          <li>Kneel straight down close feet together and sit back on head</li>
          <li>
            Gable grip hands and rock the baby so hand position is other side of
            the arm
          </li>
          <li>Take kimura grip on forearm</li>
          <li>
            Keep tricep on your chest and disconnect their shoulder socket
          </li>
          <li>Look towards where their back is facing and finish the kimura</li>
        </ul>
      </div>
    </div>
  )
}
