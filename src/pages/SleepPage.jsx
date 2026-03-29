import { useState, useEffect, useRef } from 'react'
import { Moon, Sun, TrendingUp, Clock, Target, Zap } from 'lucide-react'
import { mockSleep } from '../data/mockData'

function SleepPage() {
  const [sleeping, setSleeping] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [records, setRecords] = useState(mockSleep.records)
  const [goal, setGoal] = useState(mockSleep.goal)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [editGoal, setEditGoal] = useState({ ...mockSleep.goal })
  const intervalRef = useRef(null)

  useEffect(() => {
    if (sleeping && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [sleeping, startTime])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSleepToggle = () => {
    if (!sleeping) {
      setSleeping(true)
      setStartTime(Date.now())
      setElapsed(0)
    } else {
      setSleeping(false)
      clearInterval(intervalRef.current)
      const hours = parseFloat((elapsed / 3600).toFixed(2))
      const now = new Date()
      const bedtime = new Date(startTime)
      const newRecord = {
        date: now.toISOString().split('T')[0],
        bedtime: `${String(bedtime.getHours()).padStart(2, '0')}:${String(bedtime.getMinutes()).padStart(2, '0')}`,
        wakeup: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        hours
      }
      setRecords([newRecord, ...records])
      setElapsed(0)
      setStartTime(null)
    }
  }

  const avgHours = records.length > 0
    ? (records.reduce((a, r) => a + r.hours, 0) / records.length).toFixed(1)
    : 0

  const goalDiff = (parseFloat(avgHours) - goal.hours).toFixed(1)
  const consistency = records.length > 0
    ? Math.round((records.filter(r => r.hours >= goal.hours - 0.5).length / records.length) * 100)
    : 0

  const bestNight = records.length > 0
    ? records.reduce((best, r) => r.hours > best.hours ? r : best, records[0])
    : null

  const handleSaveGoal = () => {
    setGoal({ ...editGoal, hours: parseFloat(editGoal.hours) })
    setShowGoalModal(false)
  }

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Sueno</h1>
            <p>Controla tu descanso</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => { setEditGoal({ ...goal }); setShowGoalModal(true) }}>
            <Target size={14} /> Objetivo
          </button>
        </div>
      </div>

      <div className="sleep-timer">
        <div className="timer-label">
          {sleeping ? 'Durmiendo...' : 'Listo para dormir'}
        </div>
        <div className="timer-display">{formatTime(elapsed)}</div>
        <button className={`sleep-btn ${sleeping ? 'active' : ''}`} onClick={handleSleepToggle}>
          {sleeping ? <Sun size={28} /> : <Moon size={28} />}
          {sleeping ? 'Despertar' : 'Dormir'}
        </button>
        {sleeping && (
          <div className="text-xs text-muted">
            Inicio: {new Date(startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: parseFloat(avgHours) >= goal.hours ? 'var(--success)' : 'var(--warning)' }}>
            {avgHours}h
          </div>
          <div className="kpi-label">Media semanal</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{goal.hours}h</div>
          <div className="kpi-label">Objetivo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: goalDiff >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {goalDiff > 0 ? '+' : ''}{goalDiff}h
          </div>
          <div className="kpi-label">vs objetivo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: consistency >= 70 ? 'var(--success)' : 'var(--warning)' }}>
            {consistency}%
          </div>
          <div className="kpi-label">Consistencia</div>
        </div>
      </div>

      {bestNight && (
        <div className="card">
          <div className="card-title">
            <Zap size={16} style={{ color: 'var(--warning)' }} />
            Mejor noche
          </div>
          <div className="text-sm">{bestNight.date} - {bestNight.hours}h ({bestNight.bedtime} a {bestNight.wakeup})</div>
        </div>
      )}

      <div className="section-header">
        <span className="section-title">Historial reciente</span>
      </div>

      {records.map((record, i) => {
        const hoursColor = record.hours >= goal.hours ? 'var(--success)' : record.hours >= goal.hours - 1 ? 'var(--warning)' : 'var(--danger)'
        return (
          <div className="card" key={i}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm" style={{ fontWeight: 600 }}>{record.date}</div>
                <div className="text-xs text-muted">{record.bedtime} → {record.wakeup}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: hoursColor }}>
                  {record.hours}h
                </div>
                <div className={`badge ${record.hours >= goal.hours ? 'badge-success' : record.hours >= goal.hours - 1 ? 'badge-warning' : 'badge-danger'}`}>
                  {record.hours >= goal.hours ? 'Cumplido' : `${(goal.hours - record.hours).toFixed(1)}h menos`}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Objetivo de sueno</h2>
            <div className="form-group">
              <label>Horas objetivo</label>
              <input type="number" step="0.5" value={editGoal.hours} onChange={e => setEditGoal({ ...editGoal, hours: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hora de dormir ideal</label>
              <input type="time" value={editGoal.bedtime} onChange={e => setEditGoal({ ...editGoal, bedtime: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hora de despertar ideal</label>
              <input type="time" value={editGoal.wakeup} onChange={e => setEditGoal({ ...editGoal, wakeup: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => setShowGoalModal(false)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleSaveGoal}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SleepPage
