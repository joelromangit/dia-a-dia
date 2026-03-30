import { useState, useRef } from 'react'
import {
  Plus, BookOpen, Check, Target, Trash2, Edit3, X,
  Camera, BookMarked, Clock, TrendingUp, ChevronLeft
} from 'lucide-react'
import { mockReading } from '../data/mockData'
import { useDb } from '../hooks/useDb'
import { readingDb } from '../lib/db'

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
      background: book.cover
        ? `url(${book.cover}) center/cover no-repeat`
        : `linear-gradient(135deg, ${book.coverColor} 0%, ${book.coverColor}aa 100%)`,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      transition: 'transform 0.2s',
      filter: isWishlist ? 'grayscale(0.3) opacity(0.7)' : 'none'
    }} className={onClick ? 'cursor-pointer' : 'cursor-default'}>
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
  const [coverPreview, setCoverPreview] = useState(null)
  const [showError, setShowError] = useState(true)
  const [errors, setErrors] = useState({})

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

  const handleAddBook = () => {
    if (!validateAddBook()) return
    const book = {
      id: Date.now(),
      ...newBook,
      cover: coverPreview,
      totalPages: parseInt(newBook.totalPages),
      currentPage: 0,
      startDate: newBook.status === 'reading' ? todayStr : null,
      notes: '',
      dailyLog: []
    }
    setBooks([...books, book])
    readingDb.addBook(book)
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
    if (pagesRead > 0) {
      readingDb.logPages(bookId, todayStr, pagesRead)
    }
    setUpdatePages('')
    closeModal()
  }

  const handleLogPages = (bookId) => {
    const book = books.find(b => b.id === bookId)
    if (!validateLogPages(book)) return
    const pages = parseInt(logPages)
    const newCurrent = Math.min(book.currentPage + pages, book.totalPages)
    const status = newCurrent >= book.totalPages ? 'done' : book.status
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
    readingDb.logPages(bookId, todayStr, pages)
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
    const url = await readingDb.uploadCover(file)
    if (url) {
      setCoverPreview(url)
    } else {
      const reader = new FileReader()
      reader.onload = (ev) => setCoverPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
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
            <BookCover book={detail} size="lg" />
            <div className="flex-1 flex-col justify-end" style={{ display: 'flex' }}>
              <div className="font-800 leading-tight mb-2" style={{ fontSize: '1.2rem' }}>{detail.title}</div>
              <div className="text-sm text-muted mb-2">{detail.author}</div>

              {detail.status === 'reading' && (
                <>
                  <div className="font-900 leading-1" style={{ fontSize: '2rem', color: detail.coverColor }}>{progress}%</div>
                  <div className="progress-bar" style={{ height: 6, margin: '6px 0' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: detail.coverColor, transition: 'width 0.3s' }} />
                  </div>
                  <div className="text-xs text-muted">{detail.currentPage}/{detail.totalPages} pags · {pagesLeft} restantes</div>
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

        {modal === 'log-pages' && (
          <div className="modal-overlay" onClick={closeModal}>
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
                  <span className="font-800" style={{ color: detail.coverColor }}>
                    {Math.min(detail.currentPage + parseInt(logPages), detail.totalPages)}
                  </span>
                  <span className="text-xs text-muted"> de {detail.totalPages}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
                <button className="btn btn-block text-white border-none" style={{ background: detail.coverColor }}
                  disabled={!logPages || parseInt(logPages) <= 0}
                  onClick={() => handleLogPages(detail.id)}>Guardar</button>
              </div>
            </div>
          </div>
        )}

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
          <button className="btn btn-primary btn-sm" onClick={() => { clearErrors(); setModal('add-book') }}>
            <Plus size={14} />
          </button>
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
          <div className="kpi-value" style={{ color: avgPages >= dailyGoal ? 'var(--success)' : 'var(--text)' }}>
            {avgPages}
          </div>
          <div className="kpi-label">Media/dia</div>
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
                disabled={!newBook.title.trim() || !newBook.totalPages || parseInt(newBook.totalPages) <= 0}
                onClick={handleAddBook}>Anadir</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReadingPage
