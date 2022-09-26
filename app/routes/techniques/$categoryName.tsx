import { useParams } from "@remix-run/react"
import TechniqueListing from "~/components/TechniqueListing"

export default function CategoryPage() {
  let { categoryName } = useParams()
  return (
    <div className="flex flex-col gap-2 p-6">
      <h1 className="text-2xl font-semibold">{categoryName}</h1>
      <div className="grid grid-cols-3 gap-6">
        <TechniqueListing name="Hip escape" id="1" />
        <TechniqueListing name="Forward hip escape" id="2" />
        <TechniqueListing name="Back break fall to stand up in base" id="3" />
        <TechniqueListing name="Side break fall" id="4" />
        <TechniqueListing name="Bridge and Roll" id="5" />
        <TechniqueListing name="Forward shoulder roll" id="6" />
      </div>
    </div>
  )
}
