import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getMissions, completeMission } from '../../services/api'
import Sidebar from '../../components/Sidebar'

import { useAuth } from '../../context/AuthContext'

export default function Missions() {
  const { refreshUser } = useAuth()
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(null)
  const [success, setSuccess] = useState('')

  const fetch = async () => {
    const res = await getMissions(); setMissions(res.data)
  }
  useEffect(() => { fetch().finally(() => setLoading(false)) }, [])

  const handleComplete = async (id) => {
    setCompleting(id)
    try {
      await completeMission(id)
      setSuccess('🎉 Mission completed! Points added to your account.')
      setTimeout(() => setSuccess(''), 4000)
      await fetch()
      await refreshUser()
    } catch { /* already handled */ }
    finally { setCompleting(null) }
  }

  const active = missions.filter(m => m.status === 'active')
  const done = missions.filter(m => m.status === 'completed')

  if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main></div>

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h2>🎯 Missions</h2><p>Complete missions to earn points and badges!</p></div>

        {success && <div className="alert-success">{success}</div>}

        {/* Stats Row */}
        <div className="card-grid grid-3" style={{ marginBottom: 28 }}>
          {[
            { icon: '🔥', label: 'Active', value: active.length, color: 'purple' },
            { icon: '✅', label: 'Completed', value: done.length, color: 'green' },
            { icon: '⭐', label: 'Points Earned', value: done.reduce((a, m) => a + m.rewardPoints, 0), color: 'yellow' },
          ].map((s, i) => (
            <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
            </motion.div>
          ))}
        </div>

        {/* Active Missions */}
        <div className="section-title">🔥 Active Missions</div>
        {active.length === 0
          ? <div className="empty-state card" style={{ marginBottom: 28 }}><div className="empty-icon">🎉</div><h3>All missions completed!</h3><p>Check back later for new challenges.</p></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {active.map((m, i) => (
              <motion.div key={m.id} className="mission-card" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <span className="mission-emoji">{m.icon}</span>
                <div className="mission-info">
                  <div className="mission-title">{m.title}</div>
                  <div className="mission-desc">{m.description}</div>
                  <div className="mission-meta">
                    <span className={`badge-pill badge-type-${m.type}`}>{m.type}</span>
                    <span className="mission-points">⭐ {m.rewardPoints} pts</span>
                    {m.targetAmount && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Target: ₹{m.targetAmount}</span>}
                  </div>
                </div>
                <button className="btn btn-success" disabled={completing === m.id}
                  onClick={() => handleComplete(m.id)}>
                  {completing === m.id ? '⏳' : '✅ Complete'}
                </button>
              </motion.div>
            ))}
          </div>
        }

        {/* Completed Missions */}
        {done.length > 0 && (
          <>
            <div className="section-title">🏆 Completed Missions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {done.map((m, i) => (
                <motion.div key={m.id} className="mission-card completed" initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: i * 0.04 }}>
                  <span className="mission-emoji">{m.icon}</span>
                  <div className="mission-info">
                    <div className="mission-title" style={{ textDecoration: 'line-through' }}>{m.title}</div>
                    <div className="mission-meta">
                      <span className="badge-pill badge-done">✅ Completed</span>
                      <span className="mission-points">+{m.rewardPoints} pts</span>
                      {m.completedAt && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(m.completedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
