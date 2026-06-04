import { useState } from "react"

import {
  createUserWithEmailAndPassword
} from "firebase/auth"

import { auth } from "../firebase"

import {
  useNavigate,
  Link
} from "react-router-dom"

function Register() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const registerUser = async () => {

    // Validation
    if (!email || !password) {

      alert("Please fill all fields")
      return

    }

    if (password.length < 6) {

      alert(
        "Password must be at least 6 characters"
      )

      return

    }

    try {

      setLoading(true)

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      alert(
        "Account Created Successfully"
      )

      navigate("/login")

    } catch (error) {

      console.log(error)

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {

        alert("Email already exists")

      } else if (
        error.code ===
        "auth/invalid-email"
      ) {

        alert("Invalid email address")

      } else if (
        error.code ===
        "auth/weak-password"
      ) {

        alert("Weak password")

      } else {

        alert(error.message)

      }

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="bg-zinc-950 min-h-screen flex items-center justify-center px-6">

      <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md text-white shadow-2xl">

        <h1 className="text-3xl md:text-4xl font-bold">
          Create Account 🚀
        </h1>

        <p className="text-zinc-400 mt-3">
          Join Tanzania Housing Platform
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full bg-zinc-800 p-4 rounded-2xl mt-6 outline-none border border-zinc-700 focus:border-white"
        />

        {/* Password */}
        <div className="relative mt-4">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-zinc-800 p-4 rounded-2xl outline-none border border-zinc-700 focus:border-white"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-4 top-4 text-zinc-400 font-semibold"
          >

            {showPassword
              ? "Hide"
              : "Show"}

          </button>

        </div>

        {/* Register Button */}
        <button
          onClick={registerUser}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-2xl mt-6 font-bold hover:bg-zinc-300 transition disabled:opacity-50"
        >

          {loading
            ? "Creating Account..."
            : "Register"}

        </button>

        {/* Login Link */}
        <p className="text-zinc-400 text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-white font-bold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  )

}

export default Register