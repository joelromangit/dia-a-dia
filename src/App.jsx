import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { GraduationCap, Moon, Dumbbell, Book } from 'lucide-react'
import StudyPage from './pages/StudyPage'
import SleepPage from './pages/SleepPage'
import GymPage from './pages/GymPage'
import ReadingPage from './pages/ReadingPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StudyPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/gym" element={<GymPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <GraduationCap size={20} />
          <span>Estudio</span>
        </NavLink>
        <NavLink to="/sleep" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Moon size={20} />
          <span>Sueno</span>
        </NavLink>
        <NavLink to="/gym" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Dumbbell size={20} />
          <span>Gym</span>
        </NavLink>
        <NavLink to="/reading" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Book size={20} />
          <span>Lectura</span>
        </NavLink>
      </nav>
    </BrowserRouter>
  )
}

export default App
