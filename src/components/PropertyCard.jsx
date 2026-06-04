import { useNavigate } from "react-router-dom"
import { useState } from "react"

import {
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore"

import { auth, db } from "../firebase"

function PropertyCard({ property }) {

  const [liked, setLiked] = useState(false)

  const navigate = useNavigate()

  // Favorite Function
  const toggleLike = async (e) => {

    e.preventDefault()
    e.stopPropagation()

    const user = auth.currentUser

    if (!user) {

      alert("Please login first")
      navigate("/login")
      return

    }

    const favoriteId =
      `${user.uid}_${property.id}`

    try {

      if (liked) {

        await deleteDoc(
          doc(db, "favorites", favoriteId)
        )

        setLiked(false)

      } else {

        await setDoc(
          doc(db, "favorites", favoriteId),
          {
            userId: user.uid,
            propertyId: property.id,
            propertyTitle: property.title,
            propertyImage: property.image,
            propertyPrice: property.price
          }
        )

        setLiked(true)

      }

    } catch (error) {

      alert(error.message)

    }

  }

  // Request OTP
  const requestOTP = (e) => {

    e.preventDefault()
    e.stopPropagation()

    const user = auth.currentUser

    if (!user) {

      alert("Please login first")
      navigate("/login")
      return

    }

    navigate(`/request-otp/${property.id}`)

  }

  return (

    <div
      onClick={() => navigate(`/property/${property.id}`)}
      className="bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition duration-300"
    >

      {/* Image */}
      <div className="relative">

        <img
          src={property.image}
          alt={property.title}
          className="w-full h-64 object-cover"
        />

        {/* Favorite */}
        <button
          onClick={toggleLike}
          className="absolute top-4 right-4 bg-black/70 w-14 h-14 rounded-full flex items-center justify-center text-3xl"
        >
          {liked ? "❤️" : "🤍"}
        </button>

      </div>

      {/* Content */}
      <div className="p-5">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold text-white">
            {property.title}
          </h2>

          <span className="bg-green-500 text-black text-xs px-3 py-1 rounded-full font-semibold">
            Verified
          </span>

        </div>

        <p className="text-green-400 text-xl font-bold mt-3">
          TZS {property.price}
        </p>

        <div className="mt-3 inline-block bg-zinc-800 px-4 py-2 rounded-2xl text-sm text-white">
          {property.category}
        </div>

        <div className="mt-5 text-zinc-400 space-y-1">

          <p>📍 {property.region}</p>
          <p>🏙 {property.district}</p>
          <p>🛣 {property.street}</p>

        </div>

        <div className="flex gap-4 mt-5 text-sm flex-wrap text-white">

          <div className="bg-zinc-800 px-3 py-2 rounded-xl">
            🛏 {property.bedrooms || 0} Beds
          </div>

          <div className="bg-zinc-800 px-3 py-2 rounded-xl">
            🚿 {property.bathrooms || 0} Baths
          </div>

          <div className="bg-zinc-800 px-3 py-2 rounded-xl">
            📐 {property.size || "N/A"}
          </div>

        </div>

        {/* OTP Button */}
        <button
          onClick={requestOTP}
          className="w-full bg-white text-black py-4 rounded-2xl mt-6 font-bold hover:bg-zinc-300 transition"
        >
          Request & Get OTP
        </button>

      </div>

    </div>

  )

}

export default PropertyCard