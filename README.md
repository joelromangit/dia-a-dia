# Grindset

> Habit tracker mobile-first para preparar la Selectividad sin perder de vista el sueño, el gimnasio y la lectura.

[![Demo](https://img.shields.io/badge/demo-grindset--sigma.vercel.app-000?style=flat-square)](https://grindset-sigma.vercel.app)
[![Stack](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

**Demo en vivo:** [grindset-sigma.vercel.app](https://grindset-sigma.vercel.app)

---

## Qué es

Grindset es una PWA mobile-first que centraliza los cuatro hábitos que más mueven la aguja durante el curso de Selectividad: **estudio, sueño, gimnasio y lectura**. Cada sección está pensada como una herramienta autónoma, con su propio modelo de datos y vista optimizada para usarse desde el móvil en menos de cinco segundos.

## Secciones

| Tab | Ruta | Qué hace |
|---|---|---|
| **Estudio** | `/` | Asignaturas con planning semanal por días, checkbox de tareas, progreso global y vista de profesor para corregir ejercicios con foto + anotaciones |
| **Sueño** | `/sleep` | Cronómetro de sueño (botón dormir/despertar), objetivos diarios, KPIs e historial |
| **Gym** | `/gym` | Rutinas con ejercicios por grupo muscular, asistencia semanal y racha |
| **Lectura** | `/reading` | Biblioteca con progreso por páginas y objetivos por libro |

## Features destacadas

- **PWA instalable** con manifest, iconos y service worker para uso offline básico
- **Renderizado de fórmulas matemáticas** con KaTeX en enunciados y correcciones
- **Visor de PDF integrado** para material extra (ej. PAU MACS)
- **Subida de fotos** con recorte para entregas y correcciones del profesor
- **Notificaciones WhatsApp** para avisar al profesor de entregas o al alumno de correcciones
- **Modo admin** para gestionar contenido sin tocar la base de datos
- **Dark theme único** con sistema de diseño basado en variables CSS
- **Bottom navigation fija** y modales slide-up nativos del estilo iOS/Android

## Stack

- **Frontend:** React 19 + Vite 8 + React Router 7
- **UI:** CSS puro con design system propio, `lucide-react` para iconografía, `katex` para matemáticas
- **Backend:** Supabase (Postgres + Storage + Row Level Security)
- **Deploy:** Vercel con SPA rewrites

## Estructura

```
src/
├── pages/         StudyPage, SleepPage, GymPage, ReadingPage
├── contexts/      AdminContext (modo profesor)
├── lib/           supabase.js, notifications.js, db.js
├── data/          mockData.js (fallback sin backend)
└── index.css      design system + variables CSS
supabase-schema.sql        esquema inicial
supabase-migration-v2.sql  migración a v2
vercel.json                SPA rewrites
```

## Empezar en local

```bash
git clone https://github.com/joelromangit/grindset.git
cd grindset
npm install
npm run dev
```

Para conectar con Supabase, crea un `.env.local` con:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

Sin variables de entorno la app arranca con datos mock para que puedas trastear la UI sin tocar la base de datos.

## Scripts

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar el build |
| `npm run lint` | ESLint sobre todo el proyecto |

## Modelo de datos

Tablas principales en Supabase: `subjects`, `study_tasks`, `sleep_goals`, `sleep_records`, `routines`, `exercises`, `gym_log`, `books`. RLS habilitado con policies permisivas mientras no hay autenticación. Storage con bucket `uploads` para fotos de ejercicios y correcciones.

## Convenciones

- Mobile-first, responsive hasta 700px de ancho en desktop
- Bottom nav siempre fijo
- Español para UI, inglés para código
- Sin emojis en código

## Autor

[**Joel Roman**](https://github.com/joelromangit)
