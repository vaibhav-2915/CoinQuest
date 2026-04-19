import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getWallet, deposit, withdraw, applyInterest, getTransactions } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const txType = { deposit: '🏦', withdrawal: '💸', interest: '📈', reward: '🏆' }

export default function Wallet() {
  const [wallet, setWallet] = useState(null)
  const [txs, setTxs] = useState([])
  const [form, setForm] = useState({ amount: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('deposit')
  const [interestResult, setInterestResult] = useState(null)

  const fetchData = async () => {
    const [w, t] = await Promise.all([getWallet(), getTransactions()])
    setWallet(w.data); setTxs(t.data)
  }

  useEffect(() => { fetchData().finally(() => setLoading(false)) }, [])

  const msg = (s, err = '') => { setSuccess(s); setError(err); setTimeout(() => { setSuccess(''); setError('') }, 4000) }

  const handleAction = async (e) => {
    e.preventDefault(); setActionLoading(true)
    try {
      if (activeTab === 'deposit') {
        await deposit({ amount: parseFloat(form.amount), description: form.description || 'Deposit' })
        msg('✅ Deposit successful!')
      } else {
        await withdraw({ amount: parseFloat(form.amount), description: form.description || 'Withdrawal' })
        msg('✅ Withdrawal successful!')
      }
      setForm({ amount: '', description: '' })
      await fetchData()
    } catch (err) { msg('', err.response?.data?.error || 'Action failed.') }
    finally { setActionLoading(false) }
  }

  const handleInterest = async () => {
    setActionLoading(true)
    try {
      const res = await applyInterest(); setInterestResult(res.data); await fetchData()
    } catch (err) { msg('', err.response?.data?.error || 'Failed.') }
    finally { setActionLoading(false) }
  }

  // Build chart data from transactions (cumulative balance simulation)
  const chartData = [...txs].reverse().reduce((acc, tx) => {
    const prev = acc.length ? acc[acc.length - 1].balance : 0
    const delta = tx.type === 'withdrawal' ? -tx.amount : tx.amount
    acc.push({ date: new Date(tx.date).toLocaleDateString(), balance: Math.max(0, prev + delta) })
    return acc
  }, []).slice(-15)

  if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main></div>

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h2>💳 My Wallet</h2><p>Manage your savings and track every rupee</p></div>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)', borderRadius: 20, padding: '32px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, fontSize: 120, opacity: 0.08 }}>💰</div>
          <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>CURRENT BALANCE</div>
          <div style={{ fontSize: 52, fontWeight: 900 }}>₹{wallet?.balance?.toFixed(2) ?? '0.00'}</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>Last interest: {wallet ? new Date(wallet.lastInterestApplied).toLocaleDateString() : '—'}</div>
          <button className="btn" onClick={handleInterest} disabled={actionLoading}
            style={{ marginTop: 16, background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            📈 Apply 5% Interest
          </button>
        </motion.div>

        {/* Interest Result Banner */}
        <AnimatePresence>
          {interestResult && (
            <motion.div className="alert-success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              🎉 Interest applied! You earned <strong>₹{interestResult.interestAmount?.toFixed(2)}</strong> on ₹{interestResult.principalAmount?.toFixed(2)}. New balance: <strong>₹{interestResult.newBalance?.toFixed(2)}</strong>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card-grid grid-2" style={{ marginBottom: 24 }}>
          {/* Deposit / Withdraw Form */}
          <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="auth-tabs" style={{ marginBottom: 20 }}>
              {['deposit', 'withdraw'].map(tab => (
                <button key={tab} type="button" className={`auth-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'deposit' ? '🏦 Deposit' : '💸 Withdraw'}
                </button>
              ))}
            </div>
            {error && <div className="auth-error">⚠️ {error}</div>}
            {success && <div className="alert-success">{success}</div>}
            <form onSubmit={handleAction}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input className="form-input" type="number" min="1" step="0.01" placeholder="0.00"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <input className="form-input" placeholder="e.g. Pocket money" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <button type="submit" className={`btn btn-full ${activeTab === 'deposit' ? 'btn-success' : 'btn-danger'}`} disabled={actionLoading}>
                {actionLoading ? '⏳ Processing…' : activeTab === 'deposit' ? '✅ Deposit Money' : '💸 Withdraw Money'}
              </button>
            </form>
          </motion.div>

          {/* Balance Chart */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div className="section-title">📊 Balance History</div>
            {chartData.length < 2
              ? <div className="empty-state"><div className="empty-icon">📊</div><h3>Make transactions to see your chart!</h3></div>
              : <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#9B99B8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9B99B8', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#1A1828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F0EEF8' }} />
                    <Area type="monotone" dataKey="balance" stroke="#6C63FF" fill="url(#bal)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
            }
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="section-title">📜 Transaction History</div>
          {txs.length === 0
            ? <div className="empty-state"><div className="empty-icon">📜</div><h3>No transactions yet!</h3></div>
            : <div className="tx-list">
              {txs.map(tx => (
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
      </main>
    </div>
  )
}
