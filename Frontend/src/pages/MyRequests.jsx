import { useState, useEffect } from "react"
import axios from "axios"
import {
  FaComments,
  FaPhone,
  FaTimes,
  FaMapMarkerAlt,
  FaClock,
  FaImage,
  FaTag,
  FaMoneyBillWave
} from "react-icons/fa"

const initialRequests = [
  {
    id: 1,
    task: "Clean Backyard",
    location: "Bhubaneswar",
    owner: "Rahul",
    date: "2 March 2026",
    status: "Pending",
    category: "Cleaning",
    taskDate: "2026-03-02",
    taskTime: "10:00",
    description: "Need help cleaning the backyard area and removing waste.",
    taskImages: [],
    contactPhone: "+919999999999",
    budget: 500
  },
  {
    id: 2,
    task: "Fix Leaky Faucet",
    location: "Patna",
    owner: "Anita",
    date: "25 Feb 2026",
    status: "Accepted",
    category: "Repairs",
    taskDate: "2026-02-25",
    taskTime: "11:30",
    description: "Leaky faucet needs inspection and repair.",
    taskImages: [],
    contactPhone: "+918888888888",
    budget: 800
  },
  {
    id: 3,
    task: "Move Furniture",
    location: "Rourkela",
    owner: "Vikram",
    date: "18 Feb 2026",
    status: "Rejected",
    category: "Moving",
    taskDate: "2026-02-18",
    taskTime: "15:00",
    description: "Help needed to move a few furniture items to another room.",
    taskImages: [],
    contactPhone: "+917777777777",
    budget: 1200
  },
  {
    id: 4,
    task: "Tutoring Math",
    location: "Cuttack",
    owner: "Amit",
    date: "12 Jan 2026",
    status: "Accepted",
    category: "Teaching",
    taskDate: "2026-01-12",
    taskTime: "18:00",
    description: "Need tutoring for basic math concepts and practice.",
    taskImages: [],
    contactPhone: "+916666666666",
    budget: 1000
  },
  {
    id: 5,
    task: "Repair Kitchen",
    location: "Mumbai",
    owner: "Samir",
    date: "3 March 2026",
    status: "Pending",
    category: "Cooking",
    taskDate: "2026-03-03",
    taskTime: "09:30",
    description: "Minor kitchen repairs and organization help needed.",
    taskImages: [],
    contactPhone: "+915555555555",
    budget: 600
  },
]

const statusStyle = {
  Pending:  { bg: "#fef3c7", color: "#b45309", dot: "#f59e0b" },
  Accepted: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  Rejected: { bg: "#ffe4e6", color: "#be123c", dot: "#f43f5e" },
}

const taskIcons = {
  "Clean Backyard":   "🌿",
  "Fix Leaky Faucet": "🔧",
  "Move Furniture":   "📦",
  "Tutoring Math":    "📐",
  "Repair Kitchen":   "🍳",
}

function getImgSrc(img) {
  if (!img) return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900"
  if (img.startsWith("http")) return img
  return `http://localhost:5000${img}`
}

function buildWhatsAppLink(rawPhone, message) {
  const cleanPhone = String(rawPhone || "").replace(/[^\d]/g, "")
  if (!cleanPhone) return ""
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

function ImageSlider({ images, height = 220 }) {
  const [current, setCurrent] = useState(0)
  const imgs = images && images.length > 0 ? images : [null]

  useEffect(() => {
    if (imgs.length <= 1) return
    const t = setInterval(() => setCurrent(p => (p + 1) % imgs.length), 3500)
    return () => clearInterval(t)
  }, [imgs.length])

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden" }}>
      {imgs.map((img, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.6s ease",
            zIndex: i === current ? 1 : 0
          }}
        >
          <img src={getImgSrc(img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)" }} />
        </div>
      ))}

      {imgs.length > 1 && (
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, zIndex: 10 }}>
          {imgs.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 16 : 5,
                height: 5,
                borderRadius: 3,
                background: i === current ? "white" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TaskRequestModal({ task, onClose }) {
  const contactPhone = task?.contactPhone || ""

  const message = `Hi ${task?.owner || "there"}, I'm interested in your task "${task?.task}".`
  const waLink = buildWhatsAppLink(contactPhone, message)
  const canChat = Boolean(waLink)
  const canCall = Boolean(String(contactPhone).replace(/[^\d+]/g, ""))

  const handleChatClick = () => {
    if (!canChat) {
      alert("Chat contact is not available for this task yet.")
      return
    }
    window.open(waLink, "_blank", "noopener,noreferrer")
  }

  const handleCallClick = () => {
    if (!canCall) {
      alert("Phone number is not available for this task yet.")
      return
    }
    const tel = `tel:${String(contactPhone).replace(/[^\d+]/g, "")}`
    window.location.href = tel
  }

  const imgs = Array.isArray(task?.taskImages) && task.taskImages.length > 0 ? task.taskImages : []

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8,10,20,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(12px)"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        .maction-btn{flex:1;padding:11px 8px;border-radius:12px;border:none;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'DM Sans',sans-serif;transition:all 0.18s;}
        .maction-btn:hover{transform:translateY(-2px);filter:brightness(1.08);}
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 22,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          animation: "modalIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ImageSlider images={imgs} height={220} />

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 12,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)"
            }}
            aria-label="Close"
          >
            <FaTimes size={13} />
          </button>

          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 12, background: "#6366f1", color: "white", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
            <FaTag size={11} /> {task?.category || "Task"}
          </div>

          <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, zIndex: 12 }}>
            <h2 style={{ margin: 0, color: "white", fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {task?.task || "Task"}
            </h2>
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "14px 18px 10px" }}>
          <div style={{ marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
              📝 Description
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#334155", lineHeight: 1.75 }}>{task?.description || "No description available."}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", border: "1px solid #bae6fd", borderRadius: 14, padding: "12px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FaMapMarkerAlt size={16} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#0284c7", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Location</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0c4a6e" }}>{task?.location || "-"}</div>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0", borderRadius: 14, padding: "12px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FaClock size={16} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#15803d", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Schedule</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#15803d" }}>
                  {task?.taskDate || "-"} {task?.taskTime ? `• ${task.taskTime}` : ""}
                </div>
              </div>
            </div>

            {(task?.budget || task?.budget === 0) && (
              <div style={{ gridColumn: "1 / -1", background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0", borderRadius: 14, padding: "12px 12px", display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FaMoneyBillWave size={16} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#15803d", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Budget</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#15803d" }}>{task.budget} (approx.)</div>
                </div>
              </div>
            )}

            <div style={{ gridColumn: "1 / -1", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "12px 12px", display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1.5px solid #e2e8f0" }}>
                <FaPhone size={16} color="#6366f1" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Contact Phone</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#0f172a" }}>{task?.contactPhone || "Not available"}</div>
              </div>
            </div>
          </div>

          {imgs.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <FaImage size={12} /> Photos ({imgs.length})
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
                {imgs.slice(0, 9).map((img, i) => (
                  <div key={i} style={{ position: "relative", width: "100%", paddingBottom: "75%", borderRadius: 10, overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
                    <img src={getImgSrc(img)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: 14, borderTop: "1px solid #f1f5f9", background: "white", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="maction-btn"
              style={{ background: canChat ? "#f1f5f9" : "#f8fafc", color: canChat ? "#64748b" : "#94a3b8", border: "none", opacity: canChat ? 1 : 0.9 }}
              onClick={handleChatClick}
              disabled={!canChat}
            >
              <FaComments size={14} /> Chat
            </button>
            <button
              className="maction-btn"
              style={{ background: canCall ? "#f0fdf4" : "#f8fafc", color: canCall ? "#15803d" : "#94a3b8", border: "none", opacity: canCall ? 1 : 0.9 }}
              onClick={handleCallClick}
              disabled={!canCall}
            >
              <FaPhone size={14} /> Call
            </button>
            <button className="maction-btn" style={{ background: "#fff", color: "#0f172a", border: "1.5px solid #e2e8f0" }} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyRequests() {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState("All")
  const [mainTab, setMainTab] = useState("requests") // "requests" | "registered"
  const [regFilter, setRegFilter] = useState("All") // "All" | "Accepted" | "Rejected"
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/requests/my", {
          headers: { Authorization: `Bearer ${token}` }
        })

        const liveRequests = res.data.map(req => {
          const formattedStatus = req.status
            ? req.status.charAt(0).toUpperCase() + req.status.slice(1)
            : "Pending"
          return {
            id: req._id,
            task: req.taskId?.title || "Task",
            category: req.taskId?.category || "",
            location: req.taskId?.location || "Remote",
            owner: req.taskId?.owner?.name || "Member",
            taskDate: req.taskId?.date || "",
            taskTime: req.taskId?.time || "",
            description: req.taskId?.description || "",
            taskImages: req.taskId?.taskImages || [],
            contactPhone: req.taskId?.contactPhone || "",
            budget: req.taskId?.budget,
            date: new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: formattedStatus
          }
        })

        setRequests([...initialRequests, ...liveRequests])
      } catch (error) {
        console.error("Error fetching my requests:", error)
      }
    }
    fetchMyRequests()
  }, [])

  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter)

  // ✅ Registered Tasks = Accepted + Rejected (not Pending)
  const registeredTasks = requests.filter(r => r.status === "Accepted" || r.status === "Rejected")
  const filteredRegistered = regFilter === "All"
    ? registeredTasks
    : registeredTasks.filter(r => r.status === regFilter)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .mr-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%);
          padding: 48px 36px;
        }

        .mr-header { margin-bottom: 24px; }
        .mr-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.5px;
        }
        .mr-subtitle { margin-top: 5px; font-size: 14px; color: #64748b; }

        .main-tabs {
          display: flex; gap: 0;
          margin-bottom: 24px;
          background: white;
          border-radius: 14px;
          padding: 5px;
          border: 1.5px solid #e2e8f0;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .main-tab-btn {
          padding: 9px 22px; border-radius: 10px; border: none;
          font-size: 13px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          cursor: pointer; color: #64748b;
          background: transparent; transition: all 0.2s;
        }
        .main-tab-btn.active-requests {
          background: #6366f1; color: white;
          box-shadow: 0 3px 10px rgba(99,102,241,0.3);
        }
        .main-tab-btn.active-registered {
          background: #0f172a; color: white;
          box-shadow: 0 3px 10px rgba(15,23,42,0.2);
        }

        .mr-stats { display: flex; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
        .stat-card {
          flex: 1; min-width: 90px; background: white; border-radius: 14px;
          padding: 14px 18px; border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.1); }
        .stat-num { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; line-height: 1; }
        .stat-label { font-size: 12px; color: #94a3b8; margin-top: 4px; font-weight: 500; }

        .mr-filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .filter-pill {
          padding: 6px 16px; border-radius: 20px;
          border: 1.5px solid #e2e8f0; background: white;
          font-size: 13px; font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer; color: #64748b;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .filter-pill:hover { border-color: #a5b4fc; color: #4f46e5; transform: translateY(-1px); }
        .fp-All      { background: #1e293b !important; color: white !important; border-color: #1e293b !important; }
        .fp-Pending  { background: #fef3c7 !important; color: #b45309 !important; border-color: #fde68a !important; }
        .fp-Accepted { background: #dcfce7 !important; color: #15803d !important; border-color: #86efac !important; }
        .fp-Rejected { background: #ffe4e6 !important; color: #be123c !important; border-color: #fca5a5 !important; }

        .mr-card {
          background: white; border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 24px rgba(99,102,241,0.07);
          overflow: hidden;
        }
        table { width: 100%; border-collapse: collapse; }
        thead tr {
          background: linear-gradient(135deg, #f8faff, #f3f0ff);
          border-bottom: 1.5px solid #e2e8f0;
        }
        thead th {
          padding: 14px 20px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 700;
          color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;
          text-align: left;
        }
        thead th:last-child { text-align: center; }
        tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
          animation: fadeRow 0.35s ease both;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f8faff; }
        tbody tr.mr-row-click { cursor: pointer; }
        @keyframes fadeRow {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        tbody td {
          padding: 15px 20px; font-size: 14px; color: #1e293b;
          font-weight: 500; vertical-align: middle;
        }
        tbody td:last-child { text-align: center; }
        .task-cell { display: flex; align-items: center; gap: 10px; }
        .task-icon-sm {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0; transition: transform 0.2s;
        }
        tbody tr:hover .task-icon-sm { transform: scale(1.1) rotate(-5deg); }
        .task-name { font-weight: 600; color: #0f172a; }
        .loc-cell { color: #475569; font-size: 13px; }
        .date-cell { color: #64748b; font-size: 13px; white-space: nowrap; }
        .owner-cell { display: flex; align-items: center; gap: 8px; }
        .owner-av {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: white;
          font-family: 'Sora', sans-serif; flex-shrink: 0;
        }
        .status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 13px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
          white-space: nowrap;
        }
        tbody tr:hover .status-pill { transform: scale(1.08); }
        .empty { padding: 48px; text-align: center; }
        .empty-icon { font-size: 40px; margin-bottom: 10px; }
        .empty-text { font-size: 15px; font-family: 'Sora', sans-serif; font-weight: 600; color: #475569; }
        .empty-sub  { font-size: 13px; color: #94a3b8; margin-top: 4px; }

        /* ===== REGISTERED CARDS ===== */
        .reg-filter-row {
          display: flex; gap: 8px; margin-bottom: 20px;
          align-items: center; flex-wrap: wrap;
        }
        .reg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .reg-card {
          background: white; border-radius: 16px;
          padding: 20px 20px 20px 24px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .reg-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.10); }

        /* Green left border for Accepted */
        .reg-card.card-accepted { border-color: #bbf7d0; }
        .reg-card.card-accepted::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, #22c55e, #16a34a);
        }
        /* Red left border for Rejected */
        .reg-card.card-rejected { border-color: #fecaca; opacity: 0.88; }
        .reg-card.card-rejected::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, #f43f5e, #e11d48);
        }

        .reg-card-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; margin-bottom: 10px;
        }
        .reg-card.card-accepted .reg-card-icon { background: linear-gradient(135deg, #dcfce7, #bbf7d0); }
        .reg-card.card-rejected .reg-card-icon { background: linear-gradient(135deg, #ffe4e6, #fecaca); }

        .reg-card-title {
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #0f172a; margin-bottom: 8px;
        }
        .reg-card-meta {
          font-size: 13px; color: #64748b;
          display: flex; flex-direction: column; gap: 5px;
        }
        .reg-card-badge {
          position: absolute; top: 14px; right: 14px;
          font-size: 11px; font-weight: 700;
          padding: 4px 10px; border-radius: 999px;
          font-family: 'Sora', sans-serif;
        }
        .badge-accepted { background: #dcfce7; color: #15803d; }
        .badge-rejected { background: #ffe4e6; color: #be123c; }
      `}</style>

      <div className="mr-root">
        <div className="mr-header">
          <h1 className="mr-title">My Requests</h1>
          <p className="mr-subtitle">Track all the tasks you requested to help</p>
        </div>

        {/* MAIN TABS */}
        <div className="main-tabs">
          <button
            className={`main-tab-btn ${mainTab === "requests" ? "active-requests" : ""}`}
            onClick={() => setMainTab("requests")}
          >
            📋 My Requests
          </button>
          <button
            className={`main-tab-btn ${mainTab === "registered" ? "active-registered" : ""}`}
            onClick={() => setMainTab("registered")}
          >
            🗂️ Registered Tasks ({registeredTasks.length})
          </button>
        </div>

        {/* ===== MY REQUESTS TAB ===== */}
        {mainTab === "requests" && (
          <>
            <div className="mr-stats">
              {[
                { label: "Total",    count: requests.length,                                      color: "#6366f1" },
                { label: "Pending",  count: requests.filter(r => r.status === "Pending").length,  color: "#f59e0b" },
                { label: "Accepted", count: requests.filter(r => r.status === "Accepted").length, color: "#22c55e" },
                { label: "Rejected", count: requests.filter(r => r.status === "Rejected").length, color: "#f43f5e" },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-num" style={{ color: s.color }}>{s.count}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mr-filters">
              {["All", "Pending", "Accepted", "Rejected"].map(f => (
                <button
                  key={f}
                  className={`filter-pill ${filter === f ? `fp-${f}` : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "All" ? "All Requests" : f}
                </button>
              ))}
            </div>

            <div className="mr-card">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty">
                          <div className="empty-icon">📭</div>
                          <div className="empty-text">No {filter} requests</div>
                          <div className="empty-sub">Try a different filter</div>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((req, i) => {
                    const s = statusStyle[req.status]
                    return (
                      <tr
                        key={req.id}
                        className="mr-row-click"
                        onClick={() => setSelectedTask(req)}
                        style={{ animationDelay: `${i * 55}ms` }}
                      >
                        <td>
                          <div className="task-cell">
                            <div className="task-icon-sm">{taskIcons[req.task] || "📌"}</div>
                            <span className="task-name">{req.task}</span>
                          </div>
                        </td>
                        <td className="loc-cell">📍 {req.location}</td>
                        <td>
                          <div className="owner-cell">
                            <div className="owner-av">{req.owner[0]}</div>
                            {req.owner}
                          </div>
                        </td>
                        <td className="date-cell">📅 {req.date}</td>
                        <td>
                          <span className="status-pill" style={{ background: s.bg, color: s.color }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ===== REGISTERED TASKS TAB ===== */}
        {mainTab === "registered" && (
          <>
            {/* Filter row */}
            <div className="reg-filter-row">
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600, fontFamily: "Sora, sans-serif" }}>
                Filter:
              </span>
              {["All", "Accepted", "Rejected"].map(f => (
                <button
                  key={f}
                  className={`filter-pill ${regFilter === f ? `fp-${f}` : ""}`}
                  onClick={() => setRegFilter(f)}
                >
                  {f === "All"
                    ? `All (${registeredTasks.length})`
                    : f === "Accepted"
                    ? `✓ Accepted (${requests.filter(r => r.status === "Accepted").length})`
                    : `✕ Rejected (${requests.filter(r => r.status === "Rejected").length})`}
                </button>
              ))}
            </div>

            {filteredRegistered.length === 0 ? (
              <div style={{
                background: "white", borderRadius: 16, padding: "60px 20px",
                textAlign: "center", color: "#94a3b8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
              }}>
                <div style={{ fontSize: "52px", marginBottom: "12px" }}>📭</div>
                <p style={{ fontWeight: 700, fontSize: "16px", margin: 0, fontFamily: "Sora, sans-serif" }}>
                  No {regFilter === "All" ? "" : regFilter} registered tasks
                </p>
                <p style={{ fontSize: "13px", marginTop: "6px" }}>
                  Tasks will appear here once owner responds
                </p>
              </div>
            ) : (
              <div className="reg-grid">
                {filteredRegistered.map((req) => (
                  <div
                    key={req.id}
                    className={`reg-card ${req.status === "Accepted" ? "card-accepted" : "card-rejected"}`}
                  >
                    {/* Status badge - top right */}
                    <div className={`reg-card-badge ${req.status === "Accepted" ? "badge-accepted" : "badge-rejected"}`}>
                      {req.status === "Accepted" ? "✓ Accepted" : "✕ Rejected"}
                    </div>

                    {/* Icon */}
                    <div className="reg-card-icon">
                      {taskIcons[req.task] || "📌"}
                    </div>

                    {/* Title */}
                    <div className="reg-card-title">{req.task}</div>

                    {/* Meta */}
                    <div className="reg-card-meta">
                      <span>📍 {req.location}</span>
                      <span>👤 Owner: {req.owner}</span>
                      <span>📅 {req.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {selectedTask && (
        <TaskRequestModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}