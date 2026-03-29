import { useState } from 'react'
import { Plus, Check, BookOpen, Trash2 } from 'lucide-react'
import { mockStudy } from '../data/mockData'

function StudyPage() {
  const [subjects, setSubjects] = useState(mockStudy.subjects)
  const [showModal, setShowModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(null)
  const [newSubject, setNewSubject] = useState({ name: '', color: '#4f8cff' })
  const [newTask, setNewTask] = useState({ day: 'Lunes', task: '' })

  const totalTasks = subjects.reduce((a, s) => a + s.weeklyPlan.length, 0)
  const doneTasks = subjects.reduce((a, s) => a + s.weeklyPlan.filter(t => t.done).length, 0)
  const weekProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const toggleTask = (subjectId, taskIndex) => {
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      const plan = [...s.weeklyPlan]
      plan[taskIndex] = { ...plan[taskIndex], done: !plan[taskIndex].done }
      return { ...s, weeklyPlan: plan }
    }))
  }

  const handleAddSubject = () => {
    if (!newSubject.name) return
    setSubjects([...subjects, {
      id: Date.now(),
      ...newSubject,
      weeklyPlan: []
    }])
    setNewSubject({ name: '', color: '#4f8cff' })
    setShowModal(false)
  }

  const handleAddTask = (subjectId) => {
    if (!newTask.task) return
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      return { ...s, weeklyPlan: [...s.weeklyPlan, { ...newTask, done: false }] }
    }))
    setNewTask({ day: 'Lunes', task: '' })
    setShowTaskModal(null)
  }

  const handleDeleteTask = (subjectId, taskIndex) => {
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      const plan = s.weeklyPlan.filter((_, i) => i !== taskIndex)
      return { ...s, weeklyPlan: plan }
    }))
  }

  const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

  return (
    <>
      <div className="page-header">
        <h1>Estudio</h1>
        <p>Planning semanal - Selectividad</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm" style={{ fontWeight: 600 }}>Progreso semanal</div>
            <div className="text-xs text-muted">{doneTasks}/{totalTasks} tareas completadas</div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: weekProgress >= 70 ? 'var(--success)' : weekProgress >= 40 ? 'var(--warning)' : 'var(--text)' }}>
            {weekProgress}%
          </div>
        </div>
        <div className="progress-bar">
          <div className={`progress-fill ${weekProgress >= 70 ? 'success' : weekProgress >= 40 ? 'warning' : 'primary'}`} style={{ width: `${weekProgress}%` }} />
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Asignaturas</span>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Anadir
        </button>
      </div>

      {subjects.map(subject => {
        const subDone = subject.weeklyPlan.filter(t => t.done).length
        const subTotal = subject.weeklyPlan.length
        return (
          <div className="card" key={subject.id}>
            <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>
                <span className="color-dot" style={{ background: subject.color }} />
                {subject.name}
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${subDone === subTotal && subTotal > 0 ? 'badge-success' : 'badge-primary'}`}>
                  {subDone}/{subTotal}
                </span>
                <button className="btn btn-outline btn-sm" onClick={() => { setShowTaskModal(subject.id); setNewTask({ day: 'Lunes', task: '' }) }}>
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {subject.weeklyPlan.map((task, i) => (
              <div className="checkbox-row" key={i}>
                <div
                  className={`checkbox ${task.done ? 'checked' : ''}`}
                  onClick={() => toggleTask(subject.id, i)}
                >
                  {task.done && <Check size={12} color="white" />}
                </div>
                <div style={{ flex: 1 }}>
                  <span className={`checkbox-label ${task.done ? 'done' : ''}`}>{task.task}</span>
                  <div className="checkbox-meta">{task.day}</div>
                </div>
                <button
                  className="btn btn-sm"
                  style={{ background: 'transparent', color: 'var(--text-muted)', padding: 4 }}
                  onClick={() => handleDeleteTask(subject.id, i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {subject.weeklyPlan.length === 0 && (
              <div className="text-xs text-muted" style={{ padding: '8px 0' }}>
                Sin tareas esta semana. Anade tu planning.
              </div>
            )}
          </div>
        )
      })}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva asignatura</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} placeholder="Ej: Fisica" />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input type="color" value={newSubject.color} onChange={e => setNewSubject({ ...newSubject, color: e.target.value })} style={{ height: 40, padding: 4 }} />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleAddSubject}>Anadir</button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva tarea</h2>
            <div className="form-group">
              <label>Dia</label>
              <select value={newTask.day} onChange={e => setNewTask({ ...newTask, day: e.target.value })}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tarea</label>
              <input value={newTask.task} onChange={e => setNewTask({ ...newTask, task: e.target.value })} placeholder="Ej: Repasar tema 3 de derivadas" />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => setShowTaskModal(null)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={() => handleAddTask(showTaskModal)}>Anadir</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudyPage
