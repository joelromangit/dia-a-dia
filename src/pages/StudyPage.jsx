import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Plus, Check, Trash2, Settings, X, ChevronLeft, ChevronRight,
  Calculator, Leaf, FlaskConical, BookOpen, Globe, Atom,
  Lock, Unlock, CheckCircle, ChevronDown, ChevronUp,
  Camera, Send, ArrowLeft, Image, Upload, Zap,
  Clock, MessageSquare, ThumbsUp, ThumbsDown, ClipboardList, RefreshCw
} from 'lucide-react'
import katex from 'katex'
import { mockStudy } from '../data/mockData'
import { sendWhatsAppNotification, sendStudentWhatsApp } from '../lib/notifications'
import { useAdmin } from '../contexts/AdminContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { appStateDb } from '../lib/db'

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

function PhotoLightbox({ src, alt, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, overscrollBehavior: 'contain',
      }}
    >
      <button onClick={(e) => { e.stopPropagation(); onClose() }} style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10000,
      }}>
        <X size={20} color="white" />
      </button>
      <img
        src={src}
        alt={alt || 'Foto'}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }}
      />
    </div>
  )
}

function ClickablePhoto({ src, alt, style }) {
  const [open, setOpen] = useState(false)
  if (!src) return null
  return (
    <>
      <img
        src={src}
        alt={alt || 'Foto'}
        onClick={() => setOpen(true)}
        style={{ ...style, cursor: 'zoom-in' }}
      />
      {open && <PhotoLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}

const TOPIC_STATE_CONFIG = {
  locked: { icon: Lock, label: 'Bloqueado', color: 'var(--text-muted)' },
  available: { icon: Unlock, label: 'Disponible', color: 'var(--primary-light)' },
  in_progress: { icon: BookOpen, label: 'En curso', color: 'var(--warning)' },
  completed: { icon: CheckCircle, label: 'Completado', color: 'var(--success)' },
}

// Check if an exercise is truly complete:
// - auto exercises: done/submitted/corrected = complete
// - manual exercises: only complete if latest submission is approved
function isExerciseComplete(ex, submissions = []) {
  if (ex.status === 'corrected') return true
  if (ex.status === 'done') return true
  if (ex.status === 'submitted') {
    if (ex.type === 'auto') return true
    const exSubs = submissions.filter(s => s.exerciseId === ex.id)
    const latest = exSubs.length > 0 ? exSubs[exSubs.length - 1] : null
    return latest?.status === 'approved'
  }
  return false
}

function getTopicStateFromLegacy(status) {
  if (status === 'current') return 'in_progress'
  if (status === 'done') return 'completed'
  if (status === 'pending') return 'locked'
  if (TOPIC_STATES.includes(status)) return status
  return 'locked'
}

function isTopicExercisesComplete(subject, topicName, subs = []) {
  if (!topicName || !subject) return false
  const topic = subject.topics.find(t => t.name === topicName)
  if (!topic) return false
  const allExercises = (topic.theoryBlocks || []).flatMap(b => b.exercises || [])
  if (allExercises.length === 0) return false
  return allExercises.every(ex => isExerciseComplete(ex, subs))
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

// ========== ANSWER NORMALIZATION (Task 2) ==========
function normalizeAnswer(raw) {
  if (!raw) return ''
  let s = raw.trim().toLowerCase()
  // Strip surrounding $ from LaTeX
  if (s.startsWith('$') && s.endsWith('$')) s = s.slice(1, -1)
  // Convert LaTeX fractions: \frac{a}{b} -> a/b
  s = s.replace(/\\frac\s*\{([^}]*)\}\s*\{([^}]*)\}/g, '$1/$2')
  // Remove common LaTeX commands
  s = s.replace(/\\(left|right|,|;|!|quad|qquad|cdot|times)/g, '')
  // Remove remaining backslashes from LaTeX
  s = s.replace(/\\/g, '')
  // Normalize whitespace
  s = s.replace(/\s+/g, ' ').trim()
  // Normalize special characters
  s = s.replace(/[''`]/g, "'")
  s = s.replace(/[""«»]/g, '"')
  return s
}

function parseNumericValue(s) {
  // Try to evaluate as a fraction a/b
  const fractionMatch = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/)
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1])
    const den = parseFloat(fractionMatch[2])
    if (den !== 0) return num / den
  }
  // Try comma as decimal separator
  const commaNum = s.replace(',', '.')
  const val = parseFloat(commaNum)
  if (!isNaN(val)) return val
  return null
}

function answersMatch(student, expected) {
  const normStudent = normalizeAnswer(student)
  const normExpected = normalizeAnswer(expected)
  // Direct string match
  if (normStudent === normExpected) return true
  // Numeric comparison with tolerance
  const numStudent = parseNumericValue(normStudent)
  const numExpected = parseNumericValue(normExpected)
  if (numStudent !== null && numExpected !== null) {
    return Math.abs(numStudent - numExpected) < 0.001
  }
  return false
}

// ========== PER-TOPIC WEEKLY PLAN GENERATION (Task 1) ==========
function generateTopicPlan(topic) {
  const blocks = topic.theoryBlocks || []
  if (blocks.length === 0) return []
  return blocks.map((block, i) => ({
    day: DAYS[i % 7],
    week: Math.floor(i / 7),
    task: block.title,
    topic: topic.name,
    blockId: block.id,
    done: block.status === 'completed',
    autoComplete: block.status === 'completed',
  }))
}

// ========== DATE-BASED STUDY PLAN ==========
const PLAN_START_DATE = '2026-04-06' // Monday April 6
// Matrices has a special split: 3 easy blocks on Monday, then 1/day
// Other topics default to 1 block per weekday
const TOPIC_DAY_SPLITS = {
  'Matrices': [[1, 2, 3], [4], [5], [6], [7]],
}

function getNextWeekday(date) {
  const d = new Date(date)
  d.setDate(d.getDate() + 1)
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1)
  }
  return d
}

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

function generateFullPlan(subjects) {
  const plan = []
  let currentDate = new Date(PLAN_START_DATE + 'T12:00:00')
  // Ensure we start on a weekday
  while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
    currentDate = getNextWeekday(currentDate)
  }

  for (const subject of subjects) {
    const sortedTopics = [...subject.topics].sort((a, b) => a.order - b.order)
    for (const topic of sortedTopics) {
      const blocks = topic.theoryBlocks || []
      if (blocks.length === 0) continue

      const customSplit = TOPIC_DAY_SPLITS[topic.name]
      if (customSplit) {
        // Use custom block grouping
        for (const blockGroup of customSplit) {
          const dayBlocks = blockGroup.map(bid => blocks.find(b => b.id === bid)).filter(Boolean)
          if (dayBlocks.length === 0) continue
          for (const block of dayBlocks) {
            plan.push({
              date: formatDate(currentDate),
              blockId: block.id,
              topicName: topic.name,
              topicOrder: topic.order,
              subjectId: subject.id,
              task: block.title,
              completed: block.status === 'completed',
              completedDate: null,
              isAhead: false,
            })
          }
          currentDate = getNextWeekday(currentDate)
        }
      } else {
        // Default: 1 block per weekday
        for (const block of blocks) {
          plan.push({
            date: formatDate(currentDate),
            blockId: block.id,
            topicName: topic.name,
            topicOrder: topic.order,
            subjectId: subject.id,
            task: block.title,
            completed: block.status === 'completed',
            completedDate: null,
            isAhead: false,
          })
          currentDate = getNextWeekday(currentDate)
        }
      }
    }
  }
  return plan
}

function recalculatePlan(plan, subjects) {
  // Sync completion status from subjects data
  const updated = plan.map(entry => {
    const subject = subjects.find(s => s.id === entry.subjectId)
    if (!subject) return entry
    const topic = subject.topics.find(t => t.name === entry.topicName)
    if (!topic) return entry
    const block = (topic.theoryBlocks || []).find(b => b.id === entry.blockId)
    if (!block) return entry
    const isCompleted = block.status === 'completed'
    if (isCompleted && !entry.completed) {
      const today = formatDate(new Date())
      const isAhead = today < entry.date
      return { ...entry, completed: true, completedDate: today, isAhead }
    }
    if (!isCompleted && entry.completed) {
      return { ...entry, completed: false, isAhead: false, completedDate: null }
    }
    return { ...entry, completed: isCompleted }
  })

  // Shift: find first incomplete entry, recalculate dates from today or its original date
  const firstIncomplete = updated.findIndex(e => !e.completed)
  if (firstIncomplete < 0) return updated

  // Count how many days were gained (completed ahead)
  const aheadEntries = updated.slice(0, firstIncomplete).filter(e => e.isAhead)
  if (aheadEntries.length === 0) return updated

  // Reassign dates for incomplete entries starting from earliest available weekday
  let nextDate = new Date()
  // Start from tomorrow if today still has incomplete work, or today if nothing planned today
  const todayStr = formatDate(new Date())
  const todayHasIncomplete = updated.some(e => e.date === todayStr && !e.completed)
  if (todayHasIncomplete) {
    // Keep today's date, shift from tomorrow
    let shiftFrom = firstIncomplete
    // Find entries after today
    const afterToday = updated.findIndex((e, i) => i >= firstIncomplete && e.date > todayStr)
    if (afterToday >= 0) {
      shiftFrom = afterToday
    } else {
      return updated
    }
    nextDate = getNextWeekday(new Date(todayStr + 'T12:00:00'))

    // Group incomplete entries by original date to preserve day-groupings
    let lastOrigDate = null
    for (let i = shiftFrom; i < updated.length; i++) {
      if (updated[i].completed) continue
      if (lastOrigDate !== null && updated[i].date === lastOrigDate) {
        // Same day group - keep same new date
        updated[i] = { ...updated[i], date: formatDate(nextDate) }
      } else {
        if (lastOrigDate !== null) {
          nextDate = getNextWeekday(nextDate)
        }
        lastOrigDate = updated[i].date
        updated[i] = { ...updated[i], date: formatDate(nextDate) }
      }
    }
  }

  return updated
}

// Helper to get plan entries for a specific date range (week)
function getPlanForWeek(plan, weekStart) {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const endStr = formatDate(end)
  const startStr = formatDate(start)
  return plan.filter(e => e.date >= startStr && e.date <= endStr)
}

function getWeekMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return formatDate(d)
}

function SubmissionStatusBadge({ exerciseId, submissions = [] }) {
  const allSubs = submissions.filter(s => s.exerciseId === exerciseId)
  const sub = allSubs.length > 0 ? allSubs[allSubs.length - 1] : null
  if (!sub) return null
  if (sub.status === 'approved') {
    return (
      <div className="flex items-center gap-1 mt-1">
        <ThumbsUp size={12} style={{ color: 'var(--success)' }} />
        <span className="text-xs text-success font-600">Aprobado</span>
        {sub.feedback && <span className="text-xs text-muted"> - {sub.feedback}</span>}
      </div>
    )
  }
  if (sub.status === 'rejected') {
    return (
      <div style={{ marginTop: 4 }}>
        <div className="flex items-center gap-1">
          <ThumbsDown size={12} style={{ color: 'var(--danger)' }} />
          <span className="text-xs text-danger font-600">Rechazado</span>
          {sub.feedback && <span className="text-xs text-muted"> - {sub.feedback}</span>}
        </div>
        {sub.correctionUrl && (
          <div style={{ marginTop: 6 }}>
            <div className="text-xs text-muted" style={{ fontWeight: 600, marginBottom: 4 }}>Correccion del profesor:</div>
            <img
              src={sub.correctionUrl}
              alt="Correccion"
              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--danger)' }}
            />
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 mt-1">
      <Clock size={12} style={{ color: 'var(--warning)' }} />
      <span className="text-xs text-warning font-600">Pendiente de correccion</span>
    </div>
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

  const isCorrect = submitted && answersMatch(answer, expected)

  const handleSubmit = () => {
    if (!answer.trim()) return
    setSubmitted(true)
    if (answersMatch(answer, expected)) {
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

function ManualExercise({ exercise, onPhotoUpload, onRetryUpload, onDeletePhoto, onCorrect, isAdmin, submissions }) {
  const fileRef = useRef(null)
  const retryFileRef = useRef(null)
  const correctionFileRef = useRef(null)
  const [feedback, setFeedback] = useState('')
  const [corrFile, setCorrFile] = useState(null)
  const [corrPreview, setCorrPreview] = useState(null)
  const isDone = exercise.status === 'done' || exercise.status === 'submitted'
  const allSubs = submissions.filter(s => s.exerciseId === exercise.id)
  const latestSub = allSubs.length > 0 ? allSubs[allSubs.length - 1] : null
  const isRejected = latestSub?.status === 'rejected'
  const isPendingReview = latestSub?.status === 'pending'
  const isApproved = latestSub?.status === 'approved'

  return (
    <div style={{ padding: '10px 0' }}>
      <div className="text-0\.85 mb-2"><MathText text={exercise.question} /></div>
      {exercise.photoUrl && (
        <div style={{ marginBottom: 8 }}>
          <ClickablePhoto
            src={exercise.photoUrl}
            alt="Respuesta"
            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--border)' }}
          />
        </div>
      )}
      {exercise.status === 'submitted' && (
        <div>
          <div className="flex items-center gap-2">
            <Send size={14} style={{ color: isRejected ? 'var(--danger)' : isApproved ? 'var(--success)' : 'var(--primary-light)' }} />
            <span className={`text-xs font-600 ${isRejected ? 'text-danger' : isApproved ? 'text-success' : 'text-primary-light'}`}>
              {isRejected ? 'Rechazado' : isApproved ? 'Corregido' : 'Enviado para correccion'}
            </span>
            {allSubs.length > 1 && <span className="text-xs text-muted">(Intento {allSubs.length})</span>}
          </div>
          {latestSub?.feedback && (
            <div className="text-xs mt-1" style={{
              padding: '6px 8px',
              borderRadius: 6,
              background: isApproved ? 'rgba(0,206,201,0.08)' : 'rgba(255,118,117,0.08)',
              color: isApproved ? 'var(--success)' : 'var(--danger)',
            }}>
              <MessageSquare size={10} style={{ display: 'inline', marginRight: 4 }} />
              {latestSub.feedback}
            </div>
          )}
          {latestSub?.correctionUrl && (
            <div style={{ marginTop: 6 }}>
              <div className="text-xs text-muted mb-1" style={{ fontWeight: 600 }}>Correccion:</div>
              <ClickablePhoto src={latestSub.correctionUrl} alt="Correccion" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8, border: '1px solid var(--danger)' }} />
            </div>
          )}
          {/* Student actions: change/delete photo when pending or rejected */}
          {!isAdmin && (isRejected || isPendingReview) && (
            <div style={{ marginTop: 8 }} className="flex gap-6">
              <input
                ref={retryFileRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) onRetryUpload(exercise.id, file)
                }}
              />
              <button
                className="btn btn-sm"
                style={{ background: 'rgba(108,92,231,0.15)', color: 'var(--primary-light)', border: 'none' }}
                onClick={() => retryFileRef.current?.click()}
              >
                <Camera size={14} /> Cambiar foto
              </button>
              <button
                className="btn btn-sm"
                style={{ background: 'rgba(255,118,117,0.15)', color: 'var(--danger)', border: 'none' }}
                onClick={() => onDeletePhoto(exercise.id)}
              >
                <Trash2 size={14} /> Borrar
              </button>
            </div>
          )}
          {/* Admin correction UI */}
          {isAdmin && isPendingReview && (
            <div style={{ marginTop: 10, padding: 10, borderRadius: 8, border: '1px solid var(--primary-light)', background: 'rgba(108,92,231,0.05)' }}>
              <div className="text-xs font-700 mb-2" style={{ color: 'var(--primary-light)' }}>Corregir ejercicio</div>
              <input
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Comentario (opcional)"
                style={{ fontSize: '0.78rem', padding: '6px 8px', marginBottom: 6, width: '100%' }}
              />
              <div className="flex gap-6 mb-2">
                <input
                  ref={correctionFileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setCorrFile(file)
                      setCorrPreview(URL.createObjectURL(file))
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-outline flex-1"
                  style={{ justifyContent: 'center', fontSize: '0.72rem' }}
                  onClick={() => correctionFileRef.current?.click()}
                >
                  <Upload size={12} /> {corrFile ? 'Foto subida' : 'Subir correccion'}
                </button>
              </div>
              {corrPreview && (
                <div style={{ marginBottom: 8 }}>
                  <img src={corrPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid var(--border)' }} />
                </div>
              )}
              <div className="flex gap-6">
                <button
                  className="btn btn-sm flex-1"
                  style={{ background: 'rgba(0,206,201,0.15)', color: 'var(--success)', border: 'none', justifyContent: 'center' }}
                  onClick={() => {
                    onCorrect(exercise.id, latestSub.timestamp, 'approved', feedback, null)
                    setFeedback('')
                    setCorrFile(null)
                    setCorrPreview(null)
                  }}
                >
                  <ThumbsUp size={12} /> Aprobar
                </button>
                <button
                  className="btn btn-sm flex-1"
                  style={{ background: 'rgba(255,118,117,0.15)', color: 'var(--danger)', border: 'none', justifyContent: 'center' }}
                  onClick={() => {
                    onCorrect(exercise.id, latestSub.timestamp, 'rejected', feedback, corrFile)
                    setFeedback('')
                    setCorrFile(null)
                    setCorrPreview(null)
                  }}
                >
                  <ThumbsDown size={12} /> Rechazar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Show previous attempts */}
      {allSubs.length > 1 && (
        <details style={{ marginTop: 6 }}>
          <summary className="text-xs text-muted cursor-pointer" style={{ fontWeight: 600 }}>
            Ver {allSubs.length - 1} intento{allSubs.length > 2 ? 's' : ''} anterior{allSubs.length > 2 ? 'es' : ''}
          </summary>
          <div style={{ marginTop: 6, paddingLeft: 8, borderLeft: '2px solid var(--border)' }}>
            {allSubs.slice(0, -1).map((sub, i) => (
              <div key={i} style={{ marginBottom: 8, fontSize: '0.75rem' }}>
                <div className="flex items-center gap-1">
                  <span className="text-muted">Intento {sub.attempt || i + 1}</span>
                  <span className={`badge ${sub.status === 'approved' ? 'badge-success' : sub.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.55rem', padding: '1px 4px' }}>
                    {sub.status === 'approved' ? 'Aprobado' : sub.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                  </span>
                </div>
                {sub.feedback && <div className="text-xs text-muted mt-1">{sub.feedback}</div>}
                {sub.photoUrl && (
                  <ClickablePhoto src={sub.photoUrl} alt={`Intento ${i + 1}`} style={{ maxWidth: '100%', maxHeight: 100, borderRadius: 6, marginTop: 4, opacity: 0.7 }} />
                )}
              </div>
            ))}
          </div>
        </details>
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

function TheoryBlockCard({ block, subjectColor, isAdmin, onExerciseAnswer, onPhotoUpload, onRetryUpload, onDeletePhoto, onCorrect, onSubmitForReview, onConfirmAction, onForceUnlock, onForceComplete, onReopen, expandedBlockId, submissions }) {
  const blockStatus = block.status || 'available'
  const isLocked = blockStatus === 'locked' && !isAdmin
  const isCompleted = blockStatus === 'completed'
  const [expanded, setExpanded] = useState(expandedBlockId === block.id && !isLocked)
  const allExercises = block.exercises || []
  const allDone = allExercises.length > 0 && allExercises.every(ex => ex.status === 'done' || ex.status === 'submitted' || ex.status === 'corrected')
  const allSubmitted = allExercises.length > 0 && allExercises.every(ex => ex.status === 'submitted' || ex.status === 'corrected')
  const allTrulyComplete = allExercises.length > 0 && allExercises.every(ex => isExerciseComplete(ex, submissions))
  const someDone = allExercises.some(ex => ex.status === 'done')
  const doneCount = allExercises.filter(ex => ex.status === 'done').length
  const isPartialSubmit = someDone && !allDone
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    if (isPartialSubmit) {
      const pendingCount = allExercises.filter(ex => ex.status === 'pending').length
      onConfirmAction({
        message: `Faltan ${pendingCount} ejercicios por hacer. Quieres entregar de forma parcial?`,
        onConfirm: () => {
          onSubmitForReview(block.id)
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
        }
      })
    } else {
      onSubmitForReview(block.id)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div
      style={{
        margin: '0 16px 10px',
        borderRadius: 'var(--radius)',
        border: isCompleted ? '1px solid rgba(0,206,201,0.3)' : `1px solid var(--border)`,
        background: 'var(--bg-card)',
        overflow: 'hidden',
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      <div
        onClick={() => !isLocked && setExpanded(!expanded)}
        className={`flex items-center gap-10${isLocked ? '' : ' cursor-pointer'}`}
        style={{ padding: '14px 16px' }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-600" style={{ fontSize: '0.88rem' }}>{block.title}</span>
            {isCompleted && <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />}
          </div>
          <div className="text-xs text-muted mt-1">
            {isLocked ? (
              <span style={{ color: 'var(--text-muted)' }}>Bloqueado</span>
            ) : isCompleted && allTrulyComplete ? (
              <span style={{ color: 'var(--success)' }}>Completado</span>
            ) : (() => {
              const pendingEx = allExercises.filter(ex => ex.status === 'pending')
              const manualPendingReview = allExercises.filter(ex => ex.type === 'manual' && ex.status === 'submitted' && (() => {
                const subs = submissions.filter(s => s.exerciseId === ex.id)
                const latest = subs.length > 0 ? subs[subs.length - 1] : null
                return !latest || latest.status === 'pending'
              })())
              const doneEx = allExercises.filter(ex => ex.status === 'done')
              if (pendingEx.length === 0 && doneEx.length === 0 && manualPendingReview.length > 0) {
                return <span style={{ color: 'var(--primary-light)' }}>Pendiente de corregir ({manualPendingReview.length})</span>
              }
              if (allTrulyComplete) {
                return <span style={{ color: 'var(--success)' }}>Completado</span>
              }
              if (doneEx.length > 0 && pendingEx.length === 0) {
                return <span style={{ color: '#f59e0b' }}>{doneEx.length} por reenviar</span>
              }
              if (pendingEx.length > 0 && pendingEx.length < allExercises.length) {
                return <span style={{ color: '#f59e0b' }}>{allExercises.length - pendingEx.length}/{allExercises.length} ejercicios - Faltan {pendingEx.length}</span>
              }
              return (
                <>
                  {allExercises.length} ejercicios
                  {someDone && !allSubmitted && ' - Listos para enviar'}
                  {allSubmitted && ' - Enviados'}
                </>
              )
            })()}
          </div>
        </div>
        {isCompleted && onReopen && (
          <button
            className="btn btn-sm border-none flex-shrink-0"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '3px 8px', fontSize: '0.6rem' }}
            onClick={(e) => { e.stopPropagation(); onReopen(block.id) }}
          >
            Reabrir
          </button>
        )}
        {!isCompleted && blockStatus !== 'locked' && onForceComplete && (
          <button
            className="btn btn-sm border-none flex-shrink-0"
            style={{ background: 'rgba(0,206,201,0.12)', color: 'var(--success)', padding: '3px 8px', fontSize: '0.6rem' }}
            onClick={(e) => { e.stopPropagation(); onForceComplete(block.id) }}
          >
            Finalizar
          </button>
        )}
        {blockStatus === 'locked' ? (
          <Lock
            size={18}
            className="cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onClick={(e) => { e.stopPropagation(); onForceUnlock(block.id) }}
          />
        ) : expanded ? (
          <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} />
        ) : (
          <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
        )}
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
              {allExercises.map((ex, i) => {
                const exSubs = submissions.filter(s => s.exerciseId === ex.id)
                const latestSub = exSubs.length > 0 ? exSubs[exSubs.length - 1] : null
                return (
                <div key={ex.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div className="flex items-center gap-2" style={{ paddingTop: i > 0 ? 8 : 0 }}>
                    <span className="text-xs text-muted font-600">{i + 1}.</span>
                    {ex.status === 'submitted' && ex.type === 'auto' && <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>Hecho</span>}
                    {ex.status === 'submitted' && ex.type === 'manual' && latestSub?.status === 'approved' && <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>Corregido</span>}
                    {ex.status === 'submitted' && ex.type === 'manual' && latestSub?.status === 'rejected' && <span className="badge" style={{ fontSize: '0.6rem', padding: '1px 6px', background: 'rgba(255,118,117,0.15)', color: 'var(--danger)' }}>Rechazado</span>}
                    {ex.status === 'submitted' && ex.type === 'manual' && (!latestSub || latestSub.status === 'pending') && <span className="badge" style={{ fontSize: '0.6rem', padding: '1px 6px', background: 'rgba(108,92,231,0.12)', color: 'var(--primary-light)' }}>Por corregir</span>}
                    {ex.status === 'done' && <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>Hecho</span>}
                    {ex.status === 'pending' && <span className="badge" style={{ fontSize: '0.6rem', padding: '1px 6px', background: 'rgba(136,136,160,0.12)', color: 'var(--text-muted)' }}>Pendiente</span>}
                  </div>
                  {ex.type === 'auto' && ex.autoConfig?.type === 'multiple_choice' && (
                    <AutoExerciseMultipleChoice exercise={ex} onAnswer={onExerciseAnswer} />
                  )}
                  {ex.type === 'auto' && ex.autoConfig?.type === 'fill_blank' && (
                    <AutoExerciseFillBlank exercise={ex} onAnswer={onExerciseAnswer} />
                  )}
                  {ex.type === 'manual' && (
                    <ManualExercise exercise={ex} onPhotoUpload={onPhotoUpload} onRetryUpload={onRetryUpload} onDeletePhoto={onDeletePhoto} onCorrect={onCorrect} isAdmin={isAdmin} submissions={submissions} />
                  )}
                </div>
              )})}

              {someDone && !allSubmitted && (
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

// Extract user state from subjects (only mutable data, not curriculum content)
function extractUserState(subjects) {
  const state = {}
  for (const s of subjects) {
    for (const t of s.topics || []) {
      state[`topic_${t.order}`] = { status: t.status, extraMaterials: t.extraMaterials || [] }
      for (const b of t.theoryBlocks || []) {
        state[`block_${b.id}`] = { status: b.status }
        for (const ex of b.exercises || []) {
          if (ex.status !== 'pending') {
            state[`ex_${ex.id}`] = { status: ex.status, studentAnswer: ex.studentAnswer, photoUrl: ex.photoUrl }
          }
        }
      }
    }
  }
  return state
}

// Apply user state on top of mock data
function applyUserState(subjects, userState) {
  if (!userState) return subjects
  return subjects.map(s => ({
    ...s,
    topics: (s.topics || []).map(t => {
      const topicState = userState[`topic_${t.order}`]
      return {
        ...t,
        status: topicState?.status || t.status,
        extraMaterials: topicState?.extraMaterials || t.extraMaterials || [],
        theoryBlocks: (t.theoryBlocks || []).map(b => {
          const blockState = userState[`block_${b.id}`]
          return {
            ...b,
            status: blockState?.status || b.status,
            exercises: (b.exercises || []).map(ex => {
              const exState = userState[`ex_${ex.id}`]
              return exState ? { ...ex, ...exState } : ex
            })
          }
        })
      }
    })
  }))
}

function StudyPage() {
  const { isAdmin } = useAdmin()
  const [subjects, setSubjectsRaw] = useState(mockStudy.subjects)
  const [dataLoaded, setDataLoaded] = useState(false)
  const loading = false
  const error = null
  const saveTimeoutRef = useRef(null)

  const setSubjects = useCallback((updater) => {
    setSubjectsRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      // Debounced save to Supabase
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        appStateDb.set('study_subjects', extractUserState(next))
      }, 500)
      return next
    })
  }, [])

  // Date-based plan
  const [plan, setPlanRaw] = useState(() => generateFullPlan(mockStudy.subjects))
  const [planWeekOffset, setPlanWeekOffset] = useState(0)

  const setPlan = useCallback((updater) => {
    setPlanRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      appStateDb.set('study_plan', next)
      return next
    })
  }, [])

  // Sync plan when subjects change (block completions)
  const syncPlan = useCallback((currentSubjects) => {
    setPlan(prev => recalculatePlan(prev, currentSubjects))
  }, [setPlan])

  const [submissions, setSubmissions] = useState([])

  // Sync plan when block statuses change
  useEffect(() => {
    setPlan(prev => {
      const synced = recalculatePlan(prev, subjects)
      return JSON.stringify(synced) !== JSON.stringify(prev) ? synced : prev
    })
  }, [subjects, setPlan])

  const checkAndUnlockBlocks = useCallback((subjectId, subs) => {
    const currentSubs = subs || submissions
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s
      let topicsChanged = false
      const updatedTopics = s.topics.map((topic, topicIdx) => {
        const state = getTopicStateFromLegacy(topic.status)
        if (state !== 'in_progress') return topic
        const blocks = topic.theoryBlocks || []
        if (blocks.length === 0) return topic
        let blocksChanged = false
        const updatedBlocks = blocks.map((block, blockIdx) => {
          if (block.status === 'completed' || block.status === 'locked') return block
          const exercises = block.exercises || []
          if (exercises.length === 0) return block
          const allComplete = exercises.every(ex => isExerciseComplete(ex, currentSubs))
          if (!allComplete) return block
          blocksChanged = true
          return { ...block, status: 'completed' }
        })
        if (blocksChanged) {
          for (let i = 0; i < updatedBlocks.length; i++) {
            if (updatedBlocks[i].status === 'completed' && i + 1 < updatedBlocks.length && updatedBlocks[i + 1].status === 'locked') {
              updatedBlocks[i + 1] = { ...updatedBlocks[i + 1], status: 'available' }
            }
          }
        }
        const allBlocksCompleted = updatedBlocks.length > 0 && updatedBlocks.every(b => b.status === 'completed')
        if (allBlocksCompleted) {
          topicsChanged = true
          return { ...topic, status: 'completed', theoryBlocks: updatedBlocks }
        }
        if (blocksChanged) {
          return { ...topic, theoryBlocks: updatedBlocks }
        }
        return topic
      })
      if (topicsChanged) {
        for (let i = 0; i < updatedTopics.length; i++) {
          if (getTopicStateFromLegacy(updatedTopics[i].status) === 'completed') {
            if (i + 1 < updatedTopics.length && getTopicStateFromLegacy(updatedTopics[i + 1].status) === 'locked') {
              updatedTopics[i + 1] = { ...updatedTopics[i + 1], status: 'available' }
            }
          }
        }
      }
      return { ...s, topics: updatedTopics }
    }))
  }, [setSubjects, submissions])

  const [activeSubject, setActiveSubject] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [expandedBlockId, setExpandedBlockId] = useState(null)
  const [modal, setModal] = useState(null)
  const [newSubject, setNewSubject] = useState({ name: '', color: '#4f8cff', icon: 'calculator' })
  const [newTask, setNewTask] = useState({ day: 'Lunes', task: '', topic: '' })
  const [newTopic, setNewTopic] = useState('')
  const [editForm, setEditForm] = useState(null)
  const [showError, setShowError] = useState(true)
  const [selectedPlanTopic, setSelectedPlanTopic] = useState(null)
  const [showCorrections, setShowCorrections] = useState(true)
  const [feedbackText, setFeedbackText] = useState('')
  const [correctionFile, setCorrectionFile] = useState(null)
  const [correctionPreview, setCorrectionPreview] = useState(null)
  const correctionFileRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [unlockPrompt, setUnlockPrompt] = useState(null) // { type, subjectId, topicIndex?, blockId? }
  const [unlockPassword, setUnlockPassword] = useState('')
  const [unlockError, setUnlockError] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null) // { message, onConfirm }
  const [selectedPlanDate, setSelectedPlanDate] = useState(null)

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadFromSupabase() {
      const userState = await appStateDb.get('study_subjects')
      const loadedSubjects = userState
        ? applyUserState(mockStudy.subjects, userState)
        : mockStudy.subjects
      if (userState) {
        setSubjectsRaw(loadedSubjects)
      }
      const savedPlan = await appStateDb.get('study_plan')
      if (savedPlan) {
        setPlanRaw(recalculatePlan(savedPlan, loadedSubjects))
      }
      const savedSubs = await appStateDb.get('study_submissions')
      if (savedSubs) {
        setSubmissions(savedSubs)
      }
      // Select today if it has plan entries
      const today = formatDate(new Date())
      const activePlan = savedPlan || generateFullPlan(loadedSubjects)
      if (activePlan.some(e => e.date === today)) {
        setSelectedPlanDate(today)
      }
      setDataLoaded(true)
    }
    loadFromSupabase()
  }, [])

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
    if (task.topic && isTopicExercisesComplete(subject, task.topic, submissions)) return true
    return !!task.done
  }

  const getSubjectAllTasks = (s) => {
    // Generate plans for the first topic with blocks (week 0 only) + manual tasks
    const topicsWithBlocks = s.topics.filter(t => (t.theoryBlocks || []).length > 0)
    const firstTopic = topicsWithBlocks.length > 0 ? topicsWithBlocks[0] : null
    const topicPlan = firstTopic ? generateTopicPlan(firstTopic).filter(t => t.week === 0) : []
    const manualTasks = s.weeklyPlan.filter(t => !t.blockId)
    return [...topicPlan, ...manualTasks]
  }

  const getSubjectProgress = (s) => {
    const allTasks = getSubjectAllTasks(s)
    const total = allTasks.length
    const done = allTasks.filter(t => {
      if (t.autoComplete || t.done) return true
      if (t.blockId && t.topic) {
        const tp = s.topics.find(tt => tt.name === t.topic)
        if (tp) {
          const block = (tp.theoryBlocks || []).find(b => b.id === t.blockId)
          if (block && block.status === 'completed') return true
        }
      }
      return isTaskDone(t, s)
    }).length
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

  const totalTasks = plan.length
  const doneTasks = plan.filter(e => e.completed).length
  const weekProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const todayStr = formatDate(new Date())
  const todayPlanEntries = plan.filter(e => e.date === todayStr)

  const studyStreak = (() => {
    let streak = 0
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const ds = formatDate(d)
      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) {
        d.setDate(d.getDate() - 1)
        continue
      }
      const dayEntries = plan.filter(e => e.date === ds)
      if (dayEntries.length > 0 && dayEntries.some(e => e.completed)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else if (i === 0) {
        // Today might not have been started yet
        d.setDate(d.getDate() - 1)
        continue
      } else {
        break
      }
    }
    return streak
  })()

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

  // Force unlock: opens password prompt. unlockPrompt = { type: 'topic'|'block', subjectId, topicIndex?, blockId? }
  const handleForceUnlock = (blockId) => {
    if (isAdmin) {
      // Already admin, unlock directly
      setSubjects(prev => prev.map(s => {
        if (s.id !== activeSubject) return s
        return {
          ...s,
          topics: s.topics.map(t => ({
            ...t,
            theoryBlocks: (t.theoryBlocks || []).map(b =>
              b.id === blockId ? { ...b, status: 'available' } : b
            )
          }))
        }
      }))
    } else {
      setUnlockPrompt({ type: 'block', subjectId: activeSubject, blockId })
      setUnlockPassword('')
      setUnlockError(false)
    }
  }

  const tryUnlock = () => {
    if (unlockPassword !== 'Padel-123') {
      setUnlockError(true)
      return
    }
    if (unlockPrompt.type === 'topic') {
      setSubjects(prev => prev.map(s => {
        if (s.id !== unlockPrompt.subjectId) return s
        const topics = [...s.topics]
        topics[unlockPrompt.topicIndex] = { ...topics[unlockPrompt.topicIndex], status: 'available' }
        return { ...s, topics }
      }))
    } else if (unlockPrompt.type === 'block') {
      setSubjects(prev => prev.map(s => {
        if (s.id !== unlockPrompt.subjectId) return s
        return {
          ...s,
          topics: s.topics.map(t => ({
            ...t,
            theoryBlocks: (t.theoryBlocks || []).map(b =>
              b.id === unlockPrompt.blockId ? { ...b, status: 'available' } : b
            )
          }))
        }
      }))
    }
    setUnlockPrompt(null)
    setUnlockPassword('')
    setUnlockError(false)
  }

  // Force-complete a topic (skipping remaining exercises)
  const handleForceCompleteTopic = (subjectId, topicName, topicOrder) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s
      let unlockNext = false
      const topics = s.topics.map((t, i) => {
        if (t.name !== topicName || t.order !== topicOrder) {
          // Unlock next topic after the one we just completed
          if (unlockNext && getTopicStateFromLegacy(t.status) === 'locked') {
            unlockNext = false
            return { ...t, status: 'available' }
          }
          return t
        }
        unlockNext = true
        return {
          ...t,
          status: 'completed',
          theoryBlocks: (t.theoryBlocks || []).map(b => ({ ...b, status: 'completed' }))
        }
      })
      return { ...s, topics }
    }))
  }

  // Reopen a completed topic back to in_progress
  const handleReopenTopic = (subjectId, topicName, topicOrder) => {
    const resetExerciseIds = []
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s
      return {
        ...s,
        topics: s.topics.map(t => {
          if (t.name !== topicName || t.order !== topicOrder) return t
          const blocks = (t.theoryBlocks || []).map(b => {
            if (b.status !== 'completed') return b
            const allDone = (b.exercises || []).every(ex => isExerciseComplete(ex, submissions))
            if (allDone) return b
            // Reset incomplete block and its exercises
            return {
              ...b,
              status: 'available',
              exercises: (b.exercises || []).map(ex => {
                if (ex.status !== 'pending') resetExerciseIds.push(ex.id)
                return { ...ex, status: 'pending', studentAnswer: null, photoUrl: null }
              })
            }
          })
          return { ...t, status: 'in_progress', theoryBlocks: blocks }
        })
      }
    }))
    if (resetExerciseIds.length > 0) {
      setSubmissions(prev => {
        const updated = prev.filter(s => !resetExerciseIds.includes(s.exerciseId))
        appStateDb.set('study_submissions', updated)
        return updated
      })
    }
  }

  // Sync topic state: fix block/topic statuses based on actual exercise progress (non-destructive)
  const handleSyncTopicState = (subjectId, topicName, topicOrder) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s
      let topicChanged = false
      const topics = s.topics.map(t => {
        if (t.name !== topicName || t.order !== topicOrder) return t
        const blocks = (t.theoryBlocks || []).map((b, i, arr) => {
          const exercises = b.exercises || []
          if (exercises.length === 0) return b
          const allComplete = exercises.every(ex => isExerciseComplete(ex, submissions))
          if (allComplete && b.status !== 'completed') {
            return { ...b, status: 'completed' }
          }
          if (!allComplete && b.status === 'completed') {
            return { ...b, status: 'available' }
          }
          return b
        })
        // Unlock blocks after completed ones
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].status === 'completed' && i + 1 < blocks.length && blocks[i + 1].status === 'locked') {
            blocks[i + 1] = { ...blocks[i + 1], status: 'available' }
          }
        }
        // Determine correct topic status
        const allBlocksCompleted = blocks.length > 0 && blocks.every(b => b.status === 'completed')
        const allExercises = blocks.flatMap(b => b.exercises || [])
        const allExDone = allExercises.length > 0 && allExercises.every(ex => isExerciseComplete(ex, submissions))
        let newStatus = t.status
        if (allBlocksCompleted && allExDone) {
          newStatus = 'completed'
        } else if (t.status === 'completed' || t.status === 'locked') {
          // Was completed but exercises aren't all done, or was locked but has progress
          const hasAnyProgress = allExercises.some(ex => ex.status !== 'pending')
          newStatus = hasAnyProgress ? 'in_progress' : t.status === 'completed' ? 'available' : t.status
        }
        topicChanged = newStatus !== t.status
        return { ...t, status: newStatus, theoryBlocks: blocks }
      })
      // If topic changed to completed, unlock next
      if (topicChanged) {
        const idx = topics.findIndex(t => t.name === topicName && t.order === topicOrder)
        if (idx >= 0 && topics[idx].status === 'completed' && idx + 1 < topics.length) {
          if (getTopicStateFromLegacy(topics[idx + 1].status) === 'locked') {
            topics[idx + 1] = { ...topics[idx + 1], status: 'available' }
          }
        }
      }
      return { ...s, topics }
    }))
  }

  // Sync ALL topics in a subject: fix block/topic statuses based on actual exercise progress
  const handleSyncAllTopics = (subjectId) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s
      const topics = s.topics.map(t => {
        const blocks = (t.theoryBlocks || []).map(b => {
          const exercises = b.exercises || []
          if (exercises.length === 0) return b
          const allComplete = exercises.every(ex => isExerciseComplete(ex, submissions))
          if (allComplete && b.status !== 'completed') return { ...b, status: 'completed' }
          if (!allComplete && b.status === 'completed') return { ...b, status: 'available' }
          return b
        })
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].status === 'completed' && i + 1 < blocks.length && blocks[i + 1].status === 'locked') {
            blocks[i + 1] = { ...blocks[i + 1], status: 'available' }
          }
        }
        const allBlocksCompleted = blocks.length > 0 && blocks.every(b => b.status === 'completed')
        const allExercises = blocks.flatMap(b => b.exercises || [])
        const allExDone = allExercises.length > 0 && allExercises.every(ex => isExerciseComplete(ex, submissions))
        let newStatus = t.status
        if (allBlocksCompleted && allExDone) {
          newStatus = 'completed'
        } else if (t.status === 'completed' || t.status === 'locked') {
          const hasAnyProgress = allExercises.some(ex => ex.status !== 'pending')
          newStatus = hasAnyProgress ? 'in_progress' : t.status === 'completed' ? 'available' : t.status
        }
        return { ...t, status: newStatus, theoryBlocks: blocks }
      })
      // Unlock topics after completed ones
      for (let i = 0; i < topics.length; i++) {
        if (getTopicStateFromLegacy(topics[i].status) === 'completed' && i + 1 < topics.length) {
          if (getTopicStateFromLegacy(topics[i + 1].status) === 'locked') {
            topics[i + 1] = { ...topics[i + 1], status: 'available' }
          }
        }
      }
      return { ...s, topics }
    }))
  }

  // Force-complete a single block
  const handleForceCompleteBlock = (blockId) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== activeSubject) return s
      return {
        ...s,
        topics: s.topics.map(t => ({
          ...t,
          theoryBlocks: (t.theoryBlocks || []).map((b, i, arr) => {
            if (b.id === blockId) return { ...b, status: 'completed' }
            // Unlock the block right after the one we completed
            if (i > 0 && arr[i - 1].id === blockId && b.status === 'locked') {
              return { ...b, status: 'available' }
            }
            return b
          })
        }))
      }
    }))
  }

  // Reopen a completed block back to available, reset exercise statuses
  const handleReopenBlock = (blockId) => {
    const resetExerciseIds = []
    setSubjects(prev => prev.map(s => {
      if (s.id !== activeSubject) return s
      return {
        ...s,
        topics: s.topics.map(t => ({
          ...t,
          theoryBlocks: (t.theoryBlocks || []).map(b => {
            if (b.id !== blockId) return b
            return {
              ...b,
              status: 'available',
              exercises: (b.exercises || []).map(ex => {
                if (ex.status !== 'pending') resetExerciseIds.push(ex.id)
                return { ...ex, status: 'pending', studentAnswer: null, photoUrl: null }
              })
            }
          })
        }))
      }
    }))
    // Also remove related submissions
    if (resetExerciseIds.length > 0) {
      setSubmissions(prev => {
        const updated = prev.filter(s => !resetExerciseIds.includes(s.exerciseId))
        appStateDb.set('study_submissions', updated)
        return updated
      })
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
    setTimeout(() => checkAndUnlockBlocks(activeSubject), 0)
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
    setTimeout(() => checkAndUnlockBlocks(activeSubject), 0)
    // Find topic and block names for the notification
    const subject = subjects.find(s => s.id === activeSubject)
    if (subject) {
      for (const t of subject.topics) {
        for (const b of (t.theoryBlocks || [])) {
          const ex = (b.exercises || []).find(e => e.id === exerciseId)
          if (ex) {
            sendWhatsAppNotification(`Se ha subido una foto de resolucion en ${t.name} - ${b.title}`)
            break
          }
        }
      }
    }
  }

  const handleDeletePhoto = (exerciseId) => {
    // Reset exercise to pending and remove pending submissions
    setSubjects(prev => prev.map(s => {
      if (s.id !== activeSubject) return s
      return {
        ...s,
        topics: s.topics.map(t => ({
          ...t,
          theoryBlocks: (t.theoryBlocks || []).map(b => ({
            ...b,
            exercises: (b.exercises || []).map(ex =>
              ex.id === exerciseId ? { ...ex, status: 'pending', photoUrl: null, studentAnswer: null } : ex
            )
          }))
        }))
      }
    }))
    // Remove pending submissions for this exercise
    const updatedSubs = submissions.filter(s => !(s.exerciseId === exerciseId && s.status === 'pending'))
    setSubmissions(updatedSubs)
    appStateDb.set('study_submissions', updatedSubs)
  }

  const handleCorrectExercise = async (exerciseId, timestamp, status, feedback, correctionFile) => {
    let correctionUrl = null
    if (correctionFile && isSupabaseConfigured() && supabase) {
      const ext = correctionFile.name.split('.').pop()
      const path = `corrections/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, correctionFile)
      if (!upErr) {
        const { data } = supabase.storage.from('uploads').getPublicUrl(path)
        correctionUrl = data.publicUrl
      }
    }
    setSubmissions(prev => {
      const updated = prev.map(s =>
        s.exerciseId === exerciseId && s.timestamp === timestamp
          ? { ...s, status, feedback: feedback || '', correctionUrl: correctionUrl || s.correctionUrl || null }
          : s
      )
      appStateDb.set('study_submissions', updated)
      return updated
    })

    // Notify student via WhatsApp
    const statusText = status === 'approved' ? 'aprobado' : 'rechazado'
    const feedbackText = feedback ? ` - ${feedback}` : ''
    sendStudentWhatsApp(`Ejercicio ${statusText}${feedbackText}`)
  }

  const handleRetryUpload = async (exerciseId, file) => {
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
    // Set exercise back to 'done' with new photo so it can be re-submitted
    setSubjects(prev => prev.map(s => {
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
    // Remove pending submission so it can be re-submitted with new photo
    const updatedSubs = submissions.filter(s => !(s.exerciseId === exerciseId && s.status === 'pending'))
    setSubmissions(updatedSubs)
    appStateDb.set('study_submissions', updatedSubs)
  }

  const handleSubmitForReview = (blockId) => {
    const subject = subjects.find(s => s.id === activeSubject)
    let topicName = ''
    let blockTitle = ''
    let exerciseCount = 0
    const exercisesToSubmit = []
    if (subject) {
      for (const t of subject.topics || []) {
        const block = (t.theoryBlocks || []).find(b => b.id === blockId)
        if (block) {
          topicName = t.name || t.title || ''
          blockTitle = block.title || ''
          const doneExercises = (block.exercises || []).filter(ex => ex.status === 'done')
          exerciseCount = doneExercises.length
          doneExercises.forEach(ex => {
            exercisesToSubmit.push({
              exerciseId: ex.id,
              question: ex.question,
              answer: ex.studentAnswer || ex.photoUrl || '',
              photoUrl: ex.photoUrl || null,
              type: ex.type,
              subjectName: subject.name,
              topicName,
              blockTitle,
              timestamp: new Date().toISOString(),
              status: 'pending',
              feedback: '',
            })
          })
          break
        }
      }
    }

    // Store submissions - allow resubmission for rejected exercises
    // Auto-approve 'auto' exercises (multiple choice, fill blank) since they self-correct
    const newSubmissions = exercisesToSubmit.filter(
      sub => !submissions.some(e => e.exerciseId === sub.exerciseId && e.status === 'pending')
    ).map(sub => {
      const prevAttempts = submissions.filter(e => e.exerciseId === sub.exerciseId)
      return {
        ...sub,
        attempt: prevAttempts.length + 1,
        status: sub.type === 'auto' ? 'approved' : 'pending',
      }
    })
    const updatedSubmissions = [...submissions, ...newSubmissions]
    setSubmissions(updatedSubmissions)
    appStateDb.set('study_submissions', updatedSubmissions)

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

    sendWhatsAppNotification(`Hay algo nuevo para corregir en ${topicName} - ${blockTitle} (${exerciseCount} ejercicios enviados)`)
    setTimeout(() => checkAndUnlockBlocks(activeSubject), 0)
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
      <div className="study-topic-view">
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
            {isAdmin && (
              <button
                className="btn btn-sm border-none"
                style={{ background: 'rgba(108,92,231,0.15)', color: 'var(--primary-light)', fontSize: '0.7rem' }}
                onClick={() => {
                  handleSyncTopicState(detail.id, currentTopicData.name, currentTopicData.order)
                  setConfirmAction({
                    message: 'Estado sincronizado. Los bloques y el tema ahora reflejan el progreso real de los ejercicios.',
                    onConfirm: () => setConfirmAction(null)
                  })
                }}
              >
                <RefreshCw size={12} /> Sincronizar
              </button>
            )}
            {topicState !== 'locked' && topicState !== 'completed' ? (() => {
              const allEx = (currentTopicData.theoryBlocks || []).flatMap(b => b.exercises || [])
              const pendingEx = allEx.filter(ex => ex.status === 'pending')
              const hasPending = pendingEx.length > 0
              return (
                <button
                  className="btn btn-sm border-none"
                  style={{
                    background: hasPending ? 'rgba(136,136,160,0.12)' : 'rgba(0,206,201,0.15)',
                    color: hasPending ? 'var(--text-muted)' : 'var(--success)',
                    fontSize: '0.7rem',
                    opacity: hasPending ? 0.6 : 1,
                  }}
                  onClick={() => {
                    if (hasPending) {
                      const blockNames = (currentTopicData.theoryBlocks || [])
                        .filter(b => (b.exercises || []).some(ex => ex.status === 'pending'))
                        .map(b => b.title)
                      setConfirmAction({
                        message: `No puedes finalizar este tema. Quedan ${pendingEx.length} ejercicio${pendingEx.length > 1 ? 's' : ''} por entregar en: ${blockNames.join(', ')}.`,
                        onConfirm: () => setConfirmAction(null)
                      })
                      return
                    }
                    setConfirmAction({
                      message: 'Dar por finalizado este tema?',
                      onConfirm: () => {
                        handleForceCompleteTopic(detail.id, currentTopicData.name, currentTopicData.order)
                        setConfirmAction(null)
                      }
                    })
                  }}
                >
                  <CheckCircle size={12} /> Finalizar tema
                </button>
              )
            })() : null}
          </div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          {theoryBlocks.length === 0 && (
            <div className="text-muted text-center" style={{ padding: '40px 0', fontSize: '0.85rem' }}>
              Sin contenido teorico todavia.
            </div>
          )}

          <div className="study-topic-blocks">
            {theoryBlocks.map(block => (
              <TheoryBlockCard
                key={block.id}
                block={block}
                subjectColor={detail.color}
                isAdmin={isAdmin}
                onExerciseAnswer={handleExerciseAnswer}
                onPhotoUpload={handlePhotoUpload}
                onRetryUpload={handleRetryUpload}
                onDeletePhoto={handleDeletePhoto}
                onCorrect={handleCorrectExercise}
                onSubmitForReview={handleSubmitForReview}
                onConfirmAction={setConfirmAction}
                onForceUnlock={handleForceUnlock}
                onForceComplete={(blockId) => setConfirmAction({
                  message: 'Finalizar este bloque sin completar todos los ejercicios?',
                  onConfirm: () => { handleForceCompleteBlock(blockId); setConfirmAction(null) }
                })}
                onReopen={(blockId) => {
                  const block = (currentTopicData.theoryBlocks || []).find(b => b.id === blockId)
                  const exercises = block?.exercises || []
                  const doneCount = exercises.filter(ex => ex.status === 'done').length
                  const submittedCount = exercises.filter(ex => ex.status === 'submitted' || ex.status === 'corrected').length
                  const parts = []
                  if (doneCount > 0) parts.push(`${doneCount} ejercicio${doneCount > 1 ? 's' : ''} completado${doneCount > 1 ? 's' : ''}`)
                  if (submittedCount > 0) parts.push(`${submittedCount} ejercicio${submittedCount > 1 ? 's' : ''} enviado${submittedCount > 1 ? 's' : ''}`)
                  const lossMsg = parts.length > 0 ? `Perderas ${parts.join(' y ')}.` : ''
                  setConfirmAction({
                    message: `Seguro que quieres reabrir este bloque? ${lossMsg} Se reiniciaran todos los ejercicios.`,
                    onConfirm: () => { handleReopenBlock(blockId); setConfirmAction(null) }
                  })
                }}
                expandedBlockId={expandedBlockId}
                submissions={submissions}
              />
            ))}
          </div>

          {/* Additional material upload */}
          <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', marginTop: 12 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-700 text-xs text-muted text-uppercase tracking-wide">Material adicional</span>
            </div>
            <div className="flex gap-8">
              <label className="btn btn-sm btn-outline flex-1" style={{ justifyContent: 'center', cursor: 'pointer' }}>
                <Upload size={14} /> Subir PDF / Foto
                <input
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    let url = null
                    if (isSupabaseConfigured() && supabase) {
                      const ext = file.name.split('.').pop()
                      const path = `extra/${currentTopicData.name}/${Date.now()}.${ext}`
                      const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file)
                      if (!uploadError) {
                        const { data } = supabase.storage.from('uploads').getPublicUrl(path)
                        url = data.publicUrl
                      }
                    }
                    if (!url) url = URL.createObjectURL(file)
                    // Store in topic's extraMaterials
                    setSubjects(prev => prev.map(s => {
                      if (s.id !== activeSubject) return s
                      return {
                        ...s,
                        topics: s.topics.map(t => {
                          if (t.name !== currentTopicData.name || t.order !== currentTopicData.order) return t
                          const materials = t.extraMaterials || []
                          return { ...t, extraMaterials: [...materials, { id: Date.now(), url, name: file.name, type: file.type, uploadDate: new Date().toISOString() }] }
                        })
                      }
                    }))
                    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf')
                    sendWhatsAppNotification(
                      isPdf
                        ? `Nuevo PDF de ejercicios subido en ${currentTopicData.name}: ${file.name}`
                        : `Nueva foto de ejercicios subida en ${currentTopicData.name}`
                    )
                  }}
                />
              </label>
            </div>
            {/* Show uploaded materials */}
            {(currentTopicData.extraMaterials || []).length > 0 && (
              <div style={{ marginTop: 8 }}>
                {(currentTopicData.extraMaterials || []).map(mat => (
                  <div key={mat.id} className="flex items-center gap-8" style={{
                    padding: '8px', marginBottom: 4, borderRadius: 8,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                  }}>
                    {mat.type?.startsWith('image/') ? (
                      <Image size={14} style={{ color: detail.color, flexShrink: 0 }} />
                    ) : (
                      <Upload size={14} style={{ color: detail.color, flexShrink: 0 }} />
                    )}
                    <a href={mat.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs" style={{ color: detail.color }}>
                      {mat.name || 'Material'}
                    </a>
                    <span className="text-xs text-muted">
                      {new Date(mat.uploadDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 24 }} />
        </div>

        {confirmAction && (
          <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Confirmar</h2>
              <p style={{ fontSize: '0.88rem', marginBottom: 16 }}>{confirmAction.message}</p>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-block" onClick={() => setConfirmAction(null)}>Cancelar</button>
                <button
                  className="btn btn-block border-none"
                  style={{ background: 'var(--primary)', color: 'white' }}
                  onClick={confirmAction.onConfirm}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {unlockPrompt && (
          <div className="modal-overlay" onClick={() => setUnlockPrompt(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Desbloquear</h2>
              <p className="text-xs text-muted mb-3">
                Introduce la contrasena para desbloquear.
              </p>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Contrasena"
                  value={unlockPassword}
                  onChange={e => { setUnlockPassword(e.target.value); setUnlockError(false) }}
                  onKeyDown={e => e.key === 'Enter' && tryUnlock()}
                  autoFocus
                  className={unlockError ? 'input-error' : ''}
                />
                {unlockError && <div className="error-text">Contrasena incorrecta</div>}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={() => setUnlockPrompt(null)}>Cancelar</button>
                <button
                  className="btn btn-block border-none"
                  style={{ background: '#f59e0b', color: 'white' }}
                  onClick={tryUnlock}
                >
                  <Unlock size={14} /> Desbloquear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ========== DETAIL VIEW ==========
  if (detail) {
    const Icon = ICONS[detail.icon] || Calculator
    const currentTopic = getCurrentTopic(detail)

    // Plan-based progress for this subject
    const subjectPlanEntries = plan.filter(e => e.subjectId === detail.id)
    const subTotal = subjectPlanEntries.length
    const subDone = subjectPlanEntries.filter(e => e.completed).length
    const subProgress = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0

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
              <>
                <button
                  className="btn btn-sm border-none"
                  style={{ background: 'rgba(108,92,231,0.15)', color: 'var(--primary-light)', fontSize: '0.65rem' }}
                  onClick={() => {
                    handleSyncAllTopics(detail.id)
                    setConfirmAction({
                      message: 'Estados sincronizados. Todos los temas y bloques ahora reflejan el progreso real de los ejercicios.',
                      onConfirm: () => setConfirmAction(null)
                    })
                  }}
                >
                  <RefreshCw size={12} /> Sync
                </button>
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
              </>
            )}
          </div>

          <div className="flex gap-10 study-stats-bar">
            <div className="flex-1 bg-card rounded-sm border" style={{ padding: '10px 12px' }}>
              <div className="text-xs text-muted">Progreso</div>
              <div className="font-800" style={{ fontSize: '1.3rem', color: detail.color }}>{subProgress}%</div>
              <div className="text-xs text-muted">{subDone}/{subTotal} bloques</div>
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

          {/* Next block to study */}
          {(() => {
            const nextEntry = plan.find(e => !e.completed && e.subjectId === detail.id)
            if (!nextEntry) return null
            const isToday = nextEntry.date === formatDate(new Date())
            const dayLabel = isToday ? 'Hoy' : new Date(nextEntry.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
            return (
              <div style={{
                margin: '8px 0 0',
                padding: '8px 12px',
                borderRadius: 8,
                background: isToday ? `${detail.color}12` : 'var(--bg-card)',
                border: isToday ? `1px solid ${detail.color}30` : '1px solid var(--border)',
              }}>
                <div className="flex items-center gap-8">
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: isToday ? detail.color : 'var(--text-muted)',
                    flexShrink: 0,
                  }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-700" style={{ color: isToday ? detail.color : 'var(--text-muted)' }}>
                      {dayLabel}:
                    </span>
                    <span className="text-xs" style={{ marginLeft: 6 }}>
                      {nextEntry.task}
                    </span>
                  </div>
                  <span className="text-xs text-muted">{nextEntry.topicName}</span>
                </div>
              </div>
            )
          })()}
        </div>

        {/* ========== ADMIN CORRECTIONS PANEL ========== */}
        {isAdmin && (
          <>
            <div className="section-header">
              <button
                className="flex items-center gap-2 cursor-pointer bg-none border-none"
                style={{ color: 'var(--text-muted)', padding: 0 }}
                onClick={async () => {
                  setShowCorrections(!showCorrections)
                  const savedSubs = await appStateDb.get('study_submissions')
                  if (savedSubs) setSubmissions(savedSubs)
                }}
              >
                <ClipboardList size={14} />
                <span className="section-title">Correcciones</span>
                <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                  {submissions.filter(s => s.status === 'pending' && s.type === 'manual' && s.subjectName === detail.name).length}
                </span>
                {showCorrections ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {showCorrections && (
              <div className="px-16" style={{ paddingBottom: 12 }}>
                {submissions.filter(s => s.type === 'manual' && s.subjectName === detail.name).length === 0 && (
                  <div className="text-muted text-center" style={{ padding: '20px 0', fontSize: '0.82rem' }}>
                    Sin ejercicios enviados para corregir.
                  </div>
                )}
                {submissions
                  .filter(s => s.type === 'manual' && s.subjectName === detail.name)
                  .sort((a, b) => {
                    const order = { pending: 0, approved: 1, rejected: 1 }
                    return (order[a.status] || 0) - (order[b.status] || 0)
                  })
                  .map((sub, idx) => (
                    <div
                      key={sub.exerciseId + '-' + idx}
                      style={{
                        padding: '12px',
                        marginBottom: 8,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-card)',
                        border: sub.status === 'pending'
                          ? '1px solid var(--warning)'
                          : sub.status === 'approved'
                            ? '1px solid rgba(0,206,201,0.3)'
                            : sub.status === 'rejected'
                              ? '1px solid rgba(255,118,117,0.3)'
                              : '1px solid var(--border)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs text-muted font-600">{sub.topicName}</span>
                          <span className="text-xs text-muted"> / {sub.blockTitle}</span>
                        </div>
                        <span className={`badge ${sub.status === 'pending' ? 'badge-warning' : sub.status === 'approved' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                          {sub.status === 'pending' ? 'Pendiente' : sub.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                        </span>
                      </div>
                      <div className="text-0\.82 mb-2"><MathText text={sub.question} /></div>
                      {sub.photoUrl && (
                        <div style={{ marginBottom: 8 }}>
                          <ClickablePhoto
                            src={sub.photoUrl}
                            alt="Respuesta"
                            style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8, border: '1px solid var(--border)' }}
                          />
                        </div>
                      )}
                      {sub.answer && !sub.photoUrl && (
                        <div className="text-xs text-muted mb-2">Respuesta: {sub.answer}</div>
                      )}
                      <div className="text-xs text-muted mb-2">
                        {new Date(sub.timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {sub.feedback && (
                        <div className="text-xs mb-2" style={{
                          padding: '6px 8px',
                          borderRadius: 6,
                          background: sub.status === 'approved' ? 'rgba(0,206,201,0.08)' : 'rgba(255,118,117,0.08)',
                          color: sub.status === 'approved' ? 'var(--success)' : 'var(--danger)',
                        }}>
                          <MessageSquare size={10} style={{ display: 'inline', marginRight: 4 }} />
                          {sub.feedback}
                        </div>
                      )}
                      {sub.correctionUrl && (
                        <div style={{ marginBottom: 8 }}>
                          <div className="text-xs text-muted mb-1" style={{ fontWeight: 600 }}>Correccion:</div>
                          <ClickablePhoto
                            src={sub.correctionUrl}
                            alt="Correccion"
                            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--danger)' }}
                          />
                        </div>
                      )}
                      {sub.status === 'pending' && (
                        <div>
                          <div className="flex gap-6 mb-2">
                            <input
                              value={feedbackText}
                              onChange={e => setFeedbackText(e.target.value)}
                              placeholder="Comentario (opcional)"
                              style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                            />
                          </div>
                          <div className="flex gap-6 mb-2">
                            <input
                              ref={correctionFileRef}
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setCorrectionFile(file)
                                  setCorrectionPreview(URL.createObjectURL(file))
                                }
                              }}
                            />
                            <button
                              className="btn btn-sm btn-outline flex-1"
                              style={{ justifyContent: 'center', fontSize: '0.72rem' }}
                              onClick={() => correctionFileRef.current?.click()}
                            >
                              <Upload size={12} /> {correctionFile ? 'Foto subida' : 'Subir correccion'}
                            </button>
                          </div>
                          {correctionPreview && (
                            <div style={{ marginBottom: 8 }}>
                              <img
                                src={correctionPreview}
                                alt="Preview correccion"
                                style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid var(--border)' }}
                              />
                            </div>
                          )}
                          <div className="flex gap-6">
                            <button
                              className="btn btn-sm flex-1"
                              style={{ background: 'rgba(0,206,201,0.15)', color: 'var(--success)', border: 'none', justifyContent: 'center' }}
                              onClick={() => {
                                setSubmissions(prev => {
                                  const updated = prev.map(s =>
                                    s.exerciseId === sub.exerciseId && s.timestamp === sub.timestamp
                                      ? { ...s, status: 'approved', feedback: feedbackText }
                                      : s
                                  )
                                  appStateDb.set('study_submissions', updated)
                                  return updated
                                })
                                setFeedbackText('')
                                setCorrectionFile(null)
                                setCorrectionPreview(null)
                              }}
                            >
                              <ThumbsUp size={12} /> Aprobar
                            </button>
                            <button
                              className="btn btn-sm flex-1"
                              style={{ background: 'rgba(255,118,117,0.15)', color: 'var(--danger)', border: 'none', justifyContent: 'center' }}
                              onClick={async () => {
                                let correctionUrl = correctionPreview
                                if (correctionFile && isSupabaseConfigured() && supabase) {
                                  const ext = correctionFile.name.split('.').pop()
                                  const path = `corrections/${Date.now()}.${ext}`
                                  const { error: upErr } = await supabase.storage.from('uploads').upload(path, correctionFile)
                                  if (!upErr) {
                                    const { data } = supabase.storage.from('uploads').getPublicUrl(path)
                                    correctionUrl = data.publicUrl
                                  }
                                }
                                setSubmissions(prev => {
                                  const updated = prev.map(s =>
                                    s.exerciseId === sub.exerciseId && s.timestamp === sub.timestamp
                                      ? { ...s, status: 'rejected', feedback: feedbackText, correctionUrl: correctionUrl || null }
                                      : s
                                  )
                                  appStateDb.set('study_submissions', updated)
                                  return updated
                                })
                                setFeedbackText('')
                                setCorrectionFile(null)
                                setCorrectionPreview(null)
                              }}
                            >
                              <ThumbsDown size={12} /> Rechazar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        <div className="section-header">
          <span className="section-title">Temario</span>
        </div>
        <div className="px-16" style={{ paddingBottom: 8 }}>
          {detail.topics.map((topic, i) => {
            const state = getTopicStateFromLegacy(topic.status)
            const config = TOPIC_STATE_CONFIG[state]
            const StateIcon = config.icon
            const isLocked = state === 'locked'
            const isClickable = isAdmin || !isLocked
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
                  opacity: isLocked && !isAdmin ? 0.5 : 1,
                }}
              >
                <StateIcon
                  size={18}
                  className={`flex-shrink-0${isLocked ? ' cursor-pointer' : ''}`}
                  onClick={isLocked ? (e) => {
                    e.stopPropagation()
                    setUnlockPrompt({ type: 'topic', subjectId: detail.id, topicIndex: i })
                    setUnlockPassword('')
                    setUnlockError(false)
                  } : undefined}
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
                {(topic.theoryBlocks || []).length > 0 && (() => {
                  const total = (topic.theoryBlocks || []).length
                  const completed = (topic.theoryBlocks || []).filter(b => b.status === 'completed').length
                  if (total === 0) return null
                  return (
                    <div className="flex items-center gap-4 flex-shrink-0" style={{ marginRight: 8 }}>
                      <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border)' }}>
                        <div style={{ width: `${(completed / total) * 100}%`, height: '100%', borderRadius: 2, background: completed === total ? 'var(--success)' : detail.color, transition: 'width 0.3s' }} />
                      </div>
                      <span className="text-xs text-muted" style={{ fontSize: '0.6rem' }}>{completed}/{total}</span>
                    </div>
                  )
                })()}
                {(() => {
                  const allEx = (topic.theoryBlocks || []).flatMap(b => b.exercises || [])
                  const pendingEx = allEx.filter(ex => ex.status === 'pending')
                  const doneEx = allEx.filter(ex => ex.status === 'done')
                  const manualPendingReview = allEx.filter(ex => ex.type === 'manual' && ex.status === 'submitted' && (() => {
                    const subs = submissions.filter(s => s.exerciseId === ex.id)
                    const latest = subs.length > 0 ? subs[subs.length - 1] : null
                    return !latest || latest.status === 'pending'
                  })())
                  const allTrueComplete = allEx.length > 0 && allEx.every(ex => isExerciseComplete(ex, submissions))
                  const isPartial = state === 'in_progress' && allEx.length > 0 && pendingEx.length > 0 && pendingEx.length < allEx.length
                  const onlyCorrectionLeft = state === 'in_progress' && pendingEx.length === 0 && doneEx.length === 0 && manualPendingReview.length > 0

                  if (onlyCorrectionLeft) {
                    return (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 10,
                        background: 'rgba(108,92,231,0.12)', color: 'var(--primary-light)',
                      }}>
                        Por corregir
                      </span>
                    )
                  }

                  if (isPartial) {
                    return (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 10,
                        background: 'rgba(255,165,0,0.12)', color: '#f59e0b',
                      }}>
                        Parcial ({allEx.length - pendingEx.length}/{allEx.length})
                      </span>
                    )
                  }

                  // Topic marked completed but has uncorrected manual exercises
                  if (state === 'completed' && !allTrueComplete && manualPendingReview.length > 0) {
                    return (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 10,
                        background: 'rgba(108,92,231,0.12)', color: 'var(--primary-light)',
                      }}>
                        Por corregir
                      </span>
                    )
                  }

                  return (
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                      padding: '3px 8px', borderRadius: 10,
                      background: state === 'in_progress' ? `${detail.color}20`
                        : state === 'completed' && allTrueComplete ? 'rgba(0,206,201,0.15)'
                        : state === 'available' ? 'rgba(108,92,231,0.12)'
                        : 'rgba(136,136,160,0.12)',
                      color: state === 'in_progress' ? detail.color : config.color,
                    }}>
                      {config.label}
                    </span>
                  )
                })()}
              </div>
            )
          })}
        </div>

        <div className="section-header">
          <span className="section-title">Planning semanal</span>
          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={() => { setPlanWeekOffset(prev => prev - 1); setSelectedPlanDate(null) }}>
              <ChevronLeft size={16} />
            </button>
            <button
              className="btn btn-sm border-none"
              style={{ background: 'var(--bg-input)', fontSize: '0.7rem', padding: '4px 8px' }}
              onClick={() => { setPlanWeekOffset(0); setSelectedPlanDate(null) }}
            >
              Esta semana
            </button>
            <button className="btn-ghost" onClick={() => { setPlanWeekOffset(prev => prev + 1); setSelectedPlanDate(null) }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Advance tracking badge */}
        {(() => {
          const aheadCount = plan.filter(e => e.completed && e.isAhead).length
          if (aheadCount <= 0) return null
          return (
            <div className="study-ahead-badge">
              <Zap size={14} />
              +{aheadCount} {aheadCount === 1 ? 'bloque' : 'bloques'} adelantado
            </div>
          )
        })()}

        {/* Date-based weekly calendar */}
        <div className="px-16" style={{ paddingBottom: 8 }}>
          {(() => {
            const now = new Date()
            const baseMonday = new Date(getWeekMonday(now) + 'T12:00:00')
            baseMonday.setDate(baseMonday.getDate() + planWeekOffset * 7)
            const weekStartStr = formatDate(baseMonday)
            const weekPlan = getPlanForWeek(plan, weekStartStr)
            const todayStr = formatDate(now)
            const SHORT_DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

            // Group plan entries by date
            const planByDate = {}
            weekPlan.forEach(entry => {
              if (!planByDate[entry.date]) planByDate[entry.date] = []
              planByDate[entry.date].push(entry)
            })

            return (
              <>
                {/* Calendar strip */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {SHORT_DAYS.map((shortDay, i) => {
                    const d = new Date(baseMonday)
                    d.setDate(baseMonday.getDate() + i)
                    const dateStr = formatDate(d)
                    const isToday = dateStr === todayStr
                    const isSelected = selectedPlanDate === dateStr
                    const dayEntries = planByDate[dateStr] || []
                    const hasTasks = dayEntries.length > 0
                    const allDone = hasTasks && dayEntries.every(e => e.completed)
                    const someDone = dayEntries.some(e => e.completed)
                    const hasAhead = dayEntries.some(e => e.isAhead)
                    const isWeekend = i >= 5

                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (!hasTasks) return
                          setSelectedPlanDate(prev => prev === dateStr ? null : dateStr)
                        }}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '6px 2px',
                          borderRadius: 8,
                          cursor: hasTasks ? 'pointer' : 'default',
                          background: isSelected ? `${detail.color}25`
                            : hasAhead && allDone ? 'rgba(245, 158, 11, 0.12)'
                            : isToday ? `${detail.color}18`
                            : 'transparent',
                          border: isSelected ? `2px solid ${detail.color}`
                            : hasAhead && allDone ? '2px solid rgba(245, 158, 11, 0.4)'
                            : isToday ? `2px solid ${detail.color}40`
                            : '2px solid transparent',
                          opacity: isWeekend && !hasTasks ? 0.3 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{
                          fontSize: '0.6rem', fontWeight: 700,
                          color: isSelected ? detail.color : hasAhead && allDone ? '#f59e0b' : isToday ? detail.color : 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                          {shortDay}
                        </div>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: isSelected || isToday || (hasAhead && allDone) ? 800 : 500,
                          color: isSelected ? detail.color : hasAhead && allDone ? '#f59e0b' : isToday ? detail.color : 'var(--text)',
                          marginTop: 2,
                        }}>
                          {hasAhead && allDone && <Zap size={12} style={{ display: 'inline' }} />}
                          {d.getDate()}
                        </div>
                        {hasTasks && (
                          <div style={{
                            width: 6, height: 6, borderRadius: '50%', margin: '3px auto 0',
                            background: isSelected ? detail.color : hasAhead && allDone ? '#f59e0b' : allDone ? 'var(--success)' : someDone ? 'var(--warning)' : `${detail.color}60`,
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Tasks grouped by date - filtered if a day is selected */}
                {SHORT_DAYS.map((_, i) => {
                  const d = new Date(baseMonday)
                  d.setDate(baseMonday.getDate() + i)
                  const dateStr = formatDate(d)
                  // If a date is selected, only show that day
                  if (selectedPlanDate && dateStr !== selectedPlanDate) return null
                  const dayEntries = planByDate[dateStr] || []
                  if (dayEntries.length === 0) return null
                  const isToday = dateStr === todayStr
                  const isSelected = selectedPlanDate === dateStr
                  const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })

                  return (
                    <div key={dateStr} style={{ marginTop: 8 }}>
                      <div className="flex items-center gap-6" style={{
                        padding: '8px 0 4px',
                        ...(isSelected ? { padding: '8px 10px 4px', background: `${detail.color}08`, borderRadius: 8, marginLeft: -10, marginRight: -10 } : {}),
                      }}>
                        <span className="font-700 text-uppercase tracking-wide" style={{
                          fontSize: '0.68rem',
                          color: isSelected || isToday ? detail.color : 'var(--text-muted)',
                          textTransform: 'capitalize',
                        }}>
                          {dayLabel}
                        </span>
                        {isToday && (
                          <span style={{
                            fontSize: '0.55rem', fontWeight: 700, padding: '1px 6px', borderRadius: 6,
                            background: `${detail.color}20`, color: detail.color, textTransform: 'uppercase',
                          }}>
                            Hoy
                          </span>
                        )}
                      </div>
                      {dayEntries.map(entry => {
                        const done = entry.completed
                        const topic = detail.topics.find(t => t.name === entry.topicName)
                        return (
                          <div key={entry.blockId} className="flex items-center gap-10" style={{
                            padding: '8px 0', borderBottom: '1px solid var(--border)',
                          }}>
                            <div
                              className={`checkbox ${done ? 'checked' : ''}`}
                              style={done ? (entry.isAhead ? { background: '#f59e0b', borderColor: '#f59e0b' } : { background: 'var(--success)', borderColor: 'var(--success)' }) : { borderColor: `${detail.color}60` }}
                            >
                              {done && <Check size={12} color="white" />}
                            </div>
                            <div
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => {
                                if (topic) openTopic(topic, entry.blockId)
                              }}
                            >
                              <span style={{
                                fontSize: '0.85rem',
                                textDecoration: done ? 'line-through' : 'none',
                                color: done ? 'var(--text-muted)' : 'var(--text)',
                              }}>
                                {entry.task}
                              </span>
                              <span style={{
                                marginLeft: 8, padding: '1px 6px', borderRadius: 8, fontSize: '0.6rem',
                                background: done ? (entry.isAhead ? 'rgba(245,158,11,0.15)' : 'rgba(0,206,201,0.15)') : `${detail.color}15`,
                                color: done ? (entry.isAhead ? '#f59e0b' : 'var(--success)') : `${detail.color}cc`,
                              }}>
                                {entry.topicName}
                              </span>
                              {entry.completedDate && entry.completedDate !== entry.date && (
                                <span className="text-xs" style={{ marginLeft: 6, color: '#f59e0b' }}>
                                  (hecho el {new Date(entry.completedDate + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })})
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                {weekPlan.length === 0 && (
                  <div className="text-muted text-center" style={{ padding: '20px 0', fontSize: '0.82rem' }}>
                    Sin tareas planificadas esta semana.
                  </div>
                )}
              </>
            )
          })()}
        </div>

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

        {unlockPrompt && (
          <div className="modal-overlay" onClick={() => setUnlockPrompt(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Desbloquear tema</h2>
              <p className="text-xs text-muted mb-3">
                Introduce la contrasena de admin para desbloquear este tema.
              </p>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Contrasena"
                  value={unlockPassword}
                  onChange={e => { setUnlockPassword(e.target.value); setUnlockError(false) }}
                  onKeyDown={e => e.key === 'Enter' && tryUnlock()}
                  autoFocus
                  className={unlockError ? 'input-error' : ''}
                />
                {unlockError && <div className="error-text">Contrasena incorrecta</div>}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={() => setUnlockPrompt(null)}>Cancelar</button>
                <button
                  className="btn btn-block border-none"
                  style={{ background: '#f59e0b', color: 'white' }}
                  onClick={tryUnlock}
                >
                  <Unlock size={14} /> Desbloquear
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

      {/* Global stats */}
      <div className="flex gap-8 px-16" style={{ paddingBottom: 12 }}>
        <div className="flex-1 bg-card rounded-sm border text-center" style={{ padding: '10px 8px' }}>
          <div className="font-800" style={{ fontSize: '1.1rem', color: studyStreak >= 5 ? 'var(--success)' : studyStreak >= 3 ? 'var(--warning)' : 'var(--text)' }}>
            {studyStreak}
          </div>
          <div className="text-xs text-muted">Racha (dias)</div>
        </div>
        <div className="flex-1 bg-card rounded-sm border text-center" style={{ padding: '10px 8px' }}>
          <div className="font-800" style={{ fontSize: '1.1rem' }}>
            {plan.filter(e => e.completed).length}/{plan.length}
          </div>
          <div className="text-xs text-muted">Bloques hechos</div>
        </div>
        <div className="flex-1 bg-card rounded-sm border text-center" style={{ padding: '10px 8px' }}>
          <div className="font-800" style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
            {(() => {
              const incomplete = plan.filter(e => !e.completed)
              if (incomplete.length === 0) return 'Hecho'
              const lastDate = incomplete[incomplete.length - 1].date
              const d = new Date(lastDate + 'T12:00:00')
              return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            })()}
          </div>
          <div className="text-xs text-muted">Fin estimado</div>
        </div>
      </div>

      <div className="study-summary-grid">
      {subjects.map(subject => {
        const Icon = ICONS[subject.icon] || Calculator
        const subjectEntries = plan.filter(e => e.subjectId === subject.id)
        const subTotal = subjectEntries.length
        const subDone = subjectEntries.filter(e => e.completed).length
        const progress = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0
        const current = getCurrentTopic(subject)
        const next = getNextTopic(subject)
        const doneTops = getCompletedTopics(subject)

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
      </div>

      {todayPlanEntries.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Hoy - {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="card" style={{ borderLeft: `3px solid var(--primary)` }}>
            {todayPlanEntries.map((entry, i) => {
              const done = entry.completed
              const subject = subjects.find(s => s.id === entry.subjectId)
              const subjectColor = subject?.color || 'var(--primary)'
              return (
                <div key={i} className="flex items-center gap-10" style={{
                  padding: '8px 0',
                  borderBottom: i < todayPlanEntries.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div
                    className={`checkbox ${done ? 'checked' : ''}`}
                    style={done ? { background: 'var(--success)', borderColor: 'var(--success)' } : { borderColor: `${subjectColor}60` }}
                  >
                    {done && <Check size={12} color="white" />}
                  </div>
                  <div className="flex-1">
                    <span style={{
                      fontSize: '0.85rem',
                      textDecoration: done ? 'line-through' : 'none',
                      color: done ? 'var(--text-muted)' : 'var(--text)'
                    }}>
                      {entry.task}
                    </span>
                  </div>
                  <span className="font-700" style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: '0.6rem',
                    background: `${subjectColor}18`, color: subjectColor
                  }}>
                    {entry.topicName?.substring(0, 6)}
                  </span>
                </div>
              )
            })}
            {todayPlanEntries.every(e => e.completed) && (
              <div className="text-center mt-2" style={{ padding: '8px 0', color: 'var(--success)', fontSize: '0.82rem', fontWeight: 700 }}>
                Todo completado hoy
              </div>
            )}
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
