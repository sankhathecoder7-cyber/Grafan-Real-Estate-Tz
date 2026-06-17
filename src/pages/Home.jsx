import Navbar from "../components/Navbar"
import PropertyCard from "../components/PropertyCard"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  collection,
  getDocs
} from "firebase/firestore"

import { motion } from "framer-motion"

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
      <div className="flex justify-center items-center min-h-screen bg-deep-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm tracking-widest uppercase">Loading</p>
        </div>
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

    <div className="bg-deep-dark min-h-screen text-white pb-8 ml-20 md:ml-64 pt-4">

      <Navbar />

      <div className="sticky top-0 z-40 bg-deep-dark/95 backdrop-blur-md border-b border-white/5">

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-dark/20 via-deep-dark to-gold-dark/10 animate-gradient pointer-events-none" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="px-4 md:px-6 pt-4 md:pt-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-sm text-gold-light mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Premium Real Estate
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1]">
              <span className="gradient-text">Find Properties Across Tanzania</span> 🇹🇿
            </h1>

            <p className="text-zinc-400 mt-6 text-base md:text-lg max-w-2xl leading-relaxed">
              Discover premium apartments, houses, hotels,
              hostels, lands, offices and more
              from every region in Tanzania.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-8 flex-wrap">
              <Link
                to="/register"
                className="relative group px-8 py-4 rounded-2xl font-bold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold to-gold-dark group-hover:scale-105 transition-transform duration-300" />
                <span className="relative text-black">Get Started</span>
              </Link>

              <Link
                to="/login"
                className="glass-strong px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="px-4 md:px-6 mt-4"
        >
          <div className="glass rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl shadow-gold/5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-gold to-gold-light rounded-full" />
              <h2 className="text-xl md:text-2xl font-bold">Search Properties</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search by region, district, ward..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-gold/50 focus:bg-white/[0.07] transition-all duration-300 placeholder:text-zinc-600"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">💰</span>
                <input
                  type="number"
                  placeholder="Maximum Price (TZS)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-gold/50 focus:bg-white/[0.07] transition-all duration-300 placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex gap-3 overflow-x-auto px-4 md:px-6 mt-8 pb-4 scrollbar-thin"
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat.name
                  ? "bg-gradient-to-r from-gold to-gold-dark text-black shadow-lg shadow-gold/25"
                  : "glass hover:bg-white/[0.08] text-zinc-300"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
            </motion.button>
          ))}
        </motion.div>

      </div>

      {/* Listings */}
      <div className="px-4 md:px-6 mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-gold to-emerald-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold">Available Properties</h2>
          </div>

          <div className="glass px-5 py-2.5 rounded-2xl text-sm text-gold-light font-semibold">
            {filteredProperties.length} Listing{filteredProperties.length !== 1 ? "s" : ""}
          </div>
        </motion.div>

        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-14 text-center"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold">No Properties Found</h2>
            <p className="text-zinc-500 mt-3">No listings match your search criteria.</p>
          </motion.div>
        )}

        {/* Property Cards Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>

  )

}

export default Home