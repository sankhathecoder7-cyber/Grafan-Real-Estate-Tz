import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore"
import { db, auth } from "../firebase"
import { motion } from "framer-motion"
import { FaArrowLeft, FaPaperPlane, FaCheckDouble } from "react-icons/fa"

function ChatRoom() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [chat, setChat] = useState(null)
  const [typingUsers, setTypingUsers] = useState([])
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const user = auth.currentUser

  useEffect(() => {
    if (!user) { navigate("/login"); return }

    const fetchChat = async () => {
      const chatSnap = await getDoc(doc(db, "chats", chatId))
      if (chatSnap.exists()) setChat({ id: chatSnap.id, ...chatSnap.data() })
    }
    fetchChat()

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc"),
      limit(50)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setMessages(msgs)
      markAsRead(msgs)
    })

    const typingRef = doc(db, "chats", chatId, "typing", "status")
    const unsubTyping = onSnapshot(typingRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        const now = Date.now()
        const active = Object.entries(data)
          .filter(([uid]) => uid !== user.uid)
          .filter(([, t]) => now - t < 5000)
          .map(([uid]) => uid)
        setTypingUsers(active)
      }
    })

    return () => { unsub(); unsubTyping() }
  }, [chatId, user, navigate])

  const markAsRead = async (msgs) => {
    const unread = msgs.filter((m) => m.senderId !== user.uid && !m.readBy?.[user.uid])
    for (const m of unread) {
      try {
        await updateDoc(doc(db, "chats", chatId, "messages", m.id), {
          [`readBy.${user.uid}`]: serverTimestamp()
        })
      } catch {}
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() || !user) return
    const msg = text.trim()
    setText("")
    setTyping(false)
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: msg,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        timestamp: serverTimestamp(),
        readBy: { [user.uid]: serverTimestamp() }
      })
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: msg,
        lastMessageTime: serverTimestamp()
      })
    } catch (err) {
      console.error(err)
    }
  }

  const setTyping = async (isTyping) => {
    if (!user) return
    try {
      await updateDoc(doc(db, "chats", chatId, "typing", "status"), {
        [user.uid]: isTyping ? Date.now() : 0
      })
    } catch {}
  }

  const handleTyping = () => {
    setTyping(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 3000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (ts) => {
    if (!ts) return ""
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="bg-deep-dark min-h-screen text-white flex flex-col ml-20 md:ml-64">
      <div className="sticky top-0 z-30 bg-deep-dark/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/chats")} className="p-2 hover:bg-white/10 rounded-xl transition">
          <FaArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-semibold">{chat?.propertyTitle || "Chat"}</h2>
          {typingUsers.length > 0 && (
            <p className="text-xs text-blue-400 animate-pulse">Typing...</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-zinc-500 mt-20">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === user.uid
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] ${isMine ? "order-1" : ""}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "glass text-zinc-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] text-zinc-500">{formatTime(msg.timestamp)}</span>
                  {isMine && msg.readBy && Object.keys(msg.readBy).length > 1 && (
                    <FaCheckDouble size={10} className="text-blue-400" />
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="px-4 py-3 border-t border-white/5 flex items-center gap-2 bg-deep-dark">
        <input
          type="text"
          value={text}
          onChange={(e) => { setText(e.target.value); handleTyping() }}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 placeholder:text-zinc-600 text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition disabled:opacity-40 shrink-0"
        >
          <FaPaperPlane size={16} />
        </button>
      </form>
    </div>
  )
}

export default ChatRoom
