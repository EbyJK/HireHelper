import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
// Notice we don't need FaGoogle anymore since the official button includes it!
import { useState, useEffect } from "react"
import logo from "../assets/logo.png"

// ✅ 1. Import the official Google component
import { GoogleLogin } from "@react-oauth/google"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const API = "http://localhost:5000"

  // 🔥 REMOVE SCROLLBAR
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // --- STANDARD LOGIN ---
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Enter email and password")
        return
      }

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("LOGIN RESPONSE:", data)

      if (!res.ok) {
        alert(data.msg || data.message || "Login failed")
        return
      }

      navigate("/otp", { state: { email } })

    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  // ✅ 2. NEW: GOOGLE LOGIN HANDLER
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the secure ID token to your backend
        body: JSON.stringify({ token: credentialResponse.credential }),
      })

      const data = await res.json()

      if (res.ok) {
        // Save the token and go straight to the feed!
        localStorage.setItem("token", data.token)
        navigate("/dashboard/feed")
      } else {
        alert(data.msg || "Google login failed")
      }
    } catch (err) {
      console.error("Google Login Error:", err)
      alert("Server error during Google login")
    }
  }

  return (
    <div
      className="auth-wrapper"
      style={{
        background: "linear-gradient(135deg, #0b1020, #1f1147 55%, #2b1364)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

        <div
          className="auth-card"
          style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(18px)",
            padding: "30px 28px",
            borderRadius: "22px",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 20px 60px rgba(5,8,25,0.45)",
            width: "370px",
            maxWidth: "100%",
            color: "white"
          }}
        >

          <div style={{
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            border: "3px solid #030d0f",
            overflow: "hidden",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 10px auto"
          }}>
            <img 
              src={logo} 
              alt="HireHelper Logo" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(2.8)"
              }} 
            />
          </div>
          
          <h1 style={{ marginTop: "10px", fontWeight: "600" }}>
            Hire Helper
          </h1>

          <p style={{ marginBottom: "18px", color: "#dbe5f3", fontSize: "14px" }}>
            Sign in to your Hire-a-Helper Account
          </p>

          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              boxSizing: "border-box"
            }}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "5px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              boxSizing: "border-box"
            }}
          />

          <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <Link
              to="/forgot-password"
              style={{
                color: "#38bdf8",
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg,#6d28d9,#7c3aed)",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "15px"
            }}
            onClick={handleLogin}
          >
            Sign In
          </button>

          {/* ✅ 3. REPLACED CUSTOM BUTTON WITH OFFICIAL GOOGLE COMPONENT */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login window closed or failed.")}
              text="sign_in_with"
              theme="outline"
              size="large"
              width="270" // Matches the container width perfectly
            />
          </div>

          <Link
            to="/register"
            style={{ color: "#38bdf8", textDecoration: "none" }}
          >
            Don’t have an account? Sign up
          </Link>

        </div>

      </motion.div>
    </div>
  )
}

export default Login