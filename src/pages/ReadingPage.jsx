import { useState, useRef, useEffect } from 'react'
import {
  Plus, BookOpen, Check, Target, Trash2, Edit3, X,
  Camera, BookMarked, Clock, TrendingUp, ChevronLeft,
  ChevronRight, Calendar, Settings
} from 'lucide-react'
import { mockReading } from '../data/mockData'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useDb } from '../hooks/useDb'
import { readingDb, appStateDb } from '../lib/db'

const COVER_COLORS = ['#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#10b981', '#6366f1', '#ec4899', '#f97316', '#14b8a6', '#a855f7']

function BookCover({ book, size = 'md', onClick }) {
  const sizes = {
    sm: { width: 60, height: 88, fontSize: '0.55rem', iconSize: 16 },
    md: { width: 100, height: 148, fontSize: '0.7rem', iconSize: 24 },
    lg: { width: 140, height: 207, fontSize: '0.85rem', iconSize: 32 },
  }
  const s = sizes[size]
  const progress = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0
  const isDone = book.status === 'done'
  const isWishlist = book.status === 'wishlist'

  return (
    <div onClick={onClick} style={{
      width: s.width, height: s.height, borderRadius: 8,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      cursor: onClick ? 'pointer' : undefined,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      transition: 'transform 0.2s',
      filter: isWishlist ? 'grayscale(0.3) opacity(0.7)' : 'none'
    }}>
      {book.cover ? (
        <img src={book.cover} alt={book.title} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block'
        }} />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.coverColor}aa 100%)`
        }} />
      )}
      {!book.cover && (
        <div style={{
          position: 'absolute', inset: 0, padding: size === 'sm' ? 6 : 10,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'
        }}>
          <div className="line-clamp-3 text-white" style={{
            fontSize: s.fontSize, fontWeight: 800, lineHeight: 1.2,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            {book.title}
          </div>
          {size !== 'sm' && (
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              {book.author}
            </div>
          )}
        </div>
      )}

      {isDone && (
        <div className="flex items-center justify-center rounded-full" style={{
          position: 'absolute', top: 4, right: 4,
          width: size === 'sm' ? 18 : 24, height: size === 'sm' ? 18 : 24,
          background: 'var(--success)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          <Check size={size === 'sm' ? 10 : 14} color="white" />
        </div>
      )}

      {book.status === 'reading' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: 'rgba(0,0,0,0.3)'
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: progress >= 70 ? 'var(--success)' : 'var(--warning)',
            transition: 'width 0.3s'
          }} />
        </div>
      )}

      {isWishlist && (
        <div className="text-white font-700" style={{
          position: 'absolute', top: 4, right: 4,
          padding: '2px 6px', borderRadius: 6,
          background: 'rgba(0,0,0,0.6)', fontSize: '0.5rem'
        }}>
          PENDIENTE
        </div>
      )}
    </div>
  )
}

// Crop image to 2:3 book cover ratio, upload to Supabase or return data URL
async function cropCoverImage(file) {
  const RATIO = 2 / 3 // width:height
  const MAX_W = 400

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      let sw, sh, sx, sy

      // Crop to 2:3 from center
      if (img.width / img.height > RATIO) {
        // Image is wider than 2:3 — crop sides
        sh = img.height
        sw = Math.round(sh * RATIO)
        sx = Math.round((img.width - sw) / 2)
        sy = 0
      } else {
        // Image is taller — crop top/bottom
        sw = img.width
        sh = Math.round(sw / RATIO)
        sx = 0
        sy = Math.round((img.height - sh) / 2)
      }

      canvas.width = Math.min(sw, MAX_W)
      canvas.height = Math.round(canvas.width / RATIO)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

      // Try upload to Supabase
      if (isSupabaseConfigured() && supabase) {
        canvas.toBlob(async (blob) => {
          const path = `covers/${Date.now()}.jpg`
          const { error: uploadError } = await supabase.storage.from('uploads').upload(path, blob, { contentType: 'image/jpeg' })
          if (!uploadError) {
            const { data } = supabase.storage.from('uploads').getPublicUrl(path)
            resolve(data.publicUrl)
          } else {
            resolve(canvas.toDataURL('image/jpeg', 0.85))
          }
        }, 'image/jpeg', 0.85)
      } else {
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
    }
    img.src = URL.createObjectURL(file)
  })
}

function ReadingPage() {
  const [books, setBooks, { loading, error }] = useDb(readingDb.getBooks, mockReading.books)
  const [dailyGoal, setDailyGoal] = useState(mockReading.dailyGoalPages)
  const [modal, setModal] = useState(null)
  const [activeBook, setActiveBook] = useState(null)
  const [newBook, setNewBook] = useState({
    title: '', author: '', totalPages: '', goal: '', coverColor: '#8b5cf6', status: 'wishlist'
  })
  const [updatePages, setUpdatePages] = useState('')
  const [logPages, setLogPages] = useState('')
  const fileInputRef = useRef(null)
  const detailCoverRef = useRef(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [showError, setShowError] = useState(true)
  const [errors, setErrors] = useState({})
  const [editBook, setEditBook] = useState(null)
  const [quickLogBookId, setQuickLogBookId] = useState(null)

  // Daily goal config
  const [goalModal, setGoalModal] = useState(false)
  const [tempGoal, setTempGoal] = useState('')

  // Timer states
  const [timerMode, setTimerMode] = useState(null) // 'chrono' | 'countdown' | null
  const [timerStart, setTimerStart] = useState(null)
  const [timerElapsed, setTimerElapsed] = useState(0)
  const [countdownMinutes, setCountdownMinutes] = useState(15)
  const [countdownRemaining, setCountdownRemaining] = useState(0)
  const [timerBookId, setTimerBookId] = useState(null)
  const timerRef = useRef(null)

  // Manual session states
  const [manualSessionDate, setManualSessionDate] = useState('')
  const [manualSessionMinutes, setManualSessionMinutes] = useState('')

  // History calendar
  const [showHistory, setShowHistory] = useState(false)
  const [histCalMonth, setHistCalMonth] = useState(new Date().getMonth())
  const [histCalYear, setHistCalYear] = useState(new Date().getFullYear())

  // Load daily goal from Supabase
  useEffect(() => {
    async function loadGoal() {
      const saved = await appStateDb.get('reading_daily_goal')
      if (saved && typeof saved === 'number') setDailyGoal(saved)
    }
    loadGoal()
  }, [])

  // Timer effect
  useEffect(() => {
    if (timerMode === 'chrono' && timerStart) {
      timerRef.current = setInterval(() => {
        setTimerElapsed(Math.floor((Date.now() - timerStart) / 1000))
      }, 1000)
    } else if (timerMode === 'countdown' && countdownRemaining > 0) {
      timerRef.current = setInterval(() => {
        setCountdownRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification('Tiempo de lectura terminado')
            }
            alert('Tiempo de lectura terminado')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timerMode, timerStart, countdownRemaining])

  const reading = books.filter(b => b.status === 'reading')
  const done = books.filter(b => b.status === 'done')
  const wishlist = books.filter(b => b.status === 'wishlist')
  const totalPagesRead = books.reduce((a, b) => a + b.currentPage, 0)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayPages = books.reduce((acc, b) => {
    const entry = b.dailyLog?.find(l => l.date === todayStr)
    return acc + (entry ? entry.pages : 0)
  }, 0)

  const last7 = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    const dayPages = books.reduce((acc, b) => {
      const entry = b.dailyLog?.find(l => l.date === ds)
      return acc + (entry ? entry.pages : 0)
    }, 0)
    last7.push(dayPages)
  }
  const avgPages = last7.length > 0 ? Math.round(last7.reduce((a, b) => a + b, 0) / last7.length) : 0

  // Reading streak: consecutive days with pages logged
  const readingStreak = (() => {
    let streak = 0
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const ds = d.toISOString().split('T')[0]
      const dayPages = books.reduce((acc, b) => {
        const entry = (b.dailyLog || []).find(l => l.date === ds)
        return acc + (entry ? entry.pages : 0)
      }, 0)
      if (dayPages > 0) {
        streak++
        d.setDate(d.getDate() - 1)
      } else if (i === 0) {
        // Today hasn't been logged yet, check yesterday
        d.setDate(d.getDate() - 1)
        continue
      } else {
        break
      }
    }
    return streak
  })()

  const detail = activeBook ? books.find(b => b.id === activeBook) : null

  const clearErrors = () => setErrors({})

  const closeModal = () => {
    setModal(null)
    clearErrors()
  }

  const validateAddBook = () => {
    const errs = {}
    if (!newBook.title.trim()) errs.title = 'El titulo es obligatorio'
    const pages = parseInt(newBook.totalPages)
    if (!newBook.totalPages || isNaN(pages) || pages <= 0) errs.totalPages = 'Debe ser un numero positivo'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateLogPages = (book) => {
    const errs = {}
    const pages = parseInt(logPages)
    if (!logPages || isNaN(pages) || pages <= 0) {
      errs.logPages = 'Debe ser un numero positivo'
    } else if (book && pages > (book.totalPages - book.currentPage)) {
      errs.logPages = `Maximo ${book.totalPages - book.currentPage} paginas restantes`
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateUpdatePages = (book) => {
    const errs = {}
    const pages = parseInt(updatePages)
    if (updatePages === '' || isNaN(pages)) {
      errs.updatePages = 'Introduce un numero valido'
    } else if (pages < 0 || pages > book.totalPages) {
      errs.updatePages = `Debe estar entre 0 y ${book.totalPages}`
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddBook = async () => {
    if (!validateAddBook()) return
    const book = {
      id: Date.now(),
      ...newBook,
      cover: coverPreview,
      totalPages: parseInt(newBook.totalPages),
      currentPage: 0,
      startDate: newBook.status === 'reading' ? todayStr : null,
      notes: '',
      dailyLog: [],
      gallery: []
    }
    setBooks([...books, book])
    const dbBook = await readingDb.addBook(book)
    if (dbBook) {
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, id: dbBook.id } : b))
    }
    setNewBook({ title: '', author: '', totalPages: '', goal: '', coverColor: '#8b5cf6', status: 'wishlist' })
    setCoverPreview(null)
    closeModal()
  }

  const handleUpdateProgress = (bookId) => {
    const book = books.find(b => b.id === bookId)
    if (!validateUpdatePages(book)) return
    const pages = parseInt(updatePages)
    const newCurrent = Math.min(pages, book.totalPages)
    const pagesRead = newCurrent - book.currentPage
    const status = newCurrent >= book.totalPages ? 'done' : book.status
    setBooks(books.map(b => {
      if (b.id !== bookId) return b
      const log = pagesRead > 0
        ? [{ date: todayStr, pages: pagesRead }, ...(b.dailyLog || []).filter(l => l.date !== todayStr)]
        : b.dailyLog || []
      return {
        ...b,
        currentPage: newCurrent,
        status,
        dailyLog: log
      }
    }))
    readingDb.updateBook(bookId, { currentPage: newCurrent, status })
    if (pagesRead > 0) readingDb.logPages(bookId, todayStr, pagesRead)
    setUpdatePages('')
    closeModal()
  }

  const handleLogPages = (bookId) => {
    const book = books.find(b => b.id === bookId)
    if (!validateLogPages(book)) return
    const pages = parseInt(logPages)
    const newCurrent = Math.min(book.currentPage + pages, book.totalPages)
    const status = newCurrent >= book.totalPages ? 'done' : book.status
    const existingEntry = (book.dailyLog || []).find(l => l.date === todayStr)
    const totalTodayPages = existingEntry ? existingEntry.pages + pages : pages
    setBooks(books.map(b => {
      if (b.id !== bookId) return b
      const existing = (b.dailyLog || []).find(l => l.date === todayStr)
      const log = existing
        ? (b.dailyLog || []).map(l => l.date === todayStr ? { ...l, pages: l.pages + pages } : l)
        : [{ date: todayStr, pages }, ...(b.dailyLog || [])]
      return {
        ...b,
        currentPage: newCurrent,
        status,
        dailyLog: log
      }
    }))
    readingDb.updateBook(bookId, { currentPage: newCurrent, status })
    readingDb.logPages(bookId, todayStr, totalTodayPages)
    setLogPages('')
    closeModal()
  }

  const changeStatus = (bookId, status) => {
    const book = books.find(b => b.id === bookId)
    const startDate = status === 'reading' && !book.startDate ? todayStr : book.startDate
    const currentPage = status === 'done' ? book.totalPages : book.currentPage
    setBooks(books.map(b => {
      if (b.id !== bookId) return b
      return { ...b, status, startDate, currentPage }
    }))
    readingDb.updateBook(bookId, { status, startDate, currentPage })
  }

  const handleDelete = (bookId) => {
    setBooks(books.filter(b => b.id !== bookId))
    readingDb.deleteBook(bookId)
    setActiveBook(null)
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await cropCoverImage(file)
    setCoverPreview(url)
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
    const progress = detail.totalPages > 0 ? Math.round((detail.currentPage / detail.totalPages) * 100) : 0
    const pagesLeft = detail.totalPages - detail.currentPage
    const daysToFinish = dailyGoal > 0 ? Math.ceil(pagesLeft / dailyGoal) : null
    const recentLog = (detail.dailyLog || []).slice(0, 7)

    return (
      <>
        {error && showError && (
          <div className="error-banner">
            <span>No se pudo conectar con el servidor. Usando datos locales.</span>
            <button className="dismiss" onClick={() => setShowError(false)}>×</button>
          </div>
        )}

        <div className="p-16">
          <button className="btn-ghost flex items-center gap-1 mb-3 p-0" onClick={() => setActiveBook(null)}>
            <ChevronLeft size={18} /> Volver
          </button>

          <div className="flex gap-16" style={{ marginBottom: 20 }}>
            <div style={{ position: 'relative' }}>
              <BookCover book={detail} size="lg" onClick={() => detailCoverRef.current?.click()} />
              <div style={{
                position: 'absolute', bottom: 6, right: 6,
                background: 'rgba(0,0,0,0.7)', borderRadius: '50%',
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <Camera size={14} color="white" />
              </div>
              <input ref={detailCoverRef} type="file" accept="image/*" hidden onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                // Create a cropped version (2:3 aspect ratio for book cover)
                const url = await cropCoverImage(file)
                setBooks(books.map(b => b.id !== detail.id ? b : { ...b, cover: url }))
                readingDb.updateBook(detail.id, { cover: url })
              }} />
            </div>
            <div className="flex-1 flex-col justify-end" style={{ display: 'flex' }}>
              <div className="flex items-center gap-8 mb-2">
                <div className="font-800 leading-tight" style={{ fontSize: '1.2rem', flex: 1 }}>{detail.title}</div>
                <button className="btn btn-sm btn-outline" onClick={() => {
                  setEditBook({ ...detail })
                  clearErrors()
                  setModal('edit-book')
                }}>
                  <Edit3 size={13} /> Editar
                </button>
              </div>
              <div className="text-sm text-muted mb-2">{detail.author}</div>

              {detail.status === 'reading' && (
                <>
                  <div className="font-900 leading-1" style={{ fontSize: '2rem', color: detail.coverColor }}>{progress}%</div>
                  <div className="progress-bar" style={{ height: 6, margin: '6px 0' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: detail.coverColor, transition: 'width 0.3s' }} />
                  </div>
                  <div className="text-xs text-muted">{detail.currentPage}/{detail.totalPages} pags · {pagesLeft} restantes</div>
                  {progress >= 25 && progress < 50 && (
                    <div className="text-xs font-700 mt-1" style={{ color: detail.coverColor }}>
                      Ya llevas un cuarto del libro
                    </div>
                  )}
                  {progress >= 50 && progress < 75 && (
                    <div className="text-xs font-700 mt-1" style={{ color: 'var(--warning)' }}>
                      Mitad del libro completada
                    </div>
                  )}
                  {progress >= 75 && progress < 100 && (
                    <div className="text-xs font-700 mt-1" style={{ color: 'var(--success)' }}>
                      Recta final - te queda muy poco
                    </div>
                  )}
                </>
              )}
              {detail.status === 'done' && (
                <div className="flex items-center gap-6">
                  <Check size={18} className="text-success" />
                  <span className="font-700 text-success">Leido</span>
                </div>
              )}
              {detail.status === 'wishlist' && (
                <span className="text-muted text-0\.85">En lista de espera</span>
              )}
            </div>
          </div>
        </div>

        {detail.status === 'reading' && (
          <div className="flex gap-8 px-16" style={{ paddingBottom: 12 }}>
            <button className="btn btn-sm btn-block border-none" style={{ background: `${detail.coverColor}20`, color: detail.coverColor }}
              onClick={() => { setLogPages(''); clearErrors(); setModal('log-pages') }}>
              <Plus size={14} /> Paginas hoy
            </button>
            <button className="btn btn-sm btn-block btn-outline"
              onClick={() => { setUpdatePages(String(detail.currentPage)); clearErrors(); setModal('update-progress') }}>
              <Edit3 size={14} /> Pagina actual
            </button>
          </div>
        )}

        {detail.status === 'reading' && (
          <div className="mx-16 mb-3 rounded-sm border" style={{ background: 'var(--bg-card)', padding: '14px 16px' }}>
            {!timerMode ? (
              <>
                <div className="text-xs font-700 text-muted text-uppercase mb-2">Sesion de lectura</div>
                <div className="flex gap-8">
                  <button className="btn btn-sm flex-1 border-none"
                    style={{ background: `${detail.coverColor}20`, color: detail.coverColor }}
                    onClick={() => {
                      setTimerMode('chrono')
                      setTimerStart(Date.now())
                      setTimerElapsed(0)
                      setTimerBookId(detail.id)
                    }}>
                    <Clock size={14} /> Iniciar crono
                  </button>
                  <button className="btn btn-sm flex-1 btn-outline"
                    onClick={() => {
                      setModal('set-countdown')
                    }}>
                    <Target size={14} /> Temporizador
                  </button>
                </div>
              </>
            ) : timerMode === 'chrono' ? (
              <>
                <div className="text-xs font-700 text-muted text-uppercase mb-1">Leyendo...</div>
                <div className="text-center">
                  <div className="font-900 tabular-nums" style={{ fontSize: '2rem', color: detail.coverColor }}>
                    {String(Math.floor(timerElapsed / 3600)).padStart(2, '0')}:{String(Math.floor((timerElapsed % 3600) / 60)).padStart(2, '0')}:{String(timerElapsed % 60).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex gap-8 mt-2">
                  <button className="btn btn-sm flex-1 border-none"
                    style={{ background: 'rgba(0,206,201,0.15)', color: 'var(--success)' }}
                    onClick={() => {
                      const minutes = Math.round(timerElapsed / 60)
                      clearInterval(timerRef.current)
                      setTimerMode(null)
                      const session = { id: Date.now(), bookId: detail.id, date: todayStr, minutes, type: 'chrono' }
                      setBooks(books.map(b => {
                        if (b.id !== detail.id) return b
                        const sessions = b.sessions || []
                        return { ...b, sessions: [session, ...sessions] }
                      }))
                      readingDb.updateBook(detail.id, { sessions: [...(detail.sessions || []), session] })
                    }}>
                    <Check size={14} /> Guardar ({Math.round(timerElapsed / 60)} min)
                  </button>
                  <button className="btn btn-sm btn-outline"
                    style={{ color: 'var(--danger)' }}
                    onClick={() => { clearInterval(timerRef.current); setTimerMode(null) }}>
                    <X size={14} />
                  </button>
                </div>
              </>
            ) : timerMode === 'countdown' ? (
              <>
                <div className="text-xs font-700 text-muted text-uppercase mb-1">Temporizador</div>
                <div className="text-center">
                  <div className="font-900 tabular-nums" style={{
                    fontSize: '2rem',
                    color: countdownRemaining <= 60 ? 'var(--danger)' : countdownRemaining <= 180 ? 'var(--warning)' : detail.coverColor
                  }}>
                    {String(Math.floor(countdownRemaining / 60)).padStart(2, '0')}:{String(countdownRemaining % 60).padStart(2, '0')}
                  </div>
                </div>
                {countdownRemaining > 0 ? (
                  <div className="flex gap-8 mt-2">
                    <button className="btn btn-sm flex-1 border-none"
                      style={{ background: 'rgba(0,206,201,0.15)', color: 'var(--success)' }}
                      onClick={() => {
                        const elapsed = (countdownMinutes * 60) - countdownRemaining
                        const minutes = Math.round(elapsed / 60)
                        clearInterval(timerRef.current)
                        setTimerMode(null)
                        setCountdownRemaining(0)
                        const session = { id: Date.now(), bookId: detail.id, date: todayStr, minutes, type: 'countdown' }
                        setBooks(books.map(b => {
                          if (b.id !== detail.id) return b
                          const sessions = b.sessions || []
                          return { ...b, sessions: [session, ...sessions] }
                        }))
                        readingDb.updateBook(detail.id, { sessions: [...(detail.sessions || []), session] })
                      }}>
                      <Check size={14} /> Parar y guardar
                    </button>
                    <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }}
                      onClick={() => { clearInterval(timerRef.current); setTimerMode(null); setCountdownRemaining(0) }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-8 mt-2">
                    <button className="btn btn-sm flex-1 border-none"
                      style={{ background: 'rgba(0,206,201,0.15)', color: 'var(--success)' }}
                      onClick={() => {
                        clearInterval(timerRef.current)
                        setTimerMode(null)
                        const session = { id: Date.now(), bookId: detail.id, date: todayStr, minutes: countdownMinutes, type: 'countdown' }
                        setBooks(books.map(b => {
                          if (b.id !== detail.id) return b
                          const sessions = b.sessions || []
                          return { ...b, sessions: [session, ...sessions] }
                        }))
                        readingDb.updateBook(detail.id, { sessions: [...(detail.sessions || []), session] })
                      }}>
                      <Check size={14} /> Guardar sesion ({countdownMinutes} min)
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {detail.status === 'reading' && (
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-value" style={{ color: detail.coverColor }}>{detail.currentPage}</div>
              <div className="kpi-label">Pagina actual</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">{pagesLeft}</div>
              <div className="kpi-label">Pags restantes</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">{recentLog.length > 0 ? Math.round(recentLog.reduce((a, l) => a + l.pages, 0) / recentLog.length) : 0}</div>
              <div className="kpi-label">Media pags/dia</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">{daysToFinish || '-'}</div>
              <div className="kpi-label">Dias para acabar</div>
            </div>
          </div>
        )}

        {daysToFinish && daysToFinish > 0 && (
          <div className="text-xs text-muted text-center" style={{ padding: '0 16px 12px' }}>
            A este ritmo terminas el {(() => {
              const d = new Date()
              d.setDate(d.getDate() + daysToFinish)
              return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            })()}
          </div>
        )}

        {recentLog.length > 0 && (
          <>
            <div className="section-header">
              <span className="section-title">Ultimos dias</span>
            </div>
            <div className="flex gap-6 items-end px-16" style={{ paddingBottom: 12 }}>
              {recentLog.map((entry, i) => {
                const barH = Math.max(8, (entry.pages / dailyGoal) * 60)
                const metGoal = entry.pages >= dailyGoal
                return (
                  <div key={i} className="flex-1 flex-col items-center gap-1" style={{ display: 'flex' }}>
                    <span className="text-xs font-700" style={{ color: metGoal ? 'var(--success)' : 'var(--text-muted)' }}>
                      {entry.pages}
                    </span>
                    <div style={{
                      width: '100%', height: barH, borderRadius: 4,
                      background: metGoal ? 'var(--success)' : `${detail.coverColor}60`,
                      transition: 'height 0.3s'
                    }} />
                    <span className="text-0\\.55 text-muted">
                      {entry.date.slice(8)}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="text-xs text-muted text-center mb-3">
              Objetivo: {dailyGoal} pags/dia
            </div>
          </>
        )}

        {/* Reading sessions */}
        {(detail.sessions || []).length > 0 && (
          <>
            <div className="section-header">
              <span className="section-title">Sesiones de lectura</span>
            </div>
            <div className="px-16" style={{ paddingBottom: 12 }}>
              {(detail.sessions || []).slice(0, 10).map((session, i) => (
                <div key={session.id} className="flex items-center gap-10" style={{
                  padding: '8px 0',
                  borderBottom: i < Math.min((detail.sessions || []).length, 10) - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <Clock size={14} style={{ color: detail.coverColor, flexShrink: 0 }} />
                  <div className="flex-1">
                    <span className="text-sm font-600">{session.minutes} min</span>
                    <span className="text-xs text-muted" style={{ marginLeft: 8 }}>
                      {new Date(session.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    {session.type === 'countdown' && (
                      <span className="text-xs" style={{ marginLeft: 6, color: 'var(--primary-light)' }}>temporizador</span>
                    )}
                    {session.type === 'manual' && (
                      <span className="text-xs" style={{ marginLeft: 6, color: 'var(--text-muted)' }}>manual</span>
                    )}
                  </div>
                  <button className="btn-ghost muted opacity-40" onClick={() => {
                    setBooks(books.map(b => {
                      if (b.id !== detail.id) return b
                      return { ...b, sessions: (b.sessions || []).filter(s => s.id !== session.id) }
                    }))
                    readingDb.updateBook(detail.id, { sessions: (detail.sessions || []).filter(s => s.id !== session.id) })
                  }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <button className="btn btn-sm btn-outline mb-2 mx-16" onClick={() => {
          setManualSessionDate(todayStr)
          setManualSessionMinutes('')
          setModal('add-session')
        }}>
          <Plus size={14} /> Anadir sesion manual
        </button>

        {detail.goal && (
          <div className="card">
            <div className="card-title"><Target size={14} /> Objetivo</div>
            <div className="text-sm">{detail.goal}</div>
          </div>
        )}
        {detail.notes && (
          <div className="card">
            <div className="card-title"><BookMarked size={14} /> Notas</div>
            <div className="text-sm">{detail.notes}</div>
          </div>
        )}

        {/* Gallery */}
        <div className="section-header">
          <span className="section-title">Apuntes y fotos</span>
        </div>
        <div className="px-16" style={{ paddingBottom: 12 }}>
          <label className="btn btn-sm btn-outline mb-3" style={{ cursor: 'pointer', display: 'inline-flex' }}>
            <Camera size={14} /> Subir foto
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return
              let url = null
              if (isSupabaseConfigured() && supabase) {
                const ext = file.name.split('.').pop()
                const path = `gallery/${detail.id}/${Date.now()}.${ext}`
                const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file)
                if (!uploadError) {
                  const { data } = supabase.storage.from('uploads').getPublicUrl(path)
                  url = data.publicUrl
                }
              }
              if (!url) {
                url = await new Promise(resolve => {
                  const reader = new FileReader()
                  reader.onload = (ev) => resolve(ev.target.result)
                  reader.readAsDataURL(file)
                })
              }
              const caption = prompt('Descripcion de la foto (opcional):') || ''
              const dbPhoto = await readingDb.addGalleryPhoto(detail.id, url, caption)
              const photo = dbPhoto || { id: Date.now(), url, caption, date: new Date().toISOString() }
              setBooks(prev => prev.map(b => {
                if (b.id !== detail.id) return b
                const gallery = b.gallery || []
                return { ...b, gallery: [...gallery, photo] }
              }))
            }} />
          </label>

          {(detail.gallery || []).length === 0 && (
            <div className="text-muted text-center" style={{ padding: '20px 0', fontSize: '0.82rem' }}>
              Sin fotos. Sube apuntes, pasajes o notas del libro.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
            {(detail.gallery || []).map(photo => (
              <div key={photo.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img
                  src={photo.url}
                  alt={photo.caption || 'Apunte'}
                  onClick={() => setModal('view-photo-' + photo.id)}
                  className="cursor-pointer"
                  style={{ width: '100%', height: 120, objectFit: 'cover' }}
                />
                {photo.caption && (
                  <div className="text-xs" style={{ padding: '4px 6px', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                    {photo.caption}
                  </div>
                )}
                <button
                  className="btn-ghost"
                  onClick={() => {
                    readingDb.deleteGalleryPhoto(photo.id)
                    setBooks(prev => prev.map(b => {
                      if (b.id !== detail.id) return b
                      return { ...b, gallery: (b.gallery || []).filter(p => p.id !== photo.id) }
                    }))
                  }}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={12} color="white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-8 flex-wrap py-8 px-16" style={{ paddingBottom: 20 }}>
          {detail.status !== 'reading' && (
            <button className="btn btn-sm btn-outline" onClick={() => changeStatus(detail.id, 'reading')}>
              <BookOpen size={13} /> Empezar a leer
            </button>
          )}
          {detail.status === 'reading' && (
            <button className="btn btn-sm border-none" style={{ background: 'rgba(0,206,201,0.15)', color: 'var(--success)' }}
              onClick={() => changeStatus(detail.id, 'done')}>
              <Check size={13} /> Marcar como leido
            </button>
          )}
          {detail.status !== 'wishlist' && (
            <button className="btn btn-sm btn-outline" onClick={() => changeStatus(detail.id, 'wishlist')}>
              <Clock size={13} /> Mover a pendientes
            </button>
          )}
          <button className="btn btn-sm border-none" style={{ background: 'rgba(255,118,117,0.12)', color: 'var(--danger)' }}
            onClick={() => handleDelete(detail.id)}>
            <Trash2 size={13} /> Eliminar
          </button>
        </div>

        {modal === 'log-pages' && (() => {
          const logBook = detail || books.find(b => b.id === quickLogBookId)
          if (!logBook) return null
          return (
            <div className="modal-overlay" onClick={() => { closeModal(); setQuickLogBookId(null) }}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>Paginas leidas hoy</h2>
                <div className="form-group">
                  <label>Cuantas paginas has leido</label>
                  <input type="number" value={logPages}
                    className={errors.logPages ? 'input-error' : ''}
                    onChange={e => { setLogPages(e.target.value); setErrors({}) }}
                    placeholder="Ej: 25" autoFocus />
                  {errors.logPages && <div className="error-text">{errors.logPages}</div>}
                </div>
                {logPages && parseInt(logPages) > 0 && !errors.logPages && (
                  <div className="info-box">
                    <span className="text-xs text-muted">Llegaras a la pagina </span>
                    <span className="font-800" style={{ color: logBook.coverColor }}>
                      {Math.min(logBook.currentPage + parseInt(logPages), logBook.totalPages)}
                    </span>
                    <span className="text-xs text-muted"> de {logBook.totalPages}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-block" onClick={() => { closeModal(); setQuickLogBookId(null) }}>Cancelar</button>
                  <button className="btn btn-block text-white border-none" style={{ background: logBook.coverColor }}
                    disabled={!logPages || parseInt(logPages) <= 0}
                    onClick={() => { handleLogPages(logBook.id); setQuickLogBookId(null) }}>Guardar</button>
                </div>
              </div>
            </div>
          )
        })()}

        {modal === 'update-progress' && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Actualizar pagina</h2>
              <div className="form-group">
                <label>Pagina actual (de {detail.totalPages})</label>
                <input type="number" value={updatePages}
                  className={errors.updatePages ? 'input-error' : ''}
                  onChange={e => { setUpdatePages(e.target.value); setErrors({}) }}
                  max={detail.totalPages} autoFocus />
                {errors.updatePages && <div className="error-text">{errors.updatePages}</div>}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
                <button className="btn btn-block text-white border-none" style={{ background: detail.coverColor }}
                  disabled={updatePages === '' || isNaN(parseInt(updatePages))}
                  onClick={() => handleUpdateProgress(detail.id)}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {modal === 'edit-book' && editBook && (
          <div className="modal-overlay" onClick={() => { closeModal(); setEditBook(null) }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Editar libro</h2>
              {/* Cover upload */}
              <div className="flex justify-center mb-4">
                <div onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center cursor-pointer" style={{
                  width: 90, height: 133, borderRadius: 8,
                  background: editBook.cover
                    ? `url(${editBook.cover}) center/cover`
                    : `linear-gradient(135deg, ${editBook.coverColor} 0%, ${editBook.coverColor}aa 100%)`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  border: '2px dashed rgba(255,255,255,0.2)'
                }}>
                  <Camera size={24} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const publicUrl = await readingDb.uploadCover(file)
                  if (publicUrl) {
                    setEditBook({ ...editBook, cover: publicUrl })
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = (ev) => setEditBook({ ...editBook, cover: ev.target.result })
                  reader.readAsDataURL(file)
                }} />
              </div>
              {/* Color */}
              <div className="form-group">
                <label>Color de portada</label>
                <div className="flex gap-6 flex-wrap mt-1">
                  {COVER_COLORS.map(c => (
                    <div key={c} onClick={() => setEditBook({ ...editBook, coverColor: c })} className="cursor-pointer" style={{
                      width: 28, height: 28, borderRadius: 6, background: c,
                      border: editBook.coverColor === c ? '2px solid white' : '2px solid transparent'
                    }} />
                  ))}
                </div>
              </div>
              {/* Fields */}
              <div className="form-group">
                <label>Titulo</label>
                <input value={editBook.title} onChange={e => setEditBook({ ...editBook, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Autor</label>
                <input value={editBook.author || ''} onChange={e => setEditBook({ ...editBook, author: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Total paginas</label>
                <input type="number" value={editBook.totalPages} onChange={e => setEditBook({ ...editBook, totalPages: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label>Objetivo</label>
                <input value={editBook.goal || ''} onChange={e => setEditBook({ ...editBook, goal: e.target.value })} placeholder="Ej: Terminar en 2 semanas" />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea value={editBook.notes || ''} onChange={e => setEditBook({ ...editBook, notes: e.target.value })} rows={3} placeholder="Tus apuntes sobre el libro..." style={{ resize: 'vertical' }} />
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={() => { closeModal(); setEditBook(null) }}>Cancelar</button>
                <button className="btn btn-primary btn-block" onClick={() => {
                  setBooks(books.map(b => b.id === editBook.id ? { ...b, ...editBook } : b))
                  readingDb.updateBook(editBook.id, editBook)
                  closeModal()
                  setEditBook(null)
                }}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* Full-size photo viewer */}
        {(detail.gallery || []).map(photo => (
          modal === 'view-photo-' + photo.id && (
            <div key={photo.id} className="modal-overlay" onClick={closeModal} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', position: 'relative' }}>
                <img src={photo.url} alt={photo.caption || ''} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 12 }} />
                {photo.caption && (
                  <div className="text-sm text-center" style={{ padding: '8px 0', color: 'white' }}>
                    {photo.caption}
                  </div>
                )}
                <button className="btn-ghost" onClick={closeModal} style={{
                  position: 'absolute', top: -12, right: -12, background: 'var(--bg-card)',
                  borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--border)'
                }}>
                  <X size={16} />
                </button>
              </div>
            </div>
          )
        ))}

        {/* Countdown setup modal */}
        {modal === 'set-countdown' && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Temporizador</h2>
              <div className="form-group">
                <label>Minutos de lectura</label>
                <div className="flex gap-8 flex-wrap mt-2">
                  {[10, 15, 20, 30, 45, 60].map(m => (
                    <button key={m}
                      className="btn btn-sm"
                      style={{
                        background: countdownMinutes === m ? `${(detail || {}).coverColor || 'var(--primary)'}25` : 'var(--bg-input)',
                        color: countdownMinutes === m ? ((detail || {}).coverColor || 'var(--primary)') : 'var(--text-muted)',
                        border: countdownMinutes === m ? `1px solid ${(detail || {}).coverColor || 'var(--primary)'}` : '1px solid var(--border)',
                        minWidth: 50,
                      }}
                      onClick={() => setCountdownMinutes(m)}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
                <button className="btn btn-block text-white border-none"
                  style={{ background: (detail || {}).coverColor || 'var(--primary)' }}
                  onClick={() => {
                    setTimerMode('countdown')
                    setCountdownRemaining(countdownMinutes * 60)
                    setTimerBookId(detail?.id || null)
                    closeModal()
                  }}>Iniciar</button>
              </div>
            </div>
          </div>
        )}

        {/* Manual session modal */}
        {modal === 'add-session' && detail && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Anadir sesion de lectura</h2>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" value={manualSessionDate} onChange={e => setManualSessionDate(e.target.value)} max={todayStr} />
              </div>
              <div className="form-group">
                <label>Minutos leidos</label>
                <input type="number" value={manualSessionMinutes} onChange={e => setManualSessionMinutes(e.target.value)} placeholder="Ej: 30" autoFocus />
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
                <button className="btn btn-block text-white border-none"
                  style={{ background: detail.coverColor }}
                  disabled={!manualSessionMinutes || parseInt(manualSessionMinutes) <= 0}
                  onClick={() => {
                    const session = {
                      id: Date.now(),
                      bookId: detail.id,
                      date: manualSessionDate || todayStr,
                      minutes: parseInt(manualSessionMinutes),
                      type: 'manual'
                    }
                    setBooks(books.map(b => {
                      if (b.id !== detail.id) return b
                      const sessions = b.sessions || []
                      return { ...b, sessions: [session, ...sessions] }
                    }))
                    readingDb.updateBook(detail.id, { sessions: [...(detail.sessions || []), session] })
                    closeModal()
                  }}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ========== MAIN VIEW ==========
  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Lectura</h1>
            <p>Tu biblioteca personal</p>
          </div>
          <div className="flex gap-6">
            <button className="btn btn-outline btn-sm" onClick={() => setShowHistory(true)}>
              <Calendar size={14} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => { setTempGoal(''); setGoalModal(true) }}>
              <Settings size={14} />
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => { clearErrors(); setModal('add-book') }}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {error && showError && (
        <div className="error-banner">
          <span>No se pudo conectar con el servidor. Usando datos locales.</span>
          <button className="dismiss" onClick={() => setShowError(false)}>×</button>
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: todayPages >= dailyGoal ? 'var(--success)' : 'var(--warning)' }}>
            {todayPages}/{dailyGoal}
          </div>
          <div className="kpi-label">Pags hoy</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: readingStreak >= 7 ? 'var(--success)' : readingStreak >= 3 ? 'var(--warning)' : 'var(--text)' }}>
            {readingStreak}
          </div>
          <div className="kpi-label">Racha (dias)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{totalPagesRead.toLocaleString()}</div>
          <div className="kpi-label">Pags totales</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{reading.length}</div>
          <div className="kpi-label">Leyendo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value text-success">{done.length}</div>
          <div className="kpi-label">Leidos</div>
        </div>
      </div>

      {/* Weekly mini chart */}
      <div className="px-16" style={{ paddingBottom: 12 }}>
        <div className="flex items-end gap-3" style={{ height: 40 }}>
          {last7.slice().reverse().map((pages, i) => {
            const maxP = Math.max(...last7, dailyGoal)
            const h = maxP > 0 ? Math.max(4, (pages / maxP) * 36) : 4
            const metGoal = pages >= dailyGoal
            const isToday = i === 6
            return (
              <div key={i} className="flex-1 flex-col items-center" style={{ display: 'flex', gap: 2 }}>
                <div style={{
                  width: '100%', height: h, borderRadius: 3,
                  background: metGoal ? 'var(--success)' : pages > 0 ? 'var(--primary)' : 'var(--border)',
                  opacity: isToday ? 1 : 0.7,
                  transition: 'height 0.3s',
                }} />
              </div>
            )
          })}
        </div>
        <div className="flex gap-3">
          {last7.slice().reverse().map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - 6 + i)
            const isToday = i === 6
            return (
              <div key={i} className="flex-1 text-center" style={{
                fontSize: '0.5rem', color: isToday ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isToday ? 700 : 400,
              }}>
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()]}
              </div>
            )
          })}
        </div>
        <div className="text-xs text-muted text-center mt-1" style={{ fontSize: '0.6rem' }}>
          Ultima semana · Objetivo: {dailyGoal} pags/dia
        </div>
      </div>

      {reading.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Leyendo ahora</span>
          </div>
          {reading.map(book => {
            const progress = Math.round((book.currentPage / book.totalPages) * 100)
            const todayEntry = book.dailyLog?.find(l => l.date === todayStr)
            return (
              <div key={book.id} onClick={() => setActiveBook(book.id)} className="flex gap-14 cursor-pointer transition-all mx-16 mb-3 rounded" style={{
                border: `1px solid ${book.coverColor}30`,
                background: `linear-gradient(135deg, ${book.coverColor}08 0%, transparent 100%)`,
                padding: 14
              }}>
                <BookCover book={book} size="sm" />
                <div className="flex-1 min-w-0 flex-col justify-center" style={{ display: 'flex' }}>
                  <div className="font-700 text-md mb-1">{book.title}</div>
                  <div className="text-xs text-muted">{book.author}</div>
                  <div className="progress-bar" style={{ height: 4, margin: '6px 0 4px' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: book.coverColor }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted">{book.currentPage}/{book.totalPages}</span>
                    <span className="text-xs font-700" style={{ color: book.coverColor }}>{progress}%</span>
                  </div>
                  {todayEntry && (
                    <span className="text-xs text-success mt-1">
                      +{todayEntry.pages} pags hoy
                    </span>
                  )}
                  {(() => {
                    const pLeft = book.totalPages - book.currentPage
                    const bookLog = (book.dailyLog || []).slice(0, 7)
                    const bookAvg = bookLog.length > 0 ? Math.round(bookLog.reduce((a, l) => a + l.pages, 0) / bookLog.length) : 0
                    const dLeft = bookAvg > 0 ? Math.ceil(pLeft / bookAvg) : null
                    if (!dLeft || pLeft <= 0) return null
                    return (
                      <span className="text-xs text-muted">
                        ~{dLeft} {dLeft === 1 ? 'dia' : 'dias'} restantes
                      </span>
                    )
                  })()}
                  <button
                    className="btn btn-sm border-none mt-1"
                    style={{ background: `${book.coverColor}20`, color: book.coverColor, padding: '4px 10px', fontSize: '0.7rem' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setQuickLogBookId(book.id)
                      setLogPages('')
                      clearErrors()
                      setModal('log-pages')
                    }}
                  >
                    <Plus size={12} /> Pags hoy
                  </button>
                </div>
              </div>
            )
          })}
        </>
      )}

      {done.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Leidos</span>
          </div>
          <div className="grid-auto-fill-90 px-16" style={{ paddingBottom: 12 }}>
            {done.map(book => (
              <div key={book.id} className="flex-col items-center gap-6" style={{ display: 'flex' }}>
                <BookCover book={book} size="md" onClick={() => setActiveBook(book.id)} />
                <div className="text-0\\.65 font-600 text-center text-muted line-clamp-2 leading-tight" style={{ maxWidth: 100 }}>
                  {book.title}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {wishlist.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Proximas lecturas</span>
          </div>
          <div className="grid-auto-fill-90 px-16" style={{ paddingBottom: 12 }}>
            {wishlist.map(book => (
              <div key={book.id} className="flex-col items-center gap-6" style={{ display: 'flex' }}>
                <BookCover book={book} size="md" onClick={() => setActiveBook(book.id)} />
                <div className="text-0\\.65 font-600 text-center text-muted line-clamp-2 leading-tight" style={{ maxWidth: 100 }}>
                  {book.title}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {books.length === 0 && (
        <div className="empty-state">
          <div className="text-muted mb-3">Anade tu primer libro</div>
          <button className="btn btn-primary" onClick={() => { clearErrors(); setModal('add-book') }}>
            <Plus size={16} /> Libro
          </button>
        </div>
      )}

      {modal === 'add-book' && (
        <div className="modal-overlay" onClick={() => { closeModal(); setCoverPreview(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo libro</h2>

            <div className="flex justify-center mb-4">
              <div onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center cursor-pointer" style={{
                width: 90, height: 133, borderRadius: 8,
                background: coverPreview
                  ? `url(${coverPreview}) center/cover`
                  : `linear-gradient(135deg, ${newBook.coverColor} 0%, ${newBook.coverColor}aa 100%)`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                border: '2px dashed rgba(255,255,255,0.2)'
              }}>
                {!coverPreview && <Camera size={24} style={{ color: 'rgba(255,255,255,0.5)' }} />}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
            </div>

            <div className="form-group">
              <label>Color de portada</label>
              <div className="flex gap-6 flex-wrap mt-1">
                {COVER_COLORS.map(c => (
                  <div key={c} onClick={() => setNewBook({ ...newBook, coverColor: c })} className="cursor-pointer" style={{
                    width: 28, height: 28, borderRadius: 6, background: c,
                    border: newBook.coverColor === c ? '2px solid white' : '2px solid transparent'
                  }} />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Titulo *</label>
              <input value={newBook.title}
                className={errors.title ? 'input-error' : ''}
                onChange={e => { setNewBook({ ...newBook, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: null }) }}
                placeholder="Nombre del libro" autoFocus />
              {errors.title && <div className="error-text">{errors.title}</div>}
            </div>
            <div className="form-group">
              <label>Autor</label>
              <input value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} placeholder="Nombre del autor" />
            </div>
            <div className="form-group">
              <label>Total de paginas *</label>
              <input type="number" value={newBook.totalPages}
                className={errors.totalPages ? 'input-error' : ''}
                onChange={e => { setNewBook({ ...newBook, totalPages: e.target.value }); if (errors.totalPages) setErrors({ ...errors, totalPages: null }) }}
                placeholder="Ej: 300" />
              {errors.totalPages && <div className="error-text">{errors.totalPages}</div>}
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select value={newBook.status} onChange={e => setNewBook({ ...newBook, status: e.target.value })}>
                <option value="wishlist">Quiero leer</option>
                <option value="reading">Leyendo</option>
                <option value="done">Ya leido</option>
              </select>
            </div>
            <div className="form-group">
              <label>Objetivo (opcional)</label>
              <input value={newBook.goal} onChange={e => setNewBook({ ...newBook, goal: e.target.value })} placeholder="Ej: Terminar en 2 semanas" />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => { closeModal(); setCoverPreview(null) }}>Cancelar</button>
              <button className="btn btn-primary btn-block"
                onClick={handleAddBook}>Anadir</button>
            </div>
          </div>
        </div>
      )}

      {/* Main view log-pages modal (from quick log button) */}
      {modal === 'log-pages' && !detail && (() => {
        const logBook = books.find(b => b.id === quickLogBookId)
        if (!logBook) return null
        return (
          <div className="modal-overlay" onClick={() => { closeModal(); setQuickLogBookId(null) }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Paginas leidas hoy</h2>
              <div className="form-group">
                <label>Cuantas paginas has leido</label>
                <input type="number" value={logPages}
                  className={errors.logPages ? 'input-error' : ''}
                  onChange={e => { setLogPages(e.target.value); setErrors({}) }}
                  placeholder="Ej: 25" autoFocus />
                {errors.logPages && <div className="error-text">{errors.logPages}</div>}
              </div>
              {logPages && parseInt(logPages) > 0 && !errors.logPages && (
                <div className="info-box">
                  <span className="text-xs text-muted">Llegaras a la pagina </span>
                  <span className="font-800" style={{ color: logBook.coverColor }}>
                    {Math.min(logBook.currentPage + parseInt(logPages), logBook.totalPages)}
                  </span>
                  <span className="text-xs text-muted"> de {logBook.totalPages}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button className="btn btn-outline btn-block" onClick={() => { closeModal(); setQuickLogBookId(null) }}>Cancelar</button>
                <button className="btn btn-block text-white border-none" style={{ background: logBook.coverColor }}
                  disabled={!logPages || parseInt(logPages) <= 0}
                  onClick={() => { handleLogPages(logBook.id); setQuickLogBookId(null) }}>Guardar</button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Daily goal config modal */}
      {goalModal && (
        <div className="modal-overlay" onClick={() => setGoalModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Objetivo diario</h2>
            <div className="form-group">
              <label>Paginas por dia</label>
              <input type="number" value={tempGoal} onChange={e => setTempGoal(e.target.value)}
                placeholder={String(dailyGoal)} autoFocus />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => setGoalModal(false)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={() => {
                const val = parseInt(tempGoal)
                if (val > 0) {
                  setDailyGoal(val)
                  appStateDb.set('reading_daily_goal', val)
                }
                setGoalModal(false)
              }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Reading history calendar modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="flex justify-between items-center mb-3">
              <h2 style={{ margin: 0 }}>Historial de lectura</h2>
              <button className="btn-ghost muted p-0" onClick={() => setShowHistory(false)}><X size={18} /></button>
            </div>
            <div className="flex justify-between items-center mb-3">
              <button className="btn-ghost muted p-0" onClick={() => {
                if (histCalMonth === 0) { setHistCalMonth(11); setHistCalYear(histCalYear - 1) }
                else setHistCalMonth(histCalMonth - 1)
              }}><ChevronLeft size={18} /></button>
              <span className="font-700" style={{ textTransform: 'capitalize' }}>
                {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][histCalMonth]} {histCalYear}
              </span>
              <button className="btn-ghost muted p-0" onClick={() => {
                if (histCalMonth === 11) { setHistCalMonth(0); setHistCalYear(histCalYear + 1) }
                else setHistCalMonth(histCalMonth + 1)
              }}><ChevronRight size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
              {['L','M','X','J','V','S','D'].map(d => (
                <div key={d} className="text-center text-muted font-700" style={{ fontSize: '0.6rem', padding: '4px 0' }}>{d}</div>
              ))}
            </div>
            {(() => {
              const first = new Date(histCalYear, histCalMonth, 1)
              const last = new Date(histCalYear, histCalMonth + 1, 0)
              const weeks = []
              let week = new Array((first.getDay() + 6) % 7).fill(null)
              for (let d = 1; d <= last.getDate(); d++) {
                week.push(d)
                if (week.length === 7) { weeks.push(week); week = [] }
              }
              if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week) }

              const dateMap = {}
              books.forEach(b => {
                (b.dailyLog || []).forEach(l => {
                  if (!dateMap[l.date]) dateMap[l.date] = { pages: 0, books: [] }
                  dateMap[l.date].pages += l.pages
                  if (!dateMap[l.date].books.includes(b.title)) dateMap[l.date].books.push(b.title)
                })
              })

              return weeks.map((w, wi) => (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
                  {w.map((day, di) => {
                    if (day === null) return <div key={di} />
                    const dateStr = `${histCalYear}-${String(histCalMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const info = dateMap[dateStr]
                    const isToday = dateStr === todayStr
                    const hasData = !!info
                    return (
                      <div key={di} style={{
                        aspectRatio: '1', borderRadius: 6, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        background: hasData ? (info.pages >= dailyGoal ? 'rgba(0,206,201,0.2)' : 'rgba(108,92,231,0.15)') : 'transparent',
                        border: isToday ? '2px solid var(--primary)' : '2px solid transparent',
                        position: 'relative',
                      }} title={hasData ? `${info.pages} pags - ${info.books.join(', ')}` : ''}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: isToday ? 800 : hasData ? 600 : 400,
                          color: hasData ? 'var(--text)' : 'var(--text-muted)'
                        }}>{day}</span>
                        {hasData && (
                          <span style={{
                            fontSize: '0.45rem', fontWeight: 700, marginTop: -1,
                            color: info.pages >= dailyGoal ? 'var(--success)' : 'var(--primary-light)'
                          }}>{info.pages}p</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))
            })()}
            <div className="text-xs text-muted text-center mt-2">
              Hover sobre un dia para ver detalles
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReadingPage
