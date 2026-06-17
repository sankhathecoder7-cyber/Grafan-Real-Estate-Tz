import { useNavigate } from "react-router-dom"
import { useState } from "react"

import {
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore"

import { motion } from "framer-motion"

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

    <motion.div
      onClick={() => navigate(`/property/${property.id}`)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group glass rounded-3xl overflow-hidden cursor-pointer border border-white/[0.06] hover:border-gold/30 transition-all duration-500"
    >

      {/* Image */}
      <div className="relative overflow-hidden">

        <img
          src={property.image}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-deep-dark/80 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 glass-strong px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-xl">
          {property.category}
        </div>

        {/* Favorite */}
        <motion.button
          onClick={toggleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 glass-strong w-12 h-12 rounded-full flex items-center justify-center text-2xl backdrop-blur-xl"
        >
          {liked ? "❤️" : "🤍"}
        </motion.button>

      </div>

      {/* Content */}
      <div className="p-6">

        <div className="flex items-start justify-between gap-3">

          <h2 className="text-xl font-bold text-white leading-tight">
            {property.title}
          </h2>

          <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 text-[11px] px-3 py-1 rounded-full font-semibold border border-emerald-500/20 shrink-0 mt-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Verified
          </span>

        </div>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent text-2xl font-black">
            TZS {property.price}
          </span>
        </div>

        <div className="mt-5 text-zinc-400 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">📍</span>
            <span>{property.region}{property.district ? `, ${property.district}` : ""}</span>
          </div>
          {property.street && (
            <div className="flex items-center gap-2">
              <span className="text-base">🛣</span>
              <span>{property.street}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5 flex-wrap">
          <div className="glass px-3 py-2 rounded-xl text-xs font-medium text-zinc-300">
            🛏 {property.bedrooms || 0} Beds
          </div>
          <div className="glass px-3 py-2 rounded-xl text-xs font-medium text-zinc-300">
            🚿 {property.bathrooms || 0} Baths
          </div>
          <div className="glass px-3 py-2 rounded-xl text-xs font-medium text-zinc-300">
            📐 {property.size || "N/A"}
          </div>
        </div>

        {/* OTP Button */}
        <motion.button
          onClick={requestOTP}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full py-4 rounded-2xl mt-6 font-bold overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-[length:200%] animate-gradient" />
          <span className="relative text-black flex items-center justify-center gap-2">
            Request & Get OTP
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </span>
        </motion.button>

      </div>

    </motion.div>

  )

}

export default PropertyCard