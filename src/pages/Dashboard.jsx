import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "firebase/firestore"
import { signOut } from "firebase/auth"
import { motion } from "framer-motion"
import {
  FaHome,
  FaCalendarCheck,
  FaVideo,
  FaHeart,
  FaPlus,
  FaTrash,
  FaEdit,
  FaEye,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle
} from "react-icons/fa"
import { db, auth } from "../firebase"

function Dashboard() {
  const navigate = useNavigate()
  const user = auth.currentUser
  const [stats, setStats] = useState({ properties: 0, bookings: 0, videos: 0, favorites: 0 })
  const [myProperties, setMyProperties] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    fetchDashboard()
  }, [user])

  const fetchDashboard = async () => {
    try {
      const [propsSnap, bookingsSnap, videosSnap, favSnap] = await Promise.all([
        getDocs(query(collection(db, "properties"), where("ownerId", "==", user.uid))),
        getDocs(collection(db, "bookings")),
        getDocs(collection(db, "videos")),
        getDocs(query(collection(db, "favorites"), where("userId", "==", user.uid)))
      ])

      const props = propsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

      setStats({
        properties: props.length,
        bookings: bookingsSnap.docs.length,
        videos: videosSnap.docs.length,
        favorites: favSnap.docs.length
      })

      setMyProperties(props)

      const activity = []
      props.forEach((p) => {
        activity.push({
          id: `prop-${p.id}`,
          type: "property",
          title: `Property listed: ${p.title}`,
          time: p.createdAt,
          icon: FaHome,
          color: "text-blue-400"
        })
      })
      bookingsSnap.docs.forEach((b) => {
        const data = b.data()
        const matchingProp = props.find((p) => p.id === data.propertyId)
        activity.push({
          id: `book-${b.id}`,
          type: "booking",
          title: `New booking for ${matchingProp?.title || "property"}`,
          subtitle: data.customerPhone,
          time: data.createdAt,
          icon: FaCalendarCheck,
          color: "text-emerald-400"
        })
      })
      activity.sort((a, b) => {
        const ta = a.time?.toDate?.() || new Date(0)
        const tb = b.time?.toDate?.() || new Date(0)
        return tb - ta
      })
      setRecentActivity(activity.slice(0, 10))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return
    try {
      await deleteDoc(doc(db, "properties", id))
      setMyProperties((prev) => prev.filter((p) => p.id !== id))
      setStats((prev) => ({ ...prev, properties: prev.properties - 1 }))
    } catch (err) {
      console.error(err)
      alert("Failed to delete property")
    }
  }

  const logout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const formatTime = (ts) => {
    if (!ts) return ""
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    const now = new Date()
    const diff = now - date
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  const getStatusBadge = (property) => {
    if (property.verified) return { label: "Verified", icon: FaCheckCircle, className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" }
    if (property.rejected) return { label: "Rejected", icon: FaTimesCircle, className: "bg-red-500/15 text-red-400 border-red-500/20" }
    return { label: "Pending", icon: FaHourglassHalf, className: "bg-amber-500/15 text-amber-400 border-amber-500/20" }
  }

  const statCards = [
    { label: "My Properties", value: stats.properties, icon: FaHome, color: "from-blue-500 to-blue-700", link: "#my-properties" },
    { label: "Bookings", value: stats.bookings, icon: FaCalendarCheck, color: "from-emerald-500 to-emerald-700", link: "/bookings" },
    { label: "Videos", value: stats.videos, icon: FaVideo, color: "from-violet-500 to-violet-700", link: "/videos" },
    { label: "Favorites", value: stats.favorites, icon: FaHeart, color: "from-rose-500 to-rose-700", link: "/favorites" }
  ]

  const quickActions = [
    { label: "Add Property", icon: FaPlus, to: "/add-property", color: "bg-blue-600 hover:bg-blue-500" },
    { label: "View Videos", icon: FaVideo, to: "/videos", color: "bg-violet-600 hover:bg-violet-500" },
    { label: "Bookings", icon: FaCalendarCheck, to: "/bookings", color: "bg-emerald-600 hover:bg-emerald-500" },
    { label: "Favorites", icon: FaHeart, to: "/favorites", color: "bg-rose-600 hover:bg-rose-500" }
  ]

  if (loading) {
    return (
      <div className="bg-deep-dark min-h-screen flex items-center justify-center ml-20 md:ml-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm tracking-widest uppercase">Loading Dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-deep-dark min-h-screen text-white ml-20 md:ml-64">
      <div className="px-4 md:px-8 py-6 max-w-6xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
              <FaUserCircle size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Welcome back, {user?.displayName || "Agent"}
              </h1>
              <p className="text-zinc-400 text-sm mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/add-property"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-2xl text-sm font-medium transition"
            >
              <FaPlus size={14} />
              Add Property
            </Link>
            <button className="relative glass-strong p-3 rounded-2xl hover:bg-white/[0.12] transition">
              <FaBell size={18} className="text-zinc-300" />
              {recentActivity.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                  {recentActivity.length}
                </span>
              )}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 glass-strong px-5 py-2.5 rounded-2xl text-sm font-medium text-zinc-300 hover:bg-red-500/20 hover:text-red-400 transition"
            >
              <FaSignOutAlt size={14} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, link }, i) => (
            <Link key={label} to={link} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                className="glass rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-bl-3xl transition-transform duration-500 group-hover:scale-150" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={18} className="text-white" />
                  </motion.div>
                </div>
                <span className="text-xs text-blue-400 mt-3 inline-block group-hover:underline relative z-10">
                  View all →
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-sm uppercase tracking-wider text-zinc-500 font-medium mb-4">Quick Actions</h2>
          <div className="flex gap-3 flex-wrap">
            {quickActions.map(({ label, icon: Icon, to, color }, i) => (
              <Link key={to} to={to}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-sm text-white transition ${color}`}
                >
                  <Icon size={14} />
                  {label}
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* My Properties Grid */}
        <motion.div
          id="my-properties"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-wider text-zinc-500 font-medium">
              My Properties ({stats.properties})
            </h2>
            <Link to="/add-property" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              <FaPlus size={10} /> Add New
            </Link>
          </div>

          {myProperties.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <FaHome size={40} className="text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">No properties yet</h3>
              <p className="text-zinc-400 text-sm mt-1">Start by adding your first listing</p>
              <Link to="/add-property">
                <button className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-medium text-sm hover:bg-blue-500 transition">
                  Add Property
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {myProperties.map((property, i) => {
                const status = getStatusBadge(property)
                const StatusIcon = status.icon
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="glass rounded-2xl overflow-hidden group"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-dark/80 via-transparent to-transparent" />
                      <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.className}`}>
                        <StatusIcon size={10} />
                        {status.label}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm truncate">{property.title}</h3>
                      <div className="flex items-center gap-1 text-zinc-500 text-xs mt-1">
                        <FaMapMarkerAlt size={10} />
                        <span className="truncate">
                          {property.region}{property.district ? `, ${property.district}` : ""}
                        </span>
                      </div>
                      <p className="text-blue-400 font-bold text-sm mt-2">TZS {property.price}</p>
                      <div className="flex gap-2 mt-3">
                        <Link
                          to={`/property/${property.id}`}
                          className="flex items-center gap-1 flex-1 justify-center glass-strong py-2 rounded-xl text-xs font-medium hover:bg-white/[0.12] transition"
                        >
                          <FaEye size={10} />
                          View
                        </Link>
                        <Link
                          to={`/add-property`}
                          className="flex items-center gap-1 flex-1 justify-center glass-strong py-2 rounded-xl text-xs font-medium text-amber-400 hover:bg-white/[0.12] transition"
                        >
                          <FaEdit size={10} />
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="flex items-center gap-1 flex-1 justify-center glass-strong py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/20 transition"
                        >
                          <FaTrash size={10} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-sm uppercase tracking-wider text-zinc-500 font-medium mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center">
              <FaClock size={32} className="text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="glass rounded-2xl divide-y divide-white/[0.05]">
              {recentActivity.map((activity, i) => {
                const Icon = activity.icon
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={activity.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      {activity.subtitle && (
                        <p className="text-xs text-zinc-500">{activity.subtitle}</p>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 shrink-0">{formatTime(activity.time)}</span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
