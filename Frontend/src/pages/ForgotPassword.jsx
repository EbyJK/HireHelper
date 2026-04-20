import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  const handleForgot = async () => {
    if (!email) {
      alert("Enter your email")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("OTP sent to your email")
        navigate("/otp", { state: { email, from: "forgot" } })
      } else {
        alert(data.msg || data.message || "Error")
      }

    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0b1020, #1f1147 55%, #2b1364)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(18px)",
          padding: "30px 28px",
          borderRadius: "22px",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 20px 60px rgba(5,8,25,0.45)",
          width: "350px",
          maxWidth: "100%",
          color: "white",
          textAlign: "center"
        }}>
          <h2>Forgot Password</h2>
          <p style={{ marginTop: "8px", marginBottom: "16px", color: "#dbe5f3", fontSize: "14px" }}>
            Enter your email and we will send OTP
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.15)",
              color: "white"
            }}
          />

          <button
            onClick={handleForgot}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg,#6d28d9,#7c3aed)",
              color: "white"
            }}
          >
            Send OTP
          </button>
          <Link to="/login" style={{ color: "#c4b5fd", textDecoration: "none", display: "inline-block", marginTop: "14px", fontSize: "14px" }}>
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword