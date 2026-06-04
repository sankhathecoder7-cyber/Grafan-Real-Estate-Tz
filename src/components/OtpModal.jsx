import { useState } from "react"

function OtpModal({ closeModal }) {

  const [otp, setOtp] = useState(null)

  const generateOTP = () => {
    const randomOTP =
      Math.floor(100000 + Math.random() * 900000)

    setOtp(randomOTP)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

      <div className="bg-zinc-900 p-6 rounded-3xl w-full max-w-md text-white">

        <h2 className="text-3xl font-bold">
          Reserve Property
        </h2>

        <p className="text-zinc-400 mt-3">
          Enter your phone number to receive OTP reservation code.
        </p>

        <input
          type="text"
          placeholder="Enter phone number"
          className="w-full mt-5 bg-zinc-800 p-4 rounded-2xl outline-none"
        />

        <button
          onClick={generateOTP}
          className="w-full bg-white text-black py-4 rounded-2xl mt-6 font-bold"
        >
          Get OTP
        </button>

        {
          otp && (
            <div className="bg-zinc-800 mt-6 p-5 rounded-2xl text-center">

              <p className="text-zinc-400">
                Reservation OTP
              </p>

              <h1 className="text-5xl font-bold mt-3">
                {otp}
              </h1>

              <p className="text-green-400 mt-4">
                Reserved for 5 minutes
              </p>

            </div>
          )
        }

        <button
          onClick={closeModal}
          className="w-full mt-5 text-red-400"
        >
          Cancel
        </button>

      </div>

    </div>
  )
}

export default OtpModal