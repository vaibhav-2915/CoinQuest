import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAdminStats, getAllUsers, getModules, createModule, deleteAdminModule } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import { FiUsers, FiBarChart2, FiActivity, FiArrowUpRight, FiPlus, FiTrash2, FiBookOpen, FiCheckCircle } from 'react-icons/fi'

const cardAnim = (i) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.08 } })

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users') // 'users' or 'modules'
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [showForm, setShowForm] = useState(false)
  const [newModule, setNewModule] = useState({
    title: '', content: '', category: 'Basics', rewardPoints: 10, icon: '📚',
    quizQuestions: [{ questionText: '', optionA: '', optionB: '', optionC: '', correctOption: 'A' }]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    Promise.all([getAdminStats(), getAllUsers(), getModules()])
      .then(([s, u, m]) => {
        setStats(s.data.stats)
        setUsers(u.data)
        setModules(m.data)
      })
      .finally(() => setLoading(false))
  }

  const handleAddQuestion = () => {
    setNewModule({
      ...newModule,
      quizQuestions: [...newModule.quizQuestions, { questionText: '', optionA: '', optionB: '', optionC: '', correctOption: 'A' }]
    })
  }

  const handleCreateModule = async (e) => {
    e.preventDefault()
    try {
      await createModule(newModule)
      setShowForm(false)
      loadData()
      setNewModule({
        title: '', content: '', category: 'Basics', rewardPoints: 10, icon: '📚',
        quizQuestions: [{ questionText: '', optionA: '', optionB: '', optionC: '', correctOption: 'A' }]
      })
    } catch (err) {
      alert('Failed to create module: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteModule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return
    try {
      await deleteAdminModule(id)
      loadData()
    } catch (err) {
      alert('Failed to delete module')
    }
  }

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main>
    </div>
  )

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2>🛡️ Global Admin Dashboard</h2>
              <p>System-wide visibility and content management</p>
            </div>
            <div className="tab-control">
               <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Users</button>
               <button className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`} onClick={() => setActiveTab('modules')}>📚 Modules</button>
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="card-grid grid-4" style={{ marginBottom: 28 }}>
          {[
            { icon: <FiUsers />, color: 'blue', label: 'Total Users', value: stats?.totalUsers },
            { icon: <FiActivity />, color: 'green', label: 'Active Parents', value: stats?.parents },
            { icon: <FiBookOpen />, color: 'purple', label: 'Total Modules', value: modules.length },
            { icon: <FiArrowUpRight />, color: 'yellow', label: 'Total Missions', value: stats?.totalMissions },
          ].map((s, i) => (
            <motion.div key={i} className={`stat-card ${s.color}`} {...cardAnim(i)}>
              <div className="stat-icon">{s.icon}</div>
              <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'users' ? (
            <motion.div key="users" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card">
              <div className="section-title">👥 All Registered Users</div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr><th>User</th><th>Role</th><th>Email</th><th>Balance / Points</th><th>Last Seen</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td><div style={{ fontWeight: 700 }}>{u.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {u.id}</div></td>
                        <td><span className={`badge badge-${u.role}`}>{u.role.toUpperCase()}</span></td>
                        <td>{u.email}</td>
                        <td>{u.role === 'child' ? <span>₹{u.balance.toFixed(2)} | ⭐ {u.points}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{new Date(u.lastLogin).toLocaleString()}</div>
                          <div style={{ fontSize: 11, color: 'var(--success-green)' }}>{(Date.now() - new Date(u.lastLogin)) < (1000 * 60 * 5) ? '● Online' : ''}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div key="modules" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0 }}>📚 Learning Modules</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : <><FiPlus /> Add Module</>}
                </button>
              </div>

              {showForm && (
                <motion.div className="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: 24, overflow: 'hidden' }}>
                  <form onSubmit={handleCreateModule}>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Module Title</label>
                        <input className="form-input" value={newModule.title} onChange={e => setNewModule({...newModule, title: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Icon (Emoji)</label>
                        <input className="form-input" value={newModule.icon} onChange={e => setNewModule({...newModule, icon: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid-2">
                       <div className="form-group">
                        <label className="form-label">Category</label>
                        <input className="form-input" value={newModule.category} onChange={e => setNewModule({...newModule, category: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Reward Points</label>
                        <input className="form-input" type="number" value={newModule.rewardPoints} onChange={e => setNewModule({...newModule, rewardPoints: parseInt(e.target.value)})} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Content</label>
                      <textarea className="form-input" rows="4" value={newModule.content} onChange={e => setNewModule({...newModule, content: e.target.value})} required />
                    </div>

                    <div className="section-title" style={{ marginTop: 20 }}>❓ Quiz Questions</div>
                    {newModule.quizQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="quiz-q-form" style={{ background: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12, marginBottom: 15 }}>
                        <div className="form-group">
                          <label className="form-label">Question {qIdx + 1}</label>
                          <input className="form-input" value={q.questionText} onChange={e => {
                            const qs = [...newModule.quizQuestions]; qs[qIdx].questionText = e.target.value;
                            setNewModule({...newModule, quizQuestions: qs})
                          }} required />
                        </div>
                        <div className="grid-3">
                          {['A','B','C'].map(opt => (
                            <div key={opt} className="form-group">
                              <label className="form-label">Option {opt} {q.correctOption === opt && '✅'}</label>
                              <input className="form-input" value={q[`option${opt}`]} onChange={e => {
                                const qs = [...newModule.quizQuestions]; qs[qIdx][`option${opt}`] = e.target.value;
                                setNewModule({...newModule, quizQuestions: qs})
                              }} required />
                            </div>
                          ))}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Correct Option</label>
                          <select className="form-input" value={q.correctOption} onChange={e => {
                            const qs = [...newModule.quizQuestions]; qs[qIdx].correctOption = e.target.value;
                            setNewModule({...newModule, quizQuestions: qs})
                          }}>
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline" onClick={handleAddQuestion} style={{ marginBottom: 20 }}>+ Add Question</button>
                    <button type="submit" className="btn btn-primary btn-full">✨ Create Module</button>
                  </form>
                </motion.div>
              )}

              <div className="card-grid grid-1">
                {modules.map(mod => (
                  <div key={mod.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                      <div style={{ fontSize: 24 }}>{mod.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{mod.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mod.category} • ⭐ {mod.rewardPoints} points</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div className="badge badge-success"><FiCheckCircle /> {mod.quizQuestions?.length} Questions</div>
                      <button className="icon-btn danger" onClick={() => handleDeleteModule(mod.id)}><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
