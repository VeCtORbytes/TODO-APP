import { useState, useEffect } from "react"
import api from "../services/api"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import "../styles/dashboard.css"

export default function Dashboard() {
  const [boards, setBoards] = useState([])
  const [newBoardTitle, setNewBoardTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const { user , logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const { data } = await api.get("/boards")
      setBoards(data)
    } catch (err) {
      console.error("Failed to fetch boards:", err)
    } finally {
      setLoading(false)
    }
  }

  const createBoard = async (e) => {
    e.preventDefault()
    if (!newBoardTitle.trim()) return

  const colors = ["#ea580c", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

    try {
      const { data } = await api.post("/boards", {
      title: newBoardTitle, 
      color: randomColor 
    })
      setBoards([data, ...boards])
      setNewBoardTitle("")
    } catch (err) {
      alert("Failed to create board")
    }
  }

  const deleteBoard = async (id) => {
    if (!window.confirm("Delete this board and all todos?")) return

    try {
      await api.delete(`/boards/${id}`)
      setBoards(boards.filter((b) => b._id !== id))
    } catch (err) {
      alert("Failed to delete board")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header-wrapper">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">Dashboard - {user?.name}</h1>
            <p className="dashboard-subtitle">Organize your tasks and manage your work</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Create Board Card */}
        <div className="create-board-card">
          <form onSubmit={createBoard} className="create-board-form">
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Enter board name..."
              className="board-input-field"
            />
            <button type="submit" className="create-board-btn">
              Create Board
            </button>
          </form>
        </div>

        {/* Boards Grid */}
        {loading ? (
          <div className="loading-state">
            <p>Loading your boards...</p>
          </div>
        ) : boards.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-content">
              <h2>No boards yet</h2>
              <p>Create your first board to get started</p>
            </div>
          </div>
        ) : (
          <div className="boards-container">
            {boards.map((board) => (
              <div
                key={board._id}
                className="board-grid-card"
                onClick={() => navigate(`/board/${board._id}`)}
              >
                <div className="board-card-inner">
                  <div className="board-card-header">
                    <h3 className="board-card-title">{board.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteBoard(board._id)
                      }}
                      className="board-delete-btn"
                      title="Delete board"
                    >
                    <span class="material-symbols-outlined">delete_forever</span>
                    </button>
                  </div>
                  
                  <p className="board-card-description">
                    {board.description || "No description"}
                  </p>
                  
                  <div className="board-card-footer">
                    <span className="board-date">
                      {new Date(board.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div
                      className="board-color-dot"
                      style={{ backgroundColor: board.color || "#ea580c" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}