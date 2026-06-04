import {
  FaHome,
  FaMapMarkedAlt,
  FaVideo,
  FaUserCircle
} from "react-icons/fa"

import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 flex justify-around items-center py-4 text-white z-50">

      <Link
        to="/"
        className="flex flex-col items-center text-sm"
      >
        <FaHome size={22} />
        <span className="mt-1">
          Home
        </span>
      </Link>

      <Link
        to="/map"
        className="flex flex-col items-center text-sm"
      >
        <FaMapMarkedAlt size={22} />
        <span className="mt-1">
          Map
        </span>
      </Link>

      <Link
        to="/videos"
        className="flex flex-col items-center text-sm"
      >
        <FaVideo size={22} />
        <span className="mt-1">
          Videos
        </span>
      </Link>

      <Link
        to="/login"
        className="flex flex-col items-center text-sm"
      >
        <FaUserCircle size={22} />
        <span className="mt-1">
          Profile
        </span>
      </Link>

    </div>
  )
}

export default Navbar