import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AddItem from './pages/AddItem'
import MyRequests from './pages/MyRequests'

// Simple helper — returns true if token exists in localStorage
const isLoggedIn = () => !!localStorage.getItem('token')

// Wrapper: redirects to /login if not authenticated
const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages — with navbar */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddItem />} />
                <Route path="/my-requests" element={<MyRequests />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
