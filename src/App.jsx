import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Book, Moon, GraduationCap, Dumbbell } from 'lucide-react'
import ReadingPage from './pages/ReadingPage'
import SleepPage from './pages/SleepPage'
import StudyPage from './pages/StudyPage'
import GymPage from './pages/GymPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<ReadingPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/gym" element={<GymPage />} />
        </Routes>
      </div>
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Book size={20} />
          <span>Lectura</span>
        </NavLink>
        <NavLink to="/sleep" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Moon size={20} />
          <span>Sueno</span>
        </NavLink>
        <NavLink to="/study" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <GraduationCap size={20} />
          <span>Estudio</span>
        </NavLink>
        <NavLink to="/gym" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Dumbbell size={20} />
          <span>Gym</span>
        </NavLink>
      </nav>
    </BrowserRouter>
  )
}

export default App
