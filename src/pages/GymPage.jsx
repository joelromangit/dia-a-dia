import { useState } from 'react'
import { Dumbbell, Plus, Check, X, ChevronDown, ChevronUp, Flame } from 'lucide-react'
import { mockGym } from '../data/mockData'

function GymPage() {
  const [routines, setRoutines] = useState(mockGym.routines)
  const [weekLog, setWeekLog] = useState(mockGym.weekLog)
  const [expandedRoutine, setExpandedRoutine] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [weeklyGoal] = useState(mockGym.weeklyGoal)

  const completedDays = weekLog.filter(d => d.completed).length
  const missedDays = weekLog.filter(d => !d.completed).length
  const streak = (() => {
    let count = 0
    const sorted = [...weekLog].sort((a, b) => b.date.localeCompare(a.date))
    for (const entry of sorted) {
      if (entry.completed) count++
      else break
    }
    return count
  })()

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

  const toggleDay = (index) => {
    setWeekLog(weekLog.map((entry, i) =>
      i === index ? { ...entry, completed: !entry.completed } : entry
    ))
  }

  const handleAddRoutine = () => {
    const name = prompt('Nombre de la rutina:')
    if (!name) return
    setRoutines([...routines, { id: Date.now(), name, exercises: [] }])
  }

  const handleAddExercise = (routineId) => {
    const name = prompt('Nombre del ejercicio:')
    if (!name) return
    const sets = prompt('Series:', '4')
    const reps = prompt('Repeticiones:', '10-12')
    setRoutines(routines.map(r => {
      if (r.id !== routineId) return r
      return { ...r, exercises: [...r.exercises, { name, sets: parseInt(sets) || 4, reps: reps || '10-12' }] }
    }))
  }

  return (
    <>
      <div className="page-header">
        <h1>Gym</h1>
        <p>Tus rutinas y asistencia</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: completedDays >= weeklyGoal ? 'var(--success)' : 'var(--warning)' }}>
            {completedDays}/{weeklyGoal}
          </div>
          <div className="kpi-label">Dias esta semana</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {streak} <Flame size={18} />
            </span>
          </div>
          <div className="kpi-label">Racha actual</div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Esta semana</span>
      </div>

      <div className="card">
        <div className="attendance-dots">
          {weekLog.map((entry, i) => {
            const date = new Date(entry.date)
            const dayName = dayNames[date.getDay()]
            return (
              <div
                key={i}
                className={`attendance-dot ${entry.completed ? 'completed' : 'missed'}`}
                onClick={() => toggleDay(i)}
                style={{ cursor: 'pointer' }}
              >
                {entry.completed ? <Check size={14} /> : dayName}
              </div>
            )
          })}
        </div>
        <div className="text-xs text-muted" style={{ textAlign: 'center', marginTop: 4 }}>
          Toca para cambiar asistencia
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Rutinas</span>
        <button className="btn btn-primary btn-sm" onClick={handleAddRoutine}>
          <Plus size={14} /> Anadir
        </button>
      </div>

      {routines.map(routine => {
        const isExpanded = expandedRoutine === routine.id
        return (
          <div className="card" key={routine.id}>
            <div
              className="flex justify-between items-center"
              onClick={() => setExpandedRoutine(isExpanded ? null : routine.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-title" style={{ marginBottom: 0 }}>
                <Dumbbell size={16} />
                {routine.name}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary">{routine.exercises.length} ejercicios</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {isExpanded && (
              <div style={{ marginTop: 12 }}>
                {routine.exercises.map((ex, i) => (
                  <div className="exercise-item" key={i}>
                    <span>{ex.name}</span>
                    <span className="exercise-sets">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-sm btn-block mt-2"
                  onClick={() => handleAddExercise(routine.id)}
                >
                  <Plus size={12} /> Anadir ejercicio
                </button>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export default GymPage
