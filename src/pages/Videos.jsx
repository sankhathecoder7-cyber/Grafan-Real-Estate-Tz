import { useEffect, useState } from "react"

import {
  collection,
  getDocs
} from "firebase/firestore"

import { db } from "../firebase"

function Videos() {

  const [videos, setVideos] = useState([])

  useEffect(() => {

    const fetchVideos = async () => {

      const querySnapshot =
        await getDocs(
          collection(db, "videos")
        )

      const videoList =
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

      setVideos(videoList)
    }

    fetchVideos()

  }, [])

  return (
    <div className="bg-black min-h-screen text-white">

      {
        videos.map((item) => (

          <div
            key={item.id}
            className="h-screen relative"
          >

            <video
              src={item.videoUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-24 left-4">

              <h1 className="text-3xl font-bold">
                {item.title}
              </h1>

              <p className="text-zinc-300 mt-2">
                📍 {item.location}
              </p>

            </div>

          </div>
        ))
      }

    </div>
  )
}

export default Videos