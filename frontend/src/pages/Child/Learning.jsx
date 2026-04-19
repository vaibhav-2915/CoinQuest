import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getModules } from '../../services/api'
import Sidebar from '../../components/Sidebar'

export default function Learning() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getModules().then(r => setModules(r.data)).finally(() => setLoading(false)) }, [])

  const done = modules.filter(m => m.completed).length

  if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main></div>

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h2>📚 Learning Hub</h2><p>Learn about banking, saving, and growing your money!</p></div>

        {/* Progress */}
        <motion.div className="card" style={{ marginBottom: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>🎓 Your Learning Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{done}/{modules.length} Complete</span>
          </div>
          <div className="progress-bar" style={{ height: 14 }}>
            <div className="progress-fill" style={{ width: `${modules.length ? (done / modules.length) * 100 : 0}%` }} />
          </div>
          {done === modules.length && modules.length > 0 && (
            <div style={{ marginTop: 12, color: 'var(--accent)', fontWeight: 800, fontSize: 15 }}>
              🏆 Congratulations! You completed all modules!
            </div>
          )}
        </motion.div>

        {/* Module Cards */}
        <div className="card-grid grid-2">
          {modules.map((mod, i) => (
            <motion.div key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={`/learning/${mod.id}`} className={`module-card ${mod.completed ? 'done' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="module-emoji">{mod.icon}</span>
                  {mod.completed && <span style={{ fontSize: 24 }}>✅</span>}
                </div>
                <div>
                  <div className="module-cat">{mod.category}</div>
                  <div className="module-title">{mod.title}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>⭐ +{mod.rewardPoints} pts</span>
                  {mod.completed
                    ? <span className="module-score">Score: {mod.score}%</span>
                    : <span style={{ fontSize: 13, color: 'var(--primary-light)', fontWeight: 700 }}>Start →</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
