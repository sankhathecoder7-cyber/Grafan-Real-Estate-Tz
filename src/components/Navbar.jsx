import {
  FaHome,
  FaMapMarkedAlt,
  FaVideo,
  FaUserCircle
} from "react-icons/fa"

import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const navItems = [
  { to: "/", icon: FaHome, label: "Home" },
  { to: "/map", icon: FaMapMarkedAlt, label: "Map" },
  { to: "/videos", icon: FaVideo, label: "Videos" },
  { to: "/login", icon: FaUserCircle, label: "Profile" },
]

function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50">
      <div className="relative mx-4 mb-3 glass-strong rounded-3xl shadow-2xl shadow-gold/10">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = pathname === to

            return (
              <Link
                key={to}
                to={to}
                className="relative flex flex-col items-center gap-1 py-1 px-4"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute inset-0 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent rounded-2xl"
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Icon
                    size={20}
                    className={`transition-colors duration-300 ${
                      isActive ? "text-gold" : "text-zinc-400"
                    }`}
                  />
                </motion.div>
                <span
                  className={`relative text-[11px] font-medium transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-zinc-500"
                  }`}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
