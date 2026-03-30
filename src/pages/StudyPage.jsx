import { useState, useCallback } from 'react'
import {
  Plus, Check, Trash2, Settings, X, ChevronLeft, ChevronRight,
  Calculator, Leaf, FlaskConical, BookOpen, Globe, Atom,
  CircleDot, CircleCheck, Circle
} from 'lucide-react'
import { mockStudy } from '../data/mockData'
import { useDb } from '../hooks/useDb'
import { studyDb } from '../lib/db'

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

const ICONS = {
  calculator: Calculator,
  leaf: Leaf,
  flask: FlaskConical,
  book: BookOpen,
  globe: Globe,
  atom: Atom,
}

const ICON_OPTIONS = [
  { key: 'calculator', label: 'Mates' },
  { key: 'leaf', label: 'Bio' },
  { key: 'flask', label: 'Quimica' },
  { key: 'book', label: 'Lengua' },
  { key: 'globe', label: 'Geo' },
  { key: 'atom', label: 'Fisica' },
]

const COLOR_OPTIONS = ['#ff6b6b', '#51cf66', '#4f8cff', '#ffd43b', '#cc5de8', '#ff922b', '#20c997', '#748ffc']

function StudyPage() {
  const fetchSubjects = useCallback(() => studyDb.getSubjects(), [])
  const [subjects, setSubjects, { loading, error }] = useDb(fetchSubjects, mockStudy.subjects)
  const [activeSubject, setActiveSubject] = useState(null)
  const [modal, setModal] = useState(null)
  const [newSubject, setNewSubject] = useState({ name: '', color: '#4f8cff', icon: 'calculator' })
  const [newTask, setNewTask] = useState({ day: 'Lunes', task: '', topic: '' })
  const [newTopic, setNewTopic] = useState('')
  const [editForm, setEditForm] = useState(null)
  const [showError, setShowError] = useState(true)
  const [errors, setErrors] = useState({})

  const detail = activeSubject ? subjects.find(s => s.id === activeSubject) : null

  const clearErrors = () => setErrors({})

  const closeModal = () => {
    setModal(null)
    clearErrors()
  }

  // Helpers
  const getSubjectProgress = (s) => {
    const total = s.weeklyPlan.length
    const done = s.weeklyPlan.filter(t => t.done).length
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const getCurrentTopic = (s) => s.topics.find(t => t.status === 'current')
  const getNextTopic = (s) => {
    const currentIdx = s.topics.findIndex(t => t.status === 'current')
    return currentIdx >= 0 && currentIdx < s.topics.length - 1
      ? s.topics[currentIdx + 1]
      : null
  }
  const getDoneTopics = (s) => s.topics.filter(t => t.status === 'done').length

  // Global KPIs
  const totalTasks = subjects.reduce((a, s) => a + s.weeklyPlan.length, 0)
  const doneTasks = subjects.reduce((a, s) => a + s.weeklyPlan.filter(t => t.done).length, 0)
  const weekProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  // Today's tasks
  const dayIndex = new Date().getDay()
  const todayName = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][dayIndex]
  const todayTasks = subjects.flatMap(s =>
    s.weeklyPlan
      .map((t, i) => ({ ...t, subjectId: s.id, subjectName: s.name, subjectColor: s.color, taskIndex: i }))
      .filter(t => t.day === todayName)
  )

  // Validation
  const validateAddSubject = () => {
    const errs = {}
    if (!newSubject.name.trim()) errs.name = 'El nombre es obligatorio'
    else if (subjects.some(s => s.name.toLowerCase() === newSubject.name.trim().toLowerCase()))
      errs.name = 'Ya existe una asignatura con ese nombre'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateEditSubject = (id) => {
    const errs = {}
    if (!editForm.name.trim()) errs.name = 'El nombre es obligatorio'
    else if (subjects.some(s => s.id !== id && s.name.toLowerCase() === editForm.name.trim().toLowerCase()))
      errs.name = 'Ya existe una asignatura con ese nombre'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateAddTask = () => {
    const errs = {}
    if (!newTask.task.trim()) errs.task = 'El nombre de la tarea es obligatorio'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateAddTopic = () => {
    const errs = {}
    if (!newTopic.trim()) errs.topic = 'El nombre del tema es obligatorio'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Actions
  const toggleTask = (subjectId, taskIndex) => {
    const subject = subjects.find(s => s.id === subjectId)
    const task = subject?.weeklyPlan[taskIndex]
    const newDone = !task?.done
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      const plan = [...s.weeklyPlan]
      plan[taskIndex] = { ...plan[taskIndex], done: newDone }
      return { ...s, weeklyPlan: plan }
    }))
    if (task?.id) studyDb.updateTask(task.id, { done: newDone })
  }

  const handleAddSubject = () => {
    if (!validateAddSubject()) return
    const tempId = Date.now()
    const created = {
      id: tempId,
      ...newSubject,
      name: newSubject.name.trim(),
      topics: [],
      weeklyPlan: []
    }
    setSubjects([...subjects, created])
    setNewSubject({ name: '', color: '#4f8cff', icon: 'calculator' })
    closeModal()
    studyDb.addSubject(created).then(data => {
      if (data) {
        setSubjects(prev => prev.map(s => s.id === tempId ? { ...s, id: data.id } : s))
      }
    })
  }

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id))
    setActiveSubject(null)
    closeModal()
    studyDb.deleteSubject(id)
  }

  const handleSaveSubject = (id) => {
    if (!validateEditSubject(id)) return
    setSubjects(subjects.map(s =>
      s.id === id ? { ...s, name: editForm.name.trim(), color: editForm.color, icon: editForm.icon } : s
    ))
    closeModal()
    studyDb.updateSubject(id, { name: editForm.name.trim(), color: editForm.color, icon: editForm.icon })
  }

  const handleAddTopic = (subjectId) => {
    if (!validateAddTopic()) return
    const name = newTopic.trim()
    const subject = subjects.find(s => s.id === subjectId)
    const order = subject ? subject.topics.length + 1 : 1
    setSubjects(subjects.map(s =>
      s.id === subjectId
        ? { ...s, topics: [...s.topics, { name, order, status: 'pending' }] }
        : s
    ))
    setNewTopic('')
    clearErrors()
    studyDb.addTopic(subjectId, name, order, 'pending')
  }

  const handleDeleteTopic = (subjectId, topicIndex) => {
    const subject = subjects.find(s => s.id === subjectId)
    const topicId = subject?.topics[topicIndex]?.id
    setSubjects(subjects.map(s =>
      s.id === subjectId ? { ...s, topics: s.topics.filter((_, i) => i !== topicIndex) } : s
    ))
    if (topicId) studyDb.deleteTopic(topicId)
  }

  const cycleTopic = (subjectId, topicIndex) => {
    const cycle = { pending: 'current', current: 'done', done: 'pending' }
    const subject = subjects.find(s => s.id === subjectId)
    const topic = subject?.topics[topicIndex]
    const newStatus = topic ? cycle[topic.status] : null
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      const topics = s.topics.map((t, i) => {
        if (i === topicIndex) return { ...t, status: cycle[t.status] }
        if (cycle[s.topics[topicIndex].status] === 'current' && t.status === 'current')
          return { ...t, status: 'pending' }
        return t
      })
      return { ...s, topics }
    }))
    if (topic?.id && newStatus) {
      studyDb.updateTopic(topic.id, { status: newStatus })
      if (newStatus === 'current' && subject) {
        subject.topics.forEach((t, i) => {
          if (i !== topicIndex && t.status === 'current' && t.id) {
            studyDb.updateTopic(t.id, { status: 'pending' })
          }
        })
      }
    }
  }

  const handleAddTask = (subjectId) => {
    if (!validateAddTask()) return
    const taskData = { ...newTask, task: newTask.task.trim(), done: false }
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      return { ...s, weeklyPlan: [...s.weeklyPlan, taskData] }
    }))
    setNewTask({ day: 'Lunes', task: '', topic: '' })
    closeModal()
    studyDb.addTask(subjectId, taskData)
  }

  const handleDeleteTask = (subjectId, taskIndex) => {
    const subject = subjects.find(s => s.id === subjectId)
    const taskId = subject?.weeklyPlan[taskIndex]?.id
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      return { ...s, weeklyPlan: s.weeklyPlan.filter((_, i) => i !== taskIndex) }
    }))
    if (taskId) studyDb.deleteTask(taskId)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Cargando...</p>
      </div>
    )
  }

  // ========== DETAIL VIEW ==========
  if (detail) {
    const Icon = ICONS[detail.icon] || Calculator
    const subDone = detail.weeklyPlan.filter(t => t.done).length
    const subTotal = detail.weeklyPlan.length
    const subProgress = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0
    const currentTopic = getCurrentTopic(detail)

    const tasksByDay = {}
    detail.weeklyPlan.forEach((task, i) => {
      if (!tasksByDay[task.day]) tasksByDay[task.day] = []
      tasksByDay[task.day].push({ ...task, originalIndex: i })
    })

    return (
      <>
        {error && showError && (
          <div className="error-banner">
            <span>No se pudo conectar con el servidor. Usando datos locales.</span>
            <button className="dismiss" onClick={() => setShowError(false)}>×</button>
          </div>
        )}

        {/* Header */}
        <div className="p-16 sticky-top" style={{
          background: `linear-gradient(135deg, ${detail.color}18 0%, transparent 100%)`,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex items-center gap-2 mb-3">
            <button className="btn-ghost" onClick={() => setActiveSubject(null)}>
              <ChevronLeft size={20} />
            </button>
            <Icon size={20} style={{ color: detail.color }} />
            <span className="font-700 text-lg flex-1">{detail.name}</span>
            <button
              className="btn btn-sm border-none"
              style={{ background: `${detail.color}20`, color: detail.color }}
              onClick={() => {
                setEditForm({ name: detail.name, color: detail.color, icon: detail.icon })
                clearErrors()
                setModal('edit-subject')
              }}
            >
              <Settings size={14} />
            </button>
          </div>

          {/* Progress + current topic */}
          <div className="flex gap-10">
            <div className="flex-1 bg-card rounded-sm border" style={{ padding: '10px 12px' }}>
              <div className="text-xs text-muted">Semana</div>
              <div className="font-800" style={{ fontSize: '1.3rem', color: detail.color }}>{subProgress}%</div>
              <div className="text-xs text-muted">{subDone}/{subTotal} tareas</div>
            </div>
            <div className="flex-1 bg-card rounded-sm border" style={{ padding: '10px 12px' }}>
              <div className="text-xs text-muted">Tema actual</div>
              <div className="font-700 mt-1" style={{ fontSize: '0.95rem' }}>
                {currentTopic ? currentTopic.name : 'Ninguno'}
              </div>
              <div className="text-xs text-muted">
                {getDoneTopics(detail)}/{detail.topics.length} completados
              </div>
            </div>
          </div>
        </div>

        {/* Topic roadmap */}
        <div className="section-header">
          <span className="section-title">Temario</span>
        </div>
        <div className="px-16" style={{ paddingBottom: 8 }}>
          {detail.topics.map((topic, i) => {
            const StatusIcon = topic.status === 'done' ? CircleCheck : topic.status === 'current' ? CircleDot : Circle
            const color = topic.status === 'done' ? 'var(--success)' : topic.status === 'current' ? detail.color : 'var(--text-muted)'
            return (
              <div
                key={i}
                onClick={() => cycleTopic(detail.id, i)}
                className="flex items-center gap-10 cursor-pointer"
                style={{
                  padding: '9px 0',
                  borderBottom: i < detail.topics.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <StatusIcon size={18} className="flex-shrink-0" style={{ color }} />
                <span className="flex-1" style={{
                  fontSize: '0.85rem',
                  fontWeight: topic.status === 'current' ? 700 : 400,
                  color: topic.status === 'done' ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: topic.status === 'done' ? 'line-through' : 'none',
                }}>
                  {topic.name}
                </span>
                {topic.status === 'current' && (
                  <span className="font-700 text-uppercase" style={{
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontSize: '0.6rem',
                    background: `${detail.color}20`,
                    color: detail.color,
                  }}>
                    Ahora
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Tasks */}
        <div className="section-header">
          <span className="section-title">Tareas de la semana</span>
          <button
            className="btn btn-sm border-none"
            style={{ background: `${detail.color}20`, color: detail.color }}
            onClick={() => { setNewTask({ day: 'Lunes', task: '', topic: '' }); clearErrors(); setModal('add-task') }}
          >
            <Plus size={14} /> Tarea
          </button>
        </div>

        {DAYS.filter(d => tasksByDay[d]).map(day => (
          <div key={day} className="mx-16">
            <div className="font-700 text-uppercase tracking-wide opacity-70" style={{
              fontSize: '0.68rem',
              color: detail.color,
              padding: '10px 0 4px',
            }}>
              {day}
            </div>
            {tasksByDay[day].map(task => (
              <div key={task.originalIndex} className="flex items-center gap-10" style={{
                padding: '8px 0',
                borderBottom: '1px solid var(--border)'
              }}>
                <div
                  className={`checkbox ${task.done ? 'checked' : ''}`}
                  style={!task.done ? { borderColor: `${detail.color}60` } : {}}
                  onClick={() => toggleTask(detail.id, task.originalIndex)}
                >
                  {task.done && <Check size={12} color="white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span style={{
                    fontSize: '0.85rem',
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? 'var(--text-muted)' : 'var(--text)'
                  }}>
                    {task.task}
                  </span>
                  {task.topic && (
                    <span style={{
                      marginLeft: 8,
                      padding: '1px 6px',
                      borderRadius: 8,
                      fontSize: '0.6rem',
                      background: `${detail.color}15`,
                      color: `${detail.color}cc`
                    }}>
                      {task.topic}
                    </span>
                  )}
                </div>
                <button
                  className="btn-ghost muted opacity-40"
                  onClick={() => handleDeleteTask(detail.id, task.originalIndex)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ))}

        {detail.weeklyPlan.length === 0 && (
          <div className="text-muted text-center" style={{ padding: '30px 16px', fontSize: '0.85rem' }}>
            Sin tareas. Anade tu planning semanal.
          </div>
        )}

        <div style={{ height: 24 }} />

        {/* Add task modal */}
        {modal === 'add-task' && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Nueva tarea</h2>
              <div className="form-group">
                <label>Tarea</label>
                <input
                  className={errors.task ? 'input-error' : ''}
                  value={newTask.task}
                  onChange={e => { setNewTask({ ...newTask, task: e.target.value }); setErrors(prev => ({ ...prev, task: undefined })) }}
                  placeholder="Ej: Repasar tema 3"
                  autoFocus
                />
                {errors.task && <div className="error-text">{errors.task}</div>}
              </div>
              <div className="form-group">
                <label>Dia</label>
                <select value={newTask.day} onChange={e => setNewTask({ ...newTask, day: e.target.value })}>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {detail.topics.length > 0 && (
                <div className="form-group">
                  <label>Tema (opcional)</label>
                  <select value={newTask.topic} onChange={e => setNewTask({ ...newTask, topic: e.target.value })}>
                    <option value="">Sin tema</option>
                    {detail.topics.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
                <button
                  className="btn btn-block"
                  style={{ background: detail.color, color: 'white', border: 'none' }}
                  disabled={!newTask.task.trim()}
                  onClick={() => handleAddTask(detail.id)}
                >
                  Anadir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit subject modal */}
        {modal === 'edit-subject' && editForm && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Editar asignatura</h2>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  className={errors.name ? 'input-error' : ''}
                  value={editForm.name}
                  onChange={e => { setEditForm({ ...editForm, name: e.target.value }); setErrors(prev => ({ ...prev, name: undefined })) }}
                />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label>Icono</label>
                <div className="flex gap-8 flex-wrap mt-1">
                  {ICON_OPTIONS.map(({ key, label }) => {
                    const I = ICONS[key]
                    return (
                      <div
                        key={key}
                        onClick={() => setEditForm({ ...editForm, icon: key })}
                        className="swatch swatch-icon"
                        style={{
                          background: editForm.icon === key ? `${editForm.color}25` : 'var(--bg-input)',
                          border: editForm.icon === key ? `2px solid ${editForm.color}` : '2px solid transparent',
                        }}
                      >
                        <I size={20} style={{ color: editForm.icon === key ? editForm.color : 'var(--text-muted)' }} />
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="flex gap-8 flex-wrap mt-1">
                  {COLOR_OPTIONS.map(c => (
                    <div
                      key={c}
                      onClick={() => setEditForm({ ...editForm, color: c })}
                      className={`swatch swatch-color${editForm.color === c ? ' active' : ''}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Temas</label>
                <div className="flex gap-6 flex-wrap mb-2">
                  {detail.topics.map((topic, i) => (
                    <span key={i} className="flex items-center gap-1 font-600" style={{
                      padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem',
                      background: `${editForm.color}20`, color: editForm.color,
                    }}>
                      {topic.name}
                      <X size={12} className="cursor-pointer opacity-70" onClick={() => handleDeleteTopic(detail.id, i)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-8">
                  <input
                    className={`flex-1${errors.topic ? ' input-error' : ''}`}
                    value={newTopic}
                    onChange={e => { setNewTopic(e.target.value); setErrors(prev => ({ ...prev, topic: undefined })) }}
                    placeholder="Nuevo tema"
                    onKeyDown={e => e.key === 'Enter' && handleAddTopic(detail.id)}
                  />
                  <button
                    className="btn btn-sm border-none"
                    style={{ background: `${editForm.color}25`, color: editForm.color }}
                    onClick={() => handleAddTopic(detail.id)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {errors.topic && <div className="error-text">{errors.topic}</div>}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubject(detail.id)}>
                  <Trash2 size={14} /> Eliminar
                </button>
                <div className="flex-1" />
                <button className="btn btn-outline" onClick={closeModal}>Cancelar</button>
                <button
                  className="btn border-none"
                  style={{ background: editForm.color, color: 'white' }}
                  disabled={!editForm.name.trim()}
                  onClick={() => handleSaveSubject(detail.id)}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ========== SUMMARY VIEW ==========
  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Estudio</h1>
            <p>Selectividad - Planning semanal</p>
          </div>
          {subjects.length < 4 && (
            <button className="btn btn-primary btn-sm" onClick={() => { clearErrors(); setModal('add-subject') }}>
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {error && showError && (
        <div className="error-banner">
          <span>No se pudo conectar con el servidor. Usando datos locales.</span>
          <button className="dismiss" onClick={() => setShowError(false)}>×</button>
        </div>
      )}

      {/* Global weekly progress */}
      <div className="card" style={{ borderLeft: `3px solid ${weekProgress >= 70 ? 'var(--success)' : weekProgress >= 40 ? 'var(--warning)' : 'var(--primary)'}` }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-muted text-uppercase tracking-wide font-600">
              Progreso global
            </div>
            <div className="text-xs text-muted mt-1">{doneTasks}/{totalTasks} tareas completadas</div>
          </div>
          <div className="font-800 leading-1" style={{
            fontSize: '2rem',
            color: weekProgress >= 70 ? 'var(--success)' : weekProgress >= 40 ? 'var(--warning)' : 'var(--text-muted)'
          }}>
            {weekProgress}%
          </div>
        </div>
        <div className="progress-bar" style={{ marginTop: 10, height: 6 }}>
          <div className={`progress-fill ${weekProgress >= 70 ? 'success' : weekProgress >= 40 ? 'warning' : 'primary'}`}
            style={{ width: `${weekProgress}%` }} />
        </div>
      </div>

      {/* Subject cards */}
      {subjects.map(subject => {
        const Icon = ICONS[subject.icon] || Calculator
        const progress = getSubjectProgress(subject)
        const current = getCurrentTopic(subject)
        const next = getNextTopic(subject)
        const doneTops = getDoneTopics(subject)
        const subDone = subject.weeklyPlan.filter(t => t.done).length
        const subTotal = subject.weeklyPlan.length

        return (
          <div
            key={subject.id}
            onClick={() => setActiveSubject(subject.id)}
            className="cursor-pointer transition-all overflow-hidden"
            style={{
              margin: '0 16px 12px',
              borderRadius: 'var(--radius)',
              border: `1px solid ${subject.color}30`,
              background: `linear-gradient(135deg, ${subject.color}0a 0%, ${subject.color}03 100%)`,
            }}
          >
            {/* Top section: icon + name + progress */}
            <div className="flex items-center gap-14" style={{ padding: '16px 16px 12px' }}>
              <div className="flex items-center justify-center flex-shrink-0" style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${subject.color}18`,
              }}>
                <Icon size={24} style={{ color: subject.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-700 text-base">{subject.name}</div>
                <div className="text-xs text-muted mt-1">
                  {subDone}/{subTotal} tareas · {doneTops}/{subject.topics.length} temas
                </div>
              </div>
              <div className="text-right">
                <div className="font-800 leading-1" style={{ fontSize: '1.5rem', color: subject.color }}>
                  {progress}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-16">
              <div className="progress-bar" style={{ height: 4, margin: 0 }}>
                <div style={{
                  height: '100%', borderRadius: 3, width: `${progress}%`,
                  background: subject.color, transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Current + Next topic */}
            <div className="flex gap-8" style={{ padding: '12px 16px' }}>
              {current && (
                <div className="flex-1" style={{
                  background: `${subject.color}12`,
                  borderRadius: 8,
                  padding: '8px 10px'
                }}>
                  <div className="font-700 text-uppercase tracking-wide" style={{ fontSize: '0.6rem', color: subject.color }}>
                    Estudiando
                  </div>
                  <div className="font-600 mt-1" style={{ fontSize: '0.82rem' }}>
                    {current.name}
                  </div>
                </div>
              )}
              {next && (
                <div className="flex-1 bg-input" style={{
                  borderRadius: 8,
                  padding: '8px 10px'
                }}>
                  <div className="font-700 text-muted text-uppercase tracking-wide" style={{ fontSize: '0.6rem' }}>
                    Siguiente
                  </div>
                  <div className="font-600 text-muted mt-1" style={{ fontSize: '0.82rem' }}>
                    {next.name}
                  </div>
                </div>
              )}
            </div>

            {/* Tap hint */}
            <div className="flex items-center justify-end gap-1" style={{ padding: '0 16px 10px' }}>
              <span className="text-xs text-muted">Ver detalle</span>
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        )
      })}

      {/* Today's tasks quick view */}
      {todayTasks.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Hoy - {todayName}</span>
          </div>
          <div className="card">
            {todayTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-10" style={{
                padding: '8px 0',
                borderBottom: i < todayTasks.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div
                  className={`checkbox ${task.done ? 'checked' : ''}`}
                  style={!task.done ? { borderColor: `${task.subjectColor}60` } : {}}
                  onClick={() => toggleTask(task.subjectId, task.taskIndex)}
                >
                  {task.done && <Check size={12} color="white" />}
                </div>
                <div className="flex-1">
                  <span style={{
                    fontSize: '0.85rem',
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? 'var(--text-muted)' : 'var(--text)'
                  }}>
                    {task.task}
                  </span>
                </div>
                <span className="font-700" style={{
                  padding: '2px 8px', borderRadius: 10, fontSize: '0.6rem',
                  background: `${task.subjectColor}18`, color: task.subjectColor
                }}>
                  {task.subjectName.substring(0, 4)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {subjects.length === 0 && (
        <div className="text-center" style={{ padding: '40px 16px' }}>
          <div className="text-muted mb-3">Anade tus asignaturas</div>
          <button className="btn btn-primary" onClick={() => { clearErrors(); setModal('add-subject') }}>
            <Plus size={16} /> Asignatura
          </button>
        </div>
      )}

      {/* Add subject modal */}
      {modal === 'add-subject' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva asignatura</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input
                className={errors.name ? 'input-error' : ''}
                value={newSubject.name}
                onChange={e => { setNewSubject({ ...newSubject, name: e.target.value }); setErrors(prev => ({ ...prev, name: undefined })) }}
                placeholder="Ej: Fisica"
                autoFocus
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Icono</label>
              <div className="flex gap-8 flex-wrap mt-1">
                {ICON_OPTIONS.map(({ key }) => {
                  const I = ICONS[key]
                  return (
                    <div
                      key={key}
                      onClick={() => setNewSubject({ ...newSubject, icon: key })}
                      className="swatch swatch-icon"
                      style={{
                        background: newSubject.icon === key ? `${newSubject.color}25` : 'var(--bg-input)',
                        border: newSubject.icon === key ? `2px solid ${newSubject.color}` : '2px solid transparent',
                      }}
                    >
                      <I size={20} style={{ color: newSubject.icon === key ? newSubject.color : 'var(--text-muted)' }} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="form-group">
              <label>Color</label>
              <div className="flex gap-8 flex-wrap mt-1">
                {COLOR_OPTIONS.map(c => (
                  <div
                    key={c}
                    onClick={() => setNewSubject({ ...newSubject, color: c })}
                    className={`swatch swatch-color${newSubject.color === c ? ' active' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
              <button
                className="btn btn-primary btn-block"
                disabled={!newSubject.name.trim()}
                onClick={handleAddSubject}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudyPage
