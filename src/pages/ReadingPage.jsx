import { useState, useRef } from 'react'
import {
  Plus, BookOpen, Check, Target, Trash2, Edit3, X,
  Camera, BookMarked, Clock, TrendingUp, ChevronLeft
} from 'lucide-react'
import { mockReading } from '../data/mockData'

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
      width: s.width, height: s.height, borderRadius: 8, cursor: onClick ? 'pointer' : 'default',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      background: book.cover
        ? `url(${book.cover}) center/cover no-repeat`
        : `linear-gradient(135deg, ${book.coverColor} 0%, ${book.coverColor}aa 100%)`,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      transition: 'transform 0.2s',
      filter: isWishlist ? 'grayscale(0.3) opacity(0.7)' : 'none'
    }}>
      {/* Title overlay when no cover image */}
      {!book.cover && (
        <div style={{
          position: 'absolute', inset: 0, padding: size === 'sm' ? 6 : 10,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'
        }}>
          <div style={{
            fontSize: s.fontSize, fontWeight: 800, lineHeight: 1.2,
            color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
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

      {/* Done badge */}
      {isDone && (
        <div style={{
          position: 'absolute', top: 4, right: 4,
          width: size === 'sm' ? 18 : 24, height: size === 'sm' ? 18 : 24,
          borderRadius: '50%', background: 'var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          <Check size={size === 'sm' ? 10 : 14} color="white" />
        </div>
      )}

      {/* Progress bar at bottom for reading books */}
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

      {/* Wishlist indicator */}
      {isWishlist && (
        <div style={{
          position: 'absolute', top: 4, right: 4,
          padding: '2px 6px', borderRadius: 6,
          background: 'rgba(0,0,0,0.6)', fontSize: '0.5rem',
          color: 'white', fontWeight: 700
        }}>
          PENDIENTE
        </div>
      )}
    </div>
  )
}

function ReadingPage() {
  const [books, setBooks] = useState(mockReading.books)
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

  const reading = books.filter(b => b.status === 'reading')
  const done = books.filter(b => b.status === 'done')
  const wishlist = books.filter(b => b.status === 'wishlist')
  const totalPagesRead = books.reduce((a, b) => a + b.currentPage, 0)

  // Today's pages read
  const todayStr = new Date().toISOString().split('T')[0]
  const todayPages = books.reduce((acc, b) => {
    const entry = b.dailyLog?.find(l => l.date === todayStr)
    return acc + (entry ? entry.pages : 0)
  }, 0)

  // Average pages/day last 7 days
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

  // Handlers
  const handleAddBook = () => {
    if (!newBook.title || !newBook.totalPages) return
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
    setNewBook({ title: '', author: '', totalPages: '', goal: '', coverColor: '#8b5cf6', status: 'wishlist' })
    setCoverPreview(null)
    setModal(null)
  }

  const handleUpdateProgress = (bookId) => {
    const pages = parseInt(updatePages)
    if (isNaN(pages)) return
    setBooks(books.map(b => {
      if (b.id !== bookId) return b
      const newCurrent = Math.min(pages, b.totalPages)
      const pagesRead = newCurrent - b.currentPage
      const log = pagesRead > 0
        ? [{ date: todayStr, pages: pagesRead }, ...(b.dailyLog || []).filter(l => l.date !== todayStr)]
        : b.dailyLog || []
      return {
        ...b,
        currentPage: newCurrent,
        status: newCurrent >= b.totalPages ? 'done' : b.status,
        dailyLog: log
      }
    }))
    setUpdatePages('')
    setModal(null)
  }

  const handleLogPages = (bookId) => {
    const pages = parseInt(logPages)
    if (isNaN(pages) || pages <= 0) return
    setBooks(books.map(b => {
      if (b.id !== bookId) return b
      const newCurrent = Math.min(b.currentPage + pages, b.totalPages)
      const existing = (b.dailyLog || []).find(l => l.date === todayStr)
      const log = existing
        ? (b.dailyLog || []).map(l => l.date === todayStr ? { ...l, pages: l.pages + pages } : l)
        : [{ date: todayStr, pages }, ...(b.dailyLog || [])]
      return {
        ...b,
        currentPage: newCurrent,
        status: newCurrent >= b.totalPages ? 'done' : b.status,
        dailyLog: log
      }
    }))
    setLogPages('')
    setModal(null)
  }

  const changeStatus = (bookId, status) => {
    setBooks(books.map(b => {
      if (b.id !== bookId) return b
      return {
        ...b,
        status,
        startDate: status === 'reading' && !b.startDate ? todayStr : b.startDate,
        currentPage: status === 'done' ? b.totalPages : b.currentPage
      }
    }))
  }

  const handleDelete = (bookId) => {
    setBooks(books.filter(b => b.id !== bookId))
    setActiveBook(null)
  }

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCoverPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  // ========== DETAIL VIEW ==========
  if (detail) {
    const progress = detail.totalPages > 0 ? Math.round((detail.currentPage / detail.totalPages) * 100) : 0
    const pagesLeft = detail.totalPages - detail.currentPage
    const daysToFinish = dailyGoal > 0 ? Math.ceil(pagesLeft / dailyGoal) : null
    const recentLog = (detail.dailyLog || []).slice(0, 7)

    return (
      <>
        <div style={{ padding: '16px' }}>
          <button onClick={() => setActiveBook(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={18} /> Volver
          </button>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <BookCover book={detail} size="lg" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>{detail.title}</div>
              <div className="text-sm text-muted" style={{ marginBottom: 8 }}>{detail.author}</div>

              {detail.status === 'reading' && (
                <>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: detail.coverColor, lineHeight: 1 }}>{progress}%</div>
                  <div className="progress-bar" style={{ height: 6, margin: '6px 0' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: detail.coverColor, transition: 'width 0.3s' }} />
                  </div>
                  <div className="text-xs text-muted">{detail.currentPage}/{detail.totalPages} pags · {pagesLeft} restantes</div>
                </>
              )}
              {detail.status === 'done' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={18} style={{ color: 'var(--success)' }} />
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>Leido</span>
                </div>
              )}
              {detail.status === 'wishlist' && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>En lista de espera</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        {detail.status === 'reading' && (
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
            <button className="btn btn-sm btn-block" style={{ background: `${detail.coverColor}20`, color: detail.coverColor, border: 'none' }}
              onClick={() => { setLogPages(''); setModal('log-pages') }}>
              <Plus size={14} /> Paginas hoy
            </button>
            <button className="btn btn-sm btn-block btn-outline"
              onClick={() => { setUpdatePages(String(detail.currentPage)); setModal('update-progress') }}>
              <Edit3 size={14} /> Pagina actual
            </button>
          </div>
        )}

        {/* KPIs for reading books */}
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

        {/* Daily log */}
        {recentLog.length > 0 && (
          <>
            <div className="section-header">
              <span className="section-title">Ultimos dias</span>
            </div>
            <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, alignItems: 'flex-end' }}>
              {recentLog.map((entry, i) => {
                const barH = Math.max(8, (entry.pages / dailyGoal) * 60)
                const metGoal = entry.pages >= dailyGoal
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span className="text-xs" style={{ fontWeight: 700, color: metGoal ? 'var(--success)' : 'var(--text-muted)' }}>
                      {entry.pages}
                    </span>
                    <div style={{
                      width: '100%', height: barH, borderRadius: 4,
                      background: metGoal ? 'var(--success)' : `${detail.coverColor}60`,
                      transition: 'height 0.3s'
                    }} />
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                      {entry.date.slice(8)}
                    </span>
                  </div>
                )
              })}
            </div>
            {/* Goal line label */}
            <div className="text-xs text-muted" style={{ textAlign: 'center', marginBottom: 12 }}>
              Objetivo: {dailyGoal} pags/dia
            </div>
          </>
        )}

        {/* Goal & notes */}
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

        {/* Status change / delete */}
        <div style={{ padding: '8px 16px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {detail.status !== 'reading' && (
            <button className="btn btn-sm btn-outline" onClick={() => changeStatus(detail.id, 'reading')}>
              <BookOpen size={13} /> Empezar a leer
            </button>
          )}
          {detail.status === 'reading' && (
            <button className="btn btn-sm" style={{ background: 'rgba(0,206,201,0.15)', color: 'var(--success)', border: 'none' }}
              onClick={() => changeStatus(detail.id, 'done')}>
              <Check size={13} /> Marcar como leido
            </button>
          )}
          {detail.status !== 'wishlist' && (
            <button className="btn btn-sm btn-outline" onClick={() => changeStatus(detail.id, 'wishlist')}>
              <Clock size={13} /> Mover a pendientes
            </button>
          )}
          <button className="btn btn-sm" style={{ background: 'rgba(255,118,117,0.12)', color: 'var(--danger)', border: 'none' }}
            onClick={() => handleDelete(detail.id)}>
            <Trash2 size={13} /> Eliminar
          </button>
        </div>

        {/* Log pages modal */}
        {modal === 'log-pages' && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Paginas leidas hoy</h2>
              <div className="form-group">
                <label>Cuantas paginas has leido</label>
                <input type="number" value={logPages} onChange={e => setLogPages(e.target.value)}
                  placeholder="Ej: 25" autoFocus />
              </div>
              {logPages && parseInt(logPages) > 0 && (
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-input)', textAlign: 'center', marginBottom: 12 }}>
                  <span className="text-xs text-muted">Llegaras a la pagina </span>
                  <span style={{ fontWeight: 800, color: detail.coverColor }}>
                    {Math.min(detail.currentPage + parseInt(logPages), detail.totalPages)}
                  </span>
                  <span className="text-xs text-muted"> de {detail.totalPages}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button className="btn btn-outline btn-block" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn btn-block" style={{ background: detail.coverColor, color: 'white', border: 'none' }}
                  onClick={() => handleLogPages(detail.id)}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* Update progress modal */}
        {modal === 'update-progress' && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>Actualizar pagina</h2>
              <div className="form-group">
                <label>Pagina actual (de {detail.totalPages})</label>
                <input type="number" value={updatePages} onChange={e => setUpdatePages(e.target.value)}
                  max={detail.totalPages} autoFocus />
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-outline btn-block" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn btn-block" style={{ background: detail.coverColor, color: 'white', border: 'none' }}
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
          <button className="btn btn-primary btn-sm" onClick={() => setModal('add-book')}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Today KPIs */}
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
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{done.length}</div>
          <div className="kpi-label">Leidos</div>
        </div>
      </div>

      {/* Currently reading */}
      {reading.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Leyendo ahora</span>
          </div>
          {reading.map(book => {
            const progress = Math.round((book.currentPage / book.totalPages) * 100)
            const todayEntry = book.dailyLog?.find(l => l.date === todayStr)
            return (
              <div key={book.id} onClick={() => setActiveBook(book.id)} style={{
                margin: '0 16px 12px', borderRadius: 'var(--radius)',
                border: `1px solid ${book.coverColor}30`,
                background: `linear-gradient(135deg, ${book.coverColor}08 0%, transparent 100%)`,
                padding: '14px', display: 'flex', gap: 14, cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>
                <BookCover book={book} size="sm" />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{book.title}</div>
                  <div className="text-xs text-muted">{book.author}</div>
                  <div className="progress-bar" style={{ height: 4, margin: '6px 0 4px' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: book.coverColor }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted">{book.currentPage}/{book.totalPages}</span>
                    <span className="text-xs" style={{ fontWeight: 700, color: book.coverColor }}>{progress}%</span>
                  </div>
                  {todayEntry && (
                    <span className="text-xs" style={{ color: 'var(--success)', marginTop: 2 }}>
                      +{todayEntry.pages} pags hoy
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}

      {/* Completed - grid */}
      {done.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Leidos</span>
          </div>
          <div style={{
            padding: '0 16px 12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: 12
          }}>
            {done.map(book => (
              <div key={book.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <BookCover book={book} size="md" onClick={() => setActiveBook(book.id)} />
                <div style={{
                  fontSize: '0.65rem', fontWeight: 600, textAlign: 'center',
                  lineHeight: 1.2, color: 'var(--text-muted)', maxWidth: 100,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>
                  {book.title}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Wishlist - grid */}
      {wishlist.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Proximas lecturas</span>
          </div>
          <div style={{
            padding: '0 16px 12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: 12
          }}>
            {wishlist.map(book => (
              <div key={book.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <BookCover book={book} size="md" onClick={() => setActiveBook(book.id)} />
                <div style={{
                  fontSize: '0.65rem', fontWeight: 600, textAlign: 'center',
                  lineHeight: 1.2, color: 'var(--text-muted)', maxWidth: 100,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>
                  {book.title}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {books.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <div className="text-muted" style={{ marginBottom: 12 }}>Anade tu primer libro</div>
          <button className="btn btn-primary" onClick={() => setModal('add-book')}>
            <Plus size={16} /> Libro
          </button>
        </div>
      )}

      {/* Add book modal */}
      {modal === 'add-book' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo libro</h2>

            {/* Cover preview + upload */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div onClick={() => fileInputRef.current?.click()} style={{
                width: 90, height: 133, borderRadius: 8, cursor: 'pointer',
                background: coverPreview
                  ? `url(${coverPreview}) center/cover`
                  : `linear-gradient(135deg, ${newBook.coverColor} 0%, ${newBook.coverColor}aa 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                border: '2px dashed rgba(255,255,255,0.2)'
              }}>
                {!coverPreview && <Camera size={24} style={{ color: 'rgba(255,255,255,0.5)' }} />}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
            </div>

            {/* Color picker for placeholder */}
            <div className="form-group">
              <label>Color de portada</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {COVER_COLORS.map(c => (
                  <div key={c} onClick={() => setNewBook({ ...newBook, coverColor: c })} style={{
                    width: 28, height: 28, borderRadius: 6, background: c, cursor: 'pointer',
                    border: newBook.coverColor === c ? '2px solid white' : '2px solid transparent'
                  }} />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Titulo</label>
              <input value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} placeholder="Nombre del libro" autoFocus />
            </div>
            <div className="form-group">
              <label>Autor</label>
              <input value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} placeholder="Nombre del autor" />
            </div>
            <div className="form-group">
              <label>Total de paginas</label>
              <input type="number" value={newBook.totalPages} onChange={e => setNewBook({ ...newBook, totalPages: e.target.value })} placeholder="Ej: 300" />
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
              <button className="btn btn-outline btn-block" onClick={() => { setModal(null); setCoverPreview(null) }}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleAddBook}>Anadir</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReadingPage
