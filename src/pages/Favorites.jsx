import { useEffect, useState } from "react"

import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "firebase/firestore"

import { auth, db } from "../firebase"

function Favorites() {

  const [favorites, setFavorites] = useState([])

  useEffect(() => {

    const fetchFavorites = async () => {

      const user = auth.currentUser

      if (!user) return

      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      )

      const querySnapshot = await getDocs(q)

      const favoriteList =
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

      setFavorites(favoriteList)

    }

    fetchFavorites()

  }, [])

  const removeFavorite = async (id) => {

    try {

      await deleteDoc(
        doc(db, "favorites", id)
      )

      setFavorites(
        favorites.filter((item) => item.id !== id)
      )

    } catch (error) {

      alert(error.message)

    }

  }

  return (

    <div className="bg-zinc-950 min-h-screen text-white p-6">

      <h1 className="text-4xl font-bold">
        My Favorites ❤️
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {
          favorites.map((item) => (

            <div
              key={item.id}
              className="bg-zinc-900 rounded-3xl overflow-hidden"
            >

              <img
                src={item.propertyImage}
                alt="house"
                className="w-full h-64 object-cover"
              />

              <div className="p-4">

                <h2 className="text-2xl font-bold">
                  {item.propertyTitle}
                </h2>

                <p className="text-2xl font-bold mt-4">
                  {item.propertyPrice}
                </p>

                <button
                  onClick={() => removeFavorite(item.id)}
                  className="w-full bg-red-500 py-3 rounded-2xl mt-5 font-bold"
                >
                  Remove Favorite
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}

export default Favorites