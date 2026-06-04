import { useEffect, useState } from "react"

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore"

import { db } from "../firebase"

function Bookings() {

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const querySnapshot =
          await getDocs(
            collection(db, "bookings")
          )

        const bookingList =
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))

        setBookings(bookingList)

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }

    fetchBookings()

  }, [])

  const deleteBooking = async (id) => {

    const confirmDelete =
      window.confirm("Delete this booking?")

    if (!confirmDelete) return

    try {

      await deleteDoc(
        doc(db, "bookings", id)
      )

      setBookings(
        bookings.filter(
          (booking) => booking.id !== id
        )
      )

      alert("Booking deleted successfully")

    } catch (error) {

      alert(error.message)

    }

  }

  if (loading) {

    return (

      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading bookings...
      </div>

    )

  }

  return (

    <div className="bg-zinc-950 min-h-screen text-white p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-3xl md:text-5xl font-bold">
          Property Bookings
        </h1>

        <div className="bg-white text-black px-5 py-3 rounded-2xl font-bold text-lg w-fit">
          {bookings.length} Total Bookings
        </div>

      </div>

      {/* Empty State */}
      {
        bookings.length === 0 ? (

          <div className="flex items-center justify-center h-[60vh]">

            <p className="text-zinc-500 text-2xl">
              No bookings available
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

            {
              bookings.map((booking) => (

                <div
                  key={booking.id}
                  className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:border-zinc-600 transition"
                >

                  {/* Top */}
                  <div className="flex items-center justify-between gap-4">

                    <h2 className="text-2xl font-bold break-words">
                      {booking.propertyTitle || "Property"}
                    </h2>

                    <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      New
                    </span>

                  </div>

                  {/* Customer */}
                  <div className="mt-6 space-y-4">

                    <div className="bg-zinc-800 p-4 rounded-2xl">

                      <p className="text-zinc-400 text-sm">
                        Customer Name
                      </p>

                      <p className="text-lg font-semibold mt-1">
                        👤 {booking.customerName || "No Name"}
                      </p>

                    </div>

                    <div className="bg-zinc-800 p-4 rounded-2xl">

                      <p className="text-zinc-400 text-sm">
                        Phone Number
                      </p>

                      <p className="text-lg font-semibold mt-1">
                        📞 {booking.customerPhone || "No Phone"}
                      </p>

                    </div>

                    <div className="bg-zinc-800 p-4 rounded-2xl">

                      <p className="text-zinc-400 text-sm">
                        Customer Message
                      </p>

                      <p className="text-zinc-300 leading-7 mt-2">
                        {booking.customerMessage || "No message provided"}
                      </p>

                    </div>

                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="w-full bg-red-500 hover:bg-red-600 transition py-4 rounded-2xl mt-6 font-bold text-lg"
                  >
                    Delete Booking
                  </button>

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  )

}

export default Bookings