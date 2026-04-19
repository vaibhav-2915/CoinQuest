import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

export default function Register() {
  const { registerUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'child', parentId: '', adminSecret: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        name: form.name, email: form.email, password: form.password, role: form.role,
        parentId: form.role === 'child' && form.parentId ? form.parentId : null,
        adminSecret: form.role === 'admin' ? form.adminSecret : null
      }
      const user = await registerUser(payload)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'parent') navigate('/parent')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="auth-logo">
          <div className="logo-emoji">🌟</div>
          <h1>Join KidBank</h1>
          <p>Start your savings adventure today!</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="auth-tabs" style={{ marginBottom: 20 }}>
            {['child', 'parent', 'admin'].map(r => (
              <button key={r} type="button"
                className={`auth-tab ${form.role === r ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: r })}>
                {r === 'child' ? '👶 Kid' : r === 'parent' ? '👨‍👩‍👧 Parent' : '🛡️ Admin'}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          {form.role === 'child' && (
            <div className="form-group">
              <label className="form-label">Parent ID (optional)</label>
              <input className="form-input" type="text" placeholder="Ask your parent for their ID"
                value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })} />
            </div>
          )}

          {form.role === 'admin' && (
            <div className="form-group">
              <label className="form-label">Admin Secret Key</label>
              <input className="form-input" type="password" placeholder="Enter system admin key"
                value={form.adminSecret} onChange={e => setForm({ ...form, adminSecret: e.target.value })} required />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Creating account…' : '✨ Create Account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </motion.div>
    </div>
  )
}
