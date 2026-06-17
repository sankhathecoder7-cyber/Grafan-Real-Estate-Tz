import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import PropertyDetails from "./pages/PropertyDetails"
import MapPage from "./pages/MapPage"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Videos from "./pages/Videos"
import AddProperty from "./pages/AddProperty"
import Favorites from "./pages/Favorites"
import Bookings from "./pages/Bookings"
import RequestOTP from "./pages/RequestOTP"
import ChatList from "./pages/ChatList"
import ChatRoom from "./pages/ChatRoom"
import AdminDashboard from "./pages/AdminDashboard"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/property/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/map"
          element={<MapPage />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/videos"
          element={<Videos />}
        />

        <Route
          path="/add-property"
          element={<AddProperty />}
        />

<Route
  path="/favorites"
  element={<Favorites />}
/>

<Route
  path="/bookings"
  element={<Bookings />}
/>

<Route
  path="/request-otp/:id"
  element={<RequestOTP />}
/>

<Route
  path="/chats"
  element={
    <ProtectedRoute>
      <ChatList />
    </ProtectedRoute>
  }
/>

<Route
  path="/chat/:chatId"
  element={
    <ProtectedRoute>
      <ChatRoom />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>


      </Routes>

    </BrowserRouter>

  )

}

export default App