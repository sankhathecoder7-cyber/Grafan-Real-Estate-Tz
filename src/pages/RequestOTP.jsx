import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

import {
  collection,
  addDoc
} from "firebase/firestore"

import { db, auth } from "../firebase"

function RequestOTP() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOTP, setGeneratedOTP] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [loading, setLoading] = useState(false)

  // Request OTP
  const requestOTP = () => {

    if (!phone) {

      alert("Enter phone number")
      return

    }

    const newOTP =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString()

    setGeneratedOTP(newOTP)

    alert(`Demo OTP: ${newOTP}`)

    setShowOTP(true)

  }

  // Verify OTP + Save Booking
  const verifyOTP = async () => {

    if (!otp) {

      alert("Enter OTP")
      return

    }

    if (otp !== generatedOTP) {

      alert("Invalid OTP")
      return

    }

    try {

      setLoading(true)

      await addDoc(
        collection(db, "bookings"),
        {
          propertyId: id,
          customerPhone: phone,
          userId: auth.currentUser?.uid || null,
          status: "Pending",
          createdAt: new Date()
        }
      )

      alert("Booking Successful ✅")

      navigate("/bookings")

    } catch (error) {

      alert(error.message)

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="bg-zinc-950 min-h-screen flex items-center justify-center p-6 text-white">

      <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md">

        <h1 className="text-3xl font-bold">
          Request OTP
        </h1>

        <p className="text-zinc-400 mt-3">
          Enter phone number for booking
        </p>

        <input
          type="text"
          placeholder="255792077777"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-zinc-800 p-4 rounded-2xl mt-6 outline-none"
        />

        <button
          onClick={requestOTP}
          className="w-full bg-white text-black py-4 rounded-2xl mt-6 font-bold"
        >
          Request OTP
        </button>

        {showOTP && (

          <div className="mt-6">

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-zinc-800 p-4 rounded-2xl outline-none"
            />

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-green-500 text-black py-4 rounded-2xl mt-4 font-bold"
            >
              {loading
                ? "Saving Booking..."
                : "Verify OTP & Continue"}
            </button>

          </div>

        )}

      </div>

    </div>

  )

}

export default RequestOTP