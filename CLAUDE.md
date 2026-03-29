# Dia a Dia - Habit Tracker para Selectividad

## Descripcion
App web mobile-first para trackear habitos de cara a la selectividad. 4 secciones principales:

1. **Lectura**: Libros con progreso por paginas, objetivos, anadir libros, actualizar progreso
2. **Sueno**: Timer de sueno (boton dormir/despertar), KPIs (media, objetivo, consistencia), historial
3. **Estudio**: Asignaturas con planning semanal, checkbox de tareas, progreso general
4. **Gym**: Rutinas con ejercicios, asistencia semanal, racha

## Stack
- Vite + React (vanilla JS, sin TS)
- react-router-dom (navegacion por tabs)
- lucide-react (iconos)
- CSS puro (index.css con variables CSS, design system dark mode)
- Datos mock en src/data/mockData.js
- Sin backend - todo en estado local por ahora

## Estructura
- src/pages/ - 4 paginas principales (ReadingPage, SleepPage, StudyPage, GymPage)
- src/data/mockData.js - datos mock para desarrollo
- src/App.jsx - router + bottom navigation
- src/index.css - todo el CSS global (design system)

## Convenciones
- Mobile-first, responsive hasta 700px desktop
- Dark theme unico
- Modales slide-up en mobile, centrados en desktop
- Espanol para UI, ingles para codigo
- No emojis en codigo
