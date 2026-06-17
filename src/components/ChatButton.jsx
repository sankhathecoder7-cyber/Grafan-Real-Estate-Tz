import { useNavigate } from "react-router-dom"
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc
} from "firebase/firestore"
import { db, auth } from "../firebase"
import { FaComments } from "react-icons/fa"

function ChatButton({ property, className = "" }) {
  const navigate = useNavigate()

  const startChat = async () => {
    const user = auth.currentUser
    if (!user) { navigate("/login"); return }

    if (!property?.ownerId) {
      navigate(`/chat/new/${property?.id}`)
      return
    }

    try {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", user.uid),
        where("propertyId", "==", property.id)
      )
      const existing = await getDocs(q)
      let chatId = null

      if (!existing.empty) {
        chatId = existing.docs[0].id
      } else {
        const participants = [user.uid, property.ownerId]
        const participantInfo = {
          [user.uid]: user.displayName || user.email || "Buyer",
          [property.ownerId]: property.ownerName || "Owner"
        }
        const ref = await addDoc(collection(db, "chats"), {
          participants,
          participantInfo,
          propertyId: property.id,
          propertyTitle: property.title,
          createdAt: serverTimestamp(),
          lastMessage: "",
          lastMessageTime: serverTimestamp()
        })
        chatId = ref.id
      }

      navigate(`/chat/${chatId}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      onClick={startChat}
      className={`flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-500 transition ${className}`}
    >
      <FaComments size={18} />
      Chat with Owner
    </button>
  )
}

export default ChatButton
