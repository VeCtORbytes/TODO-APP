import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import "../styles/board.css"

export default function BoardPage() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const [newTodoDesc, setNewTodoDesc] = useState("")
  const [priority, setPriority] = useState("medium")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBoardAndTodos()
  }, [boardId])

  const fetchBoardAndTodos = async () => {
    try {
      const boardRes = await api.get(`/boards/${boardId}`)
      setBoard(boardRes.data)

      const todosRes = await api.get(`/todos/${boardId}`)
      setTodos(todosRes.data)
    } catch (err) {
      console.error("Failed to fetch board:", err)
      navigate("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const createTodo = async (e) => {
    e.preventDefault()
    if (!newTodoTitle.trim()) return

    try {
      const { data } = await api.post("/todos", {
        boardId,
        title: newTodoTitle,
        description: newTodoDesc,
        priority,
      })
      setTodos([data, ...todos])
      setNewTodoTitle("")
      setNewTodoDesc("")
      setPriority("medium")
    } catch (err) {
      alert("Failed to create todo")
    }
  }

  const updateTodoStatus = async (todoId, newStatus) => {
    try {
      const { data } = await api.put(`/todos/${todoId}`, { status: newStatus })
      setTodos(todos.map((t) => (t._id === todoId ? data : t)))
    } catch (err) {
      alert("Failed to update todo")
    }
  }

  const deleteTodo = async (todoId) => {
    if (!window.confirm("Delete this todo?")) return

    try {
      await api.delete(`/todos/${todoId}`)
      setTodos(todos.filter((t) => t._id !== todoId))
    } catch (err) {
      alert("Failed to delete todo")
    }
  }

  const getFilteredTodos = () => {
    if (filter === "completed") return todos.filter((t) => t.status === "completed")
    if (filter === "active") return todos.filter((t) => t.status !== "completed")
    return todos
  }

  const filteredTodos = getFilteredTodos()
  const completedCount = todos.filter((t) => t.status === "completed").length
  const activeCount = todos.filter((t) => t.status !== "completed").length

  if (loading) {
    return (
      <div className="board-page-wrapper">
        <div className="loading-state">
          <p>Loading board...</p>
        </div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="board-page-wrapper">
        <div className="loading-state">
          <p>Board not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="board-page-wrapper">
      {/* Header */}
      <div className="board-header-wrapper">
        <div className="board-header-content">
          <div className="board-header-left">
            <button onClick={() => navigate("/dashboard")} className="back-btn">
              ← Back to Boards
            </button>
            <h1 className="board-title">{board.title}</h1>
            <p className="board-subtitle">{board.description || "No description"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="board-container">
        {/* Add Todo Section */}
        <div className="add-todo-card">
          <h2 className="add-todo-title">Add Todo</h2>
          <form onSubmit={createTodo} className="add-todo-form">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Todo title..."
              className="todo-input"
            />
            <textarea
              value={newTodoDesc}
              onChange={(e) => setNewTodoDesc(e.target.value)}
              placeholder="Description (optional)"
              className="todo-textarea"
              rows="3"
            ></textarea>
            <div className="todo-form-footer">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button type="submit" className="btn-add-todo">
                + Add Todo
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs-wrapper">
          <div className="filter-tabs">
            {[
              { key: "all", label: "All", count: todos.length },
              { key: "active", label: "Active", count: activeCount },
              { key: "completed", label: "Completed", count: completedCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`tab-button ${filter === tab.key ? "active" : ""}`}
              >
                <span>{tab.label}</span>
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Todos List */}
        <div className="todos-wrapper">
          {filteredTodos.length === 0 ? (
            <div className="empty-todos">
              <h3>No todos found</h3>
              <p>
                {filter === "all" && "Add your first todo to get started"}
                {filter === "active" && "All tasks completed! Great job!"}
                {filter === "completed" && "No completed tasks yet"}
              </p>
            </div>
          ) : (
            <div className="todos-list">
              {filteredTodos.map((todo) => (
                <div key={todo._id} className="todo-item">
                  <button
                    onClick={() => {
                      const newStatus = todo.status === "completed" ? "pending" : "completed"
                      updateTodoStatus(todo._id, newStatus)
                    }}
                    className={`todo-checkbox ${todo.status === "completed" ? "checked" : ""}`}
                  >
                    {todo.status === "completed" && "✓"}
                  </button>

                  <div className="todo-content">
                    <h4 className={`todo-title ${todo.status === "completed" ? "completed" : ""}`}>
                      {todo.title}
                    </h4>
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                    <div className="todo-meta">
                      <span className={`priority-badge priority-${todo.priority}`}>
                        {todo.priority}
                      </span>
                      {todo.dueDate && (
                        <span className="todo-date">
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="btn-delete-todo"
                    title="Delete todo"
                  >
                    <span className="material-symbols-outlined">delete_forever</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        {todos.length > 0 && (
          <div className="stats-card">
            <h3 className="stats-title">Progress</h3>
            <div className="stats-grid">
              <div className="stat-item total">
                <div className="stat-number">{todos.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-item active">
                <div className="stat-number">{activeCount}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-item completed">
                <div className="stat-number">{completedCount}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>Completion</span>
                <span>{Math.round((completedCount / todos.length) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: (completedCount / todos.length) * 100 + "%" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}