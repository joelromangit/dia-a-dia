export const mockReading = {
  books: [
    {
      id: 1,
      title: "El arte de la guerra",
      author: "Sun Tzu",
      totalPages: 120,
      currentPage: 85,
      startDate: "2026-03-15",
      goal: "Terminar antes del 15 de abril",
      notes: "Muy aplicable a estrategia de estudio"
    },
    {
      id: 2,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      totalPages: 496,
      currentPage: 120,
      startDate: "2026-03-20",
      goal: "Leer 30 paginas por dia",
      notes: ""
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      totalPages: 326,
      currentPage: 326,
      startDate: "2026-02-01",
      goal: "Completado",
      notes: "Increible, muy recomendable"
    }
  ],
  dailyGoalPages: 30
};

export const mockSleep = {
  goal: { hours: 8, bedtime: "23:00", wakeup: "07:00" },
  records: [
    { date: "2026-03-28", bedtime: "23:15", wakeup: "07:05", hours: 7.83 },
    { date: "2026-03-27", bedtime: "00:30", wakeup: "07:45", hours: 7.25 },
    { date: "2026-03-26", bedtime: "23:00", wakeup: "06:50", hours: 7.83 },
    { date: "2026-03-25", bedtime: "01:00", wakeup: "08:00", hours: 7.0 },
    { date: "2026-03-24", bedtime: "23:30", wakeup: "07:30", hours: 8.0 },
    { date: "2026-03-23", bedtime: "22:45", wakeup: "06:45", hours: 8.0 },
    { date: "2026-03-22", bedtime: "23:10", wakeup: "07:20", hours: 8.17 }
  ]
};

export const mockStudy = {
  subjects: [
    {
      id: 1,
      name: "Matematicas",
      color: "#4f8cff",
      weeklyPlan: [
        { day: "Lunes", task: "Derivadas e integrales - Tema 5", done: true },
        { day: "Martes", task: "Problemas de optimizacion", done: true },
        { day: "Miercoles", task: "Matrices y determinantes", done: false },
        { day: "Jueves", task: "Sistemas de ecuaciones", done: false },
        { day: "Viernes", task: "Repaso general + examenes", done: false }
      ]
    },
    {
      id: 2,
      name: "Historia",
      color: "#ff6b6b",
      weeklyPlan: [
        { day: "Lunes", task: "Guerra Civil Espanola", done: true },
        { day: "Miercoles", task: "Transicion democratica", done: false },
        { day: "Viernes", task: "Constitucion de 1978", done: false }
      ]
    },
    {
      id: 3,
      name: "Lengua",
      color: "#51cf66",
      weeklyPlan: [
        { day: "Martes", task: "Comentario de texto - estructura", done: true },
        { day: "Jueves", task: "Figuras retoricas + practica", done: false },
        { day: "Sabado", task: "Redaccion argumentativa", done: false }
      ]
    },
    {
      id: 4,
      name: "Ingles",
      color: "#ffd43b",
      weeklyPlan: [
        { day: "Lunes", task: "Writing - Opinion essay", done: true },
        { day: "Miercoles", task: "Reading comprehension", done: false },
        { day: "Viernes", task: "Grammar review - conditionals", done: false }
      ]
    }
  ]
};

export const mockGym = {
  routines: [
    {
      id: 1,
      name: "Push (Pecho/Hombro/Triceps)",
      exercises: [
        { name: "Press banca", sets: 4, reps: "8-10" },
        { name: "Press inclinado mancuernas", sets: 3, reps: "10-12" },
        { name: "Aperturas", sets: 3, reps: "12-15" },
        { name: "Press militar", sets: 4, reps: "8-10" },
        { name: "Elevaciones laterales", sets: 3, reps: "15" },
        { name: "Triceps polea", sets: 3, reps: "12-15" }
      ]
    },
    {
      id: 2,
      name: "Pull (Espalda/Biceps)",
      exercises: [
        { name: "Dominadas", sets: 4, reps: "8-10" },
        { name: "Remo con barra", sets: 4, reps: "8-10" },
        { name: "Jalon al pecho", sets: 3, reps: "10-12" },
        { name: "Remo mancuerna", sets: 3, reps: "10-12" },
        { name: "Face pulls", sets: 3, reps: "15" },
        { name: "Curl biceps", sets: 3, reps: "12" }
      ]
    },
    {
      id: 3,
      name: "Legs (Pierna)",
      exercises: [
        { name: "Sentadilla", sets: 4, reps: "8-10" },
        { name: "Prensa", sets: 4, reps: "10-12" },
        { name: "Peso muerto rumano", sets: 3, reps: "10-12" },
        { name: "Extension cuadriceps", sets: 3, reps: "12-15" },
        { name: "Curl femoral", sets: 3, reps: "12-15" },
        { name: "Elevacion gemelos", sets: 4, reps: "15-20" }
      ]
    }
  ],
  weekLog: [
    { date: "2026-03-23", routineId: 1, completed: true },
    { date: "2026-03-24", routineId: 2, completed: true },
    { date: "2026-03-25", routineId: 3, completed: true },
    { date: "2026-03-26", routineId: 1, completed: true },
    { date: "2026-03-27", routineId: 2, completed: false },
    { date: "2026-03-28", routineId: 3, completed: true }
  ],
  weeklyGoal: 5
};
