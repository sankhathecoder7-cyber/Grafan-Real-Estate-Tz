import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  Timestamp
} from "firebase/firestore"
import { db, auth } from "../firebase"
import { motion } from "framer-motion"
import { FaComments, FaUser } from "react-icons/fa"

function ChatList() {
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const user = auth.currentUser

  useEffect(() => {
    if (!user) { navigate("/login"); return }

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageTime", "desc")
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setChats(chatList)
      setLoading(false)
    })

    return () => unsub()
  }, [user, navigate])

  const formatTime = (ts) => {
    if (!ts) return ""
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    const now = new Date()
    const diff = now - date
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return date.toLocaleDateString()
  }

  const getOtherParticipant = (chat) => {
    const other = chat.participants?.find((p) => p !== user.uid)
    return chat.participantInfo?.[other] || "User"
  }

  return (
    <div className="bg-deep-dark min-h-screen text-white ml-20 md:ml-64">
      <div className="sticky top-0 z-30 bg-deep-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <FaComments size={22} className="text-blue-400" />
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && chats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
          <FaComments size={48} className="text-zinc-700" />
          <p className="text-lg font-medium">No conversations yet</p>
          <p className="text-sm">Chat with property owners to start a conversation</p>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {chats.map((chat) => (
          <motion.div key={chat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to={`/chat/${chat.id}`}
              className="flex items-center gap-4 px-4 py-4 hover:bg-white/[0.03] transition block"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <FaUser size={20} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm truncate">
                    {getOtherParticipant(chat)}
                  </h3>
                  <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{chat.lastMessage || "No messages"}</p>
                {chat.propertyTitle && (
                  <p className="text-[10px] text-blue-400/70 truncate mt-0.5">{chat.propertyTitle}</p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ChatList
