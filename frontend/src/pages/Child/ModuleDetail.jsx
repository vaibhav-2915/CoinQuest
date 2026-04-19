import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getModule, submitQuiz } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

export default function ModuleDetail() {
  const { refreshUser } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState('read') // 'read' | 'quiz' | 'result'
  const [answers, setAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(0)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { getModule(id).then(r => setModule(r.data)).finally(() => setLoading(false)) }, [id])

  const handleAnswer = (qId, option) => setAnswers(prev => ({ ...prev, [qId]: option }))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await submitQuiz(id, { answers })
      setResult(res.data)
      setPhase('result')
      if (res.data.pointsEarned > 0) {
        await refreshUser()
      }
    } catch { /* errors handled */ }
    finally { setSubmitting(false) }
  }

  if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><div className="spinner-wrap"><div className="spinner" /></div></main></div>
  if (!module) return <div className="app-layout"><Sidebar /><main className="main-content"><p>Module not found.</p></main></div>

  const q = module.questions[currentQ]
  const total = module.questions.length

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => navigate('/learning')}>← Back</button>

        <AnimatePresence mode="wait">
          {/* ── READ PHASE ── */}
          {phase === 'read' && (
            <motion.div key="read" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="page-header">
                <h2>{module.icon} {module.title}</h2>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{module.category} · ⭐ {module.rewardPoints} pts</span>
              </div>
              <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-line' }}>{module.content}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" onClick={() => setPhase('quiz')}>
                  📝 Take the Quiz ({total} Questions)
                </button>
                {module.completed && (
                  <button className="btn btn-outline" onClick={() => setPhase('quiz')}>Retake Quiz</button>
                )}
              </div>
              {module.completed && (
                <div className="alert-success" style={{ marginTop: 16 }}>
                  ✅ You already completed this module with a score of <strong>{module.score}%</strong>!
                </div>
              )}
            </motion.div>
          )}

          {/* ── QUIZ PHASE ── */}
          {phase === 'quiz' && q && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>📝 Quiz — {module.title}</h2>
                <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 14 }}>Q {currentQ + 1} / {total}</span>
              </div>

              {/* Progress */}
              <div className="progress-bar" style={{ marginBottom: 28, height: 8 }}>
                <div className="progress-fill" style={{ width: `${((currentQ + 1) / total) * 100}%` }} />
              </div>

              <div className="card">
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, lineHeight: 1.5 }}>{q.question}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {q.options.map((opt, i) => (
                    <button key={i}
                      className={`quiz-option ${answers[q.id] === opt ? 'selected' : ''}`}
                      onClick={() => handleAnswer(q.id, opt)}>
                      <span style={{ fontWeight: 800, marginRight: 10, color: 'var(--primary-light)' }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
                  {currentQ > 0 && <button className="btn btn-outline" onClick={() => setCurrentQ(q => q - 1)}>← Prev</button>}
                  {currentQ < total - 1
                    ? <button className="btn btn-primary" onClick={() => setCurrentQ(q => q + 1)} disabled={!answers[q.id]}>Next →</button>
                    : <button className="btn btn-success" onClick={handleSubmit} disabled={submitting || Object.keys(answers).length < total}>
                        {submitting ? '⏳ Grading…' : '🎯 Submit Quiz'}
                      </button>
                  }
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESULT PHASE ── */}
          {phase === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>{result.passed ? '🎉' : '😅'}</div>
                <h2 style={{ fontSize: 32, marginBottom: 8 }}>{result.passed ? 'Congratulations!' : 'Keep Trying!'}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
                  You scored <strong style={{ color: result.passed ? 'var(--success)' : 'var(--danger)' }}>{result.percentage}%</strong> ({result.score}/{result.total} correct)
                </p>

                <div style={{ display: 'inline-flex', gap: 24, background: 'var(--bg3)', borderRadius: 16, padding: '20px 32px', marginBottom: 28 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>+{result.pointsEarned}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>POINTS EARNED</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: result.passed ? 'var(--success)' : 'var(--danger)' }}>
                      {result.percentage}%
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>SCORE</div>
                  </div>
                </div>

                {result.newBadges?.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🏅 New Badges Earned!</div>
                    {result.newBadges.map((b, i) => (
                      <span key={i} className="level-badge" style={{ marginRight: 8 }}>{b}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button className="btn btn-outline" onClick={() => { setPhase('quiz'); setAnswers({}); setCurrentQ(0); setResult(null) }}>🔄 Retry</button>
                  <button className="btn btn-primary" onClick={() => navigate('/learning')}>← Back to Modules</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
