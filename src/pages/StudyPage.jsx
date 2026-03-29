import { useState } from 'react'
import {
  Plus, Check, Trash2, Settings, X, ChevronLeft, ChevronRight,
  Calculator, Leaf, FlaskConical, BookOpen, Globe, Atom,
  CircleDot, CircleCheck, Circle
} from 'lucide-react'
import { mockStudy } from '../data/mockData'

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
  const [subjects, setSubjects] = useState(mockStudy.subjects)
  const [activeSubject, setActiveSubject] = useState(null)
  const [modal, setModal] = useState(null)
  const [newSubject, setNewSubject] = useState({ name: '', color: '#4f8cff', icon: 'calculator' })
  const [newTask, setNewTask] = useState({ day: 'Lunes', task: '', topic: '' })
  const [newTopic, setNewTopic] = useState('')
  const [editForm, setEditForm] = useState(null)

  const detail = activeSubject ? subjects.find(s => s.id === activeSubject) : null

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

  // Actions
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
      topics: [],
      weeklyPlan: []
    }])
    setNewSubject({ name: '', color: '#4f8cff', icon: 'calculator' })
    setModal(null)
  }

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id))
    setActiveSubject(null)
    setModal(null)
  }

  const handleSaveSubject = (id) => {
    if (!editForm.name) return
    setSubjects(subjects.map(s =>
      s.id === id ? { ...s, name: editForm.name, color: editForm.color, icon: editForm.icon } : s
    ))
    setModal(null)
  }

  const handleAddTopic = (subjectId) => {
    if (!newTopic.trim()) return
    setSubjects(subjects.map(s =>
      s.id === subjectId
        ? { ...s, topics: [...s.topics, { name: newTopic.trim(), order: s.topics.length + 1, status: 'pending' }] }
        : s
    ))
    setNewTopic('')
  }

  const handleDeleteTopic = (subjectId, topicIndex) => {
    setSubjects(subjects.map(s =>
      s.id === subjectId ? { ...s, topics: s.topics.filter((_, i) => i !== topicIndex) } : s
    ))
  }

  const cycleTopic = (subjectId, topicIndex) => {
    const cycle = { pending: 'current', current: 'done', done: 'pending' }
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      const topics = s.topics.map((t, i) => {
        if (i === topicIndex) return { ...t, status: cycle[t.status] }
        // Only one current at a time
        if (cycle[s.topics[topicIndex].status] === 'current' && t.status === 'current')
          return { ...t, status: 'pending' }
        return t
      })
      return { ...s, topics }
    }))
  }

  const handleAddTask = (subjectId) => {
    if (!newTask.task) return
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      return { ...s, weeklyPlan: [...s.weeklyPlan, { ...newTask, done: false }] }
    }))
    setNewTask({ day: 'Lunes', task: '', topic: '' })
    setModal(null)
  }

  const handleDeleteTask = (subjectId, taskIndex) => {
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      return { ...s, weeklyPlan: s.weeklyPlan.filter((_, i) => i !== taskIndex) }
    }))
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
        {/* Header */}
        <div style={{
          padding: '16px',
          background: `linear-gradient(135deg, ${detail.color}18 0%, transparent 100%)`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <button
              onClick={() => setActiveSubject(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 4 }}
            >
              <ChevronLeft size={20} />
            </button>
            <Icon size={20} style={{ color: detail.color }} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem', flex: 1 }}>{detail.name}</span>
            <button
              className="btn btn-sm"
              style={{ background: `${detail.color}20`, color: detail.color, border: 'none' }}
              onClick={() => {
                setEditForm({ name: detail.name, color: detail.color, icon: detail.icon })
                setModal('edit-subject')
              }}
            >
              <Settings size={14} />
            </button>
          </div>

          {/* Progress + current topic */}
          <div style={{
            display: 'flex',
            gap: 10,
          }}>
            <div style={{
              flex: 1,
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              border: '1px solid var(--border)'
            }}>
              <div className="text-xs text-muted">Semana</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: detail.color }}>{subProgress}%</div>
              <div className="text-xs text-muted">{subDone}/{subTotal} tareas</div>
            </div>
            <div style={{
              flex: 1,
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              border: '1px solid var(--border)'
            }}>
              <div className="text-xs text-muted">Tema actual</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: 2 }}>
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
        <div style={{ padding: '0 16px 8px' }}>
          {detail.topics.map((topic, i) => {
            const StatusIcon = topic.status === 'done' ? CircleCheck : topic.status === 'current' ? CircleDot : Circle
            const color = topic.status === 'done' ? 'var(--success)' : topic.status === 'current' ? detail.color : 'var(--text-muted)'
            return (
              <div
                key={i}
                onClick={() => cycleTopic(detail.id, i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 0',
                  borderBottom: i < detail.topics.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <StatusIcon size={18} style={{ color, flexShrink: 0 }} />
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: topic.status === 'current' ? 700 : 400,
                  color: topic.status === 'done' ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: topic.status === 'done' ? 'line-through' : 'none',
                  flex: 1
                }}>
                  {topic.name}
                </span>
                {topic.status === 'current' && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    background: `${detail.color}20`,
                    color: detail.color,
                    textTransform: 'uppercase'
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
            className="btn btn-sm"
            style={{ background: `${detail.color}20`, color: detail.color, border: 'none' }}
            onClick={() => { setNewTask({ day: 'Lunes', task: '', topic: '' }); setModal('add-task') }}
          >
            <Plus size={14} /> Tarea
          </button>
        </div>

        {DAYS.filter(d => tasksByDay[d]).map(day => (
          <div key={day} style={{ margin: '0 16px' }}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: detail.color,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '10px 0 4px',
              opacity: 0.7
            }}>
              {day}
            </div>
            {tasksByDay[day].map(task => (
              <div key={task.originalIndex} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
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
                <div style={{ flex: 1, minWidth: 0 }}>
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
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, opacity: 0.4 }}
                  onClick={() => handleDeleteTask(detail.id, task.originalIndex)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ))}

        {detail.weeklyPlan.length === 0 && (
          <div className="text-muted" style={{ textAlign: 'center', padding: '30px 16px', fontSize: '0.85rem' }}>
            Sin tareas. Anade tu planning semanal.
          </div>
        )}

        <div style={{ height: 24 }} />

        {/* Add task modal */}
        {modal === 'add-task' && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Nueva tarea</h2>
              <div className="form-group">
                <label>Tarea</label>
                <input value={newTask.task} onChange={e => setNewTask({ ...newTask, task: e.target.value })} placeholder="Ej: Repasar tema 3" autoFocus />
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
                <button className="btn btn-outline btn-block" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn btn-block" style={{ background: detail.color, color: 'white', border: 'none' }} onClick={() => handleAddTask(detail.id)}>Anadir</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit subject modal */}
        {modal === 'edit-subject' && editForm && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Editar asignatura</h2>
              <div className="form-group">
                <label>Nombre</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Icono</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {ICON_OPTIONS.map(({ key, label }) => {
                    const I = ICONS[key]
                    return (
                      <div
                        key={key}
                        onClick={() => setEditForm({ ...editForm, icon: key })}
                        style={{
                          width: 44, height: 44, borderRadius: 10,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: editForm.icon === key ? `${editForm.color}25` : 'var(--bg-input)',
                          border: editForm.icon === key ? `2px solid ${editForm.color}` : '2px solid transparent',
                          cursor: 'pointer', transition: 'all 0.2s'
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
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {COLOR_OPTIONS.map(c => (
                    <div key={c} onClick={() => setEditForm({ ...editForm, color: c })} style={{
                      width: 36, height: 36, borderRadius: 10, background: c, cursor: 'pointer',
                      border: editForm.color === c ? '3px solid white' : '3px solid transparent'
                    }} />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Temas</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {detail.topics.map((topic, i) => (
                    <span key={i} style={{
                      padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
                      background: `${editForm.color}20`, color: editForm.color,
                      display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      {topic.name}
                      <X size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleDeleteTopic(detail.id, i)} />
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Nuevo tema"
                    onKeyDown={e => e.key === 'Enter' && handleAddTopic(detail.id)} style={{ flex: 1 }} />
                  <button className="btn btn-sm" style={{ background: `${editForm.color}25`, color: editForm.color, border: 'none' }}
                    onClick={() => handleAddTopic(detail.id)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubject(detail.id)}>
                  <Trash2 size={14} /> Eliminar
                </button>
                <div style={{ flex: 1 }} />
                <button className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn" style={{ background: editForm.color, color: 'white', border: 'none' }}
                  onClick={() => handleSaveSubject(detail.id)}>Guardar</button>
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
            <button className="btn btn-primary btn-sm" onClick={() => setModal('add-subject')}>
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Global weekly progress */}
      <div className="card" style={{ borderLeft: `3px solid ${weekProgress >= 70 ? 'var(--success)' : weekProgress >= 40 ? 'var(--warning)' : 'var(--primary)'}` }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Progreso global
            </div>
            <div className="text-xs text-muted" style={{ marginTop: 2 }}>{doneTasks}/{totalTasks} tareas completadas</div>
          </div>
          <div style={{
            fontSize: '2rem', fontWeight: 800, lineHeight: 1,
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
            style={{
              margin: '0 16px 12px',
              borderRadius: 'var(--radius)',
              border: `1px solid ${subject.color}30`,
              background: `linear-gradient(135deg, ${subject.color}0a 0%, ${subject.color}03 100%)`,
              cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
              overflow: 'hidden'
            }}
          >
            {/* Top section: icon + name + progress */}
            <div style={{
              padding: '16px 16px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${subject.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={24} style={{ color: subject.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{subject.name}</div>
                <div className="text-xs text-muted" style={{ marginTop: 1 }}>
                  {subDone}/{subTotal} tareas · {doneTops}/{subject.topics.length} temas
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: subject.color, lineHeight: 1 }}>
                  {progress}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ padding: '0 16px' }}>
              <div className="progress-bar" style={{ height: 4, margin: 0 }}>
                <div style={{
                  height: '100%', borderRadius: 3, width: `${progress}%`,
                  background: subject.color, transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Current + Next topic */}
            <div style={{
              padding: '12px 16px',
              display: 'flex',
              gap: 8
            }}>
              {current && (
                <div style={{
                  flex: 1,
                  background: `${subject.color}12`,
                  borderRadius: 8,
                  padding: '8px 10px'
                }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: subject.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estudiando
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: 2 }}>
                    {current.name}
                  </div>
                </div>
              )}
              {next && (
                <div style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  borderRadius: 8,
                  padding: '8px 10px'
                }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Siguiente
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: 2, color: 'var(--text-muted)' }}>
                    {next.name}
                  </div>
                </div>
              )}
            </div>

            {/* Tap hint */}
            <div style={{
              padding: '0 16px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 4
            }}>
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
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
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
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: '0.85rem',
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? 'var(--text-muted)' : 'var(--text)'
                  }}>
                    {task.task}
                  </span>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: 10, fontSize: '0.6rem', fontWeight: 700,
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
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <div className="text-muted" style={{ marginBottom: 12 }}>Anade tus asignaturas</div>
          <button className="btn btn-primary" onClick={() => setModal('add-subject')}>
            <Plus size={16} /> Asignatura
          </button>
        </div>
      )}

      {/* Add subject modal */}
      {modal === 'add-subject' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva asignatura</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} placeholder="Ej: Fisica" autoFocus />
            </div>
            <div className="form-group">
              <label>Icono</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {ICON_OPTIONS.map(({ key }) => {
                  const I = ICONS[key]
                  return (
                    <div key={key} onClick={() => setNewSubject({ ...newSubject, icon: key })} style={{
                      width: 44, height: 44, borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: newSubject.icon === key ? `${newSubject.color}25` : 'var(--bg-input)',
                      border: newSubject.icon === key ? `2px solid ${newSubject.color}` : '2px solid transparent',
                      cursor: 'pointer'
                    }}>
                      <I size={20} style={{ color: newSubject.icon === key ? newSubject.color : 'var(--text-muted)' }} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="form-group">
              <label>Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {COLOR_OPTIONS.map(c => (
                  <div key={c} onClick={() => setNewSubject({ ...newSubject, color: c })} style={{
                    width: 36, height: 36, borderRadius: 10, background: c, cursor: 'pointer',
                    border: newSubject.color === c ? '3px solid white' : '3px solid transparent'
                  }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleAddSubject}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudyPage
