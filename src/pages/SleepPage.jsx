import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Moon, Sun, Settings, Plus, Trash2, Edit3, X,
  ChevronLeft, ChevronRight, Check, AlertTriangle
} from 'lucide-react'
import { mockSleep } from '../data/mockData'

const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

// Calculate hours slept from bedtime/wakeup strings
function calcHours(bedtime, wakeup) {
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeup.split(':').map(Number)
  let bedMin = bh * 60 + bm
  let wakeMin = wh * 60 + wm
  if (wakeMin <= bedMin) wakeMin += 24 * 60 // crossed midnight
  return parseFloat(((wakeMin - bedMin) / 60).toFixed(2))
}

// Get the schedule that applies to a given date
function getScheduleForDate(date, schedules) {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay()
  return schedules.find(s => s.days.includes(dayOfWeek)) || null
}

// Format date nicely
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDate()
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${day} ${months[d.getMonth()]}`
}

function getDayName(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return DAY_NAMES[d.getDay()]
}

// Build calendar weeks for a month
function getCalendarWeeks(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const weeks = []
  let week = new Array(first.getDay()).fill(null)
  for (let d = 1; d <= last.getDate(); d++) {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function SleepPage() {
  const [records, setRecords] = useState(mockSleep.records)
  const [schedules, setSchedules] = useState(mockSleep.schedules)
  const [sleeping, setSleeping] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [modal, setModal] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [manualForm, setManualForm] = useState({ date: '', bedtime: '23:00', wakeup: '07:00' })
  const [editForm, setEditForm] = useState(null)
  const [scheduleForm, setScheduleForm] = useState(null)
  const intervalRef = useRef(null)

  // Calendar month navigation
  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const calWeeks = useMemo(() => getCalendarWeeks(calYear, calMonth), [calYear, calMonth])

  // Records indexed by date
  const recordMap = useMemo(() => {
    const m = {}
    records.forEach(r => { m[r.date] = r })
    return m
  }, [records])

  // Timer
  useEffect(() => {
    if (sleeping && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [sleeping, startTime])

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSleepToggle = () => {
    if (!sleeping) {
      setSleeping(true)
      setStartTime(Date.now())
      setElapsed(0)
    } else {
      setSleeping(false)
      clearInterval(intervalRef.current)
      const now = new Date()
      const bedtime = new Date(startTime)
      const record = {
        id: Date.now(),
        date: now.toISOString().split('T')[0],
        bedtime: `${String(bedtime.getHours()).padStart(2, '0')}:${String(bedtime.getMinutes()).padStart(2, '0')}`,
        wakeup: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      }
      setRecords([record, ...records])
      setElapsed(0)
      setStartTime(null)
    }
  }

  const handleCancel = () => {
    setSleeping(false)
    clearInterval(intervalRef.current)
    setElapsed(0)
    setStartTime(null)
  }

  // Manual add
  const handleManualAdd = () => {
    if (!manualForm.date || !manualForm.bedtime || !manualForm.wakeup) return
    const newRec = { id: Date.now(), ...manualForm }
    setRecords(prev => [newRec, ...prev.filter(r => r.date !== manualForm.date)])
    setManualForm({ date: '', bedtime: '23:00', wakeup: '07:00' })
    setModal(null)
  }

  // Edit
  const handleEdit = () => {
    if (!editForm) return
    setRecords(records.map(r => r.id === editForm.id ? { ...editForm } : r))
    setEditForm(null)
    setModal(null)
  }

  // Delete
  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id))
    setSelectedDate(null)
  }

  // Schedules
  const handleSaveSchedule = () => {
    if (!scheduleForm || !scheduleForm.name || scheduleForm.days.length === 0) return
    if (scheduleForm.id) {
      setSchedules(schedules.map(s => s.id === scheduleForm.id ? { ...scheduleForm } : s))
    } else {
      setSchedules([...schedules, { ...scheduleForm, id: Date.now() }])
    }
    setScheduleForm(null)
    setModal(null)
  }

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id))
  }

  // KPIs
  const recentRecords = records.slice(0, 7)
  const avgHours = recentRecords.length > 0
    ? (recentRecords.reduce((a, r) => a + calcHours(r.bedtime, r.wakeup), 0) / recentRecords.length).toFixed(1)
    : '0'

  const getGoalHoursForDate = (date) => {
    const sched = getScheduleForDate(date, schedules)
    return sched ? calcHours(sched.bedtime, sched.wakeup) : 8
  }

  const consistency = recentRecords.length > 0
    ? Math.round((recentRecords.filter(r => {
        const goal = getGoalHoursForDate(r.date)
        return calcHours(r.bedtime, r.wakeup) >= goal - 0.5
      }).length / recentRecords.length) * 100)
    : 0

  // Selected date detail
  const selRecord = selectedDate ? recordMap[selectedDate] : null
  const selSchedule = selectedDate ? getScheduleForDate(selectedDate, schedules) : null

  // Calendar cell color
  const getCellStatus = (dateStr) => {
    const rec = recordMap[dateStr]
    if (!rec) return 'empty'
    const hours = calcHours(rec.bedtime, rec.wakeup)
    const goal = getGoalHoursForDate(dateStr)
    if (hours >= goal - 0.25) return 'good'
    if (hours >= goal - 1) return 'warn'
    return 'bad'
  }

  const todayStr = today.toISOString().split('T')[0]

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Sueno</h1>
            <p>Controla tu descanso</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={() => setModal('schedules')}>
              <Settings size={14} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => {
              setManualForm({ date: todayStr, bedtime: '23:00', wakeup: '07:00' })
              setModal('manual')
            }}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="sleep-timer">
        <div className="timer-label">
          {sleeping ? 'Durmiendo...' : 'Listo para dormir'}
        </div>
        <div className="timer-display">{formatTimer(elapsed)}</div>
        <button className={`sleep-btn ${sleeping ? 'active' : ''}`} onClick={handleSleepToggle}>
          {sleeping ? <Sun size={28} /> : <Moon size={28} />}
          {sleeping ? 'Despertar' : 'Dormir'}
        </button>
        {sleeping && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div className="text-xs text-muted">
              Inicio: {new Date(startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button
              className="btn btn-sm"
              style={{ background: 'rgba(255,118,117,0.15)', color: 'var(--danger)', border: 'none' }}
              onClick={handleCancel}
            >
              <X size={12} /> Cancelar
            </button>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: parseFloat(avgHours) >= 7.5 ? 'var(--success)' : 'var(--warning)' }}>
            {avgHours}h
          </div>
          <div className="kpi-label">Media 7 dias</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value" style={{ color: consistency >= 70 ? 'var(--success)' : consistency >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
            {consistency}%
          </div>
          <div className="kpi-label">Consistencia</div>
        </div>
      </div>

      {/* Schedules summary */}
      {schedules.length > 0 && (
        <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {schedules.map(s => (
            <div key={s.id} style={{
              padding: '6px 12px',
              borderRadius: 10,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              fontSize: '0.72rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 700 }}>{s.name}</span>
              <span className="text-muted"> {s.bedtime} → {s.wakeup}</span>
              <span style={{ color: 'var(--primary-light)', marginLeft: 6 }}>
                {calcHours(s.bedtime, s.wakeup)}h
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Calendar */}
      <div className="section-header">
        <button className="btn btn-sm" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0 }}
          onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }}>
          <ChevronLeft size={18} />
        </button>
        <span className="section-title" style={{ textTransform: 'capitalize' }}>
          {MONTH_NAMES[calMonth]} {calYear}
        </span>
        <button className="btn btn-sm" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0 }}
          onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ padding: '0 16px 4px' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontSize: '0.6rem', fontWeight: 700,
              color: 'var(--text-muted)', padding: '4px 0', textTransform: 'uppercase'
            }}>{d}</div>
          ))}
        </div>
        {/* Weeks */}
        {calWeeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 3 }}>
            {week.map((day, di) => {
              if (day === null) return <div key={di} />
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const status = getCellStatus(dateStr)
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate
              const hasRecord = !!recordMap[dateStr]

              const bg = status === 'good' ? 'rgba(0,206,201,0.25)'
                : status === 'warn' ? 'rgba(253,203,110,0.25)'
                : status === 'bad' ? 'rgba(255,118,117,0.25)'
                : 'transparent'
              const border = isSelected ? '2px solid var(--primary-light)'
                : isToday ? '2px solid var(--primary)'
                : '2px solid transparent'

              return (
                <div
                  key={di}
                  onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    border,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    position: 'relative'
                  }}
                >
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: isToday ? 800 : hasRecord ? 600 : 400,
                    color: hasRecord ? 'var(--text)' : 'var(--text-muted)'
                  }}>{day}</span>
                  {hasRecord && (
                    <span style={{
                      fontSize: '0.5rem',
                      fontWeight: 700,
                      color: status === 'good' ? 'var(--success)' : status === 'warn' ? 'var(--warning)' : 'var(--danger)',
                      marginTop: -1
                    }}>
                      {calcHours(recordMap[dateStr].bedtime, recordMap[dateStr].wakeup).toFixed(1)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ padding: '4px 16px 8px', display: 'flex', justifyContent: 'center', gap: 14 }}>
        {[
          { color: 'rgba(0,206,201,0.5)', label: 'Cumplido' },
          { color: 'rgba(253,203,110,0.5)', label: 'Casi' },
          { color: 'rgba(255,118,117,0.5)', label: 'Fallo' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Selected date detail */}
      {selectedDate && (
        <div style={{
          margin: '0 16px 12px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {getDayName(selectedDate)}, {formatDate(selectedDate)}
              </div>
              {selSchedule && (
                <div className="text-xs text-muted">
                  Objetivo: {selSchedule.bedtime} → {selSchedule.wakeup} ({calcHours(selSchedule.bedtime, selSchedule.wakeup)}h)
                </div>
              )}
            </div>
            {!selRecord && (
              <button className="btn btn-sm btn-primary" onClick={() => {
                setManualForm({ date: selectedDate, bedtime: selSchedule?.bedtime || '23:00', wakeup: selSchedule?.wakeup || '07:00' })
                setModal('manual')
              }}>
                <Plus size={12} /> Anadir
              </button>
            )}
          </div>

          {selRecord ? (() => {
            const hours = calcHours(selRecord.bedtime, selRecord.wakeup)
            const goalH = selSchedule ? calcHours(selSchedule.bedtime, selSchedule.wakeup) : 8
            const diff = hours - goalH
            const status = diff >= -0.25 ? 'good' : diff >= -1 ? 'warn' : 'bad'
            const statusColor = status === 'good' ? 'var(--success)' : status === 'warn' ? 'var(--warning)' : 'var(--danger)'

            return (
              <div style={{ padding: '14px 16px' }}>
                {/* Main time display */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  marginBottom: 14
                }}>
                  {/* Bedtime */}
                  <div style={{ textAlign: 'center' }}>
                    <Moon size={16} style={{ color: 'var(--primary-light)', marginBottom: 4 }} />
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                      {selRecord.bedtime}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Dormir</div>
                  </div>

                  {/* Arrow + hours */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: statusColor,
                      lineHeight: 1
                    }}>
                      {hours.toFixed(1)}h
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: statusColor,
                      marginTop: 2
                    }}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)}h vs obj
                    </div>
                  </div>

                  {/* Wakeup */}
                  <div style={{ textAlign: 'center' }}>
                    <Sun size={16} style={{ color: 'var(--warning)', marginBottom: 4 }} />
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                      {selRecord.wakeup}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Despertar</div>
                  </div>
                </div>

                {/* Visual bar: actual vs goal */}
                {selSchedule && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="text-xs text-muted">Objetivo: {goalH}h</span>
                      <span className="text-xs" style={{ color: statusColor, fontWeight: 700 }}>
                        {status === 'good' ? 'Cumplido' : status === 'warn' ? 'Casi' : 'No cumplido'}
                      </span>
                    </div>
                    <div style={{ position: 'relative', height: 8, background: 'var(--bg-input)', borderRadius: 4 }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 0, height: '100%',
                        width: `${Math.min((hours / goalH) * 100, 100)}%`,
                        background: statusColor, borderRadius: 4, transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                )}

                {/* Schedule comparison */}
                {selSchedule && (
                  <div style={{
                    display: 'flex', gap: 8, marginBottom: 12
                  }}>
                    <div style={{
                      flex: 1, padding: '6px 10px', borderRadius: 8,
                      background: 'var(--bg-input)', fontSize: '0.72rem'
                    }}>
                      <div className="text-xs text-muted" style={{ marginBottom: 2 }}>Hora dormir</div>
                      <span style={{ fontWeight: 700 }}>{selRecord.bedtime}</span>
                      <span className="text-muted"> / {selSchedule.bedtime}</span>
                    </div>
                    <div style={{
                      flex: 1, padding: '6px 10px', borderRadius: 8,
                      background: 'var(--bg-input)', fontSize: '0.72rem'
                    }}>
                      <div className="text-xs text-muted" style={{ marginBottom: 2 }}>Hora despertar</div>
                      <span style={{ fontWeight: 700 }}>{selRecord.wakeup}</span>
                      <span className="text-muted"> / {selSchedule.wakeup}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-outline" style={{ flex: 1 }} onClick={() => {
                    setEditForm({ ...selRecord })
                    setModal('edit')
                  }}>
                    <Edit3 size={13} /> Editar
                  </button>
                  <button className="btn btn-sm" style={{
                    flex: 1, background: 'rgba(255,118,117,0.12)', color: 'var(--danger)', border: 'none'
                  }} onClick={() => handleDelete(selRecord.id)}>
                    <Trash2 size={13} /> Borrar
                  </button>
                </div>
              </div>
            )
          })() : (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <div className="text-xs text-muted">Sin registro este dia</div>
            </div>
          )}
        </div>
      )}

      {/* Manual add modal */}
      {modal === 'manual' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Anadir registro</h2>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={manualForm.date}
                onChange={e => setManualForm({ ...manualForm, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hora de dormir</label>
              <input type="time" value={manualForm.bedtime}
                onChange={e => setManualForm({ ...manualForm, bedtime: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hora de despertar</label>
              <input type="time" value={manualForm.wakeup}
                onChange={e => setManualForm({ ...manualForm, wakeup: e.target.value })} />
            </div>
            {manualForm.bedtime && manualForm.wakeup && (
              <div style={{
                padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)',
                textAlign: 'center', marginBottom: 12
              }}>
                <span className="text-xs text-muted">Horas dormidas: </span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-light)' }}>
                  {calcHours(manualForm.bedtime, manualForm.wakeup).toFixed(1)}h
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-outline btn-block" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleManualAdd}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {modal === 'edit' && editForm && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Editar registro</h2>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={editForm.date}
                onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hora de dormir</label>
              <input type="time" value={editForm.bedtime}
                onChange={e => setEditForm({ ...editForm, bedtime: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hora de despertar</label>
              <input type="time" value={editForm.wakeup}
                onChange={e => setEditForm({ ...editForm, wakeup: e.target.value })} />
            </div>
            {editForm.bedtime && editForm.wakeup && (
              <div style={{
                padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)',
                textAlign: 'center', marginBottom: 12
              }}>
                <span className="text-xs text-muted">Horas dormidas: </span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-light)' }}>
                  {calcHours(editForm.bedtime, editForm.wakeup).toFixed(1)}h
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-outline btn-block" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary btn-block" onClick={handleEdit}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Schedules config modal */}
      {modal === 'schedules' && !scheduleForm && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Horarios de sueno</h2>
            <p className="text-xs text-muted" style={{ marginBottom: 16 }}>
              Configura tus objetivos por dias. Las horas objetivo se calculan automaticamente.
            </p>

            {schedules.map(s => (
              <div key={s.id} style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.name}</div>
                  <div className="text-xs text-muted" style={{ marginTop: 2 }}>
                    {s.days.map(d => DAY_LABELS[d]).join(', ')} · {s.bedtime} → {s.wakeup}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)', marginTop: 2 }}>
                    {calcHours(s.bedtime, s.wakeup)}h objetivo
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-outline" onClick={() => setScheduleForm({ ...s })}>
                    <Edit3 size={12} />
                  </button>
                  <button className="btn btn-sm" style={{ background: 'rgba(255,118,117,0.12)', color: 'var(--danger)', border: 'none' }}
                    onClick={() => handleDeleteSchedule(s.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Check for uncovered days */}
            {(() => {
              const covered = new Set(schedules.flatMap(s => s.days))
              const uncovered = [0,1,2,3,4,5,6].filter(d => !covered.has(d))
              if (uncovered.length === 0) return null
              return (
                <div style={{
                  padding: '8px 12px', borderRadius: 8, background: 'rgba(253,203,110,0.1)',
                  fontSize: '0.72rem', color: 'var(--warning)', marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <AlertTriangle size={14} />
                  Sin horario: {uncovered.map(d => DAY_NAMES[d]).join(', ')}
                </div>
              )
            })()}

            <button className="btn btn-primary btn-block mt-2" onClick={() => {
              const covered = new Set(schedules.flatMap(s => s.days))
              const free = [0,1,2,3,4,5,6].filter(d => !covered.has(d))
              setScheduleForm({ id: null, name: '', days: free.length > 0 ? free : [], bedtime: '23:00', wakeup: '07:00' })
            }}>
              <Plus size={14} /> Nuevo horario
            </button>

            <button className="btn btn-outline btn-block mt-2" onClick={() => setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Schedule edit form */}
      {modal === 'schedules' && scheduleForm && (
        <div className="modal-overlay" onClick={() => { setScheduleForm(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{scheduleForm.id ? 'Editar horario' : 'Nuevo horario'}</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input value={scheduleForm.name} onChange={e => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                placeholder="Ej: Entre semana" autoFocus />
            </div>
            <div className="form-group">
              <label>Dias</label>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {DAY_LABELS.map((label, i) => {
                  const active = scheduleForm.days.includes(i)
                  // Check if another schedule already has this day
                  const taken = schedules.some(s => s.id !== scheduleForm.id && s.days.includes(i))
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (taken) return
                        setScheduleForm({
                          ...scheduleForm,
                          days: active ? scheduleForm.days.filter(d => d !== i) : [...scheduleForm.days, i]
                        })
                      }}
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, cursor: taken ? 'not-allowed' : 'pointer',
                        background: active ? 'var(--primary)' : taken ? 'var(--bg-input)' : 'var(--bg-input)',
                        color: active ? 'white' : taken ? 'var(--border)' : 'var(--text-muted)',
                        border: active ? '2px solid var(--primary)' : '2px solid var(--border)',
                        opacity: taken ? 0.4 : 1,
                        transition: 'all 0.15s'
                      }}
                    >
                      {label}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="form-group">
              <label>Hora de dormir</label>
              <input type="time" value={scheduleForm.bedtime}
                onChange={e => setScheduleForm({ ...scheduleForm, bedtime: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hora de despertar</label>
              <input type="time" value={scheduleForm.wakeup}
                onChange={e => setScheduleForm({ ...scheduleForm, wakeup: e.target.value })} />
            </div>
            {scheduleForm.bedtime && scheduleForm.wakeup && (
              <div style={{
                padding: '10px 12px', borderRadius: 8, background: 'var(--bg-input)',
                textAlign: 'center', marginBottom: 12
              }}>
                <span className="text-xs text-muted">Horas objetivo: </span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-light)' }}>
                  {calcHours(scheduleForm.bedtime, scheduleForm.wakeup).toFixed(1)}h
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-outline btn-block" onClick={() => setScheduleForm(null)}>Volver</button>
              <button className="btn btn-primary btn-block" onClick={handleSaveSchedule}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SleepPage
