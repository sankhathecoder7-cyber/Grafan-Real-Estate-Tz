import { Link, useNavigate } from "react-router-dom"

import MyProperties from "../components/MyProperties"

import { signOut } from "firebase/auth"

import { auth } from "../firebase"

function Dashboard() {

  const navigate = useNavigate()

  const logoutUser = async () => {

    try {

      await signOut(auth)

      alert("Logged out successfully")

      navigate("/login")

    } catch (error) {

      alert(error.message)

    }

  }

  return (

    <div className="bg-zinc-950 min-h-screen text-white p-4 md:p-6">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl md:text-4xl font-bold">
            Dalali Dashboard
          </h1>

          <p className="text-zinc-400 mt-3">
            Manage properties, videos and reservations
          </p>

        </div>

        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-2xl font-bold w-fit"
        >
          Logout
        </button>

      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* Upload Property */}
        <div className="bg-zinc-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold">
            Upload Property
          </h2>

          <p className="text-zinc-400 mt-2">
            Add new rooms, houses and apartments
          </p>

          <Link to="/add-property">

            <button className="bg-white text-black px-6 py-3 rounded-2xl mt-5 font-bold hover:bg-zinc-300 transition">
              Add Property
            </button>

          </Link>

        </div>

        {/* Videos */}
        <div className="bg-zinc-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold">
            Property Videos
          </h2>

          <p className="text-zinc-400 mt-2">
            Watch uploaded property tours
          </p>

          <Link to="/videos">

            <button className="bg-white text-black px-6 py-3 rounded-2xl mt-5 font-bold hover:bg-zinc-300 transition">
              Open Videos
            </button>

          </Link>

        </div>

        {/* Bookings */}
        <div className="bg-zinc-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold">
            Reservations
          </h2>

          <p className="text-zinc-400 mt-2">
            View OTP requests and bookings
          </p>

          <Link to="/bookings">

            <button className="bg-white text-black px-6 py-3 rounded-2xl mt-5 font-bold hover:bg-zinc-300 transition">
              View Reservations
            </button>

          </Link>

        </div>

        {/* Favorites */}
        <div className="bg-zinc-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold">
            Favorites
          </h2>

          <p className="text-zinc-400 mt-2">
            View saved favorite properties
          </p>

          <Link to="/favorites">

            <button className="bg-white text-black px-6 py-3 rounded-2xl mt-5 font-bold hover:bg-zinc-300 transition">
              Open Favorites
            </button>

          </Link>

        </div>

      </div>

      {/* My Properties */}
      <div className="mt-10">

        <MyProperties />

      </div>

    </div>

  )

}

export default Dashboard