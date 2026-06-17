import { createPortal } from "react-dom"
import {
  FaHome,
  FaMapMarkedAlt,
  FaVideo,
  FaUserCircle,
  FaComments
} from "react-icons/fa"

import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const navItems = [
  { to: "/", icon: FaHome, label: "Home" },
  { to: "/map", icon: FaMapMarkedAlt, label: "Map" },
  { to: "/videos", icon: FaVideo, label: "Videos" },
  { to: "/chats", icon: FaComments, label: "Chats" },
  { to: "/login", icon: FaUserCircle, label: "Profile" },
]

function Navbar() {
  const { pathname } = useLocation()

  return createPortal(
    <nav className="fixed left-0 top-0 h-full w-20 md:w-64 z-50 bg-deep-dark/95 backdrop-blur-md border-r border-white/5">
      <div className="flex flex-col gap-2 py-6 px-3 md:px-5">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to

          return (
            <Link
              key={to}
              to={to}
              className="relative flex items-center gap-3 py-3 px-3 md:px-4 rounded-xl"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute inset-0 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent rounded-xl"
                />
              )}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative shrink-0"
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-zinc-400"
                  }`}
                />
              </motion.div>
              <span
                className={`relative text-sm font-medium transition-colors duration-300 hidden md:block ${
                  isActive ? "text-gold" : "text-zinc-500"
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>,
    document.body
  )
}

export default Navbar
