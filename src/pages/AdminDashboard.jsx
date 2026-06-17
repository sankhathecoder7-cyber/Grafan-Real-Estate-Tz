import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore"
import { db, auth } from "../firebase"
import { motion } from "framer-motion"
import {
  FaHome,
  FaUsers,
  FaCalendarCheck,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaTrash,
  FaSignOutAlt,
  FaShieldAlt,
  FaClipboardCheck,
  FaExclamationTriangle
} from "react-icons/fa"
import { signOut } from "firebase/auth"

function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ properties: 0, users: 0, bookings: 0, chats: 0 })
  const [pendingProperties, setPendingProperties] = useState([])
  const [reportedProperties, setReportedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [propsSnap, bookingsSnap, chatsSnap] = await Promise.all([
        getDocs(collection(db, "properties")),
        getDocs(collection(db, "bookings")),
        getDocs(collection(db, "chats"))
      ])

      const allProperties = propsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

      setStats({
        properties: allProperties.length,
        users: new Set(allProperties.filter((p) => p.ownerId).map((p) => p.ownerId)).size,
        bookings: bookingsSnap.docs.length,
        chats: chatsSnap.docs.length
      })

      setPendingProperties(allProperties.filter((p) => !p.verified && !p.rejected))
      setReportedProperties(allProperties.filter((p) => p.reported))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const verifyProperty = async (propertyId) => {
    try {
      await updateDoc(doc(db, "properties", propertyId), { verified: true })
      setPendingProperties((prev) => prev.filter((p) => p.id !== propertyId))
    } catch (err) {
      console.error(err)
      alert("Failed to verify property")
    }
  }

  const rejectProperty = async (propertyId) => {
    try {
      await updateDoc(doc(db, "properties", propertyId), { rejected: true })
      setPendingProperties((prev) => prev.filter((p) => p.id !== propertyId))
    } catch (err) {
      console.error(err)
      alert("Failed to reject property")
    }
  }

  const dismissReport = async (propertyId) => {
    try {
      await updateDoc(doc(db, "properties", propertyId), { reported: false })
      setReportedProperties((prev) => prev.filter((p) => p.id !== propertyId))
    } catch (err) {
      console.error(err)
      alert("Failed to dismiss report")
    }
  }

  const deleteProperty = async (propertyId) => {
    if (!window.confirm("Delete this property permanently?")) return
    try {
      await deleteDoc(doc(db, "properties", propertyId))
      setReportedProperties((prev) => prev.filter((p) => p.id !== propertyId))
      setPendingProperties((prev) => prev.filter((p) => p.id !== propertyId))
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

  const statCards = [
    { label: "Total Properties", value: stats.properties, icon: FaHome, color: "from-blue-500 to-blue-700" },
    { label: "Property Owners", value: stats.users, icon: FaUsers, color: "from-emerald-500 to-emerald-700" },
    { label: "Total Bookings", value: stats.bookings, icon: FaCalendarCheck, color: "from-violet-500 to-violet-700" },
    { label: "Chat Threads", value: stats.chats, icon: FaComments, color: "from-amber-500 to-amber-700" }
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
      <div className="px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center">
              <FaShieldAlt size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-zinc-400 text-sm">Manage listings, verifications, and reports</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-2xl font-medium hover:bg-red-500/20 transition"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider">{label}</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "glass text-zinc-400 hover:text-white"
            }`}
          >
            <FaClipboardCheck size={14} />
            Pending Verification
            {pendingProperties.length > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingProperties.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reported")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition ${
              activeTab === "reported"
                ? "bg-red-600 text-white"
                : "glass text-zinc-400 hover:text-white"
            }`}
          >
            <FaFlag size={14} />
            Reported Listings
            {reportedProperties.length > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {reportedProperties.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "pending" && (
          <div>
            {pendingProperties.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <FaCheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">All Clear</h3>
                <p className="text-zinc-400 text-sm mt-1">No properties pending verification</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full md:w-24 h-24 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{property.title}</h3>
                      <p className="text-zinc-400 text-sm truncate">
                        {property.region}{property.district ? `, ${property.district}` : ""}
                      </p>
                      <p className="text-blue-400 text-sm font-medium">
                        TZS {property.price}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => verifyProperty(property.id)}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-500 transition"
                      >
                        <FaCheckCircle size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectProperty(property.id)}
                        className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-red-500/20 transition"
                      >
                        <FaTimesCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reported" && (
          <div>
            {reportedProperties.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <FaExclamationTriangle size={40} className="text-zinc-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">No Reports</h3>
                <p className="text-zinc-400 text-sm mt-1">No properties have been reported</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportedProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 border border-red-500/20"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full md:w-24 h-24 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{property.title}</h3>
                        <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase">
                          Reported
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm truncate">
                        {property.region}{property.district ? `, ${property.district}` : ""}
                      </p>
                      <p className="text-blue-400 text-sm font-medium">
                        TZS {property.price}
                      </p>
                      {property.reportReason && (
                        <p className="text-red-400/70 text-xs mt-1">Reason: {property.reportReason}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        to={`/property/${property.id}`}
                        className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-white/[0.08] transition text-zinc-300"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => dismissReport(property.id)}
                        className="flex items-center gap-2 bg-zinc-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-zinc-600 transition"
                      >
                        <FaCheckCircle size={14} />
                        Dismiss
                      </button>
                      <button
                        onClick={() => deleteProperty(property.id)}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-red-500 transition"
                      >
                        <FaTrash size={14} />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
