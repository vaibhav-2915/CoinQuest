import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getChildren, assignMission } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

export default function ParentDashboard() {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ childId: '', title: '', description: '', rewardPoints: 20, targetAmount: '', icon: '🎯' })
  const [success, setSuccess] = useState('')

  const fetch = () => getChildren().then(r => setChildren(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      await assignMission({
        childId: parseInt(form.childId), title: form.title, description: form.description,
        rewardPoints: parseInt(form.rewardPoints), targetAmount: form.targetAmount ? parseFloat(form.targetAmount) : null,
        icon: form.icon
      })
      setSuccess('✅ Mission assigned successfully!'); setShowForm(false)
      setForm({ childId: '', title: '', description: '', rewardPoints: 20, targetAmount: '', icon: '🎯' })
      setTimeout(() => setSuccess(''), 4000)
    } catch { /* noop */ }
  }

  if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main></div>

  const totalBalance = children.reduce((a, c) => a + c.balance, 0)
  const avgLevel = children.length ? (children.reduce((a, c) => a + c.level, 0) / children.length).toFixed(1) : 0

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>👨‍👩‍👧 Parent Dashboard</h2>
          <p>Welcome back, {user?.name}! Monitor your children's progress below.</p>
        </div>

        {success && <div className="alert-success">{success}</div>}

        {/* Stats */}
        <div className="card-grid grid-3" style={{ marginBottom: 28 }}>
          {[
            { icon: '👶', color: 'purple', label: 'Children', value: children.length },
            { icon: '💰', color: 'green',  label: 'Total Savings', value: `₹${totalBalance.toFixed(2)}` },
            { icon: '⭐', color: 'yellow', label: 'Avg Level', value: avgLevel },
          ].map((s, i) => (
            <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
            </motion.div>
          ))}
        </div>

        {/* Assign Mission Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '➕ Assign Mission'}
          </button>
        </div>

        {/* Assign Mission Form */}
        {showForm && (
          <motion.div className="card" style={{ marginBottom: 28 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-title">📋 Assign Custom Mission</div>
            <form onSubmit={handleAssign}>
              <div className="card-grid grid-2">
                <div className="form-group">
                  <label className="form-label">Select Child</label>
                  <select className="form-input form-select" value={form.childId} onChange={e => setForm({ ...form, childId: e.target.value })} required>
                    <option value="">-- Select --</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Icon Emoji</label>
                  <input className="form-input" placeholder="e.g. 🎯" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mission Title</label>
                  <input className="form-input" placeholder="e.g. Save ₹300" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Reward Points</label>
                  <input className="form-input" type="number" min="1" value={form.rewardPoints} onChange={e => setForm({ ...form, rewardPoints: e.target.value })} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description</label>
                  <input className="form-input" placeholder="Describe the mission" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Amount (optional ₹)</label>
                  <input className="form-input" type="number" placeholder="e.g. 300" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">🚀 Assign Mission</button>
            </form>
          </motion.div>
        )}

        {/* Children Cards */}
        <div className="section-title">👶 Your Children</div>
        {children.length === 0
          ? <div className="empty-state card"><div className="empty-icon">👶</div><h3>No children linked yet</h3><p>Ask your child to register with your parent ID: <strong>{user?.id}</strong></p></div>
          : <div className="card-grid grid-2">
            {children.map((c, i) => (
              <motion.div key={c.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ cursor: 'pointer' }} onClick={() => {}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{c.name}</div>
                    <span className="level-badge" style={{ fontSize: 12, padding: '3px 10px' }}>Level {c.level}</span>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--success)' }}>₹{c.balance.toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Balance</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>⭐ {c.points} points</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.email}</span>
                </div>
                <Link to={`/parent/child/${c.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                  📊 View Analytics
                </Link>
              </motion.div>
            ))}
          </div>
        }

        {/* Parent ID Info */}
        <motion.div className="card" style={{ marginTop: 28, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>ℹ️ Your Parent ID</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary-light)', letterSpacing: 2 }}>{user?.id}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Share this with your children when they register so they get linked to your account.</div>
        </motion.div>
      </main>
    </div>
  )
}
