import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa"

// ✅ 1. Import the Google Login component
import { GoogleLogin } from "@react-oauth/google"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const getPasswordStrength = (value) => {
    if (!value) return { label: "", color: "#94a3b8" }
    if (value.length < 6) return { label: "Weak password", color: "#ef4444" }
    if (value.length < 10) return { label: "Medium password", color: "#f59e0b" }
    return { label: "Strong password", color: "#22c55e" }
  }

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields.")
      return
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      alert("Password and confirm password do not match.")
      return
    }
    if (!acceptTerms) {
      alert("Please accept the terms and privacy policy.")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.msg)
        navigate("/otp", { state: { email: email } })
      } else {
        alert(data.msg)
      }
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Cannot connect to server.")
    }
  }

  // ✅ 2. Add the Google Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })

      const data = await res.json()

      if (res.ok) {
        // Save the token and go straight to the feed!
        localStorage.setItem("token", data.token)
        navigate("/dashboard/feed")
      } else {
        alert(data.msg || "Google registration failed")
      }
    } catch (err) {
      console.error("Google Auth Error:", err)
      alert("Server error during Google registration")
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

        {/* 🔥 3D Removed */}
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
          <FaUserPlus size={75} color="#38bdf8" />

          <h1 style={{ marginTop: "10px", fontWeight: "600" }}>
            Create Your Account
          </h1>

          <p style={{ marginBottom: "18px", color: "#dbe5f3", fontSize: "14px" }}>
            Join the Hire-Helper Community
          </p>

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "40px", marginBottom: "8px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeBtnStyle}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <p style={{ marginBottom: "10px", fontSize: "12px", textAlign: "left", color: getPasswordStrength(password).color }}>
            {getPasswordStrength(password).label}
          </p>

          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={eyeBtnStyle}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", textAlign: "left", marginBottom: "8px", color: "#dbe5f3" }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{ marginTop: "2px" }}
            />
            I agree to the Terms of Service and Privacy Policy.
          </label>

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
              marginTop: "10px",
              marginBottom: "15px"
            }}
            onClick={handleRegister}
          >
            Create Account
          </button>

          {/* ✅ 3. Add the Google Button Component */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google signup window closed or failed.")}
              text="signup_with" // Sets the text to "Sign up with Google"
              theme="outline"
              size="large"
              width="290" // Perfectly matches the width of your inputs inside the 370px card!
            />
          </div>

          <Link
            to="/login"
            style={{ color: "#38bdf8", textDecoration: "none", display: "block" }}
          >
            Already have an account? Sign in
          </Link>

        </div>

      </motion.div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.15)",
  color: "white",
  boxSizing: "border-box" // Added to keep inputs from overflowing
}

const eyeBtnStyle = {
  position: "absolute",
  right: "12px",
  top: "10px",
  background: "transparent",
  border: "none",
  color: "#dbe5f3",
  cursor: "pointer"
}

export default Register