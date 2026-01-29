import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../hooks/useAuth"
import "../styles/auth.css"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post("/auth/register", { name, email, password })
      login(data.user, data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
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
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Join TaskFlow and start organizing</p>

            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="form-control"
                  required
                />
              </div>

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
                <p className="form-hint">Min 6 characters</p>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="form-divider">
              <span>or</span>
            </div>

            <p className="form-footer">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}