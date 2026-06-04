import Navbar from "../components/Navbar"
import PropertyCard from "../components/PropertyCard"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  collection,
  getDocs
} from "firebase/firestore"

import { db } from "../firebase"

function Home() {

  const [properties, setProperties] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchText, setSearchText] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [loading, setLoading] = useState(true)
  // Fetch Properties
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "properties")
        )
  
        const propertyList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
  
        setProperties(propertyList)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false) // ✅ always runs
      }
    }
  
    fetchProperties()
  }, [])

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        Loading properties...
      </div>
    )
  }
  

  // Categories
  const categories = [
    {
      name: "All",
      icon: "🌍"
    },
    {
      name: "Apartment",
      icon: "🏢"
    },
    {
      name: "House",
      icon: "🏠"
    },
    {
      name: "Hostel",
      icon: "🎓"
    },
    {
      name: "Office",
      icon: "💼"
    },
    {
      name: "Shop",
      icon: "🛒"
    },
    {
      name: "Land",
      icon: "🌱"
    },
    {
      name: "Warehouse",
      icon: "🏭"
    },
    {
      name: "Hotel",
      icon: "🏨"
    }
  ]

  // Filter Properties
  const filteredProperties = properties.filter((property) => {

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : property.category === selectedCategory

    const search = searchText.toLowerCase()

    const matchesSearch =
      property.region?.toLowerCase().includes(search) ||
      property.district?.toLowerCase().includes(search) ||
      property.ward?.toLowerCase().includes(search) ||
      property.street?.toLowerCase().includes(search) ||
      property.location?.toLowerCase().includes(search) ||
      property.title?.toLowerCase().includes(search)

    const propertyPrice = parseInt(
      String(property.price || "0").replace(/\D/g, "")
    )

    const matchesPrice =
      maxPrice === ""
        ? true
        : propertyPrice <= Number(maxPrice)

    return (
      matchesCategory &&
      matchesSearch &&
      matchesPrice
    )

  })

  return (

    <div className="bg-zinc-950 min-h-screen text-white pb-28">

      {/* Hero */}
      <div className="px-4 md:px-6 pt-8">

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Find Properties Across Tanzania 🇹🇿
        </h1>

        <p className="text-zinc-400 mt-4 text-base md:text-lg max-w-2xl">
          Search apartments, houses, hotels,
          hostels, lands, offices and more
          from every region in Tanzania.
        </p>

      </div>

      {/* Buttons */}
      <div className="flex gap-4 px-4 md:px-6 mt-8 flex-wrap">

        <Link
          to="/register"
          className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
        >
          Register
        </Link>

        <Link
          to="/login"
          className="bg-zinc-800 px-6 py-3 rounded-2xl font-bold hover:bg-zinc-700 transition"
        >
          Login
        </Link>

      </div>

      {/* Search */}
      <div className="px-4 md:px-6 mt-8">

        <div className="bg-zinc-900 p-5 rounded-3xl space-y-4">

          <h2 className="text-2xl font-bold">
            Search Properties
          </h2>

          <input
            type="text"
            placeholder="Search by region, district, ward..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-zinc-800 p-4 rounded-2xl outline-none"
          />

          <input
            type="number"
            placeholder="Maximum Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-zinc-800 p-4 rounded-2xl outline-none"
          />

        </div>

      </div>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto px-4 md:px-6 mt-8 pb-3">

        {categories.map((cat) => (

          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.name
                ? "bg-white text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >

            <span>{cat.icon}</span>

            <span>{cat.name}</span>

          </button>

        ))}

      </div>

      {/* Listings */}
      <div className="px-4 md:px-6 mt-10">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl md:text-3xl font-bold">
            Available Properties
          </h2>

          <div className="bg-zinc-900 px-4 py-2 rounded-2xl text-zinc-300">
            {filteredProperties.length} Listings
          </div>

        </div>

        {filteredProperties.length === 0 && (

          <div className="bg-zinc-900 p-10 rounded-3xl text-center">

            <h2 className="text-2xl font-bold">
              No Properties Found
            </h2>

            <p className="text-zinc-400 mt-3">
              No listings match your search.
            </p>

          </div>

        )}

        {/* Property Cards */}
        <div className="space-y-6">

          {filteredProperties.map((property) => (

            <PropertyCard
              key={property.id}
              property={property}
            />

          ))}

        </div>

      </div>

      {/* Navbar */}
      <Navbar />

    </div>

  )

}

export default Home