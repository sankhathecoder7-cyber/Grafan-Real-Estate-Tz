import { useEffect, useState } from "react"

import {
  collection,
  getDocs
} from "firebase/firestore"

import { db } from "../firebase"

function Bookings() {

  const [bookings, setBookings] = useState([])

  useEffect(() => {

    const fetchBookings = async () => {

      const querySnapshot =
        await getDocs(
          collection(db, "bookings")
        )

      const data = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data()
        })
      )

      setBookings(data)

    }

    fetchBookings()

  }, [])

  return (

    <div className="bg-zinc-950 min-h-screen text-white p-6">

      <h1 className="text-4xl font-bold mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 ? (

        <p>
          No bookings yet
        </p>

      ) : (

        <div className="space-y-4">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="bg-zinc-900 p-5 rounded-2xl"
            >

              <p>
                Property ID:
                {" "}
                {booking.propertyId}
              </p>

              <p>
                Phone:
                {" "}
                {booking.customerPhone}
              </p>

              <p>
                Status:
                {" "}
                {booking.status}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}

export default Bookings