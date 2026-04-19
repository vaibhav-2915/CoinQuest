import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getWallet, getTransactions, getMissions, getModules } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import LevelProgress from '../../components/LevelProgress'

const card = (i) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.08 } })

export default function ChildDashboard() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [txs, setTxs] = useState([])
  const [missions, setMissions] = useState([])
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getWallet(), getTransactions(), getMissions(), getModules()])
      .then(([w, t, m, mod]) => {
        setWallet(w.data); setTxs(t.data); setMissions(m.data); setModules(mod.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main>
    </div>
  )

  const activeMissions = missions.filter(m => m.status === 'active').slice(0, 3)
  const completedModules = modules.filter(m => m.completed).length
  const earnedBadges = missions.filter(m => m.status === 'completed').length
  const txType = { deposit: '🏦', withdrawal: '💸', interest: '📈', reward: '🏆' }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>👋 Welcome back, {user?.name}!</h2>
          <p>Check your bank progress and keep saving smart 🌟</p>
        </div>

        <LevelProgress points={user?.points ?? 0} level={user?.level ?? 1} />

        {/* Stats Row */}
        <div className="card-grid grid-4" style={{ marginBottom: 28 }}>
          {[
            { icon: '💰', color: 'purple', label: 'Balance', value: `₹${wallet?.balance?.toFixed(2) ?? '0.00'}` },
            { icon: '🎯', color: 'pink',   label: 'Active Missions', value: missions.filter(m => m.status === 'active').length },
            { icon: '📚', color: 'teal',   label: 'Modules Done', value: `${completedModules}/${modules.length}` },
            { icon: '🏆', color: 'yellow', label: 'Missions Won', value: earnedBadges },
          ].map((s, i) => (
            <motion.div key={i} className="stat-card" {...card(i)}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
            </motion.div>
          ))}
        </div>

        <div className="card-grid grid-2">
          {/* Active Missions */}
          <motion.div className="card" {...card(4)}>
            <div className="section-title">🎯 Active Missions
              <Link to="/missions" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>See all →</Link>
            </div>
            {activeMissions.length === 0
              ? <div className="empty-state"><div className="empty-icon">🎉</div><h3>All missions done!</h3></div>
              : activeMissions.map(m => (
                <div key={m.id} className="mission-card" style={{ marginBottom: 10 }}>
                  <span className="mission-emoji">{m.icon}</span>
                  <div className="mission-info">
                    <div className="mission-title">{m.title}</div>
                    <div className="mission-points">⭐ {m.rewardPoints} pts</div>
                  </div>
                </div>
              ))}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div className="card" {...card(5)}>
            <div className="section-title">💳 Recent Transactions
              <Link to="/wallet" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>See all →</Link>
            </div>
            {txs.length === 0
              ? <div className="empty-state"><div className="empty-icon">💳</div><h3>No transactions yet</h3></div>
              : <div className="tx-list">
                {txs.slice(0, 5).map(tx => (
                  <div key={tx.id} className="tx-item">
                    <div className={`tx-icon tx-${tx.type}`}>{txType[tx.type] ?? '💳'}</div>
                    <div className="tx-info">
                      <div className="tx-desc">{tx.description}</div>
                      <div className="tx-date">{new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                    <div className={`tx-amount ${tx.type === 'withdrawal' ? 'neg' : 'pos'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            }
          </motion.div>
        </div>

        {/* Learning Modules Preview */}
        <motion.div className="card" style={{ marginTop: 24 }} {...card(6)}>
          <div className="section-title">📚 Learning Modules
            <Link to="/learning" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>Explore →</Link>
          </div>
          <div className="card-grid grid-4">
            {modules.map(mod => (
              <Link key={mod.id} to={`/learning/${mod.id}`} className={`module-card ${mod.completed ? 'done' : ''}`}>
                <div className="module-emoji">{mod.icon}</div>
                <div className="module-title">{mod.title}</div>
                <div className="module-cat">{mod.category}</div>
                {mod.completed && <div className="module-score">✅ Score: {mod.score}%</div>}
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
