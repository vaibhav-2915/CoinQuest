export const LEVELS = [
  { level: 1, name: 'Beginner Banker',  min: 0,    max: 99,    emoji: '🐣' },
  { level: 2, name: 'Smart Saver',      min: 100,  max: 299,   emoji: '🐥' },
  { level: 3, name: 'Money Wizard',     min: 300,  max: 599,   emoji: '🧙' },
  { level: 4, name: 'Investor Pro',     min: 600,  max: 999,   emoji: '💼' },
  { level: 5, name: 'Financial Guru',   min: 1000, max: Infinity, emoji: '🏆' },
]

export default function LevelProgress({ points, level }) {
  const info = LEVELS[Math.min(level - 1, 4)]
  const next = LEVELS[Math.min(level, 4)]
  const pct = level >= 5 ? 100
    : Math.round(((points - info.min) / (next.min - info.min)) * 100)

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <span style={{ fontSize: 40 }}>{info.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="level-badge">⭐ Level {level} — {info.name}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>{points} pts</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          {level < 5 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              {next.min - points} pts to <strong>{next.name}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
