import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  doc,
  getDoc
} from "firebase/firestore"

import { db } from "../firebase"

function PropertyDetails() {

  const { id } = useParams()

  const [property, setProperty] = useState(null)

  useEffect(() => {

    const fetchProperty = async () => {

      try {

        const docRef = doc(
          db,
          "properties",
          id
        )

        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {

          setProperty({
            id: docSnap.id,
            ...docSnap.data()
          })

        }

      } catch (error) {

        console.log(error)

      }

    }

    fetchProperty()

  }, [id])

  if (!property) {

    return (

      <div className="bg-zinc-950 min-h-screen flex items-center justify-center text-white text-2xl">

        Loading Property...

      </div>

    )

  }

  // WhatsApp Message
  const whatsappMessage =
    `Hello, I am interested in ${property.title}`

  // Clean Phone Number
  const cleanPhone =
    property.ownerPhone
      ?.replace(/\s/g, "")
      ?.replace("+", "")

  // WhatsApp Link
  const whatsappLink =
    `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      whatsappMessage
    )}`

  // Real Google Maps Coordinates
  const googleMapLink =
    property.latitude && property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${property.region} ${property.district} ${property.street}`
        )}`

  return (

    <div className="bg-zinc-950 min-h-screen text-white pb-20">

      {/* Property Image */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-80 object-cover"
      />

      <div className="p-6">

        {/* Title */}
        <h1 className="text-4xl font-bold">
          {property.title}
        </h1>

        {/* Price */}
        <p className="text-green-400 text-3xl font-bold mt-3">
          TZS {property.price}
        </p>

        {/* Location */}
        <a
          href={googleMapLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 mt-4 block hover:underline"
        >

          📍 {property.location}

        </a>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-4 mt-8">

          <div className="bg-zinc-900 p-4 rounded-2xl">
            🛏 Bedrooms
            <br />

            <span className="font-bold text-xl">
              {property.bedrooms}
            </span>

          </div>

          <div className="bg-zinc-900 p-4 rounded-2xl">
            🚿 Bathrooms
            <br />

            <span className="font-bold text-xl">
              {property.bathrooms}
            </span>

          </div>

          <div className="bg-zinc-900 p-4 rounded-2xl">
            📐 Size
            <br />

            <span className="font-bold text-xl">
              {property.size}
            </span>

          </div>

          <div className="bg-zinc-900 p-4 rounded-2xl">
            🚗 Parking
            <br />

            <span className="font-bold text-xl">
              {property.parking}
            </span>

          </div>

          <div className="bg-zinc-900 p-4 rounded-2xl">
            🛋 Furnished
            <br />

            <span className="font-bold text-xl">
              {property.furnished}
            </span>

          </div>

          <div className="bg-zinc-900 p-4 rounded-2xl">
            📌 Status
            <br />

            <span className="font-bold text-xl">
              {property.status}
            </span>

          </div>

        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
        >

          <button className="w-full bg-green-500 text-black py-4 rounded-2xl mt-10 font-bold hover:bg-green-400 transition">

            Chat on WhatsApp

          </button>

        </a>

        {/* Google Maps Button */}
        <a
          href={googleMapLink}
          target="_blank"
          rel="noreferrer"
        >

          <button className="w-full bg-blue-500 text-white py-4 rounded-2xl mt-4 font-bold hover:bg-blue-400 transition">

            Open Google Maps

          </button>

        </a>

        {/* Call Button */}
        <a
          href={`tel:${cleanPhone}`}
        >

          <button className="w-full bg-white text-black py-4 rounded-2xl mt-4 font-bold hover:bg-zinc-300 transition">

            Call Owner

          </button>

        </a>

        {/* Owner Contact */}
        <div className="bg-zinc-900 p-5 rounded-2xl mt-5">

          <h2 className="text-xl font-bold">
            Owner Contact
          </h2>

          <p className="text-zinc-400 mt-2">
            📞 {property.ownerPhone}
          </p>

        </div>

      </div>

    </div>

  )

}

export default PropertyDetails