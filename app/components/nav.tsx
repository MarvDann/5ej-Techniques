import { Link } from "@remix-run/react"

export default function Nav() {
  return (
    <div className="h-full w-80 border-r bg-gray-100">
      {/* <Link to="new" className="block p-4 text-xl text-blue-500">
        + New Note
      </Link> */}

      <hr />
      <ul>
        <li>
          <Link
            to="/techniques/mat-drills"
            className="block p-4 text-lg text-slate-500"
          >
            Mat Drills
          </Link>
        </li>
        <li>
          <Link
            to="/techniques/standing-self-defense"
            className="block p-4 text-lg text-slate-500"
          >
            Standing Self Defence
          </Link>
        </li>
        <li>
          <Link
            to="/techniques/mount"
            className="block p-4 text-lg text-slate-500"
          >
            Mount
          </Link>
        </li>
        <li>
          <Link to="/" className="block p-4 text-lg text-slate-500">
            Guard
          </Link>
        </li>
        <li>
          <Link to="/" className="block p-4 text-lg text-slate-500">
            Side Control
          </Link>
        </li>
        <li>
          <Link to="/" className="block p-4 text-xl text-slate-500">
            Back Mount
          </Link>
        </li>
      </ul>
    </div>
  )
}
