import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'

export default function AdminLock() {
  const { isAdmin, login, logout } = useAdmin()
  const [showModal, setShowModal] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleClick() {
    if (isAdmin) {
      logout()
    } else {
      setShowModal(true)
      setPassword('')
      setError('')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (login(password)) {
      setShowModal(false)
    } else {
      setError('Contrasena incorrecta')
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {isAdmin ? (
          <Unlock size={18} color="var(--primary)" />
        ) : (
          <Lock size={18} color="var(--text-muted)" />
        )}
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Modo Admin</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Contrasena"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p style={{ color: 'var(--danger, #ef4444)', fontSize: '0.85rem', marginBottom: 12 }}>
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Entrar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
