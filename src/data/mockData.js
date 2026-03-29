export const mockReading = {
  dailyGoalPages: 30,
  books: [
    {
      id: 1,
      title: "El arte de la guerra",
      author: "Sun Tzu",
      cover: null,
      coverColor: "#8b5cf6",
      totalPages: 120,
      currentPage: 85,
      status: "reading",
      startDate: "2026-03-15",
      goal: "Terminar antes del 15 de abril",
      notes: "Muy aplicable a estrategia de estudio",
      dailyLog: [
        { date: "2026-03-28", pages: 15 },
        { date: "2026-03-27", pages: 20 },
        { date: "2026-03-26", pages: 10 },
        { date: "2026-03-25", pages: 25 },
        { date: "2026-03-24", pages: 15 }
      ]
    },
    {
      id: 2,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      cover: null,
      coverColor: "#f59e0b",
      totalPages: 496,
      currentPage: 120,
      status: "reading",
      startDate: "2026-03-20",
      goal: "Leer 30 paginas por dia",
      notes: "",
      dailyLog: [
        { date: "2026-03-28", pages: 30 },
        { date: "2026-03-27", pages: 25 },
        { date: "2026-03-26", pages: 30 },
        { date: "2026-03-25", pages: 35 }
      ]
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      cover: null,
      coverColor: "#ef4444",
      totalPages: 326,
      currentPage: 326,
      status: "done",
      startDate: "2026-02-01",
      goal: "",
      notes: "Increible, muy recomendable",
      dailyLog: []
    },
    {
      id: 4,
      title: "El principito",
      author: "Antoine de Saint-Exupery",
      cover: null,
      coverColor: "#06b6d4",
      totalPages: 96,
      currentPage: 96,
      status: "done",
      startDate: "2026-01-10",
      goal: "",
      notes: "Clasico imprescindible",
      dailyLog: []
    },
    {
      id: 5,
      title: "Atomic Habits",
      author: "James Clear",
      cover: null,
      coverColor: "#10b981",
      totalPages: 320,
      currentPage: 0,
      status: "wishlist",
      startDate: null,
      goal: "Leer despues de selectividad",
      notes: "",
      dailyLog: []
    },
    {
      id: 6,
      title: "Pensar rapido, pensar despacio",
      author: "Daniel Kahneman",
      cover: null,
      coverColor: "#6366f1",
      totalPages: 499,
      currentPage: 0,
      status: "wishlist",
      startDate: null,
      goal: "",
      notes: "",
      dailyLog: []
    }
  ]
};

export const mockSleep = {
  schedules: [
    { id: 1, name: "Entre semana", days: [1, 2, 3, 4, 5], bedtime: "23:00", wakeup: "07:00" },
    { id: 2, name: "Fin de semana", days: [0, 6], bedtime: "00:00", wakeup: "09:00" }
  ],
  records: [
    { id: 1, date: "2026-03-28", bedtime: "23:15", wakeup: "07:05" },
    { id: 2, date: "2026-03-27", bedtime: "00:30", wakeup: "07:45" },
    { id: 3, date: "2026-03-26", bedtime: "23:00", wakeup: "06:50" },
    { id: 4, date: "2026-03-25", bedtime: "01:00", wakeup: "08:00" },
    { id: 5, date: "2026-03-24", bedtime: "23:30", wakeup: "07:30" },
    { id: 6, date: "2026-03-23", bedtime: "22:45", wakeup: "06:45" },
    { id: 7, date: "2026-03-22", bedtime: "23:10", wakeup: "07:20" },
    { id: 8, date: "2026-03-21", bedtime: "23:45", wakeup: "07:10" },
    { id: 9, date: "2026-03-20", bedtime: "02:00", wakeup: "09:30" },
    { id: 10, date: "2026-03-19", bedtime: "23:05", wakeup: "07:00" },
    { id: 11, date: "2026-03-18", bedtime: "23:20", wakeup: "07:15" },
    { id: 12, date: "2026-03-17", bedtime: "00:15", wakeup: "07:30" },
    { id: 13, date: "2026-03-16", bedtime: "01:30", wakeup: "10:00" },
    { id: 14, date: "2026-03-15", bedtime: "00:45", wakeup: "09:15" }
  ]
};

export const mockStudy = {
  subjects: [
    {
      id: 1,
      name: "Matematicas",
      icon: "calculator",
      color: "#ff6b6b",
      topics: [
        { name: "Derivadas", order: 1, status: "done" },
        { name: "Integrales", order: 2, status: "current" },
        { name: "Matrices", order: 3, status: "pending" },
        { name: "Probabilidad", order: 4, status: "pending" },
        { name: "Geometria", order: 5, status: "pending" }
      ],
      weeklyPlan: [
        { day: "Lunes", task: "Integrales definidas - ejercicios", topic: "Integrales", done: true },
        { day: "Martes", task: "Integrales por partes", topic: "Integrales", done: true },
        { day: "Miercoles", task: "Integrales - problemas de area", topic: "Integrales", done: false },
        { day: "Jueves", task: "Repaso integrales + examen", topic: "Integrales", done: false },
        { day: "Viernes", task: "Intro matrices y determinantes", topic: "Matrices", done: false }
      ]
    },
    {
      id: 2,
      name: "Biologia",
      icon: "leaf",
      color: "#51cf66",
      topics: [
        { name: "Celula", order: 1, status: "done" },
        { name: "Genetica", order: 2, status: "done" },
        { name: "Evolucion", order: 3, status: "current" },
        { name: "Ecologia", order: 4, status: "pending" },
        { name: "Inmunologia", order: 5, status: "pending" }
      ],
      weeklyPlan: [
        { day: "Lunes", task: "Seleccion natural - teoria", topic: "Evolucion", done: true },
        { day: "Martes", task: "Especiacion y filogenia", topic: "Evolucion", done: false },
        { day: "Jueves", task: "Pruebas de la evolucion", topic: "Evolucion", done: false },
        { day: "Viernes", task: "Ejercicios de repaso evolucion", topic: "Evolucion", done: false }
      ]
    }
  ]
};

export const mockGym = {
  templates: [
    {
      id: 1,
      name: "Push",
      color: "#ff6b6b",
      exercises: [
        { id: 1, name: "Press banca", defaultSets: 4, defaultReps: "8-10" },
        { id: 2, name: "Press inclinado mancuernas", defaultSets: 3, defaultReps: "10-12" },
        { id: 3, name: "Aperturas", defaultSets: 3, defaultReps: "12-15" },
        { id: 4, name: "Press militar", defaultSets: 4, defaultReps: "8-10" },
        { id: 5, name: "Elevaciones laterales", defaultSets: 3, defaultReps: "15" },
        { id: 6, name: "Triceps polea", defaultSets: 3, defaultReps: "12-15" }
      ]
    },
    {
      id: 2,
      name: "Pull",
      color: "#4f8cff",
      exercises: [
        { id: 7, name: "Dominadas", defaultSets: 4, defaultReps: "8-10" },
        { id: 8, name: "Remo con barra", defaultSets: 4, defaultReps: "8-10" },
        { id: 9, name: "Jalon al pecho", defaultSets: 3, defaultReps: "10-12" },
        { id: 10, name: "Remo mancuerna", defaultSets: 3, defaultReps: "10-12" },
        { id: 11, name: "Face pulls", defaultSets: 3, defaultReps: "15" },
        { id: 12, name: "Curl biceps", defaultSets: 3, defaultReps: "12" }
      ]
    },
    {
      id: 3,
      name: "Legs",
      color: "#51cf66",
      exercises: [
        { id: 13, name: "Sentadilla", defaultSets: 4, defaultReps: "8-10" },
        { id: 14, name: "Prensa", defaultSets: 4, defaultReps: "10-12" },
        { id: 15, name: "Peso muerto rumano", defaultSets: 3, defaultReps: "10-12" },
        { id: 16, name: "Extension cuadriceps", defaultSets: 3, defaultReps: "12-15" },
        { id: 17, name: "Curl femoral", defaultSets: 3, defaultReps: "12-15" },
        { id: 18, name: "Elevacion gemelos", defaultSets: 4, defaultReps: "15-20" }
      ]
    }
  ],
  workouts: [
    {
      id: 1, date: "2026-03-28", templateName: "Push", color: "#ff6b6b",
      startTime: "17:30", endTime: "18:45", durationMin: 75,
      exercises: [
        { name: "Press banca", sets: [{ reps: 10, weight: 70 }, { reps: 8, weight: 75 }, { reps: 8, weight: 75 }, { reps: 6, weight: 80 }] },
        { name: "Press inclinado mancuernas", sets: [{ reps: 10, weight: 24 }, { reps: 10, weight: 24 }, { reps: 8, weight: 26 }] },
        { name: "Aperturas", sets: [{ reps: 12, weight: 14 }, { reps: 12, weight: 14 }, { reps: 10, weight: 16 }] },
        { name: "Press militar", sets: [{ reps: 10, weight: 40 }, { reps: 8, weight: 45 }, { reps: 8, weight: 45 }, { reps: 6, weight: 50 }] },
        { name: "Elevaciones laterales", sets: [{ reps: 15, weight: 10 }, { reps: 15, weight: 10 }, { reps: 12, weight: 12 }] },
        { name: "Triceps polea", sets: [{ reps: 15, weight: 25 }, { reps: 12, weight: 27.5 }, { reps: 12, weight: 27.5 }] }
      ]
    },
    {
      id: 2, date: "2026-03-27", templateName: "Legs", color: "#51cf66",
      startTime: "18:00", endTime: "19:20", durationMin: 80,
      exercises: [
        { name: "Sentadilla", sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 90 }, { reps: 8, weight: 90 }, { reps: 6, weight: 100 }] },
        { name: "Prensa", sets: [{ reps: 12, weight: 150 }, { reps: 10, weight: 170 }, { reps: 10, weight: 170 }, { reps: 8, weight: 190 }] },
        { name: "Peso muerto rumano", sets: [{ reps: 10, weight: 70 }, { reps: 10, weight: 70 }, { reps: 8, weight: 80 }] },
        { name: "Curl femoral", sets: [{ reps: 12, weight: 40 }, { reps: 12, weight: 40 }, { reps: 10, weight: 45 }] }
      ]
    },
    {
      id: 3, date: "2026-03-26", templateName: "Pull", color: "#4f8cff",
      startTime: "17:00", endTime: "18:10", durationMin: 70,
      exercises: [
        { name: "Dominadas", sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 6, weight: 5 }, { reps: 6, weight: 5 }] },
        { name: "Remo con barra", sets: [{ reps: 10, weight: 60 }, { reps: 8, weight: 65 }, { reps: 8, weight: 65 }, { reps: 6, weight: 70 }] },
        { name: "Jalon al pecho", sets: [{ reps: 10, weight: 55 }, { reps: 10, weight: 55 }, { reps: 8, weight: 60 }] },
        { name: "Curl biceps", sets: [{ reps: 12, weight: 12 }, { reps: 10, weight: 14 }, { reps: 10, weight: 14 }] }
      ]
    },
    {
      id: 4, date: "2026-03-25", templateName: "Push", color: "#ff6b6b",
      startTime: "17:15", endTime: "18:30", durationMin: 75,
      exercises: [
        { name: "Press banca", sets: [{ reps: 10, weight: 65 }, { reps: 8, weight: 70 }, { reps: 8, weight: 70 }, { reps: 6, weight: 75 }] },
        { name: "Press militar", sets: [{ reps: 10, weight: 40 }, { reps: 8, weight: 40 }, { reps: 8, weight: 45 }, { reps: 6, weight: 45 }] },
        { name: "Elevaciones laterales", sets: [{ reps: 15, weight: 10 }, { reps: 12, weight: 10 }, { reps: 12, weight: 12 }] }
      ]
    },
    {
      id: 5, date: "2026-03-23", templateName: "Legs", color: "#51cf66",
      startTime: "10:00", endTime: "11:15", durationMin: 75,
      exercises: [
        { name: "Sentadilla", sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 85 }, { reps: 8, weight: 85 }, { reps: 6, weight: 95 }] },
        { name: "Prensa", sets: [{ reps: 12, weight: 140 }, { reps: 10, weight: 160 }, { reps: 10, weight: 160 }, { reps: 8, weight: 180 }] }
      ]
    },
    {
      id: 6, date: "2026-03-21", templateName: "Pull", color: "#4f8cff",
      startTime: "17:30", endTime: "18:35", durationMin: 65,
      exercises: [
        { name: "Dominadas", sets: [{ reps: 8, weight: 0 }, { reps: 7, weight: 0 }, { reps: 6, weight: 0 }, { reps: 5, weight: 5 }] },
        { name: "Remo con barra", sets: [{ reps: 10, weight: 55 }, { reps: 8, weight: 60 }, { reps: 8, weight: 60 }, { reps: 6, weight: 65 }] }
      ]
    }
  ],
  weeklyGoal: 5
};
