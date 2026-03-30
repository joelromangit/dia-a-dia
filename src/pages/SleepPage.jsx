import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Moon, Sun, Settings, Plus, Trash2, Edit3, X,
  ChevronLeft, ChevronRight, Check, AlertTriangle
} from 'lucide-react'
import { mockSleep } from '../data/mockData'
import { useDb } from '../hooks/useDb'
import { sleepDb } from '../lib/db'

const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

function calcHours(bedtime, wakeup) {
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeup.split(':').map(Number)
  let bedMin = bh * 60 + bm
  let wakeMin = wh * 60 + wm
  if (wakeMin <= bedMin) wakeMin += 24 * 60
  return parseFloat(((wakeMin - bedMin) / 60).toFixed(2))
}

function getScheduleForDate(date, schedules) {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay()
  return schedules.find(s => s.days.includes(dayOfWeek)) || null
}

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

const TIME_RE = /^\d{2}:\d{2}$/

function validateManualForm(form, todayStr) {
  const errors = {}
  if (!form.date || !form.date.trim()) errors.date = 'La fecha es obligatoria'
  else if (form.date > todayStr) errors.date = 'La fecha no puede ser futura'
  if (!form.bedtime || !form.bedtime.trim()) errors.bedtime = 'La hora de dormir es obligatoria'
  else if (!TIME_RE.test(form.bedtime)) errors.bedtime = 'Formato invalido (HH:MM)'
  if (!form.wakeup || !form.wakeup.trim()) errors.wakeup = 'La hora de despertar es obligatoria'
  else if (!TIME_RE.test(form.wakeup)) errors.wakeup = 'Formato invalido (HH:MM)'
  return errors
}

function validateScheduleForm(form) {
  const errors = {}
  if (!form.name || !form.name.trim()) errors.name = 'El nombre es obligatorio'
  if (!form.days || form.days.length === 0) errors.days = 'Selecciona al menos un dia'
  if (!form.bedtime || !form.bedtime.trim()) errors.bedtime = 'La hora de dormir es obligatoria'
  else if (!TIME_RE.test(form.bedtime)) errors.bedtime = 'Formato invalido (HH:MM)'
  if (!form.wakeup || !form.wakeup.trim()) errors.wakeup = 'La hora de despertar es obligatoria'
  else if (!TIME_RE.test(form.wakeup)) errors.wakeup = 'Formato invalido (HH:MM)'
  return errors
}

function SleepPage() {
  const [records, setRecords, { loading: loadingRecords, error: errorRecords }] = useDb(sleepDb.getRecords, mockSleep.records)
  const [schedules, setSchedules, { loading: loadingSchedules, error: errorSchedules }] = useDb(sleepDb.getSchedules, mockSleep.schedules)
  const [sleeping, setSleeping] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [modal, setModal] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [manualForm, setManualForm] = useState({ date: '', bedtime: '23:00', wakeup: '07:00' })
  const [editForm, setEditForm] = useState(null)
  const [scheduleForm, setScheduleForm] = useState(null)
  const [showError, setShowError] = useState(true)
  const [formErrors, setFormErrors] = useState({})
  const intervalRef = useRef(null)

  const loading = loadingRecords || loadingSchedules
  const error = errorRecords || errorSchedules

  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const calWeeks = useMemo(() => getCalendarWeeks(calYear, calMonth), [calYear, calMonth])

  const recordMap = useMemo(() => {
    const m = {}
    records.forEach(r => { m[r.date] = r })
    return m
  }, [records])

  useEffect(() => {
    if (sleeping && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [sleeping, startTime])

  useEffect(() => {
    if (error) setShowError(true)
  }, [error])

  const closeModal = () => {
    setModal(null)
    setScheduleForm(null)
    setEditForm(null)
    setFormErrors({})
  }

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
      sleepDb.addRecord(record)
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

  const todayStr = today.toISOString().split('T')[0]

  const handleManualAdd = () => {
    const errs = validateManualForm(manualForm, todayStr)
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return
    const newRec = { id: Date.now(), ...manualForm }
    setRecords(prev => [newRec, ...prev.filter(r => r.date !== manualForm.date)])
    sleepDb.addRecord(manualForm)
    setManualForm({ date: '', bedtime: '23:00', wakeup: '07:00' })
    closeModal()
  }

  const handleEdit = () => {
    if (!editForm) return
    const errs = validateManualForm(editForm, todayStr)
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return
    setRecords(records.map(r => r.id === editForm.id ? { ...editForm } : r))
    sleepDb.updateRecord(editForm.id, { date: editForm.date, bedtime: editForm.bedtime, wakeup: editForm.wakeup })
    setEditForm(null)
    closeModal()
  }

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id))
    sleepDb.deleteRecord(id)
    setSelectedDate(null)
  }

  const handleSaveSchedule = () => {
    if (!scheduleForm) return
    const errs = validateScheduleForm(scheduleForm)
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (scheduleForm.id) {
      setSchedules(schedules.map(s => s.id === scheduleForm.id ? { ...scheduleForm } : s))
      sleepDb.updateSchedule(scheduleForm.id, scheduleForm)
    } else {
      setSchedules([...schedules, { ...scheduleForm, id: Date.now() }])
      sleepDb.addSchedule(scheduleForm)
    }
    setScheduleForm(null)
    closeModal()
  }

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id))
    sleepDb.deleteSchedule(id)
  }

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

  const selRecord = selectedDate ? recordMap[selectedDate] : null
  const selSchedule = selectedDate ? getScheduleForDate(selectedDate, schedules) : null

  const getCellStatus = (dateStr) => {
    const rec = recordMap[dateStr]
    if (!rec) return 'empty'
    const hours = calcHours(rec.bedtime, rec.wakeup)
    const goal = getGoalHoursForDate(dateStr)
    if (hours >= goal - 0.25) return 'good'
    if (hours >= goal - 1) return 'warn'
    return 'bad'
  }

  const manualFormHasErrors = Object.keys(formErrors).length > 0
  const isManualFormInvalid = !manualForm.date?.trim() || !manualForm.bedtime?.trim() || !manualForm.wakeup?.trim()
  const isEditFormInvalid = !editForm?.date?.trim() || !editForm?.bedtime?.trim() || !editForm?.wakeup?.trim()
  const isScheduleFormInvalid = !scheduleForm?.name?.trim() || !scheduleForm?.days?.length || !scheduleForm?.bedtime?.trim() || !scheduleForm?.wakeup?.trim()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Sueno</h1>
            <p>Controla tu descanso</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={() => { setFormErrors({}); setModal('schedules') }}>
              <Settings size={14} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => {
              setManualForm({ date: todayStr, bedtime: '23:00', wakeup: '07:00' })
              setFormErrors({})
              setModal('manual')
            }}>
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
          <div className="flex-col items-center gap-6">
            <div className="text-xs text-muted">
              Inicio: {new Date(startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button
              className="btn btn-sm border-none"
              style={{ background: 'rgba(255,118,117,0.15)', color: 'var(--danger)' }}
              onClick={handleCancel}
            >
              <X size={12} /> Cancelar
            </button>
          </div>
        )}
      </div>

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

      {schedules.length > 0 && (
        <div className="px-16 flex gap-8 overflow-x-auto" style={{ paddingBottom: 8 }}>
          {schedules.map(s => (
            <div key={s.id} className="bg-card border rounded-sm flex-shrink-0 text-nowrap" style={{ padding: '6px 12px', fontSize: '0.72rem' }}>
              <span className="font-700">{s.name}</span>
              <span className="text-muted"> {s.bedtime} → {s.wakeup}</span>
              <span className="text-primary-light" style={{ marginLeft: 6 }}>
                {calcHours(s.bedtime, s.wakeup)}h
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="section-header">
        <button className="btn-ghost muted p-0"
          onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }}>
          <ChevronLeft size={18} />
        </button>
        <span className="section-title" style={{ textTransform: 'capitalize' }}>
          {MONTH_NAMES[calMonth]} {calYear}
        </span>
        <button className="btn-ghost muted p-0"
          onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="px-16" style={{ paddingBottom: 4 }}>
        <div className="grid-7 mb-2">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-0\.6 font-700 text-muted text-uppercase py-8">{d}</div>
          ))}
        </div>
        {calWeeks.map((week, wi) => (
          <div key={wi} className="grid-7" style={{ marginBottom: 3 }}>
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
                  className="flex-col items-center justify-center cursor-pointer transition-all"
                  onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    background: bg,
                    border,
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

      <div className="flex justify-center gap-14 py-8 px-16">
        {[
          { color: 'rgba(0,206,201,0.5)', label: 'Cumplido' },
          { color: 'rgba(253,203,110,0.5)', label: 'Casi' },
          { color: 'rgba(255,118,117,0.5)', label: 'Fallo' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            <span className="text-0\.6 text-muted">{l.label}</span>
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="rounded border bg-card overflow-hidden mx-16 mb-3">
          <div className="flex justify-between items-center border" style={{ padding: '12px 16px', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
            <div>
              <div className="text-md font-700">
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
                setFormErrors({})
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
                <div className="flex items-center justify-center gap-16 mb-3">
                  <div className="text-center">
                    <Moon size={16} style={{ color: 'var(--primary-light)', marginBottom: 4 }} />
                    <div className="font-800 tabular-nums" style={{ fontSize: '1.4rem' }}>
                      {selRecord.bedtime}
                    </div>
                    <div className="text-0\.6 text-muted text-uppercase font-600">Dormir</div>
                  </div>

                  <div className="text-center">
                    <div className="font-900 leading-1" style={{ fontSize: '1.8rem', color: statusColor }}>
                      {hours.toFixed(1)}h
                    </div>
                    <div className="text-0\.65 font-700 mt-1" style={{ color: statusColor }}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)}h vs obj
                    </div>
                  </div>

                  <div className="text-center">
                    <Sun size={16} style={{ color: 'var(--warning)', marginBottom: 4 }} />
                    <div className="font-800 tabular-nums" style={{ fontSize: '1.4rem' }}>
                      {selRecord.wakeup}
                    </div>
                    <div className="text-0\.6 text-muted text-uppercase font-600">Despertar</div>
                  </div>
                </div>

                {selSchedule && (
                  <div className="mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-muted">Objetivo: {goalH}h</span>
                      <span className="text-xs font-700" style={{ color: statusColor }}>
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

                {selSchedule && (
                  <div className="flex gap-8 mb-3">
                    <div className="flex-1 bg-input rounded-sm" style={{ padding: '6px 10px', fontSize: '0.72rem' }}>
                      <div className="text-xs text-muted mb-2">Hora dormir</div>
                      <span className="font-700">{selRecord.bedtime}</span>
                      <span className="text-muted"> / {selSchedule.bedtime}</span>
                    </div>
                    <div className="flex-1 bg-input rounded-sm" style={{ padding: '6px 10px', fontSize: '0.72rem' }}>
                      <div className="text-xs text-muted mb-2">Hora despertar</div>
                      <span className="font-700">{selRecord.wakeup}</span>
                      <span className="text-muted"> / {selSchedule.wakeup}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-8">
                  <button className="btn btn-sm btn-outline flex-1" onClick={() => {
                    setEditForm({ ...selRecord })
                    setFormErrors({})
                    setModal('edit')
                  }}>
                    <Edit3 size={13} /> Editar
                  </button>
                  <button className="btn btn-sm flex-1 border-none" style={{
                    background: 'rgba(255,118,117,0.12)', color: 'var(--danger)'
                  }} onClick={() => handleDelete(selRecord.id)}>
                    <Trash2 size={13} /> Borrar
                  </button>
                </div>
              </div>
            )
          })() : (
            <div className="text-center" style={{ padding: '20px 16px' }}>
              <div className="text-xs text-muted">Sin registro este dia</div>
            </div>
          )}
        </div>
      )}

      {modal === 'manual' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Anadir registro</h2>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={manualForm.date}
                className={formErrors.date ? 'input-error' : ''}
                onChange={e => {
                  setManualForm({ ...manualForm, date: e.target.value })
                  setFormErrors(prev => { const { date, ...rest } = prev; return rest })
                }} />
              {formErrors.date && <div className="error-text">{formErrors.date}</div>}
            </div>
            <div className="form-group">
              <label>Hora de dormir</label>
              <input type="time" value={manualForm.bedtime}
                className={formErrors.bedtime ? 'input-error' : ''}
                onChange={e => {
                  setManualForm({ ...manualForm, bedtime: e.target.value })
                  setFormErrors(prev => { const { bedtime, ...rest } = prev; return rest })
                }} />
              {formErrors.bedtime && <div className="error-text">{formErrors.bedtime}</div>}
            </div>
            <div className="form-group">
              <label>Hora de despertar</label>
              <input type="time" value={manualForm.wakeup}
                className={formErrors.wakeup ? 'input-error' : ''}
                onChange={e => {
                  setManualForm({ ...manualForm, wakeup: e.target.value })
                  setFormErrors(prev => { const { wakeup, ...rest } = prev; return rest })
                }} />
              {formErrors.wakeup && <div className="error-text">{formErrors.wakeup}</div>}
            </div>
            {manualForm.bedtime && manualForm.wakeup && (
              <div className="info-box">
                <span className="text-xs text-muted">Horas dormidas: </span>
                <span className="font-800 text-lg text-primary-light">
                  {calcHours(manualForm.bedtime, manualForm.wakeup).toFixed(1)}h
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary btn-block" disabled={isManualFormInvalid} onClick={handleManualAdd}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'edit' && editForm && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Editar registro</h2>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" value={editForm.date}
                className={formErrors.date ? 'input-error' : ''}
                onChange={e => {
                  setEditForm({ ...editForm, date: e.target.value })
                  setFormErrors(prev => { const { date, ...rest } = prev; return rest })
                }} />
              {formErrors.date && <div className="error-text">{formErrors.date}</div>}
            </div>
            <div className="form-group">
              <label>Hora de dormir</label>
              <input type="time" value={editForm.bedtime}
                className={formErrors.bedtime ? 'input-error' : ''}
                onChange={e => {
                  setEditForm({ ...editForm, bedtime: e.target.value })
                  setFormErrors(prev => { const { bedtime, ...rest } = prev; return rest })
                }} />
              {formErrors.bedtime && <div className="error-text">{formErrors.bedtime}</div>}
            </div>
            <div className="form-group">
              <label>Hora de despertar</label>
              <input type="time" value={editForm.wakeup}
                className={formErrors.wakeup ? 'input-error' : ''}
                onChange={e => {
                  setEditForm({ ...editForm, wakeup: e.target.value })
                  setFormErrors(prev => { const { wakeup, ...rest } = prev; return rest })
                }} />
              {formErrors.wakeup && <div className="error-text">{formErrors.wakeup}</div>}
            </div>
            {editForm.bedtime && editForm.wakeup && (
              <div className="info-box">
                <span className="text-xs text-muted">Horas dormidas: </span>
                <span className="font-800 text-lg text-primary-light">
                  {calcHours(editForm.bedtime, editForm.wakeup).toFixed(1)}h
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-outline btn-block" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary btn-block" disabled={isEditFormInvalid} onClick={handleEdit}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'schedules' && !scheduleForm && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Horarios de sueno</h2>
            <p className="text-xs text-muted mb-4">
              Configura tus objetivos por dias. Las horas objetivo se calculan automaticamente.
            </p>

            {schedules.map(s => (
              <div key={s.id} className="flex justify-between items-center border rounded-sm" style={{ padding: 12, marginBottom: 10 }}>
                <div>
                  <div className="text-0\.85 font-700">{s.name}</div>
                  <div className="text-xs text-muted mt-1">
                    {s.days.map(d => DAY_LABELS[d]).join(', ')} · {s.bedtime} → {s.wakeup}
                  </div>
                  <div className="text-0\.75 font-700 text-primary-light mt-1">
                    {calcHours(s.bedtime, s.wakeup)}h objetivo
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-outline" onClick={() => { setScheduleForm({ ...s }); setFormErrors({}) }}>
                    <Edit3 size={12} />
                  </button>
                  <button className="btn btn-sm border-none" style={{ background: 'rgba(255,118,117,0.12)', color: 'var(--danger)' }}
                    onClick={() => handleDeleteSchedule(s.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {(() => {
              const covered = new Set(schedules.flatMap(s => s.days))
              const uncovered = [0,1,2,3,4,5,6].filter(d => !covered.has(d))
              if (uncovered.length === 0) return null
              return (
                <div className="flex items-center gap-6 rounded-sm mb-3" style={{
                  padding: '8px 12px', background: 'rgba(253,203,110,0.1)',
                  fontSize: '0.72rem', color: 'var(--warning)'
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
              setFormErrors({})
            }}>
              <Plus size={14} /> Nuevo horario
            </button>

            <button className="btn btn-outline btn-block mt-2" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === 'schedules' && scheduleForm && (
        <div className="modal-overlay" onClick={() => { setScheduleForm(null); setFormErrors({}) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{scheduleForm.id ? 'Editar horario' : 'Nuevo horario'}</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input value={scheduleForm.name}
                className={formErrors.name ? 'input-error' : ''}
                onChange={e => {
                  setScheduleForm({ ...scheduleForm, name: e.target.value })
                  setFormErrors(prev => { const { name, ...rest } = prev; return rest })
                }}
                placeholder="Ej: Entre semana" autoFocus />
              {formErrors.name && <div className="error-text">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label>Dias</label>
              <div className="flex gap-6 mt-1">
                {DAY_LABELS.map((label, i) => {
                  const active = scheduleForm.days.includes(i)
                  const taken = schedules.some(s => s.id !== scheduleForm.id && s.days.includes(i))
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center font-700 text-0\.75 transition-all"
                      onClick={() => {
                        if (taken) return
                        setScheduleForm({
                          ...scheduleForm,
                          days: active ? scheduleForm.days.filter(d => d !== i) : [...scheduleForm.days, i]
                        })
                        setFormErrors(prev => { const { days, ...rest } = prev; return rest })
                      }}
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        cursor: taken ? 'not-allowed' : 'pointer',
                        background: active ? 'var(--primary)' : 'var(--bg-input)',
                        color: active ? 'white' : taken ? 'var(--border)' : 'var(--text-muted)',
                        border: active ? '2px solid var(--primary)' : '2px solid var(--border)',
                        opacity: taken ? 0.4 : 1
                      }}
                    >
                      {label}
                    </div>
                  )
                })}
              </div>
              {formErrors.days && <div className="error-text">{formErrors.days}</div>}
            </div>
            <div className="form-group">
              <label>Hora de dormir</label>
              <input type="time" value={scheduleForm.bedtime}
                className={formErrors.bedtime ? 'input-error' : ''}
                onChange={e => {
                  setScheduleForm({ ...scheduleForm, bedtime: e.target.value })
                  setFormErrors(prev => { const { bedtime, ...rest } = prev; return rest })
                }} />
              {formErrors.bedtime && <div className="error-text">{formErrors.bedtime}</div>}
            </div>
            <div className="form-group">
              <label>Hora de despertar</label>
              <input type="time" value={scheduleForm.wakeup}
                className={formErrors.wakeup ? 'input-error' : ''}
                onChange={e => {
                  setScheduleForm({ ...scheduleForm, wakeup: e.target.value })
                  setFormErrors(prev => { const { wakeup, ...rest } = prev; return rest })
                }} />
              {formErrors.wakeup && <div className="error-text">{formErrors.wakeup}</div>}
            </div>
            {scheduleForm.bedtime && scheduleForm.wakeup && (
              <div className="info-box">
                <span className="text-xs text-muted">Horas objetivo: </span>
                <span className="font-800 text-lg text-primary-light">
                  {calcHours(scheduleForm.bedtime, scheduleForm.wakeup).toFixed(1)}h
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-outline btn-block" onClick={() => { setScheduleForm(null); setFormErrors({}) }}>Volver</button>
              <button className="btn btn-primary btn-block" disabled={isScheduleFormInvalid} onClick={handleSaveSchedule}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SleepPage
