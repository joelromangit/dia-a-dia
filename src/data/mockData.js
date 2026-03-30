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
        {
          name: "Matrices",
          order: 1,
          status: "available",
          theoryBlocks: [
            {
              id: 1,
              title: "Que es una matriz y tipos basicos",
              content: "Imagina una tabla de numeros, como una hoja de calculo. Eso es basicamente una matriz: numeros organizados en filas (horizontales) y columnas (verticales). Las usamos constantemente en matematicas para organizar datos y resolver problemas.\n\nUna matriz se nombra con una letra mayuscula, por ejemplo $A$, y sus dimensiones se escriben como $A_{m \\times n}$, donde $m$ es el numero de filas y $n$ el numero de columnas. Cada numero dentro de la matriz se llama elemento y se identifica con $a_{ij}$, donde $i$ es la fila y $j$ es la columna. Por ejemplo, $a_{23}$ es el elemento que esta en la fila 2 y columna 3.\n\nVeamos un ejemplo concreto. Esta es una matriz de $2 \\times 3$ (2 filas, 3 columnas):\n\n$\\begin{pmatrix} 1 & 5 & -3 \\\\ 2 & 0 & 7 \\end{pmatrix}$\n\nAqui, $a_{11} = 1$, $a_{12} = 5$, $a_{13} = -3$, $a_{21} = 2$, $a_{22} = 0$, $a_{23} = 7$.\n\nExisten varios tipos de matrices que debes conocer:\n\nMatriz fila: tiene una sola fila ($1 \\times n$). Ejemplo: $\\begin{pmatrix} 3 & -1 & 4 \\end{pmatrix}$\n\nMatriz columna: tiene una sola columna ($m \\times 1$). Ejemplo: $\\begin{pmatrix} 2 \\\\ 5 \\\\ -1 \\end{pmatrix}$\n\nMatriz cuadrada: tiene el mismo numero de filas que de columnas ($n \\times n$). Ejemplo de $2 \\times 2$: $\\begin{pmatrix} 3 & 1 \\\\ 4 & 2 \\end{pmatrix}$\n\nMatriz identidad $I$: es cuadrada, con unos en la diagonal y ceros en el resto. Es el \"1\" de las matrices: cualquier matriz multiplicada por $I$ da ella misma. Ejemplo:\n\n$I_{3} = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$\n\nMatriz nula $O$: todos sus elementos son cero. Es el \"0\" de las matrices.\n\n$O_{2 \\times 2} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$",
              exercises: [
                {
                  id: 1,
                  type: "auto",
                  question: "La matriz $\\begin{pmatrix} 4 & -1 & 0 \\\\ 2 & 3 & 5 \\end{pmatrix}$ tiene dimension:",
                  autoConfig: { type: "multiple_choice", choices: ["$3 \\times 2$", "$2 \\times 3$", "$2 \\times 2$", "$3 \\times 3$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 2,
                  type: "auto",
                  question: "La matriz $\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ es una matriz:",
                  autoConfig: { type: "multiple_choice", choices: ["Nula", "Fila", "Identidad", "Columna"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 3,
                  type: "auto",
                  question: "En la matriz $A = \\begin{pmatrix} 7 & 2 & -1 \\\\ 0 & 5 & 3 \\end{pmatrix}$, el elemento $a_{12}$ vale:",
                  autoConfig: { type: "multiple_choice", choices: ["$0$", "$7$", "$2$", "$5$"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 4,
                  type: "auto",
                  question: "La matriz $\\begin{pmatrix} 5 \\\\ -2 \\\\ 3 \\end{pmatrix}$ es de tipo:",
                  autoConfig: { type: "multiple_choice", choices: ["Matriz fila", "Matriz cuadrada", "Matriz columna", "Matriz identidad"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 5,
                  type: "auto",
                  question: "La matriz $\\begin{pmatrix} 3 & -1 & 0 \\\\ 2 & 4 & 7 \\\\ 1 & 5 & -2 \\end{pmatrix}$ tiene dimension:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "3x3" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 6,
                  type: "auto",
                  question: "En la matriz $B = \\begin{pmatrix} 1 & 8 & -3 \\\\ 4 & 0 & 6 \\end{pmatrix}$, el elemento $b_{21}$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "4" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 7,
                  type: "auto",
                  question: "Una matriz de $3 \\times 4$ tiene en total:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "12" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 8,
                  type: "manual",
                  question: "Escribe una matriz de dimension $2 \\times 3$ cuyos elementos sean numeros enteros a tu eleccion. Indica la dimension y senala los elementos $a_{11}$, $a_{13}$ y $a_{22}$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 9,
                  type: "manual",
                  question: "Escribe la matriz identidad $I_3 = \\begin{pmatrix} ? & ? & ? \\\\ ? & ? & ? \\\\ ? & ? & ? \\end{pmatrix}$. Completa todos los elementos y explica por que se llama identidad.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 10,
                  type: "manual",
                  question: "Dada la matriz $A = \\begin{pmatrix} 3 & -1 & 0 \\\\ 7 & 2 & 5 \\\\ -4 & 8 & 1 \\end{pmatrix}$, identifica todos sus elementos escribiendo $a_{ij}$ para cada posicion (desde $a_{11}$ hasta $a_{33}$).",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 11,
                  type: "manual",
                  question: "Escribe un ejemplo de matriz columna de $4 \\times 1$ y un ejemplo de matriz fila de $1 \\times 3$. Indica la dimension de cada una.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 12,
                  type: "manual",
                  question: "Clasifica cada una de estas matrices segun su tipo (fila, columna, cuadrada, identidad, nula):\n\na) $\\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$\n\nb) $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$\n\nc) $\\begin{pmatrix} 3 & -1 & 7 \\end{pmatrix}$\n\nd) $\\begin{pmatrix} 5 \\\\ 2 \\end{pmatrix}$",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 2,
              title: "Suma, resta y multiplicacion por escalar",
              content: "Sumar matrices es muy intuitivo: se suman los elementos que estan en la misma posicion. Eso si, solo se pueden sumar matrices que tengan exactamente las mismas dimensiones.\n\nEjemplo paso a paso:\n\n$\\begin{pmatrix} 1 & 3 \\\\ 2 & 0 \\end{pmatrix} + \\begin{pmatrix} 4 & -1 \\\\ 5 & 2 \\end{pmatrix} = \\begin{pmatrix} 1+4 & 3+(-1) \\\\ 2+5 & 0+2 \\end{pmatrix} = \\begin{pmatrix} 5 & 2 \\\\ 7 & 2 \\end{pmatrix}$\n\nLa resta funciona igual, pero restando elemento a elemento:\n\n$\\begin{pmatrix} 5 & 2 \\\\ 7 & 2 \\end{pmatrix} - \\begin{pmatrix} 1 & 3 \\\\ 2 & 0 \\end{pmatrix} = \\begin{pmatrix} 5-1 & 2-3 \\\\ 7-2 & 2-0 \\end{pmatrix} = \\begin{pmatrix} 4 & -1 \\\\ 5 & 2 \\end{pmatrix}$\n\nMultiplicar una matriz por un escalar (un numero $k$) significa multiplicar TODOS los elementos por ese numero:\n\n$3 \\cdot \\begin{pmatrix} 2 & -1 \\\\ 0 & 4 \\end{pmatrix} = \\begin{pmatrix} 3 \\cdot 2 & 3 \\cdot (-1) \\\\ 3 \\cdot 0 & 3 \\cdot 4 \\end{pmatrix} = \\begin{pmatrix} 6 & -3 \\\\ 0 & 12 \\end{pmatrix}$\n\nPropiedades importantes de estas operaciones:\n\nConmutativa: $A + B = B + A$\n\nAsociativa: $(A + B) + C = A + (B + C)$\n\nElemento neutro: $A + O = A$ (la matriz nula no cambia nada)\n\nDistributiva del escalar: $k \\cdot (A + B) = k \\cdot A + k \\cdot B$\n\nOtra distributiva: $(k + l) \\cdot A = k \\cdot A + l \\cdot A$",
              exercises: [
                {
                  id: 13,
                  type: "auto",
                  question: "Se pueden sumar las matrices $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ y $\\begin{pmatrix} 5 & 6 & 7 \\\\ 8 & 9 & 0 \\end{pmatrix}$?",
                  autoConfig: { type: "multiple_choice", choices: ["Si, el resultado es $2 \\times 3$", "Si, el resultado es $2 \\times 2$", "No, porque tienen distinta dimension", "Si, pero solo las dos primeras columnas"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 14,
                  type: "auto",
                  question: "El resultado de $\\begin{pmatrix} 1 & 4 \\\\ 3 & 2 \\end{pmatrix} + \\begin{pmatrix} 2 & -1 \\\\ 0 & 5 \\end{pmatrix}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$\\begin{pmatrix} 3 & 3 \\\\ 3 & 7 \\end{pmatrix}$", "$\\begin{pmatrix} 3 & 5 \\\\ 3 & 7 \\end{pmatrix}$", "$\\begin{pmatrix} 2 & -4 \\\\ 0 & 10 \\end{pmatrix}$", "$\\begin{pmatrix} 1 & 3 \\\\ 3 & 3 \\end{pmatrix}$"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 15,
                  type: "auto",
                  question: "Si $A = \\begin{pmatrix} 2 & -3 \\\\ 1 & 0 \\end{pmatrix}$, entonces $-2 \\cdot A$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$\\begin{pmatrix} -4 & 6 \\\\ -2 & 0 \\end{pmatrix}$", "$\\begin{pmatrix} 4 & -6 \\\\ 2 & 0 \\end{pmatrix}$", "$\\begin{pmatrix} -4 & -6 \\\\ -2 & 0 \\end{pmatrix}$", "$\\begin{pmatrix} 0 & -1 \\\\ 3 & 2 \\end{pmatrix}$"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 16,
                  type: "auto",
                  question: "Si $A$ y $B$ son matrices de $3 \\times 2$, la dimension de $A + B$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$6 \\times 4$", "$3 \\times 2$", "$2 \\times 3$", "No se pueden sumar"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 17,
                  type: "auto",
                  question: "Si $A = \\begin{pmatrix} 3 & -1 \\\\ 2 & 5 \\end{pmatrix}$ y $B = \\begin{pmatrix} 1 & 4 \\\\ -2 & 3 \\end{pmatrix}$, el elemento en la posicion $(1,2)$ de $A + B$ es:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "3" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 18,
                  type: "auto",
                  question: "Si $k = 4$ y $a_{ij} = 3$, entonces el elemento correspondiente en $k \\cdot A$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "12" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 19,
                  type: "auto",
                  question: "La propiedad que establece que $A + B = B + A$ se llama propiedad:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "conmutativa" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 20,
                  type: "manual",
                  question: "Calcula la suma $\\begin{pmatrix} 3 & 1 \\\\ -2 & 4 \\end{pmatrix} + \\begin{pmatrix} 2 & -3 \\\\ 5 & 1 \\end{pmatrix}$. Muestra el calculo elemento a elemento.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 21,
                  type: "manual",
                  question: "Calcula la suma $\\begin{pmatrix} 1 & -2 \\\\ 4 & 0 \\\\ 3 & 5 \\end{pmatrix} + \\begin{pmatrix} 2 & 3 \\\\ -1 & 6 \\\\ 0 & -4 \\end{pmatrix}$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 22,
                  type: "manual",
                  question: "Calcula $\\begin{pmatrix} 5 & 2 & -1 \\\\ 3 & 0 & 4 \\end{pmatrix} - \\begin{pmatrix} 2 & -1 & 3 \\\\ 1 & 4 & -2 \\end{pmatrix}$. Muestra cada paso.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 23,
                  type: "manual",
                  question: "Calcula $3 \\cdot \\begin{pmatrix} 2 & -1 \\\\ 0 & 4 \\end{pmatrix}$. Muestra como se multiplica cada elemento por el escalar.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 24,
                  type: "manual",
                  question: "Dadas $A = \\begin{pmatrix} 1 & 3 \\\\ -2 & 0 \\end{pmatrix}$ y $B = \\begin{pmatrix} 2 & -1 \\\\ 4 & 5 \\end{pmatrix}$, calcula $2A + 3B$ paso a paso.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 25,
                  type: "manual",
                  question: "Dadas $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$ y $C = \\begin{pmatrix} -1 & 0 \\\\ 2 & 1 \\end{pmatrix}$, calcula $3A - 2B + C$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 26,
                  type: "manual",
                  question: "Encuentra la matriz $X$ sabiendo que $\\begin{pmatrix} 2 & 1 \\\\ 0 & 4 \\end{pmatrix} + X = \\begin{pmatrix} 5 & 3 \\\\ 1 & 7 \\end{pmatrix}$. Comprueba tu resultado sumando.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 27,
                  type: "manual",
                  question: "Encuentra el escalar $k$ sabiendo que $k \\cdot \\begin{pmatrix} 2 & -1 \\\\ 3 & 0 \\end{pmatrix} = \\begin{pmatrix} 6 & -3 \\\\ 9 & 0 \\end{pmatrix}$. Explica como lo encontraste.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 3,
              title: "Traspuesta de una matriz",
              content: "La traspuesta de una matriz se obtiene intercambiando las filas por las columnas. La fila 1 pasa a ser la columna 1, la fila 2 pasa a ser la columna 2, y asi sucesivamente. Se escribe como $A^T$ o $A'$.\n\nVeamoslo con un ejemplo visual. Si tenemos:\n\n$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}$\n\nEntonces su traspuesta es:\n\n$A^T = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$\n\nFijate: la primera fila de $A$ (que era $1, 2, 3$) ahora es la primera columna de $A^T$. La segunda fila (que era $4, 5, 6$) ahora es la segunda columna.\n\nCambio de dimensiones: si $A$ es de dimension $m \\times n$, entonces $A^T$ es de dimension $n \\times m$. En nuestro ejemplo, $A$ era $2 \\times 3$ y $A^T$ es $3 \\times 2$.\n\nOtro ejemplo con una matriz cuadrada:\n\n$B = \\begin{pmatrix} 1 & 7 \\\\ 3 & 2 \\end{pmatrix} \\Rightarrow B^T = \\begin{pmatrix} 1 & 3 \\\\ 7 & 2 \\end{pmatrix}$\n\nEn las matrices cuadradas, la traspuesta se obtiene \"reflejando\" por la diagonal principal (la que va de arriba-izquierda a abajo-derecha).\n\nPropiedades de la traspuesta:\n\n$(A^T)^T = A$ (trasponer dos veces devuelve la original)\n\n$(A + B)^T = A^T + B^T$ (la traspuesta de una suma es la suma de las traspuestas)\n\n$(k \\cdot A)^T = k \\cdot A^T$ (el escalar no se ve afectado)\n\n$(A \\cdot B)^T = B^T \\cdot A^T$ (ojo: el orden se invierte)",
              exercises: [
                {
                  id: 28,
                  type: "auto",
                  question: "Si $A$ es una matriz de $3 \\times 5$, su traspuesta $A^T$ tiene dimension:",
                  autoConfig: { type: "multiple_choice", choices: ["$3 \\times 5$", "$5 \\times 3$", "$3 \\times 3$", "$5 \\times 5$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 29,
                  type: "auto",
                  question: "Cual de estas es $(A^T)^T$?",
                  autoConfig: { type: "multiple_choice", choices: ["$A^T$", "$A$", "$I$", "$O$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 30,
                  type: "auto",
                  question: "Si $A^T = A$, la matriz se llama:",
                  autoConfig: { type: "multiple_choice", choices: ["Identidad", "Nula", "Simetrica", "Inversa"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 31,
                  type: "auto",
                  question: "Si el elemento $a_{23} = 7$ en la matriz $A$, en la traspuesta $A^T$ ese valor estara en la posicion:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "(3,2)" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 32,
                  type: "auto",
                  question: "Si $A$ es de dimension $4 \\times 2$, la dimension de $(A^T)^T$ es:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "4x2" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 33,
                  type: "manual",
                  question: "Calcula la traspuesta de $A = \\begin{pmatrix} 2 & -1 & 0 \\\\ 3 & 4 & -5 \\end{pmatrix}$. Indica las dimensiones de $A$ y de $A^T$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 34,
                  type: "manual",
                  question: "Calcula la traspuesta de $B = \\begin{pmatrix} 1 & 4 & -2 \\\\ 0 & 3 & 5 \\\\ -1 & 2 & 7 \\end{pmatrix}$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 35,
                  type: "manual",
                  question: "Dada $C = \\begin{pmatrix} 3 & 1 \\\\ -2 & 5 \\end{pmatrix}$, calcula $C^T$ y luego $(C^T)^T$. Verifica que $(C^T)^T = C$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 36,
                  type: "manual",
                  question: "Dadas $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 0 \\end{pmatrix}$ y $B = \\begin{pmatrix} -1 & 4 \\\\ 2 & 1 \\end{pmatrix}$, calcula $(A + B)^T$ y compara con $A^T + B^T$. Son iguales?",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 37,
                  type: "manual",
                  question: "Dada $A = \\begin{pmatrix} 2 & -1 \\\\ 4 & 3 \\end{pmatrix}$, calcula $(3A)^T$ y compara con $3 \\cdot (A^T)$. Verifica que son iguales.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 4,
              title: "Multiplicacion de matrices",
              content: "La multiplicacion de matrices es la operacion mas importante y la que mas cuesta al principio, pero una vez le pillas el truco es mecanica. Hay una condicion fundamental: para poder multiplicar $A \\cdot B$, el numero de columnas de $A$ debe ser igual al numero de filas de $B$.\n\nSi $A$ es de dimension $m \\times n$ y $B$ es de dimension $n \\times p$, entonces el resultado $C = A \\cdot B$ tendra dimension $m \\times p$.\n\nPara calcular cada elemento $c_{ij}$, tomas la fila $i$ de $A$ y la columna $j$ de $B$, multiplicas los elementos uno a uno y sumas todo. Veamoslo paso a paso con un ejemplo de $2 \\times 2$:\n\n$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$\n\n$c_{11}$: fila 1 de $A$ por columna 1 de $B$: $1 \\cdot 5 + 2 \\cdot 7 = 5 + 14 = 19$\n\n$c_{12}$: fila 1 de $A$ por columna 2 de $B$: $1 \\cdot 6 + 2 \\cdot 8 = 6 + 16 = 22$\n\n$c_{21}$: fila 2 de $A$ por columna 1 de $B$: $3 \\cdot 5 + 4 \\cdot 7 = 15 + 28 = 43$\n\n$c_{22}$: fila 2 de $A$ por columna 2 de $B$: $3 \\cdot 6 + 4 \\cdot 8 = 18 + 32 = 50$\n\nResultado: $A \\cdot B = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$\n\nAhora un ejemplo con dimensiones diferentes. $A$ es $2 \\times 3$ y $B$ es $3 \\times 2$, asi que el resultado sera $2 \\times 2$:\n\n$A = \\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 3 & 1 \\\\ 2 & -1 \\\\ 0 & 4 \\end{pmatrix}$\n\n$c_{11} = 1 \\cdot 3 + 0 \\cdot 2 + 2 \\cdot 0 = 3$\n\n$c_{12} = 1 \\cdot 1 + 0 \\cdot (-1) + 2 \\cdot 4 = 9$\n\n$c_{21} = (-1) \\cdot 3 + 3 \\cdot 2 + 1 \\cdot 0 = 3$\n\n$c_{22} = (-1) \\cdot 1 + 3 \\cdot (-1) + 1 \\cdot 4 = 0$\n\nResultado: $A \\cdot B = \\begin{pmatrix} 3 & 9 \\\\ 3 & 0 \\end{pmatrix}$\n\nMUY IMPORTANTE: la multiplicacion de matrices NO es conmutativa. Es decir, $A \\cdot B \\neq B \\cdot A$ en general. Incluso puede pasar que $A \\cdot B$ exista pero $B \\cdot A$ no (si las dimensiones no cuadran).\n\nPropiedades que si cumple:\n\nAsociativa: $(A \\cdot B) \\cdot C = A \\cdot (B \\cdot C)$\n\nDistributiva: $A \\cdot (B + C) = A \\cdot B + A \\cdot C$\n\nElemento neutro: $A \\cdot I = I \\cdot A = A$",
              exercises: [
                {
                  id: 38,
                  type: "auto",
                  question: "Si $A$ es de $2 \\times 3$ y $B$ es de $3 \\times 4$, la dimension de $A \\cdot B$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$2 \\times 4$", "$3 \\times 3$", "$2 \\times 3$", "$4 \\times 2$"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 39,
                  type: "auto",
                  question: "Si $A$ es de $3 \\times 2$ y $B$ es de $4 \\times 3$, se puede calcular $A \\cdot B$?",
                  autoConfig: { type: "multiple_choice", choices: ["Si, y el resultado es $3 \\times 3$", "Si, y el resultado es $3 \\times 4$", "No, porque columnas de $A$ (2) $\\neq$ filas de $B$ (4)", "Si, y el resultado es $4 \\times 2$"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 40,
                  type: "manual",
                  question: "Calcula paso a paso $A \\cdot B$ donde $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ y $B = \\begin{pmatrix} 1 & -1 \\\\ 2 & 4 \\end{pmatrix}$. Luego calcula $B \\cdot A$ y comprueba que $A \\cdot B \\neq B \\cdot A$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 41,
                  type: "manual",
                  question: "Calcula $A \\cdot B$ donde $A = \\begin{pmatrix} 2 & -1 & 3 \\\\ 0 & 4 & 1 \\end{pmatrix}$ y $B = \\begin{pmatrix} 1 & 0 \\\\ 2 & -1 \\\\ 3 & 2 \\end{pmatrix}$. Indica primero la dimension del resultado.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 42,
                  type: "manual",
                  question: "Dada $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, calcula $A \\cdot I_2$ y comprueba que el resultado es la propia $A$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 43,
                  type: "manual",
                  question: "Calcula $\\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 1 & 0 \\\\ 0 & 2 & 1 \\end{pmatrix} \\cdot \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & -1 & 3 \\\\ 1 & 0 & 2 \\end{pmatrix}$. Muestra el calculo de cada elemento.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 5,
              title: "Determinante de una matriz",
              content: "El determinante es un numero que se asocia a cada matriz cuadrada. Es fundamental porque nos dice si la matriz tiene inversa (si el determinante es distinto de cero) o no (si es cero). Solo se puede calcular para matrices cuadradas.\n\nDeterminante de una matriz $2 \\times 2$:\n\nDada $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, su determinante es:\n\n$|A| = a \\cdot d - b \\cdot c$\n\nEs decir, multiplicas en diagonal (de arriba-izquierda a abajo-derecha) y restas el otro producto diagonal. Ejemplo:\n\n$\\begin{vmatrix} 3 & 2 \\\\ 1 & 4 \\end{vmatrix} = 3 \\cdot 4 - 2 \\cdot 1 = 12 - 2 = 10$\n\nDeterminante de una matriz $3 \\times 3$ (Regla de Sarrus):\n\nPara una matriz $3 \\times 3$, usamos la regla de Sarrus. Se copian las dos primeras columnas a la derecha de la matriz, y luego:\n\nSe suman los tres productos de las diagonales que van de izquierda a derecha (descendentes).\n\nSe restan los tres productos de las diagonales que van de derecha a izquierda (ascendentes).\n\nEjemplo paso a paso con $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 0 \\end{pmatrix}$:\n\nDiagonales descendentes: $1 \\cdot 5 \\cdot 0 + 2 \\cdot 6 \\cdot 7 + 3 \\cdot 4 \\cdot 8 = 0 + 84 + 96 = 180$\n\nDiagonales ascendentes: $3 \\cdot 5 \\cdot 7 + 1 \\cdot 6 \\cdot 8 + 2 \\cdot 4 \\cdot 0 = 105 + 48 + 0 = 153$\n\n$|A| = 180 - 153 = 27$\n\nPropiedad clave: si $|A| = 0$, la matriz es singular (no tiene inversa). Si $|A| \\neq 0$, la matriz es regular (si tiene inversa).",
              exercises: [
                {
                  id: 44,
                  type: "auto",
                  question: "El determinante de $\\begin{pmatrix} 4 & 3 \\\\ 2 & 5 \\end{pmatrix}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$14$", "$26$", "$20$", "$23$"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 45,
                  type: "auto",
                  question: "El determinante de $\\begin{pmatrix} 6 & 3 \\\\ 2 & 1 \\end{pmatrix}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$12$", "$0$", "$9$", "$-3$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 46,
                  type: "manual",
                  question: "Calcula el determinante de $\\begin{pmatrix} 5 & -2 \\\\ 3 & 7 \\end{pmatrix}$ y di si la matriz es regular o singular.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 47,
                  type: "manual",
                  question: "Usando la regla de Sarrus, calcula el determinante de $\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & -1 & 2 \\\\ 1 & 4 & -1 \\end{pmatrix}$. Muestra las diagonales descendentes y ascendentes por separado.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 48,
                  type: "manual",
                  question: "Calcula el determinante de $\\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\\\ 2 & 1 & 0 \\end{pmatrix}$ por Sarrus. Indica si la matriz tiene inversa.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 6,
              title: "Matriz adjunta y cofactores",
              content: "Para calcular la inversa de una matriz $3 \\times 3$ necesitamos primero entender los cofactores y la matriz adjunta. Es un proceso con varios pasos, pero cada uno es sencillo.\n\nPaso 1 - El menor $M_{ij}$: es el determinante de la submatriz que queda al eliminar la fila $i$ y la columna $j$. Por ejemplo, en una matriz $3 \\times 3$, el menor $M_{12}$ se calcula eliminando la fila 1 y la columna 2, y calculando el determinante de la matriz $2 \\times 2$ que queda.\n\nPaso 2 - El cofactor $C_{ij}$: se obtiene multiplicando el menor por un signo que depende de la posicion:\n\n$C_{ij} = (-1)^{i+j} \\cdot M_{ij}$\n\nEl patron de signos para una $3 \\times 3$ es:\n\n$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$\n\nEs decir: si $i + j$ es par, el signo es $+$; si es impar, el signo es $-$.\n\nPaso 3 - La matriz adjunta: se forma con todos los cofactores y luego se traspone. $\\text{adj}(A) = (C_{ij})^T$\n\nEjemplo completo con $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}$:\n\n$C_{11} = (+1) \\cdot \\begin{vmatrix} 1 & 4 \\\\ 6 & 0 \\end{vmatrix} = 1 \\cdot (0 - 24) = -24$\n\n$C_{12} = (-1) \\cdot \\begin{vmatrix} 0 & 4 \\\\ 5 & 0 \\end{vmatrix} = -1 \\cdot (0 - 20) = 20$\n\n$C_{13} = (+1) \\cdot \\begin{vmatrix} 0 & 1 \\\\ 5 & 6 \\end{vmatrix} = 1 \\cdot (0 - 5) = -5$\n\nY asi con las demas posiciones. Luego se monta la matriz de cofactores y se traspone para obtener la adjunta.",
              exercises: [
                {
                  id: 49,
                  type: "auto",
                  question: "El signo del cofactor $C_{23}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$+$ (positivo)", "$-$ (negativo)", "Depende del valor", "Siempre $+1$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 50,
                  type: "manual",
                  question: "Dada $A = \\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix}$, calcula los 4 cofactores ($C_{11}, C_{12}, C_{21}, C_{22}$) y forma la matriz adjunta $\\text{adj}(A)$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 51,
                  type: "manual",
                  question: "Para la matriz $A = \\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\\\ 2 & 1 & 0 \\end{pmatrix}$, calcula los cofactores $C_{11}$, $C_{12}$ y $C_{13}$ (primera fila completa).",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 52,
                  type: "manual",
                  question: "Calcula todos los cofactores de $A = \\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & -1 & 2 \\\\ 1 & 4 & -1 \\end{pmatrix}$, forma la matriz de cofactores y obten la adjunta $\\text{adj}(A)$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 7,
              title: "Matriz inversa",
              content: "La matriz inversa de $A$, que se escribe $A^{-1}$, es aquella que al multiplicarla por $A$ da la identidad:\n\n$A \\cdot A^{-1} = A^{-1} \\cdot A = I$\n\nCondicion para que exista: el determinante de $A$ debe ser distinto de cero ($|A| \\neq 0$). Si $|A| = 0$, la matriz NO tiene inversa.\n\nFormula general:\n\n$A^{-1} = \\frac{1}{|A|} \\cdot \\text{adj}(A)$\n\nAtajo para matrices $2 \\times 2$:\n\nSi $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ y $|A| = ad - bc \\neq 0$, entonces:\n\n$A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$\n\nEs decir: intercambias los elementos de la diagonal, cambias el signo de los otros dos, y divides todo por el determinante.\n\nEjemplo $2 \\times 2$ paso a paso:\n\n$A = \\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix}$\n\n$|A| = 2 \\cdot 3 - 1 \\cdot 5 = 6 - 5 = 1$\n\n$A^{-1} = \\frac{1}{1} \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix} = \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}$\n\nVerificacion: $A \\cdot A^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix} \\cdot \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix} = \\begin{pmatrix} 6-5 & -2+2 \\\\ 15-15 & -5+6 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I$\n\nPara una matriz $3 \\times 3$ el proceso es:\n\n1. Calcular $|A|$ (por Sarrus). Si es 0, no tiene inversa.\n\n2. Calcular todos los cofactores y formar $\\text{adj}(A)$.\n\n3. Dividir cada elemento de la adjunta por $|A|$.\n\n4. Verificar multiplicando $A \\cdot A^{-1} = I$.",
              exercises: [
                {
                  id: 53,
                  type: "auto",
                  question: "La matriz $\\begin{pmatrix} 6 & 3 \\\\ 2 & 1 \\end{pmatrix}$ tiene inversa?",
                  autoConfig: { type: "multiple_choice", choices: ["Si, porque es cuadrada", "No, porque su determinante es $0$", "Si, porque tiene numeros positivos", "No, porque no es simetrica"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 54,
                  type: "auto",
                  question: "Si $|A| = 5$, entonces $A^{-1}$ se calcula multiplicando la adjunta por:",
                  autoConfig: { type: "multiple_choice", choices: ["$5$", "$-5$", "$\\frac{1}{5}$", "$\\frac{-1}{5}$"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 55,
                  type: "manual",
                  question: "Calcula la inversa de $A = \\begin{pmatrix} 3 & 1 \\\\ 5 & 2 \\end{pmatrix}$ usando el atajo de $2 \\times 2$. Verifica que $A \\cdot A^{-1} = I$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 56,
                  type: "manual",
                  question: "Dada $A = \\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\\\ 2 & 1 & 0 \\end{pmatrix}$, calcula $|A|$, luego la adjunta, y finalmente $A^{-1}$. Muestra todos los pasos.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 57,
                  type: "manual",
                  question: "Calcula la inversa de $\\begin{pmatrix} 4 & 7 \\\\ 2 & 6 \\end{pmatrix}$ y verifica el resultado. Luego explica por que $\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ no tiene inversa.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        {
          name: "Sistemas de ecuaciones",
          order: 2,
          status: "locked",
          theoryBlocks: [
            {
              id: 4,
              title: "Tipos de sistemas y metodo de Gauss",
              content: "Un sistema de ecuaciones lineales es un conjunto de ecuaciones de primer grado con varias incognitas. Por ejemplo: { 2x + y = 5, x - y = 1 }. Los sistemas se clasifican segun sus soluciones en tres tipos.\n\nUn sistema compatible determinado (SCD) tiene una unica solucion. Un sistema compatible indeterminado (SCI) tiene infinitas soluciones (que dependen de uno o mas parametros). Un sistema incompatible (SI) no tiene ninguna solucion.\n\nEl metodo de Gauss consiste en transformar el sistema en otro equivalente con forma escalonada, usando operaciones elementales por filas: intercambiar dos filas, multiplicar una fila por un escalar distinto de cero, o sumar a una fila un multiplo de otra. El objetivo es conseguir ceros debajo de la diagonal principal.\n\nEjemplo: Resolver { x + y + z = 6, 2x + y - z = 1, x - y + 2z = 5 }. Escribimos la matriz ampliada [[1,1,1|6], [2,1,-1|1], [1,-1,2|5]]. F2 = F2 - 2*F1 nos da [[1,1,1|6], [0,-1,-3|-11], [1,-1,2|5]]. F3 = F3 - F1 nos da [[1,1,1|6], [0,-1,-3|-11], [0,-2,1|-1]]. F3 = F3 - 2*F2 nos da [[1,1,1|6], [0,-1,-3|-11], [0,0,7|21]]. De la tercera ecuacion: 7z = 21, z = 3. De la segunda: -y - 9 = -11, y = 2. De la primera: x + 2 + 3 = 6, x = 1.\n\nSi al escalonar aparece una fila del tipo (0 0 0 | k) con k distinto de 0, el sistema es incompatible. Si aparece (0 0 0 | 0), hay una ecuacion redundante y el sistema puede ser compatible indeterminado.",
              exercises: [
                {
                  id: 10,
                  type: "auto",
                  question: "Un sistema con la fila (0 0 0 | 5) en su forma escalonada es:",
                  autoConfig: { type: "multiple_choice", choices: ["Compatible determinado", "Compatible indeterminado", "Incompatible", "No se puede determinar"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 11,
                  type: "auto",
                  question: "El metodo de Gauss se basa en:",
                  autoConfig: { type: "multiple_choice", choices: ["Calcular determinantes", "Operaciones elementales por filas para escalonar la matriz", "Multiplicar matrices", "Hallar la matriz inversa"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 12,
                  type: "manual",
                  question: "Resuelve por el metodo de Gauss el sistema: { x + 2y - z = 3, 2x + y + z = 4, 3x + 3y + 0z = 7 }. Clasifica el sistema y, si tiene solucion, encuentrala.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 5,
              title: "Teorema de Rouche-Frobenius",
              content: "El teorema de Rouche-Frobenius permite clasificar un sistema de ecuaciones lineales sin necesidad de resolverlo completamente. Se basa en comparar los rangos de la matriz de coeficientes A y de la matriz ampliada (A|b).\n\nEl rango de una matriz es el numero maximo de filas (o columnas) linealmente independientes, que equivale al orden del mayor menor (subdeterminante) no nulo. Se puede calcular escalonando la matriz y contando las filas no nulas.\n\nEl teorema establece: dado un sistema de n incognitas con matriz de coeficientes A y matriz ampliada (A|b), si rang(A) es distinto de rang(A|b), el sistema es incompatible (no tiene solucion). Si rang(A) = rang(A|b) = r, el sistema es compatible. Si ademas r = n (numero de incognitas), es compatible determinado (solucion unica). Si r < n, es compatible indeterminado con n - r parametros libres (infinitas soluciones).\n\nEjemplo: Para el sistema { x + y = 3, 2x + 2y = 6, 3x + 3y = 9 }, la matriz A = [[1,1], [2,2], [3,3]] tiene rang(A) = 1 (las tres filas son proporcionales). La ampliada (A|b) = [[1,1,3], [2,2,6], [3,3,9]] tambien tiene rango 1. Como rang(A) = rang(A|b) = 1 < n = 2, el sistema es compatible indeterminado con 2-1 = 1 parametro libre.\n\nEste teorema es especialmente util en sistemas con parametros, donde se pide discutir el sistema segun los valores del parametro. Se plantean los determinantes relevantes y se analiza para que valores se anulan, clasificando el sistema en cada caso.",
              exercises: [
                {
                  id: 13,
                  type: "auto",
                  question: "Si rang(A) = 2, rang(A|b) = 3 y hay 3 incognitas, el sistema es:",
                  autoConfig: { type: "multiple_choice", choices: ["Compatible determinado", "Compatible indeterminado", "Incompatible", "No se puede determinar"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 14,
                  type: "auto",
                  question: "Un sistema compatible indeterminado con 4 incognitas y rang(A) = rang(A|b) = 2 tiene:",
                  autoConfig: { type: "multiple_choice", choices: ["1 parametro libre", "2 parametros libres", "3 parametros libres", "Solucion unica"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 15,
                  type: "manual",
                  question: "Discute segun los valores del parametro k el sistema: { x + y + z = 1, x + ky + z = k, 2x + y + (k+1)z = 2 }. Resuelve en los casos compatibles.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 6,
              title: "Regla de Cramer",
              content: "La regla de Cramer permite resolver sistemas de n ecuaciones con n incognitas cuando el determinante de la matriz de coeficientes es distinto de cero, es decir, cuando el sistema es compatible determinado.\n\nPara un sistema con matriz de coeficientes A y vector de terminos independientes b, cada incognita x_i se calcula como x_i = |A_i| / |A|, donde A_i es la matriz que resulta de sustituir la columna i de A por el vector b.\n\nEjemplo con sistema 2x2: { 3x + 2y = 7, x - y = 1 }. La matriz A = [[3,2],[1,-1]], con |A| = 3*(-1) - 2*1 = -5. Para x: |A_x| = |[[7,2],[1,-1]]| = 7*(-1) - 2*1 = -9, luego x = -9/(-5) = 9/5. Para y: |A_y| = |[[3,7],[1,1]]| = 3*1 - 7*1 = -4, luego y = -4/(-5) = 4/5.\n\nPara sistemas 3x3, el procedimiento es analogo pero con determinantes de 3x3 (usando Sarrus o cofactores). La ventaja de Cramer es que permite calcular una incognita especifica sin resolver todo el sistema. Su desventaja es que para sistemas grandes es computacionalmente costoso, ya que requiere calcular n+1 determinantes.\n\nCondicion de aplicacion: |A| debe ser distinto de 0. Si |A| = 0, la regla de Cramer no se puede aplicar y debemos usar Gauss o Rouche-Frobenius para clasificar y resolver el sistema.",
              exercises: [
                {
                  id: 16,
                  type: "auto",
                  question: "La regla de Cramer se puede aplicar cuando:",
                  autoConfig: { type: "multiple_choice", choices: ["El sistema tiene mas ecuaciones que incognitas", "El determinante de la matriz de coeficientes es 0", "El determinante de la matriz de coeficientes es distinto de 0", "El sistema es incompatible"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 17,
                  type: "auto",
                  question: "En la regla de Cramer, para hallar x_2 en un sistema 3x3 se sustituye por el vector b la columna:",
                  autoConfig: { type: "multiple_choice", choices: ["Primera", "Segunda", "Tercera", "Cualquiera"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 18,
                  type: "manual",
                  question: "Resuelve usando la regla de Cramer: { 2x + y - z = 3, x - y + 2z = 1, 3x + 2y + z = 10 }. Calcula cada determinante paso a paso usando Sarrus.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        {
          name: "Probabilidad",
          order: 3,
          status: "locked",
          theoryBlocks: [
            {
              id: 7,
              title: "Probabilidad basica y regla de Laplace",
              content: "La probabilidad es la rama de las matematicas que estudia los fenomenos aleatorios, aquellos cuyo resultado no se puede predecir con certeza. El espacio muestral (E u Omega) es el conjunto de todos los resultados posibles de un experimento aleatorio. Un suceso es cualquier subconjunto del espacio muestral.\n\nLa regla de Laplace establece que, si todos los resultados del espacio muestral son equiprobables, la probabilidad de un suceso A es: P(A) = numero de casos favorables / numero de casos posibles. Por ejemplo, al lanzar un dado justo, P(sacar par) = 3/6 = 1/2, ya que los casos favorables son {2, 4, 6} y los posibles son {1, 2, 3, 4, 5, 6}.\n\nPropiedades fundamentales: para cualquier suceso A, 0 <= P(A) <= 1. La probabilidad del suceso seguro es P(E) = 1 y la del suceso imposible es P(vacio) = 0. La probabilidad del suceso complementario es P(A') = 1 - P(A).\n\nPara la union de dos sucesos: P(A union B) = P(A) + P(B) - P(A interseccion B). Si A y B son mutuamente excluyentes (A interseccion B = vacio), entonces P(A union B) = P(A) + P(B). Estos axiomas y propiedades son la base de todo calculo de probabilidades y se aplican en los problemas tipicos de PAU.",
              exercises: [
                {
                  id: 19,
                  type: "auto",
                  question: "Se extraen 2 bolas de una urna con 3 rojas y 5 azules (sin reposicion). La probabilidad de que ambas sean rojas es:",
                  autoConfig: { type: "multiple_choice", choices: ["3/28", "9/64", "3/8", "6/56"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 20,
                  type: "auto",
                  question: "Si P(A) = 0.4 y P(B) = 0.3 y A y B son mutuamente excluyentes, P(A union B) es:",
                  autoConfig: { type: "multiple_choice", choices: ["0.12", "0.58", "0.7", "0.1"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 21,
                  type: "manual",
                  question: "En una clase de 30 alumnos, 18 estudian ingles, 12 estudian frances y 6 estudian ambos idiomas. Si se elige un alumno al azar, calcula: a) P(ingles o frances), b) P(ni ingles ni frances), c) P(solo ingles).",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 8,
              title: "Probabilidad condicionada y teorema de Bayes",
              content: "La probabilidad condicionada P(A|B) es la probabilidad de que ocurra A sabiendo que ya ha ocurrido B. Se define como: P(A|B) = P(A interseccion B) / P(B), siempre que P(B) > 0. De esta formula se deduce la regla del producto: P(A interseccion B) = P(B) * P(A|B).\n\nDos sucesos A y B son independientes si la ocurrencia de uno no afecta a la probabilidad del otro, es decir, P(A|B) = P(A). Esto equivale a P(A interseccion B) = P(A) * P(B). Cuidado: independencia y exclusion mutua son conceptos distintos.\n\nEl teorema de la probabilidad total establece que si B1, B2, ..., Bn forman una particion del espacio muestral (son mutuamente excluyentes y su union es E), entonces para cualquier suceso A: P(A) = P(B1)*P(A|B1) + P(B2)*P(A|B2) + ... + P(Bn)*P(A|Bn). Es muy util cuando se conocen probabilidades condicionadas pero se quiere la probabilidad total.\n\nEl teorema de Bayes permite \"invertir\" probabilidades condicionadas: P(Bi|A) = P(Bi)*P(A|Bi) / P(A), donde P(A) se calcula con la probabilidad total. Es especialmente util en problemas de diagnostico o clasificacion. Los diagramas de arbol son la herramienta visual clave: en cada rama se escribe la probabilidad condicionada, y para obtener P(A interseccion Bi) se multiplican las probabilidades del camino.",
              exercises: [
                {
                  id: 22,
                  type: "auto",
                  question: "Si P(A) = 0.6, P(B) = 0.5 y P(A interseccion B) = 0.3, entonces P(A|B) es:",
                  autoConfig: { type: "multiple_choice", choices: ["0.5", "0.6", "0.3", "0.15"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 23,
                  type: "auto",
                  question: "Dos sucesos son independientes si:",
                  autoConfig: { type: "multiple_choice", choices: ["P(A interseccion B) = 0", "P(A|B) = P(A)", "P(A union B) = 1", "P(A) + P(B) = 1"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 24,
                  type: "manual",
                  question: "Una fabrica tiene dos maquinas. La maquina M1 produce el 60% de las piezas y la M2 el 40%. El porcentaje de piezas defectuosas es del 3% en M1 y del 5% en M2. a) Calcula la probabilidad de que una pieza elegida al azar sea defectuosa. b) Si una pieza resulta defectuosa, calcula la probabilidad de que haya sido producida por M2.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 9,
              title: "Combinatoria aplicada",
              content: "La combinatoria proporciona las herramientas para contar el numero de formas de elegir o disponer elementos, lo que es esencial para calcular probabilidades con la regla de Laplace.\n\nVariaciones sin repeticion V(m,n): numero de formas de elegir n elementos de m y ordenarlos. V(m,n) = m! / (m-n)!. Ejemplo: de cuantas formas se pueden elegir presidente, secretario y tesorero entre 10 personas: V(10,3) = 10*9*8 = 720.\n\nVariaciones con repeticion VR(m,n): cuando se permite repetir, VR(m,n) = m^n. Ejemplo: cuantos numeros de 4 cifras se pueden formar con {1,2,3,4,5}: VR(5,4) = 5^4 = 625.\n\nPermutaciones P(n): caso particular de variaciones donde se ordenan todos los n elementos. P(n) = n!. Ejemplo: de cuantas formas se pueden sentar 6 personas en una fila: P(6) = 6! = 720.\n\nCombinaciones C(m,n) o (m sobre n): numero de formas de elegir n elementos de m sin importar el orden. C(m,n) = m! / (n! * (m-n)!). Ejemplo: de cuantas formas se puede elegir un comite de 3 personas entre 10: C(10,3) = 10! / (3! * 7!) = 120.\n\nAplicacion a probabilidad: para calcular la probabilidad de un suceso en un experimento sin orden y sin reposicion, se usan combinaciones. Ejemplo clasico: probabilidad de acertar 3 numeros de 6 en una loteria de 49: C(6,3)*C(43,3) / C(49,6).",
              exercises: [
                {
                  id: 25,
                  type: "auto",
                  question: "El numero de combinaciones C(8,3) es:",
                  autoConfig: { type: "multiple_choice", choices: ["336", "56", "24", "512"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 26,
                  type: "auto",
                  question: "Para contrasenas de 4 digitos (0-9) con repeticion se usa:",
                  autoConfig: { type: "multiple_choice", choices: ["Combinaciones C(10,4)", "Variaciones V(10,4)", "Variaciones con repeticion VR(10,4)", "Permutaciones P(4)"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 27,
                  type: "manual",
                  question: "En una urna hay 6 bolas rojas y 4 azules. Se extraen 3 bolas sin reposicion. Calcula: a) Probabilidad de que las 3 sean rojas. b) Probabilidad de que exactamente 2 sean rojas y 1 azul. c) Probabilidad de que al menos 1 sea azul.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        {
          name: "Estadistica",
          order: 4,
          status: "locked",
          theoryBlocks: [
            {
              id: 10,
              title: "Distribucion binomial",
              content: "La distribucion binomial B(n,p) modela el numero de exitos en n ensayos independientes de Bernoulli, donde cada ensayo tiene probabilidad de exito p y de fracaso q = 1-p.\n\nLa funcion de probabilidad es: P(X=k) = C(n,k) * p^k * q^(n-k), donde C(n,k) es el numero combinatorio. Esta formula calcula la probabilidad de obtener exactamente k exitos en n intentos.\n\nEjemplo: si lanzamos una moneda justa 5 veces, X = numero de caras sigue B(5, 0.5). La probabilidad de obtener exactamente 3 caras es: P(X=3) = C(5,3) * 0.5^3 * 0.5^2 = 10 * 0.125 * 0.25 = 0.3125.\n\nLos parametros de la distribucion binomial son: media (esperanza) E(X) = n*p, y varianza Var(X) = n*p*q. La desviacion tipica es sigma = sqrt(n*p*q). Estos valores permiten ubicar donde se concentra la distribucion y cual es su dispersion.\n\nPara probabilidades acumuladas se suman los valores individuales. Por ejemplo, P(X <= 2) = P(X=0) + P(X=1) + P(X=2). Para P(X >= k) es a menudo mas comodo calcular P(X >= k) = 1 - P(X <= k-1). La binomial se puede aproximar por una normal cuando n es grande (generalmente n*p >= 5 y n*q >= 5).",
              exercises: [
                {
                  id: 28,
                  type: "auto",
                  question: "Si X sigue B(10, 0.3), la media E(X) es:",
                  autoConfig: { type: "multiple_choice", choices: ["0.3", "3", "7", "2.1"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 29,
                  type: "auto",
                  question: "En una distribucion B(n,p), la varianza es:",
                  autoConfig: { type: "multiple_choice", choices: ["n*p", "n*p*q", "p*q", "n*q"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 30,
                  type: "manual",
                  question: "Un examen tipo test tiene 8 preguntas con 4 opciones cada una. Si un alumno responde al azar, calcula: a) La probabilidad de acertar exactamente 3 preguntas. b) La probabilidad de acertar al menos 2. c) El numero esperado de aciertos.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 11,
              title: "Distribucion normal",
              content: "La distribucion normal N(mu, sigma) es la distribucion continua mas importante en estadistica. Su funcion de densidad tiene forma de campana de Gauss, simetrica respecto a la media mu. Los parametros son: mu (media, centro de la campana) y sigma (desviacion tipica, que controla la anchura).\n\nPropiedades clave: la curva es simetrica respecto a x = mu. El area total bajo la curva es 1. Aproximadamente el 68.27% de los datos estan entre mu-sigma y mu+sigma, el 95.45% entre mu-2*sigma y mu+2*sigma, y el 99.73% entre mu-3*sigma y mu+3*sigma (regla 68-95-99.7).\n\nPara calcular probabilidades con la normal, se tipifica la variable: Z = (X - mu) / sigma. La variable Z sigue una distribucion normal estandar N(0,1), cuyas probabilidades se consultan en la tabla normal. La tabla da P(Z <= z), es decir, la probabilidad acumulada hasta z.\n\nEjemplo: Si X sigue N(170, 10) (alturas en cm), la probabilidad de que X < 185 se calcula tipificando: Z = (185-170)/10 = 1.5. En la tabla, P(Z <= 1.5) = 0.9332. Para P(X > 185) = 1 - 0.9332 = 0.0668.\n\nPropiedades utiles de la tabla: P(Z <= -z) = 1 - P(Z <= z) por simetria. P(a < Z < b) = P(Z <= b) - P(Z <= a). Si necesitas P(Z >= z) = 1 - P(Z <= z).",
              exercises: [
                {
                  id: 31,
                  type: "auto",
                  question: "Si X sigue N(50, 5), al tipificar X = 60 se obtiene Z =",
                  autoConfig: { type: "multiple_choice", choices: ["10", "2", "1", "0.5"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 32,
                  type: "auto",
                  question: "En una N(0,1), P(Z <= 0) es igual a:",
                  autoConfig: { type: "multiple_choice", choices: ["0", "0.5", "1", "0.68"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 33,
                  type: "manual",
                  question: "Las notas de un examen siguen una distribucion N(6.5, 1.5). Calcula: a) La probabilidad de sacar mas de 8. b) La probabilidad de sacar entre 5 y 7. c) La nota minima del 10% de alumnos con mejores resultados.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 12,
              title: "Intervalos de confianza",
              content: "Un intervalo de confianza es un rango de valores que, con una cierta probabilidad (nivel de confianza), contiene el verdadero valor de un parametro poblacional. Es la herramienta fundamental de la inferencia estadistica.\n\nPara la media poblacional mu, cuando se conoce la desviacion tipica poblacional sigma, el intervalo de confianza al nivel (1-alfa) es: (x_barra - z_(alfa/2) * sigma/sqrt(n), x_barra + z_(alfa/2) * sigma/sqrt(n)), donde x_barra es la media muestral, n es el tamano de la muestra, y z_(alfa/2) es el valor critico de la normal estandar.\n\nValores criticos habituales: para confianza del 90%, z = 1.645. Para 95%, z = 1.96. Para 99%, z = 2.576.\n\nEl margen de error E es la mitad de la amplitud del intervalo: E = z_(alfa/2) * sigma/sqrt(n). De aqui se puede despejar el tamano de muestra minimo para un margen de error deseado: n = (z_(alfa/2) * sigma / E)^2. Si el resultado no es entero, se redondea al entero superior.\n\nInterpretacion correcta: un intervalo de confianza del 95% significa que, si repitieramos el muestreo muchas veces, el 95% de los intervalos construidos contendrian el verdadero valor de mu. NO significa que hay un 95% de probabilidad de que mu este en ese intervalo concreto (mu es fijo, no aleatorio).",
              exercises: [
                {
                  id: 34,
                  type: "auto",
                  question: "El valor critico z para un nivel de confianza del 95% es:",
                  autoConfig: { type: "multiple_choice", choices: ["1.645", "1.96", "2.576", "1.28"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 35,
                  type: "auto",
                  question: "Si se duplica el tamano de la muestra, el margen de error:",
                  autoConfig: { type: "multiple_choice", choices: ["Se reduce a la mitad", "Se divide por sqrt(2)", "Se mantiene igual", "Se duplica"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 36,
                  type: "manual",
                  question: "Se mide la duracion de 100 llamadas telefonicas y se obtiene una media de 4.2 minutos. Si sigma = 1.8 minutos: a) Construye un intervalo de confianza al 95% para la media. b) Calcula el tamano de muestra necesario para que el margen de error sea menor que 0.2 minutos con confianza del 99%.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        {
          name: "Funciones",
          order: 5,
          status: "locked",
          theoryBlocks: [
            {
              id: 13,
              title: "Dominio, recorrido y tipos de funciones",
              content: "Una funcion f: A -> B es una relacion que asigna a cada elemento x del conjunto A (dominio) exactamente un elemento y = f(x) del conjunto B. El dominio Dom(f) es el conjunto de valores de x para los que la funcion esta definida. El recorrido o imagen Im(f) es el conjunto de valores que toma f(x).\n\nPara hallar el dominio, se buscan las restricciones: en funciones racionales (cocientes), el denominador no puede ser cero. En raices de indice par, el radicando debe ser >= 0. En logaritmos, el argumento debe ser > 0.\n\nEjemplos: Dom(f(x) = 1/(x-2)) = R - {2}. Dom(f(x) = sqrt(x-3)) = [3, +infinito). Dom(f(x) = ln(x^2-1)) requiere x^2-1 > 0, es decir x < -1 o x > 1.\n\nClasificacion de funciones: una funcion es inyectiva si elementos distintos tienen imagenes distintas (pasa el test de la linea horizontal). Es sobreyectiva si todo elemento del codominio tiene al menos una preimagen. Es biyectiva si es inyectiva y sobreyectiva a la vez, y en ese caso tiene funcion inversa.\n\nTipos de funciones elementales: polinomicas (f(x) = a_n*x^n + ... + a_0), racionales (cociente de polinomios), exponenciales (f(x) = a^x, con a > 0), logaritmicas (f(x) = log_a(x)), trigonometricas (sin, cos, tan).",
              exercises: [
                {
                  id: 37,
                  type: "auto",
                  question: "El dominio de f(x) = sqrt(4 - x^2) es:",
                  autoConfig: { type: "multiple_choice", choices: ["R", "[-2, 2]", "(0, 4)", "(-infinito, 2]"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 38,
                  type: "auto",
                  question: "El dominio de f(x) = ln(x) + 1/(x-1) es:",
                  autoConfig: { type: "multiple_choice", choices: ["(0, +infinito)", "(0, 1) union (1, +infinito)", "R - {1}", "(1, +infinito)"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 39,
                  type: "manual",
                  question: "Dada f(x) = (x^2 - 4)/(x^2 - 1): a) Halla el dominio. b) Estudia si es inyectiva. c) Calcula f(0), f(2) y f(-3).",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 14,
              title: "Limites y continuidad",
              content: "El limite de f(x) cuando x tiende a a, lim(x->a) f(x) = L, significa que f(x) se aproxima tanto como queramos a L cuando x se acerca suficientemente a a (sin llegar a a). El limite puede existir aunque f(a) no este definida.\n\nPropiedades de los limites: el limite de una suma es la suma de los limites, lo mismo para el producto, cociente (si el limite del denominador no es 0), y la composicion de funciones continuas.\n\nIndeterminaciones mas frecuentes: 0/0 se resuelve factorizando, racionalizando o aplicando L'Hopital. infinito/infinito se resuelve dividiendo por la mayor potencia o con L'Hopital. infinito - infinito se transforma en un cociente. 0 * infinito se reescribe como cociente. 1^infinito se resuelve con el limite notable: lim(1 + 1/n)^n = e.\n\nEjemplo: lim(x->2) (x^2-4)/(x-2) = lim(x->2) (x-2)(x+2)/(x-2) = lim(x->2) (x+2) = 4.\n\nContinuidad: f es continua en x = a si se cumplen tres condiciones: 1) existe f(a), 2) existe lim(x->a) f(x), y 3) lim(x->a) f(x) = f(a). Si alguna falla, hay discontinuidad. Las discontinuidades pueden ser evitables (el limite existe pero no coincide con f(a)) o de salto (los limites laterales son distintos).",
              exercises: [
                {
                  id: 40,
                  type: "auto",
                  question: "lim(x->3) (x^2 - 9)/(x - 3) es igual a:",
                  autoConfig: { type: "multiple_choice", choices: ["0", "6", "9", "No existe"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 41,
                  type: "auto",
                  question: "Una funcion f es continua en x = a si:",
                  autoConfig: { type: "multiple_choice", choices: ["f(a) esta definida", "El limite en a existe", "f(a) = lim(x->a) f(x) y ambos existen", "f'(a) existe"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 42,
                  type: "manual",
                  question: "Dada f(x) = { (x^2 - 1)/(x - 1) si x != 1, k si x = 1 }: a) Calcula lim(x->1) f(x). b) Determina el valor de k para que f sea continua en x = 1. c) Estudia la continuidad de g(x) = (x^2 + x - 6)/(x - 2) en x = 2.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 15,
              title: "Asintotas",
              content: "Las asintotas son rectas a las que la grafica de una funcion se aproxima indefinidamente. Hay tres tipos: verticales, horizontales y oblicuas.\n\nAsintotas verticales: la recta x = a es asintota vertical si lim(x->a+) f(x) = +/-infinito o lim(x->a-) f(x) = +/-infinito. Se buscan en los puntos donde la funcion no esta definida (denominador = 0 en funciones racionales). Ejemplo: f(x) = 1/(x-2) tiene asintota vertical en x = 2.\n\nAsintotas horizontales: la recta y = b es asintota horizontal si lim(x->+infinito) f(x) = b o lim(x->-infinito) f(x) = b. En funciones racionales: si grado del numerador < grado del denominador, AH en y = 0. Si grados iguales, AH en y = cociente de coeficientes principales. Si grado numerador > grado denominador, no hay AH.\n\nAsintotas oblicuas: la recta y = mx + n es asintota oblicua cuando no hay horizontal. Se calcula: m = lim(x->infinito) f(x)/x, y n = lim(x->infinito) [f(x) - mx]. Solo existen en funciones racionales cuando el grado del numerador es exactamente una unidad mayor que el del denominador.\n\nEjemplo completo: f(x) = (2x^2 + 1)/(x - 1). AV en x = 1 (denominador = 0). No hay AH (grado num = 2 > grado den = 1). AO: m = lim(2x^2+1)/(x(x-1)) = 2, n = lim((2x^2+1)/(x-1) - 2x) = lim(2x+1)/(x-1) = 2. La asintota oblicua es y = 2x + 2.",
              exercises: [
                {
                  id: 43,
                  type: "auto",
                  question: "f(x) = (3x + 1)/(x - 2) tiene asintota horizontal en:",
                  autoConfig: { type: "multiple_choice", choices: ["y = 0", "y = 3", "y = -2", "No tiene asintota horizontal"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 44,
                  type: "auto",
                  question: "Una funcion racional tiene asintota oblicua cuando:",
                  autoConfig: { type: "multiple_choice", choices: ["Grado numerador = grado denominador", "Grado numerador < grado denominador", "Grado numerador = grado denominador + 1", "Siempre tiene"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 45,
                  type: "manual",
                  question: "Para f(x) = (x^2 - 3x + 2)/(x - 3): a) Halla las asintotas verticales. b) Comprueba que no hay asintota horizontal. c) Calcula la asintota oblicua y = mx + n.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        {
          name: "Derivadas",
          order: 6,
          status: "locked",
          theoryBlocks: [
            {
              id: 16,
              title: "Concepto y reglas de derivacion",
              content: "La derivada de una funcion f en un punto a, f'(a), se define como el limite del cociente incremental: f'(a) = lim(h->0) [f(a+h) - f(a)] / h. Geometricamente, es la pendiente de la recta tangente a la grafica de f en el punto (a, f(a)). Fisicamente, representa la tasa de cambio instantanea.\n\nTabla de derivadas fundamentales: (x^n)' = n*x^(n-1). (e^x)' = e^x. (a^x)' = a^x * ln(a). (ln x)' = 1/x. (log_a x)' = 1/(x * ln a). (sin x)' = cos x. (cos x)' = -sin x. (tan x)' = 1/cos^2(x) = 1 + tan^2(x).\n\nReglas de derivacion: regla de la suma: (f + g)' = f' + g'. Producto por constante: (k*f)' = k*f'. Regla del producto: (f*g)' = f'*g + f*g'. Regla del cociente: (f/g)' = (f'*g - f*g') / g^2.\n\nRegla de la cadena: si h(x) = f(g(x)), entonces h'(x) = f'(g(x)) * g'(x). Es decir, se deriva la funcion exterior evaluada en la interior, y se multiplica por la derivada de la interior. Ejemplo: si h(x) = (3x+1)^5, entonces h'(x) = 5*(3x+1)^4 * 3 = 15*(3x+1)^4.\n\nLa regla de la cadena es la mas importante de todas porque permite derivar funciones compuestas, que son la mayoria de las funciones que aparecen en PAU.",
              exercises: [
                {
                  id: 46,
                  type: "auto",
                  question: "La derivada de f(x) = x^3 * e^x es:",
                  autoConfig: { type: "multiple_choice", choices: ["3x^2 * e^x", "x^3 * e^x + 3x^2 * e^x", "3x^2 + e^x", "x^3 * e^x"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 47,
                  type: "auto",
                  question: "La derivada de f(x) = ln(x^2 + 1) es:",
                  autoConfig: { type: "multiple_choice", choices: ["1/(x^2+1)", "2x/(x^2+1)", "2x*ln(x^2+1)", "1/x"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 48,
                  type: "manual",
                  question: "Calcula la derivada de cada funcion: a) f(x) = (2x-1)/(x^2+3), b) g(x) = e^(x^2-3x), c) h(x) = sqrt(1 + sin(x)). Simplifica los resultados.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 17,
              title: "Recta tangente y monotonia",
              content: "La recta tangente a la grafica de f en el punto x = a tiene la ecuacion: y - f(a) = f'(a) * (x - a). El punto de tangencia es (a, f(a)) y la pendiente es f'(a). La recta normal es perpendicular a la tangente y tiene pendiente -1/f'(a).\n\nEjemplo: hallar la recta tangente a f(x) = x^2 - 3x + 1 en x = 2. Calculamos f(2) = 4-6+1 = -1 y f'(x) = 2x-3, f'(2) = 1. La ecuacion es: y - (-1) = 1*(x - 2), es decir, y = x - 3.\n\nEstudio de la monotonia (crecimiento y decrecimiento): f es creciente en un intervalo si f'(x) > 0 en ese intervalo, y decreciente si f'(x) < 0. Para estudiar la monotonia: 1) calcular f'(x), 2) resolver f'(x) = 0 para hallar los puntos criticos, 3) estudiar el signo de f'(x) en cada intervalo determinado por los puntos criticos.\n\nExtremos relativos: en un punto critico x = c donde f'(c) = 0, si f' cambia de positivo a negativo, hay un maximo relativo. Si cambia de negativo a positivo, hay un minimo relativo. Si no cambia de signo, no hay extremo (punto de inflexion con tangente horizontal).\n\nCriterio alternativo con la segunda derivada: si f'(c) = 0 y f''(c) < 0, hay maximo relativo. Si f'(c) = 0 y f''(c) > 0, hay minimo relativo. Si f''(c) = 0, el criterio no decide y hay que analizar el signo de f'.",
              exercises: [
                {
                  id: 49,
                  type: "auto",
                  question: "Si f'(3) = 0 y f''(3) = -2, en x = 3 hay:",
                  autoConfig: { type: "multiple_choice", choices: ["Minimo relativo", "Maximo relativo", "Punto de inflexion", "No se puede determinar"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 50,
                  type: "auto",
                  question: "Una funcion es decreciente en un intervalo si en ese intervalo:",
                  autoConfig: { type: "multiple_choice", choices: ["f'(x) > 0", "f'(x) < 0", "f''(x) < 0", "f(x) < 0"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 51,
                  type: "manual",
                  question: "Dada f(x) = x^3 - 3x^2 + 4: a) Halla la recta tangente en x = 1. b) Estudia los intervalos de crecimiento y decrecimiento. c) Determina los extremos relativos y sus valores.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 18,
              title: "Concavidad y puntos de inflexion",
              content: "La segunda derivada f''(x) proporciona informacion sobre la concavidad de la funcion. Si f''(x) > 0 en un intervalo, la funcion es concava hacia arriba (convexa) en ese intervalo: la grafica queda por encima de sus tangentes. Si f''(x) < 0, la funcion es concava hacia abajo: la grafica queda por debajo de sus tangentes.\n\nUn punto de inflexion es un punto donde la funcion cambia de concavidad. Para encontrarlos: 1) calcular f''(x), 2) resolver f''(x) = 0 para obtener los candidatos, 3) comprobar que f'' cambia de signo en ese punto (si no cambia, no es punto de inflexion).\n\nEjemplo: f(x) = x^3 - 6x^2 + 9x + 1. f'(x) = 3x^2 - 12x + 9, f''(x) = 6x - 12. Resolvemos f''(x) = 0: 6x - 12 = 0, x = 2. Para x < 2, f''(x) < 0 (concava abajo). Para x > 2, f''(x) > 0 (concava arriba). Como cambia de signo, x = 2 es punto de inflexion. El punto es (2, f(2)) = (2, 3).\n\nEstudio completo de una funcion: se combinan el analisis de la primera derivada (monotonia y extremos) con el de la segunda derivada (concavidad e inflexiones) para obtener una descripcion completa del comportamiento de la funcion. Junto con el dominio, las asintotas y algunos puntos notables (cortes con los ejes), se puede trazar la grafica de la funcion con precision.",
              exercises: [
                {
                  id: 52,
                  type: "auto",
                  question: "Si f''(x) > 0 en un intervalo, la funcion es:",
                  autoConfig: { type: "multiple_choice", choices: ["Creciente", "Decreciente", "Concava hacia arriba (convexa)", "Concava hacia abajo"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 53,
                  type: "auto",
                  question: "Un punto de inflexion es un punto donde:",
                  autoConfig: { type: "multiple_choice", choices: ["f'(x) = 0", "La funcion cambia de creciente a decreciente", "f''(x) = 0 y cambia de signo", "f(x) = 0"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 54,
                  type: "manual",
                  question: "Realiza un estudio completo de f(x) = x^4 - 8x^2 + 16: a) Dominio y simetrias. b) Extremos relativos (usando f'). c) Puntos de inflexion (usando f''). d) Esboza la grafica indicando toda la informacion obtenida.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        {
          name: "Optimizacion",
          order: 7,
          status: "locked",
          theoryBlocks: [
            {
              id: 19,
              title: "Planteamiento de problemas de optimizacion",
              content: "Los problemas de optimizacion consisten en encontrar el valor maximo o minimo de una magnitud sujeta a ciertas restricciones. Son uno de los ejercicios mas habituales en la PAU y requieren combinar el planteamiento del problema con las tecnicas de derivacion.\n\nPaso 1: Identificar la variable a optimizar. Leer el enunciado con atencion y determinar que magnitud se quiere maximizar o minimizar (area, volumen, coste, distancia, etc.).\n\nPaso 2: Escribir la funcion objetivo. Expresar la magnitud a optimizar como una funcion matematica de una o varias variables. Por ejemplo, si queremos maximizar el area de un rectangulo: A = base * altura.\n\nPaso 3: Establecer las restricciones. Identificar las condiciones que limitan las variables (perimetro fijo, material disponible, relaciones geometricas, etc.). Por ejemplo: perimetro = 2*base + 2*altura = 20.\n\nPaso 4: Expresar la funcion objetivo en una sola variable. Usar la restriccion para eliminar una variable. En el ejemplo: altura = (20 - 2*base)/2 = 10 - base, y sustituir en A: A(base) = base * (10 - base) = 10*base - base^2.\n\nEl dominio de la funcion debe tener sentido fisico: las magnitudes geometricas deben ser positivas. En el ejemplo, base > 0 y altura > 0, lo que implica 0 < base < 10.",
              exercises: [
                {
                  id: 55,
                  type: "manual",
                  question: "Un ganadero quiere cercar un corral rectangular adosado a un muro (que hace de un lado). Dispone de 100 metros de valla. Plantea la funcion objetivo y la restriccion para maximizar el area del corral.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 56,
                  type: "manual",
                  question: "Se quiere fabricar una lata cilindrica de 1 litro (1000 cm^3) de volumen con la menor cantidad de material posible. Expresa el area total (tapa + base + lateral) en funcion del radio r.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 57,
                  type: "manual",
                  question: "Un cable aereo va desde un punto A situado a 3 km de la costa hasta un pueblo B en la costa a 5 km del punto mas cercano. El cable por mar cuesta 5000 euros/km y por tierra 3000 euros/km. Plantea la funcion de coste en funcion de x (distancia en la costa desde el punto mas cercano a A hasta donde el cable toca tierra).",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 20,
              title: "Resolucion y verificacion",
              content: "Una vez que la funcion objetivo esta expresada en una variable, se resuelve el problema aplicando las tecnicas de derivacion para hallar extremos.\n\nPaso 5: Derivar la funcion objetivo e igualar a cero. Calculamos f'(x) = 0 para encontrar los puntos criticos. Ejemplo: si A(x) = 10x - x^2, entonces A'(x) = 10 - 2x = 0, luego x = 5.\n\nPaso 6: Comprobar que es maximo o minimo con la segunda derivada. Si f''(x) < 0 en el punto critico, es un maximo. Si f''(x) > 0, es un minimo. En el ejemplo: A''(x) = -2 < 0, por lo tanto x = 5 da el area maxima.\n\nPaso 7: Comprobar las condiciones de contorno. Si el dominio es un intervalo cerrado [a,b], hay que evaluar la funcion tambien en los extremos del intervalo y comparar con el valor en el punto critico, ya que el maximo o minimo absoluto podria estar en un extremo.\n\nPaso 8: Interpretar el resultado. Volver al contexto del problema y dar una respuesta completa. En el ejemplo: la base debe medir 5 m, la altura 10-5 = 5 m, y el area maxima es 25 m^2. Es decir, el rectangulo de perimetro 20 con mayor area es el cuadrado.\n\nErrores frecuentes: olvidar verificar con la segunda derivada, no comprobar que el punto critico pertenece al dominio, no interpretar la respuesta en el contexto del problema, o confundir maximo con minimo.",
              exercises: [
                {
                  id: 58,
                  type: "manual",
                  question: "Resuelve: un ganadero tiene 100 m de valla para cercar un corral rectangular adosado a un muro. Halla las dimensiones que maximizan el area. Verifica con la segunda derivada.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 59,
                  type: "manual",
                  question: "Halla las dimensiones de la lata cilindrica de 1 litro (1000 cm^3) que usa la minima cantidad de material. Recuerda: V = pi*r^2*h, A = 2*pi*r^2 + 2*pi*r*h.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 60,
                  type: "manual",
                  question: "De todos los triangulos rectangulos cuya hipotenusa mide 10 cm, halla las dimensiones de aquel cuya area es maxima. Usa que si los catetos son a y b, entonces a^2 + b^2 = 100.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        {
          name: "Integrales",
          order: 8,
          status: "locked",
          theoryBlocks: [
            {
              id: 21,
              title: "Primitivas y reglas basicas de integracion",
              content: "La primitiva (o antiderivada) de una funcion f(x) es una funcion F(x) tal que F'(x) = f(x). La integral indefinida se escribe como: integral de f(x) dx = F(x) + C, donde C es la constante de integracion (ya que si F'(x) = f(x), tambien (F(x)+C)' = f(x) para cualquier constante C).\n\nTabla de integrales basicas: integral de x^n dx = x^(n+1)/(n+1) + C (para n distinto de -1). Integral de 1/x dx = ln|x| + C. Integral de e^x dx = e^x + C. Integral de a^x dx = a^x/ln(a) + C. Integral de sin(x) dx = -cos(x) + C. Integral de cos(x) dx = sin(x) + C. Integral de 1/cos^2(x) dx = tan(x) + C.\n\nPropiedades de la integral: la integral de una suma es la suma de las integrales: integral de (f+g) = integral de f + integral de g. Una constante multiplicativa sale fuera: integral de k*f = k * integral de f.\n\nEjemplos: integral de (3x^2 + 2x - 5) dx = x^3 + x^2 - 5x + C. Integral de (e^x + 1/x) dx = e^x + ln|x| + C. Integral de 4*cos(x) dx = 4*sin(x) + C.\n\nPara verificar una integral, basta derivar el resultado: si obtenemos la funcion original, la integral es correcta. Esta verificacion es especialmente util en examenes.",
              exercises: [
                {
                  id: 61,
                  type: "auto",
                  question: "La integral de x^4 dx es:",
                  autoConfig: { type: "multiple_choice", choices: ["4x^3 + C", "x^5/5 + C", "x^5 + C", "5x^5 + C"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 62,
                  type: "auto",
                  question: "La integral de 1/x dx es:",
                  autoConfig: { type: "multiple_choice", choices: ["x^0 + C", "ln(x) + C", "ln|x| + C", "-1/x^2 + C"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 63,
                  type: "manual",
                  question: "Calcula las siguientes integrales: a) integral de (3x^2 - 4x + 1/x) dx, b) integral de (2*e^x - 3*sin(x)) dx, c) integral de (x + 1)^2 dx (desarrolla primero).",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 22,
              title: "Metodos de integracion",
              content: "Cuando la integral no se puede resolver directamente con la tabla de integrales basicas, se aplican metodos de integracion.\n\nMetodo de sustitucion (cambio de variable): consiste en hacer un cambio u = g(x), de modo que du = g'(x)*dx, transformando la integral en una mas sencilla. La clave es identificar una funcion interior cuya derivada (o un multiplo) aparece como factor.\n\nEjemplo: integral de 2x*e^(x^2) dx. Hacemos u = x^2, du = 2x*dx. La integral queda: integral de e^u du = e^u + C = e^(x^2) + C.\n\nOtro ejemplo: integral de cos(x)/(1 + sin(x)) dx. Hacemos u = 1 + sin(x), du = cos(x)*dx. Queda: integral de 1/u du = ln|u| + C = ln|1 + sin(x)| + C.\n\nIntegracion por partes: se basa en la formula integral de u*dv = u*v - integral de v*du. Se elige u (que se deriva) y dv (que se integra) segun la regla LIATE: Logaritmicas, Inversas trigonometricas, Algebraicas (polinomios), Trigonometricas, Exponenciales. Se elige u lo mas a la izquierda posible.\n\nEjemplo: integral de x*e^x dx. Elegimos u = x (algebraica), dv = e^x*dx. Entonces du = dx, v = e^x. Aplicando: integral = x*e^x - integral de e^x dx = x*e^x - e^x + C = e^x*(x-1) + C.\n\nA veces hay que aplicar por partes dos veces seguidas, como en integral de x^2*e^x dx o integral de e^x*sin(x) dx.",
              exercises: [
                {
                  id: 64,
                  type: "auto",
                  question: "Para integral de 3x^2 * cos(x^3) dx, el cambio de variable adecuado es:",
                  autoConfig: { type: "multiple_choice", choices: ["u = cos(x^3)", "u = x^3", "u = 3x^2", "u = x^2"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 65,
                  type: "auto",
                  question: "En integracion por partes de integral de x*ln(x) dx, se elige u =",
                  autoConfig: { type: "multiple_choice", choices: ["x", "ln(x)", "x*ln(x)", "1/x"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 66,
                  type: "manual",
                  question: "Calcula: a) integral de x/(x^2+1)^2 dx (sustitucion), b) integral de x*cos(x) dx (por partes), c) integral de ln(x) dx (por partes con dv = dx).",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 23,
              title: "Integral definida y areas",
              content: "La integral definida integral[a,b] f(x) dx se calcula mediante el teorema fundamental del calculo: integral[a,b] f(x) dx = F(b) - F(a), donde F es cualquier primitiva de f. Los valores a y b son los limites de integracion (inferior y superior).\n\nEjemplo: integral[1,3] (2x + 1) dx. Una primitiva es F(x) = x^2 + x. Evaluamos: F(3) - F(1) = (9+3) - (1+1) = 12 - 2 = 10.\n\nPropiedades de la integral definida: integral[a,a] f(x) dx = 0. integral[a,b] f(x) dx = -integral[b,a] f(x) dx. integral[a,b] (f+g) = integral[a,b] f + integral[a,b] g. integral[a,c] f = integral[a,b] f + integral[b,c] f.\n\nCalculo de areas: si f(x) >= 0 en [a,b], el area bajo la curva y sobre el eje X es directamente integral[a,b] f(x) dx. Si f(x) <= 0 en [a,b], el area es -integral[a,b] f(x) dx (o equivalentemente integral[a,b] |f(x)| dx). Si f cambia de signo en [a,b], hay que dividir el intervalo en los puntos donde f(x) = 0 y calcular cada area por separado.\n\nArea entre dos curvas: si f(x) >= g(x) en [a,b], el area encerrada entre ambas es integral[a,b] [f(x) - g(x)] dx. Primero se hallan los puntos de corte (f(x) = g(x)) para determinar los limites de integracion y cual funcion va arriba en cada intervalo.",
              exercises: [
                {
                  id: 67,
                  type: "auto",
                  question: "integral[0,2] (3x^2) dx es igual a:",
                  autoConfig: { type: "multiple_choice", choices: ["12", "8", "6", "4"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 68,
                  type: "auto",
                  question: "Si f(x) < 0 en [a,b], el area entre f y el eje X es:",
                  autoConfig: { type: "multiple_choice", choices: ["integral[a,b] f(x) dx", "-integral[a,b] f(x) dx", "0", "No se puede calcular"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 69,
                  type: "manual",
                  question: "Calcula el area encerrada entre la parabola y = x^2 - 4 y el eje X. Primero halla los puntos de corte con el eje X, luego determina el signo de la funcion en el intervalo, y finalmente calcula la integral.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        }
      ],
      weeklyPlan: [
        { day: "Lunes", task: "Tipos de matrices", topic: "Matrices", blockId: 1, done: false },
        { day: "Martes", task: "Suma, resta y escalar", topic: "Matrices", blockId: 2, done: false },
        { day: "Miercoles", task: "Traspuesta", topic: "Matrices", blockId: 3, done: false },
        { day: "Jueves", task: "Multiplicacion de matrices", topic: "Matrices", blockId: 4, done: false },
        { day: "Viernes", task: "Determinantes", topic: "Matrices", blockId: 5, done: false },
        { day: "Sabado", task: "Adjunta y cofactores", topic: "Matrices", blockId: 6, done: false },
        { day: "Domingo", task: "Repaso: Matriz inversa", topic: "Matrices", blockId: 7, done: false }
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
