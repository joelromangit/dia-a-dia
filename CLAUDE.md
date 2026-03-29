# Dia a Dia - Habit Tracker para Selectividad

## Descripcion
App web mobile-first para trackear habitos de cara a la selectividad. Prioridad de secciones:

1. **Estudio** (/) - Asignaturas con planning semanal, checkbox de tareas, progreso general
2. **Sueno** (/sleep) - Timer de sueno (boton dormir/despertar), KPIs, historial
3. **Gym** (/gym) - Rutinas con ejercicios, asistencia semanal, racha
4. **Lectura** (/reading) - Libros con progreso por paginas, objetivos

## Stack
- Vite + React (vanilla JS, sin TS)
- react-router-dom (navegacion por tabs)
- lucide-react (iconos)
- @supabase/supabase-js (DB + storage)
- CSS puro (index.css con variables CSS, design system dark mode)
- Deploy: Vercel (vercel.json con SPA rewrites)

## Backend: Supabase
- Schema en supabase-schema.sql
- Config en src/lib/supabase.js
- Env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- Tablas: subjects, study_tasks, sleep_goals, sleep_records, routines, exercises, gym_log, books
- RLS habilitado, policies permisivas (sin auth por ahora)
- Bucket 'uploads' para storage

## Estructura
- src/pages/ - 4 paginas: StudyPage, SleepPage, GymPage, ReadingPage
- src/lib/supabase.js - cliente Supabase
- src/data/mockData.js - datos mock (fallback si no hay Supabase)
- src/App.jsx - router + bottom navigation
- src/index.css - CSS global (design system)

## Convenciones
- Mobile-first, responsive hasta 700px desktop
- Bottom nav siempre fijo (position: fixed)
- Dark theme unico
- Modales slide-up en mobile, centrados en desktop
- Espanol para UI, ingles para codigo
- No emojis en codigo
