import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../hooks/useAuth"
import "../styles/auth.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data } = await api.post("/auth/login", { email, password })
      login(data.user, data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <h1 className="brand-title">TaskFlow</h1>
            <p className="brand-tagline">Organize. Manage. Achieve.</p>
            
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Create unlimited boards</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Manage todos efficiently</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Track your progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <div className="form-wrapper">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to your TaskFlow account</p>

            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="form-divider">
              <span>or</span>
            </div>

            <p className="form-footer">
              Don't have an account?{" "}
              <Link to="/register" className="link">
                Create one here
              </Link>
            </p>

            <div className="demo-info">
              <p className="demo-title">📝 Demo Credentials:</p>
              <p className="demo-text">Email: test@example.com</p>
              <p className="demo-text">Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}