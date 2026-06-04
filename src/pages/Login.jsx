import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import {
  signInWithEmailAndPassword
} from "firebase/auth"

import { auth } from "../firebase"

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const loginUser = async () => {

    // Validation
    if (!email || !password) {

      alert("Please fill all fields")
      return

    }

    try {

      setLoading(true)

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      alert("Login Successful")

      navigate("/dashboard")

    } catch (error) {

      console.log(error)

      if (error.code === "auth/user-not-found") {

        alert("User not found")

      } else if (
        error.code === "auth/wrong-password"
      ) {

        alert("Wrong password")

      } else if (
        error.code === "auth/invalid-email"
      ) {

        alert("Invalid email")

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
          Welcome Back 👋
        </h1>

        <p className="text-zinc-400 mt-3">
          Login to continue to your account
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
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-4 text-zinc-400 font-semibold"
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>

        </div>

        {/* Login Button */}
        <button
          onClick={loginUser}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-2xl mt-6 font-bold hover:bg-zinc-300 transition disabled:opacity-50"
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>

        {/* Register Link */}
        <p className="text-zinc-400 text-center mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-white font-bold hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>

  )

}

export default Login