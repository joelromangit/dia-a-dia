import { useState, useCallback, useRef } from 'react'
import {
  Plus, Check, Trash2, Settings, X, ChevronLeft, ChevronRight,
  Calculator, Leaf, FlaskConical, BookOpen, Globe, Atom,
  Lock, Unlock, CheckCircle, ChevronDown, ChevronUp,
  Camera, Send, ArrowLeft, Image, Upload
} from 'lucide-react'
import katex from 'katex'
import { mockStudy } from '../data/mockData'
import { sendWhatsAppNotification } from '../lib/notifications'
import { useAdmin } from '../contexts/AdminContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

function MathText({ text }) {
  if (!text) return null
  const parts = text.split(/(\$[^$]+\$)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const tex = part.slice(1, -1)
          try {
            return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: false }) }} />
          } catch {
            return <span key={i}>{tex}</span>
          }
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

function MathBlock({ tex }) {
  try {
    return <div style={{ textAlign: 'center', margin: '12px 0', overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: false, displayMode: true }) }} />
  } catch {
    return <div>{tex}</div>
  }
}

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

const TOPIC_STATES = ['locked', 'available', 'in_progress', 'completed']

const TOPIC_STATE_CONFIG = {
  locked: { icon: Lock, label: 'Bloqueado', color: 'var(--text-muted)' },
  available: { icon: Unlock, label: 'Disponible', color: 'var(--primary-light)' },
  in_progress: { icon: BookOpen, label: 'En curso', color: 'var(--warning)' },
  completed: { icon: CheckCircle, label: 'Completado', color: 'var(--success)' },
}

function getTopicStateFromLegacy(status) {
  if (status === 'current') return 'in_progress'
  if (status === 'done') return 'completed'
  if (status === 'pending') return 'locked'
  if (TOPIC_STATES.includes(status)) return status
  return 'locked'
}

function isTopicExercisesComplete(subject, topicName) {
  if (!topicName || !subject) return false
  const topic = subject.topics.find(t => t.name === topicName)
  if (!topic) return false
  const allExercises = (topic.theoryBlocks || []).flatMap(b => b.exercises || [])
  if (allExercises.length === 0) return false
  return allExercises.every(ex => ex.status === 'done' || ex.status === 'submitted' || ex.status === 'corrected')
}

function TopicStateBadge({ topic, subjectColor, isAdmin, onClick }) {
  const state = getTopicStateFromLegacy(topic.status)
  const config = TOPIC_STATE_CONFIG[state]
  const StateIcon = config.icon

  return (
    <span
      onClick={isAdmin ? (e) => { e.stopPropagation(); onClick() } : undefined}
      className={`flex items-center gap-1 font-700 text-uppercase${isAdmin ? ' cursor-pointer' : ''}`}
      style={{
        padding: '3px 8px',
        borderRadius: 10,
        fontSize: '0.6rem',
        background: state === 'in_progress'
          ? `${subjectColor}20`
          : state === 'completed'
            ? 'rgba(0,206,201,0.15)'
            : state === 'available'
              ? 'rgba(108,92,231,0.12)'
              : 'rgba(136,136,160,0.12)',
        color: state === 'in_progress' ? subjectColor : config.color,
      }}
    >
      <StateIcon size={10} />
      {config.label}
    </span>
  )
}

function AutoExerciseMultipleChoice({ exercise, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const { choices, correctIndex } = exercise.autoConfig
  const isDone = exercise.status === 'done' || exercise.status === 'submitted'

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    if (selected === correctIndex) {
      onAnswer(exercise.id, selected, true)
    }
  }

  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
  }

  if (isDone) {
    return (
      <div style={{ padding: '10px 0' }}>
        <div className="text-0\.85 mb-2"><MathText text={exercise.question} /></div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} style={{ color: 'var(--success)' }} />
          <span className="text-xs text-success font-600">Correcto: <MathText text={choices[correctIndex]} /></span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '10px 0' }}>
      <div className="text-0\.85 mb-2"><MathText text={exercise.question} /></div>
      <div className="flex-col" style={{ gap: 6 }}>
        {choices.map((choice, i) => {
          let bg = 'var(--bg-input)'
          let border = '1px solid var(--border)'
          let textColor = 'var(--text)'
          if (submitted && i === correctIndex) {
            bg = 'rgba(0,206,201,0.15)'
            border = '1px solid var(--success)'
            textColor = 'var(--success)'
          } else if (submitted && i === selected && i !== correctIndex) {
            bg = 'rgba(255,118,117,0.15)'
            border = '1px solid var(--danger)'
            textColor = 'var(--danger)'
          } else if (!submitted && i === selected) {
            bg = 'rgba(108,92,231,0.15)'
            border = '1px solid var(--primary)'
          }
          return (
            <div
              key={i}
              onClick={!submitted ? () => setSelected(i) : undefined}
              className={`flex items-center gap-10 rounded-sm${!submitted ? ' cursor-pointer' : ''}`}
              style={{ padding: '10px 12px', background: bg, border, color: textColor, fontSize: '0.85rem' }}
            >
              <div
                className="flex-shrink-0 rounded-full flex items-center justify-center"
                style={{
                  width: 18, height: 18,
                  border: i === selected ? '2px solid currentColor' : '2px solid var(--border)',
                  background: i === selected ? 'currentColor' : 'transparent',
                }}
              >
                {i === selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
              </div>
              <MathText text={choice} />
            </div>
          )
        })}
      </div>
      {!submitted && (
        <button
          className="btn btn-primary btn-sm mt-2"
          disabled={selected === null}
          onClick={handleSubmit}
        >
          Comprobar
        </button>
      )}
      {submitted && selected !== correctIndex && (
        <button className="btn btn-outline btn-sm mt-2" onClick={handleRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

function AutoExerciseFillBlank({ exercise, onAnswer }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isDone = exercise.status === 'done' || exercise.status === 'submitted'
  const expected = exercise.autoConfig.expectedAnswer

  const isCorrect = submitted && answer.trim().toLowerCase() === expected.trim().toLowerCase()

  const handleSubmit = () => {
    if (!answer.trim()) return
    setSubmitted(true)
    if (answer.trim().toLowerCase() === expected.trim().toLowerCase()) {
      onAnswer(exercise.id, answer.trim(), true)
    }
  }

  const handleRetry = () => {
    setAnswer('')
    setSubmitted(false)
  }

  if (isDone) {
    return (
      <div style={{ padding: '10px 0' }}>
        <div className="text-0\.85 mb-2"><MathText text={exercise.question} /></div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} style={{ color: 'var(--success)' }} />
          <span className="text-xs text-success font-600">Correcto: {expected}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '10px 0' }}>
      <div className="text-0\.85 mb-2"><MathText text={exercise.question} /></div>
      <div className="flex gap-2">
        <input
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Tu respuesta"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={submitted && !isCorrect ? { borderColor: 'var(--danger)' } : {}}
        />
        {!submitted && (
          <button className="btn btn-primary btn-sm" disabled={!answer.trim()} onClick={handleSubmit}>
            Comprobar
          </button>
        )}
      </div>
      {submitted && !isCorrect && (
        <div className="mt-2">
          <span className="text-xs text-danger font-600">Respuesta correcta: {expected}</span>
          <button className="btn btn-outline btn-sm mt-1" onClick={handleRetry}>Reintentar</button>
        </div>
      )}
    </div>
  )
}

function ManualExercise({ exercise, onPhotoUpload }) {
  const fileRef = useRef(null)
  const isDone = exercise.status === 'done' || exercise.status === 'submitted'

  return (
    <div style={{ padding: '10px 0' }}>
      <div className="text-0\.85 mb-2"><MathText text={exercise.question} /></div>
      {exercise.photoUrl && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={exercise.photoUrl}
            alt="Respuesta"
            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--border)' }}
          />
        </div>
      )}
      {exercise.status === 'submitted' && (
        <div className="flex items-center gap-2">
          <Send size={14} style={{ color: 'var(--primary-light)' }} />
          <span className="text-xs text-primary-light font-600">Enviado para correccion</span>
        </div>
      )}
      {!exercise.photoUrl && exercise.status !== 'submitted' && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) onPhotoUpload(exercise.id, file)
            }}
          />
          <button className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
            <Camera size={14} /> Subir foto
          </button>
        </>
      )}
      {exercise.photoUrl && !isDone && exercise.status !== 'submitted' && (
        <div className="flex items-center gap-2 mt-1">
          <CheckCircle size={14} style={{ color: 'var(--success)' }} />
          <span className="text-xs text-success font-600">Foto subida</span>
        </div>
      )}
    </div>
  )
}

function TheoryBlockCard({ block, subjectColor, isAdmin, onExerciseAnswer, onPhotoUpload, onSubmitForReview, expandedBlockId }) {
  const [expanded, setExpanded] = useState(expandedBlockId === block.id)
  const allExercises = block.exercises || []
  const allDone = allExercises.length > 0 && allExercises.every(ex => ex.status === 'done' || ex.status === 'submitted')
  const allSubmitted = allExercises.length > 0 && allExercises.every(ex => ex.status === 'submitted')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    onSubmitForReview(block.id)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div
      style={{
        margin: '0 16px 10px',
        borderRadius: 'var(--radius)',
        border: `1px solid var(--border)`,
        background: 'var(--bg-card)',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-10 cursor-pointer"
        style={{ padding: '14px 16px' }}
      >
        <div className="flex-1 min-w-0">
          <div className="font-600" style={{ fontSize: '0.88rem' }}>{block.title}</div>
          <div className="text-xs text-muted mt-1">
            {allExercises.length} ejercicios
            {allDone && !allSubmitted && ' - Listos para enviar'}
            {allSubmitted && ' - Enviados'}
          </div>
        </div>
        {expanded ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            fontSize: '0.85rem',
            lineHeight: 1.65,
            color: 'var(--text)',
            marginBottom: allExercises.length > 0 ? 16 : 0,
          }}>
            {block.content.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ marginBottom: 10 }}><MathText text={paragraph} /></p>
            ))}
          </div>

          {allExercises.length > 0 && (
            <>
              <div className="font-700 text-uppercase tracking-wide text-muted" style={{ fontSize: '0.68rem', marginBottom: 8 }}>
                Ejercicios
              </div>
              {allExercises.map((ex, i) => (
                <div key={ex.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div className="flex items-center gap-2" style={{ paddingTop: i > 0 ? 8 : 0 }}>
                    <span className="text-xs text-muted font-600">{i + 1}.</span>
                    {ex.status === 'done' && <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>Hecho</span>}
                    {ex.status === 'submitted' && <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>Enviado</span>}
                    {ex.status === 'pending' && <span className="badge" style={{ fontSize: '0.6rem', padding: '1px 6px', background: 'rgba(136,136,160,0.12)', color: 'var(--text-muted)' }}>Pendiente</span>}
                  </div>
                  {ex.type === 'auto' && ex.autoConfig?.type === 'multiple_choice' && (
                    <AutoExerciseMultipleChoice exercise={ex} onAnswer={onExerciseAnswer} />
                  )}
                  {ex.type === 'auto' && ex.autoConfig?.type === 'fill_blank' && (
                    <AutoExerciseFillBlank exercise={ex} onAnswer={onExerciseAnswer} />
                  )}
                  {ex.type === 'manual' && (
                    <ManualExercise exercise={ex} onPhotoUpload={onPhotoUpload} />
                  )}
                </div>
              ))}

              {allDone && !allSubmitted && (
                <button
                  className="btn btn-sm w-full mt-3"
                  style={{ background: `${subjectColor}20`, color: subjectColor, border: 'none', justifyContent: 'center' }}
                  onClick={handleSubmit}
                >
                  <Send size={14} /> Enviar para corregir
                </button>
              )}
              {showSuccess && (
                <div className="text-xs text-success font-600 text-center mt-2">
                  Ejercicios enviados para correccion
                </div>
              )}
              {allSubmitted && (
                <div className="text-xs text-primary-light font-600 text-center mt-2">
                  Todos los ejercicios enviados
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

const STUDY_STORAGE_KEY = 'grindset-study-data'
const STUDY_DATA_VERSION = 2

function loadStudyData() {
  try {
    const savedVersion = localStorage.getItem(STUDY_STORAGE_KEY + '-version')
    if (savedVersion === String(STUDY_DATA_VERSION)) {
      const saved = localStorage.getItem(STUDY_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    }
    localStorage.removeItem(STUDY_STORAGE_KEY)
  } catch {}
  return mockStudy.subjects
}

function saveStudyData(subjects) {
  try {
    localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(subjects))
    localStorage.setItem(STUDY_STORAGE_KEY + '-version', String(STUDY_DATA_VERSION))
  } catch {}
}

function StudyPage() {
  const { isAdmin } = useAdmin()
  const [subjects, setSubjectsRaw] = useState(loadStudyData)
  const loading = false
  const error = null

  const setSubjects = useCallback((updater) => {
    setSubjectsRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveStudyData(next)
      return next
    })
  }, [])
  const [activeSubject, setActiveSubject] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [expandedBlockId, setExpandedBlockId] = useState(null)
  const [modal, setModal] = useState(null)
  const [newSubject, setNewSubject] = useState({ name: '', color: '#4f8cff', icon: 'calculator' })
  const [newTask, setNewTask] = useState({ day: 'Lunes', task: '', topic: '' })
  const [newTopic, setNewTopic] = useState('')
  const [editForm, setEditForm] = useState(null)
  const [showError, setShowError] = useState(true)
  const [errors, setErrors] = useState({})

  const detail = activeSubject ? subjects.find(s => s.id === activeSubject) : null
  const currentTopicData = activeTopic && detail
    ? detail.topics.find(t => t.name === activeTopic.name && t.order === activeTopic.order)
    : null

  const clearErrors = () => setErrors({})

  const closeModal = () => {
    setModal(null)
    clearErrors()
  }

  const isTaskDone = (task, subject) => {
    if (task.topic && isTopicExercisesComplete(subject, task.topic)) return true
    return !!task.done
  }

  const getSubjectProgress = (s) => {
    const total = s.weeklyPlan.length
    const done = s.weeklyPlan.filter(t => isTaskDone(t, s)).length
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const getCurrentTopic = (s) => s.topics.find(t => {
    const state = getTopicStateFromLegacy(t.status)
    return state === 'in_progress'
  })
  const getNextTopic = (s) => {
    const currentIdx = s.topics.findIndex(t => getTopicStateFromLegacy(t.status) === 'in_progress')
    return currentIdx >= 0 && currentIdx < s.topics.length - 1 ? s.topics[currentIdx + 1] : null
  }
  const getCompletedTopics = (s) => s.topics.filter(t => getTopicStateFromLegacy(t.status) === 'completed').length

  const totalTasks = subjects.reduce((a, s) => a + s.weeklyPlan.length, 0)
  const doneTasks = subjects.reduce((a, s) => a + s.weeklyPlan.filter(t => isTaskDone(t, s)).length, 0)
  const weekProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const dayIndex = (new Date().getDay() + 6) % 7
  const todayName = DAYS[dayIndex]
  const todayTasks = subjects.flatMap(s =>
    s.weeklyPlan
      .map((t, i) => ({ ...t, subjectId: s.id, subjectName: s.name, subjectColor: s.color, taskIndex: i, autoComplete: t.topic ? isTopicExercisesComplete(s, t.topic) : false }))
      .filter(t => t.day === todayName)
  )

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
    const hasAny = subject && subject.topics.length > 0
    const initialStatus = hasAny ? 'locked' : 'available'
    setSubjects(subjects.map(s =>
      s.id === subjectId
        ? { ...s, topics: [...s.topics, { name, order, status: initialStatus, theoryBlocks: [] }] }
        : s
    ))
    setNewTopic('')
    clearErrors()
    studyDb.addTopic(subjectId, name, order, initialStatus)
  }

  const handleDeleteTopic = (subjectId, topicIndex) => {
    const subject = subjects.find(s => s.id === subjectId)
    const topicId = subject?.topics[topicIndex]?.id
    setSubjects(subjects.map(s =>
      s.id === subjectId ? { ...s, topics: s.topics.filter((_, i) => i !== topicIndex) } : s
    ))
    if (topicId) studyDb.deleteTopic(topicId)
  }

  const cycleTopicState = (subjectId, topicIndex) => {
    if (!isAdmin) return
    const cycle = { locked: 'available', available: 'in_progress', in_progress: 'completed', completed: 'locked' }
    setSubjects(subjects.map(s => {
      if (s.id !== subjectId) return s
      const topics = s.topics.map((t, i) => {
        if (i !== topicIndex) return t
        const currentState = getTopicStateFromLegacy(t.status)
        const newState = cycle[currentState]
        return { ...t, status: newState }
      })
      const changedTopic = topics[topicIndex]
      if (changedTopic.status === 'completed') {
        const nextIdx = topicIndex + 1
        if (nextIdx < topics.length && getTopicStateFromLegacy(topics[nextIdx].status) === 'locked') {
          topics[nextIdx] = { ...topics[nextIdx], status: 'available' }
        }
      }
      return { ...s, topics }
    }))
    const subject = subjects.find(s => s.id === subjectId)
    const topic = subject?.topics[topicIndex]
    if (topic?.id) {
      const currentState = getTopicStateFromLegacy(topic.status)
      const newState = { locked: 'available', available: 'in_progress', in_progress: 'completed', completed: 'locked' }[currentState]
      studyDb.updateTopic(topic.id, { status: newState })
      if (newState === 'completed' && subject) {
        const nextTopic = subject.topics[topicIndex + 1]
        if (nextTopic?.id && getTopicStateFromLegacy(nextTopic.status) === 'locked') {
          studyDb.updateTopic(nextTopic.id, { status: 'available' })
        }
      }
    }
  }

  const openTopic = (topic, blockId = null) => {
    const state = getTopicStateFromLegacy(topic.status)
    if (!isAdmin && state === 'locked') return
    if (state === 'available') {
      setSubjects(subjects.map(s => {
        if (s.id !== activeSubject) return s
        return {
          ...s,
          topics: s.topics.map(t =>
            t.name === topic.name && t.order === topic.order
              ? { ...t, status: 'in_progress' }
              : t
          )
        }
      }))
      if (topic.id) studyDb.updateTopic(topic.id, { status: 'in_progress' })
    }
    setExpandedBlockId(blockId)
    setActiveTopic(topic)
  }

  const handleExerciseAnswer = (exerciseId, answer, correct) => {
    if (!correct) return
    setSubjects(subjects.map(s => {
      if (s.id !== activeSubject) return s
      return {
        ...s,
        topics: s.topics.map(t => ({
          ...t,
          theoryBlocks: (t.theoryBlocks || []).map(b => ({
            ...b,
            exercises: (b.exercises || []).map(ex =>
              ex.id === exerciseId ? { ...ex, status: 'done', studentAnswer: answer } : ex
            )
          }))
        }))
      }
    }))
  }

  const handlePhotoUpload = async (exerciseId, file) => {
    let photoUrl = null
    if (isSupabaseConfigured() && supabase) {
      const ext = file.name.split('.').pop()
      const path = `exercises/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file)
      if (!uploadError) {
        const { data } = supabase.storage.from('uploads').getPublicUrl(path)
        photoUrl = data.publicUrl
      }
    }
    if (!photoUrl) {
      photoUrl = URL.createObjectURL(file)
    }
    setSubjects(subjects.map(s => {
      if (s.id !== activeSubject) return s
      return {
        ...s,
        topics: s.topics.map(t => ({
          ...t,
          theoryBlocks: (t.theoryBlocks || []).map(b => ({
            ...b,
            exercises: (b.exercises || []).map(ex =>
              ex.id === exerciseId ? { ...ex, status: 'done', photoUrl } : ex
            )
          }))
        }))
      }
    }))
  }

  const handleSubmitForReview = (blockId) => {
    const subject = subjects.find(s => s.id === activeSubject)
    let topicName = ''
    let blockTitle = ''
    let exerciseCount = 0
    if (subject) {
      for (const t of subject.topics || []) {
        const block = (t.theoryBlocks || []).find(b => b.id === blockId)
        if (block) {
          topicName = t.name || t.title || ''
          blockTitle = block.title || ''
          exerciseCount = (block.exercises || []).filter(ex => ex.status === 'done').length
          break
        }
      }
    }

    setSubjects(subjects.map(s => {
      if (s.id !== activeSubject) return s
      return {
        ...s,
        topics: s.topics.map(t => ({
          ...t,
          theoryBlocks: (t.theoryBlocks || []).map(b => {
            if (b.id !== blockId) return b
            return {
              ...b,
              exercises: (b.exercises || []).map(ex =>
                ex.status === 'done' ? { ...ex, status: 'submitted' } : ex
              )
            }
          })
        }))
      }
    }))

    sendWhatsAppNotification(`Nuevos ejercicios para corregir: ${topicName} - ${blockTitle} (${exerciseCount} ejercicios)`)
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

  // ========== TOPIC VIEW ==========
  if (detail && currentTopicData) {
    const Icon = ICONS[detail.icon] || Calculator
    const topicState = getTopicStateFromLegacy(currentTopicData.status)
    const theoryBlocks = currentTopicData.theoryBlocks || []

    return (
      <>
        {error && showError && (
          <div className="error-banner">
            <span>No se pudo conectar con el servidor. Usando datos locales.</span>
            <button className="dismiss" onClick={() => setShowError(false)}>x</button>
          </div>
        )}

        <div className="p-16 sticky-top" style={{
          background: `linear-gradient(135deg, ${detail.color}18 0%, var(--bg) 100%)`,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex items-center gap-2 mb-3">
            <button className="btn-ghost" onClick={() => setActiveTopic(null)}>
              <ArrowLeft size={20} />
            </button>
            <Icon size={18} style={{ color: detail.color }} />
            <div className="flex-1 min-w-0">
              <div className="font-700 text-lg">{currentTopicData.name}</div>
              <div className="text-xs text-muted">{detail.name}</div>
            </div>
            <TopicStateBadge
              topic={currentTopicData}
              subjectColor={detail.color}
              isAdmin={isAdmin}
              onClick={() => {
                const idx = detail.topics.findIndex(t => t.name === currentTopicData.name && t.order === currentTopicData.order)
                if (idx >= 0) cycleTopicState(detail.id, idx)
              }}
            />
          </div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          {theoryBlocks.length === 0 && (
            <div className="text-muted text-center" style={{ padding: '40px 0', fontSize: '0.85rem' }}>
              Sin contenido teorico todavia.
            </div>
          )}

          {theoryBlocks.map(block => (
            <TheoryBlockCard
              key={block.id}
              block={block}
              subjectColor={detail.color}
              isAdmin={isAdmin}
              onExerciseAnswer={handleExerciseAnswer}
              onPhotoUpload={handlePhotoUpload}
              onSubmitForReview={handleSubmitForReview}
              expandedBlockId={expandedBlockId}
            />
          ))}

          <div style={{ height: 24 }} />
        </div>
      </>
    )
  }

  // ========== DETAIL VIEW ==========
  if (detail) {
    const Icon = ICONS[detail.icon] || Calculator
    const subDone = detail.weeklyPlan.filter(t => isTaskDone(t, detail)).length
    const subTotal = detail.weeklyPlan.length
    const subProgress = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0
    const currentTopic = getCurrentTopic(detail)

    const tasksByDay = {}
    detail.weeklyPlan.forEach((task, i) => {
      const autoComplete = task.topic ? isTopicExercisesComplete(detail, task.topic) : false
      if (!tasksByDay[task.day]) tasksByDay[task.day] = []
      tasksByDay[task.day].push({ ...task, originalIndex: i, autoComplete })
    })

    return (
      <>
        {error && showError && (
          <div className="error-banner">
            <span>No se pudo conectar con el servidor. Usando datos locales.</span>
            <button className="dismiss" onClick={() => setShowError(false)}>x</button>
          </div>
        )}

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
            {isAdmin && (
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
            )}
          </div>

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
                {getCompletedTopics(detail)}/{detail.topics.length} completados
              </div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <span className="section-title">Temario</span>
        </div>
        <div className="px-16" style={{ paddingBottom: 8 }}>
          {detail.topics.map((topic, i) => {
            const state = getTopicStateFromLegacy(topic.status)
            const config = TOPIC_STATE_CONFIG[state]
            const StateIcon = config.icon
            const isClickable = isAdmin || (state !== 'locked')
            const hasContent = (topic.theoryBlocks || []).length > 0

            return (
              <div
                key={i}
                onClick={() => {
                  if (isClickable && hasContent) openTopic(topic)
                }}
                className={`flex items-center gap-10${isClickable && hasContent ? ' cursor-pointer' : ''}`}
                style={{
                  padding: '9px 0',
                  borderBottom: i < detail.topics.length - 1 ? '1px solid var(--border)' : 'none',
                  opacity: state === 'locked' && !isAdmin ? 0.5 : 1,
                }}
              >
                <StateIcon
                  size={18}
                  className="flex-shrink-0"
                  style={{
                    color: state === 'completed' ? 'var(--success)'
                      : state === 'in_progress' ? detail.color
                      : state === 'available' ? 'var(--primary-light)'
                      : 'var(--text-muted)'
                  }}
                />
                <span className="flex-1" style={{
                  fontSize: '0.85rem',
                  fontWeight: state === 'in_progress' ? 700 : 400,
                  color: state === 'completed' ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: state === 'completed' ? 'line-through' : 'none',
                }}>
                  {topic.name}
                </span>
                <TopicStateBadge
                  topic={topic}
                  subjectColor={detail.color}
                  isAdmin={isAdmin}
                  onClick={() => cycleTopicState(detail.id, i)}
                />
              </div>
            )
          })}
        </div>

        <div className="section-header">
          <span className="section-title">Tareas de la semana</span>
          {isAdmin && (
            <button
              className="btn btn-sm border-none"
              style={{ background: `${detail.color}20`, color: detail.color }}
              onClick={() => { setNewTask({ day: 'Lunes', task: '', topic: '' }); clearErrors(); setModal('add-task') }}
            >
              <Plus size={14} /> Tarea
            </button>
          )}
        </div>

        {/* Weekly calendar strip */}
        <div className="px-16" style={{ paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {(() => {
              const now = new Date()
              const mondayOffset = (now.getDay() + 6) % 7
              const monday = new Date(now)
              monday.setDate(now.getDate() - mondayOffset)
              const SHORT_DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
              return SHORT_DAYS.map((shortDay, i) => {
                const d = new Date(monday)
                d.setDate(monday.getDate() + i)
                const isToday = i === mondayOffset
                const dayName = DAYS[i]
                const dayTasks = tasksByDay[dayName] || []
                const allDone = dayTasks.length > 0 && dayTasks.every(t => t.autoComplete || t.done)
                const hasTasks = dayTasks.length > 0
                const someDone = dayTasks.some(t => t.autoComplete || t.done)

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '6px 2px',
                      borderRadius: 8,
                      background: isToday ? `${detail.color}18` : 'transparent',
                      border: isToday ? `2px solid ${detail.color}40` : '2px solid transparent',
                    }}
                  >
                    <div style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: isToday ? detail.color : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {shortDay}
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: isToday ? 800 : 500,
                      color: isToday ? detail.color : 'var(--text)',
                      marginTop: 2,
                    }}>
                      {d.getDate()}
                    </div>
                    {hasTasks && (
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        margin: '3px auto 0',
                        background: allDone ? 'var(--success)' : someDone ? 'var(--warning)' : `${detail.color}60`,
                      }} />
                    )}
                  </div>
                )
              })
            })()}
          </div>

          {/* Tasks for each day under the calendar */}
          {DAYS.map((dayName, i) => {
            const dayTasks = tasksByDay[dayName]
            if (!dayTasks || dayTasks.length === 0) return null
            const now = new Date()
            const mondayOffset = (now.getDay() + 6) % 7
            const isToday = i === mondayOffset

            return (
              <div key={dayName} style={{ marginTop: i === DAYS.findIndex(d => tasksByDay[d]) ? 8 : 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 0 4px',
                }}>
                  <span className="font-700 text-uppercase tracking-wide" style={{
                    fontSize: '0.68rem',
                    color: isToday ? detail.color : 'var(--text-muted)',
                  }}>
                    {dayName}
                  </span>
                  {isToday && (
                    <span style={{
                      fontSize: '0.55rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 6,
                      background: `${detail.color}20`,
                      color: detail.color,
                      textTransform: 'uppercase',
                    }}>
                      Hoy
                    </span>
                  )}
                </div>
                {dayTasks.map(task => {
                  const done = task.autoComplete || task.done
                  const canToggle = isAdmin || !task.topic
                  return (
                    <div key={task.originalIndex} className="flex items-center gap-10" style={{
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border)'
                    }}>
                      <div
                        className={`checkbox ${done ? 'checked' : ''}`}
                        style={!done ? { borderColor: `${detail.color}60` } : task.autoComplete ? { background: 'var(--success)', borderColor: 'var(--success)' } : {}}
                        onClick={canToggle ? () => toggleTask(detail.id, task.originalIndex) : undefined}
                      >
                        {done && <Check size={12} color="white" />}
                      </div>
                      <div
                        className="flex-1 min-w-0"
                        style={{ cursor: task.topic ? 'pointer' : 'default' }}
                        onClick={() => {
                          if (task.topic) {
                            const topic = detail.topics.find(t => t.name === task.topic)
                            if (topic) openTopic(topic, task.blockId || null)
                          }
                        }}
                      >
                        <span style={{
                          fontSize: '0.85rem',
                          textDecoration: done ? 'line-through' : 'none',
                          color: done ? 'var(--text-muted)' : 'var(--text)'
                        }}>
                          {task.task}
                        </span>
                        {task.topic && (
                          <span style={{
                            marginLeft: 8,
                            padding: '1px 6px',
                            borderRadius: 8,
                            fontSize: '0.6rem',
                            background: task.autoComplete ? 'rgba(0,206,201,0.15)' : `${detail.color}15`,
                            color: task.autoComplete ? 'var(--success)' : `${detail.color}cc`
                          }}>
                            {task.topic}
                          </span>
                        )}
                      </div>
                      {isAdmin && (
                        <button
                          className="btn-ghost muted opacity-40"
                          onClick={() => handleDeleteTask(detail.id, task.originalIndex)}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {detail.weeklyPlan.length === 0 && (
          <div className="text-muted text-center" style={{ padding: '30px 16px', fontSize: '0.85rem' }}>
            Sin tareas. Anade tu planning semanal.
          </div>
        )}

        <div style={{ height: 24 }} />

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
          {isAdmin && subjects.length < 4 && (
            <button className="btn btn-primary btn-sm" onClick={() => { clearErrors(); setModal('add-subject') }}>
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {error && showError && (
        <div className="error-banner">
          <span>No se pudo conectar con el servidor. Usando datos locales.</span>
          <button className="dismiss" onClick={() => setShowError(false)}>x</button>
        </div>
      )}

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

      {subjects.map(subject => {
        const Icon = ICONS[subject.icon] || Calculator
        const progress = getSubjectProgress(subject)
        const current = getCurrentTopic(subject)
        const next = getNextTopic(subject)
        const doneTops = getCompletedTopics(subject)
        const subDone = subject.weeklyPlan.filter(t => isTaskDone(t, subject)).length
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

            <div className="px-16">
              <div className="progress-bar" style={{ height: 4, margin: 0 }}>
                <div style={{
                  height: '100%', borderRadius: 3, width: `${progress}%`,
                  background: subject.color, transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

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

            <div className="flex items-center justify-end gap-1" style={{ padding: '0 16px 10px' }}>
              <span className="text-xs text-muted">Ver detalle</span>
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        )
      })}

      {todayTasks.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Hoy - {todayName}</span>
          </div>
          <div className="card">
            {todayTasks.map((task, i) => {
              const done = task.autoComplete || task.done
              const canToggle = isAdmin || !task.topic
              return (
                <div key={i} className="flex items-center gap-10" style={{
                  padding: '8px 0',
                  borderBottom: i < todayTasks.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div
                    className={`checkbox ${done ? 'checked' : ''}`}
                    style={!done ? { borderColor: `${task.subjectColor}60` } : task.autoComplete ? { background: 'var(--success)', borderColor: 'var(--success)' } : {}}
                    onClick={canToggle ? () => toggleTask(task.subjectId, task.taskIndex) : undefined}
                  >
                    {done && <Check size={12} color="white" />}
                  </div>
                  <div className="flex-1">
                    <span style={{
                      fontSize: '0.85rem',
                      textDecoration: done ? 'line-through' : 'none',
                      color: done ? 'var(--text-muted)' : 'var(--text)'
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
              )
            })}
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
