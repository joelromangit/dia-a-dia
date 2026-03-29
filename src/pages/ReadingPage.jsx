import { useState } from 'react'
import { BookOpen, Plus, Target, Check, ChevronRight } from 'lucide-react'
import { mockReading } from '../data/mockData'

function ReadingPage() {
  const [books, setBooks] = useState(mockReading.books)
  const [showModal, setShowModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(null)
  const [newBook, setNewBook] = useState({ title: '', author: '', totalPages: '', goal: '' })
  const [updatePages, setUpdatePages] = useState('')

  const activeBooks = books.filter(b => b.currentPage < b.totalPages)
  const completedBooks = books.filter(b => b.currentPage >= b.totalPages)
  const totalPagesRead = books.reduce((acc, b) => acc + b.currentPage, 0)

  const handleAddBook = () => {
    if (!newBook.title || !newBook.totalPages) return
    setBooks([...books, {
      id: Date.now(),
      ...newBook,
      totalPages: parseInt(newBook.totalPages),
      currentPage: 0,
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    }])
    setNewBook({ title: '', author: '', totalPages: '', goal: '' })
    setShowModal(false)
  }

  const handleUpdatePages = (bookId) => {
    if (!updatePages) return
    setBooks(books.map(b =>
      b.id === bookId
        ? { ...b, currentPage: Math.min(parseInt(updatePages), b.totalPages) }
        : b
    ))
    setUpdatePages('')
    setShowUpdateModal(null)
  }

  return (
    <>
      <div className="page-header">
        <h1>Lectura</h1>
        <p>Tu progreso de lectura</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">{activeBooks.length}</div>
          <div className="kpi-label">Libros activos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{completedBooks.length}</div>
          <div className="kpi-label">Completados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{totalPagesRead}</div>
          <div className="kpi-label">Paginas leidas</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{mockReading.dailyGoalPages}</div>
          <div className="kpi-label">Obj. diario (pags)</div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Leyendo ahora</span>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Anadir
        </button>
      </div>

      {activeBooks.map(book => {
        const progress = Math.round((book.currentPage / book.totalPages) * 100)
        const progressClass = progress >= 75 ? 'success' : progress >= 40 ? 'warning' : 'primary'
        return (
          <div className="card" key={book.id} onClick={() => { setShowUpdateModal(book.id); setUpdatePages(String(book.currentPage)) }}>
            <div className="card-title">
              <BookOpen size={16} />
              {book.title}
            </div>
            <div className="card-subtitle">{book.author}</div>
            <div className="progress-bar">
              <div className={`progress-fill ${progressClass}`} style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">{book.currentPage}/{book.totalPages} paginas</span>
              <span className={`badge badge-${progressClass}`}>{progress}%</span>
            </div>
            {book.goal && (
              <div className="flex items-center gap-2 mt-2">
                <Target size={12} style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs text-muted">{book.goal}</span>
              </div>
            )}
          </div>
        )
      })}

      {completedBooks.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Completados</span>
          </div>
          {completedBooks.map(book => (
            <div className="card" key={book.id}>
              <div className="card-title">
                <Check size={16} style={{ color: 'var(--success)' }} />
                {book.title}
              </div>
              <div className="card-subtitle">{book.author} - {book.totalPages} paginas</div>
              {book.notes && <div className="text-xs text-muted mt-2">"{book.notes}"</div>}
            </div>
          ))}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo libro</h2>
            <div className="form-group">
              <label>Titulo</label>
              <input value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} placeholder="Nombre del libro" />
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
              <label>Objetivo</label>
              <input value={newBook.goal} onChange={e => setNewBook({ ...newBook, goal: e.target.value })} placeholder="Ej: Terminar en 2 semanas" />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleAddBook}>Anadir</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Actualizar progreso</h2>
            <div className="form-group">
              <label>Pagina actual</label>
              <input type="number" value={updatePages} onChange={e => setUpdatePages(e.target.value)} placeholder="Pagina en la que vas" />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline btn-block" onClick={() => setShowUpdateModal(null)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={() => handleUpdatePages(showUpdateModal)}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReadingPage
