import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Dumbbell, Plus, Trash2, Edit3, Play, Square, Clock,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Calendar, List, Flame, TrendingUp, X, Check, Copy, Settings
} from 'lucide-react'
import { mockGym } from '../data/mockData'
import { useDb } from '../hooks/useDb'
import { gymDb } from '../lib/db'

const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const COLORS = ['#ff6b6b', '#4f8cff', '#51cf66', '#ffd43b', '#cc5de8', '#ff922b', '#20c997', '#748ffc']

function getCalendarWeeks(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const weeks = []
  let week = new Array(first.getDay()).fill(null)
  for (let d = 1; d <= last.getDate(); d++) {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week) }
  return weeks
}

function formatDuration(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function GymPage() {
  const [templates, setTemplates, templatesDb] = useDb(gymDb.getTemplates, mockGym.templates)
  const [workouts, setWorkouts, workoutsDb] = useDb(gymDb.getWorkouts, mockGym.workouts)
  const [weeklyGoal] = useState(mockGym.weeklyGoal)
  const [view, setView] = useState('list')
  const [modal, setModal] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [expandedWorkout, setExpandedWorkout] = useState(null)
  const [showError, setShowError] = useState(true)

  const loading = templatesDb.loading || workoutsDb.loading
  const dbError = templatesDb.error || workoutsDb.error

  // Active workout state
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [timerStart, setTimerStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  // Template form
  const [templateForm, setTemplateForm] = useState(null)
  const [templateExForm, setTemplateExForm] = useState({ name: '', defaultSets: 4, defaultReps: '10-12' })

  // Exercise add form for active workout
  const [addExForm, setAddExForm] = useState({ name: '', sets: 3, reps: '10' })

  // Edit timer form
  const [editTimerForm, setEditTimerForm] = useState(null)

  // Validation errors
  const [errors, setErrors] = useState({})

  // Calendar
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const calWeeks = useMemo(() => getCalendarWeeks(calYear, calMonth), [calYear, calMonth])

  const workoutMap = useMemo(() => {
    const m = {}
    workouts.forEach(w => { m[w.date] = w })
    return m
  }, [workouts])

  // Timer
  useEffect(() => {
    if (timerStart) {
      intervalRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - timerStart) / 1000)), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerStart])

  // KPIs
  const thisWeekWorkouts = workouts.filter(w => {
    const d = new Date(w.date + 'T12:00:00')
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)
    return d >= weekStart
  })

  const streak = (() => {
    const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date))
    let count = 0
    let lastDate = null
    for (const w of sorted) {
      const d = new Date(w.date + 'T12:00:00')
      if (!lastDate) { lastDate = d; count = 1; continue }
      const diff = Math.round((lastDate - d) / (1000 * 60 * 60 * 24))
      if (diff <= 2) { count++; lastDate = d } else break
    }
    return count
  })()

  const totalVolume = workouts.reduce((acc, w) =>
    acc + w.exercises.reduce((a, ex) =>
      a + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0), 0), 0)

  const avgDuration = workouts.length > 0
    ? Math.round(workouts.reduce((a, w) => a + w.durationMin, 0) / workouts.length)
    : 0

  // Exercise stats across all workouts
  const getExerciseStats = (exerciseName) => {
    const entries = []
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.name === exerciseName) {
          const maxWeight = Math.max(...ex.sets.map(s => s.weight))
          const totalVol = ex.sets.reduce((a, s) => a + s.reps * s.weight, 0)
          entries.push({ date: w.date, maxWeight, totalVol, sets: ex.sets.length })
        }
      })
    })
    return entries.sort((a, b) => b.date.localeCompare(a.date))
  }

  // Start a new workout
  const startWorkout = (template = null) => {
    const now = new Date()
    const workout = {
      id: Date.now(),
      date: todayStr,
      templateName: template ? template.name : 'Entreno libre',
      color: template ? template.color : '#748ffc',
      startTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      endTime: null,
      durationMin: 0,
      exercises: template
        ? template.exercises.map(ex => ({ name: ex.name, sets: [] }))
        : []
    }
    setActiveWorkout(workout)
    setTimerStart(Date.now())
    setElapsed(0)
    setModal(null)
  }

  const finishWorkout = () => {
    if (!activeWorkout) return
    clearInterval(intervalRef.current)
    const now = new Date()
    const finished = {
      ...activeWorkout,
      endTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      durationMin: Math.round(elapsed / 60)
    }
    setWorkouts([finished, ...workouts])
    gymDb.addWorkout(finished)
    setActiveWorkout(null)
    setTimerStart(null)
    setElapsed(0)
  }

  const cancelWorkout = () => {
    clearInterval(intervalRef.current)
    setActiveWorkout(null)
    setTimerStart(null)
    setElapsed(0)
  }

  // Add set to active workout exercise
  const addSet = (exIndex, reps, weight) => {
    const exercises = [...activeWorkout.exercises]
    exercises[exIndex] = {
      ...exercises[exIndex],
      sets: [...exercises[exIndex].sets, { reps: parseInt(reps) || 0, weight: parseFloat(weight) || 0 }]
    }
    setActiveWorkout({ ...activeWorkout, exercises })
  }

  const removeSet = (exIndex, setIndex) => {
    const exercises = [...activeWorkout.exercises]
    exercises[exIndex] = {
      ...exercises[exIndex],
      sets: exercises[exIndex].sets.filter((_, i) => i !== setIndex)
    }
    setActiveWorkout({ ...activeWorkout, exercises })
  }

  const addExerciseToWorkout = () => {
    if (!addExForm.name || !addExForm.name.trim()) {
      setErrors({ addExName: 'El nombre es obligatorio' })
      return
    }
    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, { name: addExForm.name.trim(), sets: [] }]
    })
    setAddExForm({ name: '', sets: 3, reps: '10' })
    clearErrors()
    setModal(null)
  }

  const removeExerciseFromWorkout = (exIndex) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((_, i) => i !== exIndex)
    })
  }

  const handleEditTimer = () => {
    if (!editTimerForm) return
    const timerErrs = validateEditTimer()
    if (Object.keys(timerErrs).length > 0) { setErrors(timerErrs); return }
    setWorkouts(workouts.map(w => {
      if (w.id !== editTimerForm.id) return w
      return { ...w, startTime: editTimerForm.startTime, endTime: editTimerForm.endTime, durationMin: editTimerForm.durationMin }
    }))
    gymDb.updateWorkoutTimer(editTimerForm.id, editTimerForm.startTime, editTimerForm.endTime, editTimerForm.durationMin)
    setEditTimerForm(null)
    clearErrors()
    setModal(null)
  }

  const clearErrors = () => setErrors({})

  const validateTemplateName = (name) => {
    const errs = {}
    if (!name || !name.trim()) errs.name = 'El nombre es obligatorio'
    else if (templates.some(t => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== templateForm?.id))
      errs.name = 'Ya existe una plantilla con ese nombre'
    return errs
  }

  const validateTemplateExercise = () => {
    const errs = {}
    if (!templateExForm.name || !templateExForm.name.trim()) errs.exName = 'El nombre es obligatorio'
    if (!templateExForm.defaultSets || templateExForm.defaultSets <= 0) errs.exSets = 'Debe ser positivo'
    if (!templateExForm.defaultReps || !templateExForm.defaultReps.trim()) errs.exReps = 'Obligatorio'
    return errs
  }

  const validateEditTimer = () => {
    const errs = {}
    if (!editTimerForm.startTime) errs.startTime = 'Hora inicio obligatoria'
    if (!editTimerForm.endTime) errs.endTime = 'Hora fin obligatoria'
    if (editTimerForm.startTime && editTimerForm.endTime && editTimerForm.durationMin <= 0)
      errs.endTime = 'La hora fin debe ser posterior al inicio'
    return errs
  }

  // Templates CRUD
  const handleSaveTemplate = () => {
    if (!templateForm) return
    const nameErrs = validateTemplateName(templateForm.name)
    if (Object.keys(nameErrs).length > 0) { setErrors(nameErrs); return }
    if (templateForm.id) {
      setTemplates(templates.map(t => t.id === templateForm.id ? { ...templateForm } : t))
      gymDb.updateTemplate(templateForm.id, templateForm)
    } else {
      setTemplates([...templates, { ...templateForm, id: Date.now() }])
      gymDb.addTemplate(templateForm)
    }
    setTemplateForm(null)
    clearErrors()
    setModal(null)
  }

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id))
    gymDb.deleteTemplate(id)
  }

  const addExToTemplate = () => {
    const exErrs = validateTemplateExercise()
    if (Object.keys(exErrs).length > 0) { setErrors(exErrs); return }
    setTemplateForm({
      ...templateForm,
      exercises: [...templateForm.exercises, { id: Date.now(), ...templateExForm }]
    })
    setTemplateExForm({ name: '', defaultSets: 4, defaultReps: '10-12' })
    clearErrors()
  }

  const removeExFromTemplate = (exId) => {
    setTemplateForm({
      ...templateForm,
      exercises: templateForm.exercises.filter(e => e.id !== exId)
    })
  }

  // Delete workout
  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id))
    gymDb.deleteWorkout(id)
    setExpandedWorkout(null)
    setSelectedDate(null)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Cargando...</p>
      </div>
    )
  }

  // ========== ACTIVE WORKOUT VIEW ==========
  if (activeWorkout) {
    return (
      <>
        <div className="p-16 sticky-top" style={{
          background: `linear-gradient(135deg, ${activeWorkout.color}15 0%, transparent 100%)`,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="font-700 text-lg">{activeWorkout.templateName}</div>
              <div className="text-xs text-muted">Inicio: {activeWorkout.startTime}</div>
            </div>
            <div className="font-800 tabular-nums" style={{ fontSize: '1.4rem', color: activeWorkout.color }}>
              {formatTimer(elapsed)}
            </div>
          </div>
          <div className="flex gap-8">
            <button className="btn btn-sm flex-1 border-none text-white" style={{ background: activeWorkout.color }}
              onClick={finishWorkout}>
              <Square size={13} /> Terminar
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => { setModal('add-exercise'); clearErrors() }}>
              <Plus size={13} /> Ejercicio
            </button>
            <button className="btn btn-sm border-none" style={{ background: 'rgba(255,118,117,0.12)', color: 'var(--danger)' }}
              onClick={cancelWorkout}>
              <X size={13} />
            </button>
          </div>
        </div>

        {activeWorkout.exercises.map((ex, exI) => (
          <ExerciseCard
            key={exI}
            exercise={ex}
            index={exI}
            color={activeWorkout.color}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onRemoveExercise={removeExerciseFromWorkout}
            getExerciseStats={getExerciseStats}
            editable
          />
        ))}

        {activeWorkout.exercises.length === 0 && (
          <div className="empty-state">
            <div className="text-muted mb-3">Anade ejercicios a tu entreno</div>
            <button className="btn btn-primary" onClick={() => setModal('add-exercise')}>
              <Plus size={16} /> Ejercicio
            </button>
          </div>
        )}

        <div className="mt-4" />

        {modal === 'add-exercise' && (
          <div className="modal-overlay" onClick={() => { clearErrors(); setModal(null) }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Anadir ejercicio</h2>
              <div className="form-group">
                <label>Nombre</label>
                <input className={errors.addExName ? 'input-error' : ''} value={addExForm.name}
                  onChange={e => { setAddExForm({ ...addExForm, name: e.target.value }); setErrors(prev => ({ ...prev, addExName: null })) }}
                  placeholder="Ej: Press banca" autoFocus />
                {errors.addExName && <div className="error-text">{errors.addExName}</div>}
              </div>
              {templates.length > 0 && (
                <div className="form-group">
                  <label>Desde plantilla</label>
                  <div className="flex flex-wrap gap-6 mt-1">
                    {templates.flatMap(t => t.exercises).filter(ex =>
                      !activeWorkout.exercises.some(ae => ae.name === ex.name)
                    ).slice(0, 12).map(ex => (
                      <button key={ex.id} className="btn btn-sm btn-outline"
                        onClick={() => { setAddExForm({ ...addExForm, name: ex.name }); clearErrors() }}>
                        {ex.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={() => { clearErrors(); setModal(null) }}>Cancelar</button>
                <button className="btn btn-primary btn-block" disabled={!addExForm.name.trim()} onClick={addExerciseToWorkout}>Anadir</button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ========== MAIN VIEW ==========
  const sortedWorkouts = [...workouts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Gym</h1>
            <p>Entrenos y progreso</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={() => setModal('templates')}>
              <Settings size={14} />
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setModal('new-workout')}>
              <Play size={14} /> Entreno
            </button>
          </div>
        </div>
      </div>

      {dbError && showError && (
        <div className="error-banner">
          <span>No se pudo conectar con el servidor. Usando datos locales.</span>
          <button className="dismiss" onClick={() => setShowError(false)}>×</button>
        </div>
      )}

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: thisWeekWorkouts.length >= weeklyGoal ? 'var(--success)' : 'var(--warning)' }}>
            {thisWeekWorkouts.length}/{weeklyGoal}
          </div>
          <div className="kpi-label">Esta semana</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value flex items-center justify-center gap-1 text-warning">
            {streak} <Flame size={16} />
          </div>
          <div className="kpi-label">Racha</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value text-primary-light" style={{ fontSize: '1.2rem' }}>
            {(totalVolume / 1000).toFixed(1)}k
          </div>
          <div className="kpi-label">Vol. total (kg)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">
            {avgDuration}m
          </div>
          <div className="kpi-label">Media duracion</div>
        </div>
      </div>

      <div className="flex mx-16 mb-3 bg-card rounded border overflow-hidden">
        <button
          className="flex-1 py-8 border-none cursor-pointer text-0.78 font-600 flex items-center justify-center gap-6"
          onClick={() => setView('list')}
          style={{
            background: view === 'list' ? 'var(--primary)' : 'transparent',
            color: view === 'list' ? 'white' : 'var(--text-muted)'
          }}>
          <List size={14} /> Lista
        </button>
        <button
          className="flex-1 py-8 border-none cursor-pointer text-0.78 font-600 flex items-center justify-center gap-6"
          onClick={() => setView('calendar')}
          style={{
            background: view === 'calendar' ? 'var(--primary)' : 'transparent',
            color: view === 'calendar' ? 'white' : 'var(--text-muted)'
          }}>
          <Calendar size={14} /> Calendario
        </button>
      </div>

      {/* CALENDAR VIEW */}
      {view === 'calendar' && (
        <>
          <div className="section-header">
            <button className="btn-ghost muted p-0"
              onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }}>
              <ChevronLeft size={18} />
            </button>
            <span className="section-title">{MONTH_NAMES[calMonth]} {calYear}</span>
            <button className="btn-ghost muted p-0"
              onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="px-16" style={{ paddingBottom: 8 }}>
            <div className="grid-7 mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center text-0.6 font-700 text-muted py-8">{d}</div>
              ))}
            </div>
            {calWeeks.map((week, wi) => (
              <div key={wi} className="grid-7" style={{ marginBottom: 3 }}>
                {week.map((day, di) => {
                  if (day === null) return <div key={di} />
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const workout = workoutMap[dateStr]
                  const isToday = dateStr === todayStr
                  const isSelected = dateStr === selectedDate

                  return (
                    <div key={di} onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)} style={{
                      aspectRatio: '1', borderRadius: 8, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      background: workout ? `${workout.color}20` : 'transparent',
                      border: isSelected ? '2px solid var(--primary-light)' : isToday ? '2px solid var(--primary)' : '2px solid transparent',
                      transition: 'all 0.15s'
                    }}>
                      <span style={{
                        fontSize: '0.78rem', fontWeight: isToday ? 800 : workout ? 600 : 400,
                        color: workout ? 'var(--text)' : 'var(--text-muted)'
                      }}>{day}</span>
                      {workout && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: workout.color, marginTop: 1 }} />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Selected date detail */}
          {selectedDate && workoutMap[selectedDate] && (
            <WorkoutCard
              workout={workoutMap[selectedDate]}
              expanded={expandedWorkout === workoutMap[selectedDate].id}
              onToggle={() => setExpandedWorkout(expandedWorkout === workoutMap[selectedDate].id ? null : workoutMap[selectedDate].id)}
              onDelete={handleDeleteWorkout}
              onEditTimer={(w) => {
                setEditTimerForm({ id: w.id, startTime: w.startTime, endTime: w.endTime, durationMin: w.durationMin })
                setModal('edit-timer')
              }}
              getExerciseStats={getExerciseStats}
            />
          )}
        </>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <>
          <div className="section-header">
            <span className="section-title">Entrenos recientes</span>
          </div>
          {sortedWorkouts.map(w => (
            <WorkoutCard
              key={w.id}
              workout={w}
              expanded={expandedWorkout === w.id}
              onToggle={() => setExpandedWorkout(expandedWorkout === w.id ? null : w.id)}
              onDelete={handleDeleteWorkout}
              onEditTimer={(w) => {
                setEditTimerForm({ id: w.id, startTime: w.startTime, endTime: w.endTime, durationMin: w.durationMin })
                setModal('edit-timer')
              }}
              getExerciseStats={getExerciseStats}
            />
          ))}
          {workouts.length === 0 && (
            <div className="empty-state">
              <div className="text-muted">Sin entrenos todavia</div>
            </div>
          )}
        </>
      )}

      {/* New workout modal */}
      {modal === 'new-workout' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo entreno</h2>
            <p className="text-xs text-muted mb-4">Elige una plantilla o empieza en blanco</p>
            {templates.map(t => (
              <div key={t.id} onClick={() => startWorkout(t)}
                className="flex items-center gap-12 cursor-pointer rounded-sm transition-all mb-2"
                style={{ padding: 14, border: `1px solid ${t.color}40`, background: `${t.color}08` }}>
                <div className="flex items-center justify-center" style={{
                  width: 40, height: 40, borderRadius: 10, background: `${t.color}20`
                }}>
                  <Dumbbell size={20} style={{ color: t.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-700 text-md">{t.name}</div>
                  <div className="text-xs text-muted">{t.exercises.length} ejercicios</div>
                </div>
                <Play size={16} style={{ color: t.color }} />
              </div>
            ))}
            <button className="btn btn-outline btn-block mt-2" onClick={() => startWorkout(null)}>
              <Plus size={14} /> Entreno en blanco
            </button>
            <button className="btn btn-outline btn-block mt-2" onClick={() => setModal(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Templates management modal */}
      {modal === 'templates' && !templateForm && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Plantillas</h2>
            {templates.map(t => (
              <div key={t.id} className="flex justify-between items-center rounded-sm border mb-2" style={{ padding: 12 }}>
                <div>
                  <div className="font-700 text-0.85 flex items-center gap-6">
                    <div className="color-dot" style={{ background: t.color }} />
                    {t.name}
                  </div>
                  <div className="text-xs text-muted">{t.exercises.length} ejercicios</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-outline" onClick={() => { setTemplateForm({ ...t, exercises: [...t.exercises] }); clearErrors() }}>
                    <Edit3 size={12} />
                  </button>
                  <button className="btn btn-sm border-none" style={{ background: 'rgba(255,118,117,0.12)', color: 'var(--danger)' }}
                    onClick={() => handleDeleteTemplate(t.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-primary btn-block mt-2"
              onClick={() => { setTemplateForm({ id: null, name: '', color: '#ff6b6b', exercises: [] }); clearErrors() }}>
              <Plus size={14} /> Nueva plantilla
            </button>
            <button className="btn btn-outline btn-block mt-2" onClick={() => { clearErrors(); setModal(null) }}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === 'templates' && templateForm && (
        <div className="modal-overlay" onClick={() => { setTemplateForm(null); clearErrors() }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{templateForm.id ? 'Editar plantilla' : 'Nueva plantilla'}</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input className={errors.name ? 'input-error' : ''} value={templateForm.name}
                onChange={e => { setTemplateForm({ ...templateForm, name: e.target.value }); setErrors(prev => ({ ...prev, name: null })) }}
                placeholder="Ej: Push" autoFocus />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Color</label>
              <div className="flex gap-8 flex-wrap mt-1">
                {COLORS.map(c => (
                  <div key={c} className="cursor-pointer rounded-sm" onClick={() => setTemplateForm({ ...templateForm, color: c })}
                    style={{ width: 32, height: 32, background: c, border: templateForm.color === c ? '3px solid white' : '3px solid transparent' }} />
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Ejercicios</label>
              {templateForm.exercises.map(ex => (
                <div key={ex.id} className="list-row justify-between text-0.82">
                  <span>{ex.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">{ex.defaultSets}x{ex.defaultReps}</span>
                    <X size={14} className="cursor-pointer text-muted" onClick={() => removeExFromTemplate(ex.id)} />
                  </div>
                </div>
              ))}
              <div className="flex gap-6 mt-2">
                <input className={errors.exName ? 'input-error' : ''} value={templateExForm.name}
                  onChange={e => { setTemplateExForm({ ...templateExForm, name: e.target.value }); setErrors(prev => ({ ...prev, exName: null })) }}
                  placeholder="Nombre" style={{ flex: 2 }} onKeyDown={e => e.key === 'Enter' && addExToTemplate()} />
                <input className={`text-center ${errors.exSets ? 'input-error' : ''}`} value={templateExForm.defaultSets}
                  onChange={e => { setTemplateExForm({ ...templateExForm, defaultSets: parseInt(e.target.value) || 0 }); setErrors(prev => ({ ...prev, exSets: null })) }}
                  placeholder="S" type="number" style={{ flex: 0.5 }} />
                <input className={errors.exReps ? 'input-error' : ''} value={templateExForm.defaultReps}
                  onChange={e => { setTemplateExForm({ ...templateExForm, defaultReps: e.target.value }); setErrors(prev => ({ ...prev, exReps: null })) }}
                  placeholder="Reps" style={{ flex: 0.8 }} />
                <button className="btn btn-sm btn-primary" onClick={addExToTemplate}><Plus size={14} /></button>
              </div>
              {(errors.exName || errors.exSets || errors.exReps) && (
                <div className="error-text mt-1">{errors.exName || errors.exSets || errors.exReps}</div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => { setTemplateForm(null); clearErrors() }}>Volver</button>
              <button className="btn btn-primary btn-block" disabled={!templateForm.name.trim()} onClick={handleSaveTemplate}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'edit-timer' && editTimerForm && (
        <div className="modal-overlay" onClick={() => { setEditTimerForm(null); clearErrors(); setModal(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Editar duracion</h2>
            <div className="form-group">
              <label>Hora inicio</label>
              <input className={errors.startTime ? 'input-error' : ''} type="time" value={editTimerForm.startTime}
                onChange={e => {
                  const st = e.target.value
                  setErrors(prev => ({ ...prev, startTime: null, endTime: null }))
                  setEditTimerForm(prev => {
                    if (prev.endTime) {
                      const [sh, sm] = st.split(':').map(Number)
                      const [eh, em] = prev.endTime.split(':').map(Number)
                      let dur = (eh * 60 + em) - (sh * 60 + sm)
                      if (dur < 0) dur += 24 * 60
                      return { ...prev, startTime: st, durationMin: dur }
                    }
                    return { ...prev, startTime: st }
                  })
                }} />
              {errors.startTime && <div className="error-text">{errors.startTime}</div>}
            </div>
            <div className="form-group">
              <label>Hora fin</label>
              <input className={errors.endTime ? 'input-error' : ''} type="time" value={editTimerForm.endTime}
                onChange={e => {
                  const et = e.target.value
                  setErrors(prev => ({ ...prev, endTime: null }))
                  setEditTimerForm(prev => {
                    const [sh, sm] = prev.startTime.split(':').map(Number)
                    const [eh, em] = et.split(':').map(Number)
                    let dur = (eh * 60 + em) - (sh * 60 + sm)
                    if (dur < 0) dur += 24 * 60
                    return { ...prev, endTime: et, durationMin: dur }
                  })
                }} />
              {errors.endTime && <div className="error-text">{errors.endTime}</div>}
            </div>
            <div className="info-box">
              <span className="text-xs text-muted">Duracion: </span>
              <span className="font-800 text-lg text-primary-light">
                {formatDuration(editTimerForm.durationMin)}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-block" onClick={() => { setEditTimerForm(null); clearErrors(); setModal(null) }}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleEditTimer}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ========== Exercise Card (for active workout) ==========
function ExerciseCard({ exercise, index, color, onAddSet, onRemoveSet, onRemoveExercise, getExerciseStats, editable }) {
  const [showAdd, setShowAdd] = useState(false)
  const [reps, setReps] = useState('10')
  const [weight, setWeight] = useState('')
  const [showStats, setShowStats] = useState(false)

  const stats = getExerciseStats(exercise.name)
  const lastSession = stats.length > 0 ? stats[0] : null

  return (
    <div className="mx-16 rounded border bg-card overflow-hidden" style={{ marginBottom: 10 }}>
      <div className="flex justify-between items-center border" style={{ padding: '10px 14px', borderWidth: '0 0 1px 0' }}>
        <div className="font-700" style={{ fontSize: '0.88rem' }}>{exercise.name}</div>
        <div className="flex items-center gap-2">
          {stats.length > 0 && (
            <button className="btn-ghost muted" style={{ padding: 2 }}
              onClick={() => setShowStats(!showStats)}>
              <TrendingUp size={14} />
            </button>
          )}
          {editable && (
            <button className="btn-ghost muted" style={{ padding: 2 }}
              onClick={() => onRemoveExercise(index)}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Previous stats */}
      {showStats && lastSession && (
        <div style={{ padding: '6px 14px', background: `${color}08`, borderBottom: '1px solid var(--border)' }}>
          <div className="text-xs text-muted mb-2">Anterior ({lastSession.date})</div>
          <div className="flex gap-12">
            <span className="text-xs"><b style={{ color }}>{lastSession.maxWeight}kg</b> max</span>
            <span className="text-xs"><b>{lastSession.sets}</b> series</span>
            <span className="text-xs"><b>{stats.length}</b> veces hecho</span>
          </div>
        </div>
      )}

      {/* Sets */}
      <div style={{ padding: '6px 14px' }}>
        {exercise.sets.length > 0 && (
          <div className="flex mb-2 py-8" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs text-muted text-center" style={{ flex: 0.5 }}>#</span>
            <span className="text-xs text-muted text-center flex-1">Reps</span>
            <span className="text-xs text-muted text-center flex-1">Peso</span>
            {editable && <span style={{ width: 24 }} />}
          </div>
        )}
        {exercise.sets.map((set, si) => (
          <div key={si} className="flex items-center" style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs text-muted text-center" style={{ flex: 0.5 }}>{si + 1}</span>
            <span className="text-0.85 font-600 text-center flex-1">{set.reps}</span>
            <span className="text-0.85 font-600 text-center flex-1">
              {set.weight > 0 ? `${set.weight}kg` : '-'}
            </span>
            {editable && (
              <button className="btn-ghost muted p-0" style={{ width: 24 }}
                onClick={() => onRemoveSet(index, si)}>
                <X size={12} />
              </button>
            )}
          </div>
        ))}

        {/* Add set */}
        {editable && (
          showAdd ? (
            <div className="flex gap-6 items-center mt-2">
              <input className="text-center flex-1" value={reps} onChange={e => setReps(e.target.value)}
                placeholder="Reps" type="number" style={{ padding: '8px 6px' }} autoFocus />
              <input className="text-center flex-1" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="Kg" type="number" step="0.5" style={{ padding: '8px 6px' }} />
              <button className="btn btn-sm border-none text-white" style={{ background: color }}
                onClick={() => {
                  if (!reps || parseInt(reps) < 0) return
                  if (weight && parseFloat(weight) < 0) return
                  onAddSet(index, reps, weight); setShowAdd(false); setWeight('')
                }}>
                <Check size={14} />
              </button>
              <button className="btn btn-sm btn-outline" onClick={() => setShowAdd(false)}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <button className="btn btn-sm btn-outline btn-block mt-2" onClick={() => setShowAdd(true)}>
              <Plus size={12} /> Serie
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ========== Workout Card (for list/calendar) ==========
function WorkoutCard({ workout, expanded, onToggle, onDelete, onEditTimer, getExerciseStats }) {
  const totalVol = workout.exercises.reduce((a, ex) =>
    a + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0), 0)
  const totalSets = workout.exercises.reduce((a, ex) => a + ex.sets.length, 0)

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const d = new Date(workout.date + 'T12:00:00')
  const dateLabel = `${dayNames[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`

  return (
    <div style={{
      margin: '0 16px 10px', borderRadius: 'var(--radius)',
      border: `1px solid ${workout.color}30`, background: `${workout.color}05`, overflow: 'hidden'
    }}>
      <div className="flex items-center gap-12 cursor-pointer" onClick={onToggle} style={{ padding: '12px 14px' }}>
        <div className="flex items-center justify-center flex-shrink-0" style={{
          width: 42, height: 42, borderRadius: 12, background: `${workout.color}18`
        }}>
          <Dumbbell size={20} style={{ color: workout.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-700 text-md">{workout.templateName}</div>
          <div className="text-xs text-muted">{dateLabel} · {workout.startTime}-{workout.endTime}</div>
        </div>
        <div className="text-right">
          <div className="text-md font-700" style={{ color: workout.color }}>
            {formatDuration(workout.durationMin)}
          </div>
          <div className="text-xs text-muted">{totalSets} series</div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${workout.color}20` }}>
          <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
            {[
              { label: 'Volumen', value: `${(totalVol / 1000).toFixed(1)}k kg` },
              { label: 'Series', value: totalSets },
              { label: 'Ejercicios', value: workout.exercises.length },
            ].map((kpi, i) => (
              <div key={i} className="flex-1 text-center" style={{
                padding: 10,
                borderRight: i < 2 ? '1px solid var(--border)' : 'none'
              }}>
                <div className="font-700" style={{ fontSize: '0.95rem' }}>{kpi.value}</div>
                <div className="text-xs text-muted">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Exercises */}
          {workout.exercises.map((ex, i) => {
            const maxW = Math.max(...ex.sets.map(s => s.weight))
            const stats = getExerciseStats(ex.name)
            return (
              <div key={i} style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-600 text-0.82">{ex.name}</span>
                  <div className="flex gap-2">
                    {maxW > 0 && (
                      <span className="text-xs font-700" style={{ color: workout.color }}>{maxW}kg</span>
                    )}
                    <span className="text-xs text-muted">{stats.length}x</span>
                  </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                  {ex.sets.map((s, si) => (
                    <span key={si} className="text-0.68 font-600 tabular-nums bg-input rounded-sm" style={{ padding: '2px 8px' }}>
                      {s.reps}x{s.weight > 0 ? `${s.weight}kg` : '-'}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="flex gap-8" style={{ padding: '10px 14px' }}>
            <button className="btn btn-sm btn-outline flex-1" onClick={() => onEditTimer(workout)}>
              <Clock size={13} /> Editar tiempo
            </button>
            <button className="btn btn-sm flex-1 border-none" style={{ background: 'rgba(255,118,117,0.12)', color: 'var(--danger)' }}
              onClick={() => onDelete(workout.id)}>
              <Trash2 size={13} /> Borrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GymPage
