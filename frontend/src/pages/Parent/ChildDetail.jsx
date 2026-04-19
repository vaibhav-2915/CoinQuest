import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getChildAnalytics } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#6C63FF', '#FF6B9D', '#FFD93D', '#6BCB77', '#4ECDC4']
const txType = { deposit: '🏦', withdrawal: '💸', interest: '📈', reward: '🏆' }

export default function ChildDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getChildAnalytics(id).then(r => setData(r.data)).finally(() => setLoading(false)) }, [id])

  if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main></div>
  if (!data) return <div className="app-layout"><Sidebar /><main className="main-content"><p>Child not found.</p></main></div>

  // Chart data: module progress
  const moduleChartData = data.moduleProgress.map(m => ({
    name: m.title.split(' ').slice(0, 2).join(' '),
    score: m.score,
    completed: m.completed ? 1 : 0
  }))

  // Pie: activity breakdown
  const pieData = [
    { name: 'Missions Done', value: data.missionsCompleted },
    { name: 'Modules Done', value: data.modulesCompleted },
    { name: 'Badges', value: data.badgesEarned },
  ].filter(d => d.value > 0)

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => navigate('/parent')}>← Back</button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)', borderRadius: 20, padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900 }}>
            {data.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{data.name}</div>
            <div style={{ opacity: 0.85, fontSize: 14, fontWeight: 600 }}>⭐ Level {data.level} · {data.points} points</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 36, fontWeight: 900 }}>₹{data.balance.toFixed(2)}</div>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Current Balance</div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="card-grid grid-4" style={{ marginBottom: 28 }}>
          {[
            { icon: '✅', color: 'green',  label: 'Missions Done', value: data.missionsCompleted },
            { icon: '📚', color: 'teal',   label: 'Modules Done', value: data.modulesCompleted },
            { icon: '🏅', color: 'yellow', label: 'Badges Earned', value: data.badgesEarned },
            { icon: '🎯', color: 'purple', label: 'Active Missions', value: data.activeMissions.length },
          ].map((s, i) => (
            <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
            </motion.div>
          ))}
        </div>

        <div className="card-grid grid-2" style={{ marginBottom: 24 }}>
          {/* Quiz Scores Bar Chart */}
          <motion.div className="card" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div className="section-title">📊 Quiz Scores by Module</div>
            {moduleChartData.length === 0
              ? <div className="empty-state"><div className="empty-icon">📊</div><h3>No quiz data yet</h3></div>
              : <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={moduleChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#9B99B8', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#9B99B8', fontSize: 11 }} unit="%" />
                    <Tooltip contentStyle={{ background: '#1A1828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F0EEF8' }} formatter={(v) => [`${v}%`, 'Score']} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {moduleChartData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            }
          </motion.div>

          {/* Activity Pie Chart */}
          <motion.div className="card" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="section-title">🎯 Activity Breakdown</div>
            {pieData.length === 0
              ? <div className="empty-state"><div className="empty-icon">🎯</div><h3>No activity yet</h3></div>
              : <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1A1828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F0EEF8' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#9B99B8' }} />
                  </PieChart>
                </ResponsiveContainer>
            }
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="section-title">💳 Recent Transactions</div>
          {data.recentTransactions.length === 0
            ? <div className="empty-state"><div className="empty-icon">💳</div><h3>No transactions yet</h3></div>
            : <div className="tx-list">
              {data.recentTransactions.map(tx => (
                <div key={tx.id} className="tx-item">
                  <div className={`tx-icon tx-${tx.type}`}>{txType[tx.type] ?? '💳'}</div>
                  <div className="tx-info">
                    <div className="tx-desc">{tx.description}</div>
                    <div className="tx-date">{new Date(tx.date).toLocaleString()}</div>
                  </div>
                  <div className={`tx-amount ${tx.type === 'withdrawal' ? 'neg' : 'pos'}`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          }
        </motion.div>

        {/* Module Progress */}
        <motion.div className="card" style={{ marginTop: 24 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="section-title">📚 Module Progress</div>
          <div className="card-grid grid-2">
            {data.moduleProgress.map(m => (
              <div key={m.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{m.icon} {m.title}</span>
                  <span style={{ fontSize: 13, color: m.completed ? 'var(--success)' : 'var(--text-muted)', fontWeight: 700 }}>
                    {m.completed ? `✅ ${m.score}%` : '⏳ Pending'}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${m.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
