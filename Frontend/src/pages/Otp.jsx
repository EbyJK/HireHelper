import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { FaUnlockAlt } from "react-icons/fa"

function Otp() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [otp, setOtp] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  const email = location.state?.email
  const from = location.state?.from

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter the OTP code.")
      return
    }

    if (!email) {
      alert("Email not found. Please register or log in again.")
      navigate("/")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok && data.token) {

        // 🔥 CONDITION ADDED HERE
        if (from === "forgot") {
          navigate("/reset-password", { state: { email } })
        } else {
          localStorage.setItem("token", data.token)
          navigate("/dashboard")
        }

      } else {
        alert(data.msg || "Invalid or expired OTP")
      }

    } catch (error) {
      console.error("Verification failed:", error)
      alert("Cannot connect to server.")
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      alert("Email not found. Please try login/register again.")
      return
    }

    if (resendCooldown > 0) return

    try {
      const response = await fetch("http://localhost:5000/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, from }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.msg || "OTP resent successfully")
        setResendCooldown(30)
      } else {
        alert(data.msg || data.message || "Failed to resend OTP")
      }
    } catch (error) {
      console.error("Resend OTP failed:", error)
      alert("Cannot connect to server.")
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
          <FaUnlockAlt size={75} color="#38bdf8" />

          <h1 style={{ marginTop: "10px", fontWeight: "600" }}>
            Verify Account
          </h1>

          <p style={{ marginBottom: "16px", color: "#dbe5f3", fontSize: "14px" }}>
            We sent a 6-digit code to {email || "your email"}
          </p>

          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              textAlign: "center",
              fontSize: "18px",
              letterSpacing: "4px"
            }}
          />

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
              marginTop: "10px"
            }}
            onClick={handleVerify}
          >
            Verify
          </button>

          <button
            onClick={handleResendOtp}
            disabled={resendCooldown > 0}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "10px",
              border: "1px solid #a78bfa",
              background: resendCooldown > 0 ? "rgba(148, 163, 184, 0.35)" : "transparent",
              color: "white",
              fontWeight: "600",
              cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
              marginTop: "10px"
            }}
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
          </button>
          <Link to="/login" style={{ color: "#c4b5fd", textDecoration: "none", display: "inline-block", marginTop: "14px", fontSize: "14px" }}>
            Back to login
          </Link>

        </div>

      </motion.div>
    </div>
  )
}

export default Otp