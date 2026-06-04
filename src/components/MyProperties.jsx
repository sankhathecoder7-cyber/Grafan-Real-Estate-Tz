import { useEffect, useState } from "react"

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore"

import { db } from "../firebase"

function MyProperties() {

  const [properties, setProperties] = useState([])

  useEffect(() => {

    const fetchProperties = async () => {

      const querySnapshot =
        await getDocs(
          collection(db, "properties")
        )

      const propertyList =
        querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data()
        }))

      setProperties(propertyList)
    }

    fetchProperties()

  }, [])

  const deleteProperty = async (id) => {

    await deleteDoc(
      doc(db, "properties", id)
    )

    setProperties(
      properties.filter(
        (property) => property.id !== id
      )
    )
  }

  return (

    <div className="mt-12">

      <h2 className="text-3xl font-bold mb-6">
        My Properties
      </h2>

      <div className="space-y-6">

        {
          properties.map((property) => (

            <div
              key={property.id}
              className="bg-zinc-900 p-4 rounded-3xl flex gap-4 items-center"
            >

              <img
                src={property.image}
                alt={property.title}
                className="w-32 h-32 object-cover rounded-2xl"
              />

              <div>

                <h3 className="text-2xl font-bold">
                  {property.title}
                </h3>

                <p className="text-zinc-400 mt-2">
                  📍 {property.location}
                </p>

                <p className="text-white font-bold mt-2">
                  {property.price}
                </p>

                <button
                  onClick={() => deleteProperty(property.id)}
                  className="bg-red-500 px-5 py-2 rounded-xl mt-4 font-bold"
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        }

      </div>

    </div>

  )
}

export default MyProperties