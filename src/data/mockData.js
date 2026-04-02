import sistemas from './topics/sistemas'
import probabilidad from './topics/probabilidad'
import estadistica from './topics/estadistica'
import funciones from './topics/funciones'
import derivadas from './topics/derivadas'
import optimizacion from './topics/optimizacion'

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
  records: []
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
              status: "available",
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
              status: "locked",
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
              status: "locked",
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
              status: "locked",
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
                  id: 200,
                  type: "auto",
                  question: "El producto $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\cdot \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ es igual a:",
                  autoConfig: { type: "multiple_choice", choices: ["$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$", "$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$", "$\\begin{pmatrix} 2 & 2 \\\\ 3 & 5 \\end{pmatrix}$", "$\\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 201,
                  type: "auto",
                  question: "La multiplicacion de matrices es conmutativa ($A \\cdot B = B \\cdot A$ siempre)?",
                  autoConfig: { type: "multiple_choice", choices: ["Si, siempre", "Solo si son cuadradas", "No, en general $A \\cdot B \\neq B \\cdot A$", "Solo si son simetricas"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 202,
                  type: "auto",
                  question: "Si $A$ es de $4 \\times 2$ y $B$ es de $2 \\times 5$, cuantos elementos tiene el producto $A \\cdot B$?",
                  autoConfig: { type: "multiple_choice", choices: ["$8$", "$10$", "$20$", "$40$"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 203,
                  type: "auto",
                  question: "El elemento $c_{12}$ de $C = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix} \\cdot \\begin{pmatrix} 1 & 4 \\\\ 2 & -1 \\end{pmatrix}$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "7" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 204,
                  type: "auto",
                  question: "Para que exista el producto $A \\cdot B$, el numero de columnas de $A$ debe ser igual al numero de ______ de $B$:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "filas" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 205,
                  type: "auto",
                  question: "El elemento $c_{21}$ de $C = \\begin{pmatrix} 1 & 0 \\\\ -1 & 2 \\end{pmatrix} \\cdot \\begin{pmatrix} 3 & 1 \\\\ 4 & 5 \\end{pmatrix}$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "5" },
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
                },
                {
                  id: 206,
                  type: "manual",
                  question: "Dada $A = \\begin{pmatrix} 1 & -1 \\\\ 2 & 0 \\\\ 3 & 1 \\end{pmatrix}$ y $B = \\begin{pmatrix} 2 & 0 & 1 \\\\ -1 & 3 & 2 \\end{pmatrix}$, calcula $A \\cdot B$. Indica la dimension del resultado antes de empezar. Puede calcularse $B \\cdot A$? Si es asi, calculalo y compara dimensiones.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 207,
                  type: "manual",
                  question: "Calcula $A^2 = A \\cdot A$ para $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$. Luego calcula $A^3 = A^2 \\cdot A$. Observa el patron y formula una hipotesis sobre $A^n$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 208,
                  type: "manual",
                  question: "Dadas $A = \\begin{pmatrix} 2 & 1 \\\\ -1 & 3 \\end{pmatrix}$ y $B = \\begin{pmatrix} 0 & 4 \\\\ 1 & -2 \\end{pmatrix}$, verifica que $(A \\cdot B)^T = B^T \\cdot A^T$ calculando ambos lados de la igualdad.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 5,
              status: "locked",
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
                  id: 300,
                  type: "auto",
                  question: "El determinante de $\\begin{pmatrix} -1 & 3 \\\\ 2 & -4 \\end{pmatrix}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$-2$", "$2$", "$-10$", "$10$"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 301,
                  type: "auto",
                  question: "Si el determinante de una matriz es $0$, la matriz se llama:",
                  autoConfig: { type: "multiple_choice", choices: ["Regular", "Identidad", "Singular", "Simetrica"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 302,
                  type: "auto",
                  question: "El determinante de la matriz identidad $I_3$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$0$", "$1$", "$3$", "No se puede calcular"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 303,
                  type: "auto",
                  question: "El determinante de $\\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$10$", "$30$", "$0$", "$15$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 304,
                  type: "auto",
                  question: "El determinante de $\\begin{pmatrix} 5 & -2 \\\\ 3 & 7 \\end{pmatrix}$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "41" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 305,
                  type: "auto",
                  question: "Si $|A| = 3$ y $|B| = -2$, entonces $|A \\cdot B|$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "-6" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 306,
                  type: "auto",
                  question: "El determinante de $\\begin{pmatrix} 0 & 1 \\\\ -3 & 2 \\end{pmatrix}$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "3" },
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
                },
                {
                  id: 307,
                  type: "manual",
                  question: "Calcula por Sarrus el determinante de $\\begin{pmatrix} 3 & -1 & 2 \\\\ 0 & 4 & -3 \\\\ 1 & 2 & 1 \\end{pmatrix}$. Muestra cada diagonal por separado y clasifica la matriz como regular o singular.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 308,
                  type: "manual",
                  question: "Determina para que valor de $k$ la matriz $\\begin{pmatrix} 1 & k \\\\ 3 & 6 \\end{pmatrix}$ es singular. Explica que significa geometricamente que una matriz $2 \\times 2$ tenga determinante cero.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 309,
                  type: "manual",
                  question: "Calcula el determinante de $\\begin{pmatrix} 1 & 2 & -1 \\\\ 3 & 0 & 2 \\\\ -2 & 1 & 4 \\end{pmatrix}$ por Sarrus. Luego, sin recalcular, indica cuanto vale el determinante de su traspuesta y justifica por que.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 6,
              status: "locked",
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
                  id: 400,
                  type: "auto",
                  question: "El menor $M_{11}$ de $\\begin{pmatrix} 3 & 1 & 2 \\\\ 0 & 4 & -1 \\\\ 5 & 2 & 7 \\end{pmatrix}$ es el determinante de:",
                  autoConfig: { type: "multiple_choice", choices: ["$\\begin{pmatrix} 3 & 1 \\\\ 0 & 4 \\end{pmatrix}$", "$\\begin{pmatrix} 4 & -1 \\\\ 2 & 7 \\end{pmatrix}$", "$\\begin{pmatrix} 0 & -1 \\\\ 5 & 7 \\end{pmatrix}$", "$\\begin{pmatrix} 1 & 2 \\\\ 2 & 7 \\end{pmatrix}$"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 401,
                  type: "auto",
                  question: "El signo del cofactor $C_{31}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$+$ (positivo)", "$-$ (negativo)", "Depende de la matriz", "No tiene signo"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 402,
                  type: "auto",
                  question: "La matriz adjunta se obtiene:",
                  autoConfig: { type: "multiple_choice", choices: ["Calculando los cofactores", "Calculando los cofactores y trasponiendolos", "Calculando los menores", "Invirtiendo la matriz"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 403,
                  type: "auto",
                  question: "El patron de signos para los cofactores sigue la regla $(-1)^{i+j}$. Para $C_{22}$ el signo es:",
                  autoConfig: { type: "multiple_choice", choices: ["$+$ porque $2+2=4$ es par", "$-$ porque $2+2=4$ es par", "$+$ porque $2 \\cdot 2=4$", "$-$ porque esta en la diagonal"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 404,
                  type: "auto",
                  question: "El cofactor $C_{12}$ de $\\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix}$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "-2" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 405,
                  type: "auto",
                  question: "El menor $M_{23}$ de $\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}$ (eliminar fila 2, columna 3) vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "-6" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 406,
                  type: "auto",
                  question: "Si el menor $M_{13} = 5$, entonces el cofactor $C_{13}$ vale ($(-1)^{1+3} \\cdot 5$):",
                  autoConfig: { type: "fill_blank", expectedAnswer: "5" },
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
                },
                {
                  id: 407,
                  type: "manual",
                  question: "Calcula el determinante de $A = \\begin{pmatrix} 3 & 1 & -2 \\\\ 0 & 2 & 1 \\\\ 4 & -1 & 3 \\end{pmatrix}$ desarrollando por la primera columna (usando cofactores). Compara el resultado con Sarrus.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 408,
                  type: "manual",
                  question: "Dada $A = \\begin{pmatrix} 1 & 2 & 0 \\\\ 3 & -1 & 4 \\\\ 2 & 0 & 5 \\end{pmatrix}$, calcula todos los cofactores, forma la matriz de cofactores, trasponla para obtener $\\text{adj}(A)$ y verifica que $A \\cdot \\text{adj}(A) = |A| \\cdot I$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 409,
                  type: "manual",
                  question: "Calcula la adjunta de $B = \\begin{pmatrix} 2 & -1 & 0 \\\\ 1 & 3 & 2 \\\\ 0 & 4 & -1 \\end{pmatrix}$. Luego verifica que $B \\cdot \\text{adj}(B)$ da una matriz diagonal con $|B|$ en la diagonal.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            },
            {
              id: 7,
              status: "locked",
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
                  id: 500,
                  type: "auto",
                  question: "Si $A \\cdot A^{-1} = I$, entonces $A^{-1} \\cdot A$ es igual a:",
                  autoConfig: { type: "multiple_choice", choices: ["$A$", "$A^{-1}$", "$I$", "$O$"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 501,
                  type: "auto",
                  question: "La inversa de $A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$\\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$", "$\\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}$", "$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$", "No tiene inversa"], correctIndex: 2 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 502,
                  type: "auto",
                  question: "Si $A^{-1} = \\begin{pmatrix} 2 & -1 \\\\ -3 & 2 \\end{pmatrix}$, entonces $(A^{-1})^{-1}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$\\begin{pmatrix} 2 & -1 \\\\ -3 & 2 \\end{pmatrix}$", "La matriz $A$ original", "$\\begin{pmatrix} -2 & 1 \\\\ 3 & -2 \\end{pmatrix}$", "No existe"], correctIndex: 1 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 503,
                  type: "auto",
                  question: "Usando el atajo $2 \\times 2$, la inversa de $\\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix}$ es:",
                  autoConfig: { type: "multiple_choice", choices: ["$\\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}$", "$\\begin{pmatrix} 3 & 1 \\\\ 5 & 2 \\end{pmatrix}$", "$\\begin{pmatrix} -3 & 1 \\\\ 5 & -2 \\end{pmatrix}$", "$\\begin{pmatrix} 2 & -5 \\\\ -1 & 3 \\end{pmatrix}$"], correctIndex: 0 },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 504,
                  type: "auto",
                  question: "El determinante de $\\begin{pmatrix} 3 & 1 \\\\ 5 & 2 \\end{pmatrix}$ vale:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "1" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 505,
                  type: "auto",
                  question: "Si $|A| = -2$, el factor por el que se multiplica la adjunta para obtener $A^{-1}$ es:",
                  autoConfig: { type: "fill_blank", expectedAnswer: "-1/2" },
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 506,
                  type: "auto",
                  question: "Si $A$ es una matriz $2 \\times 2$ con $|A| = 0$, cuantas inversas tiene?",
                  autoConfig: { type: "fill_blank", expectedAnswer: "0" },
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
                },
                {
                  id: 507,
                  type: "manual",
                  question: "Calcula la inversa de $\\begin{pmatrix} 1 & -1 \\\\ 2 & 3 \\end{pmatrix}$ usando el atajo de $2 \\times 2$. Verifica multiplicando $A \\cdot A^{-1}$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 508,
                  type: "manual",
                  question: "Resuelve la ecuacion matricial $A \\cdot X = B$ donde $A = \\begin{pmatrix} 2 & 1 \\\\ 5 & 3 \\end{pmatrix}$ y $B = \\begin{pmatrix} 3 \\\\ 8 \\end{pmatrix}$. Pista: $X = A^{-1} \\cdot B$.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                },
                {
                  id: 509,
                  type: "manual",
                  question: "Calcula la inversa de $\\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & -1 & 3 \\\\ 0 & 2 & 1 \\end{pmatrix}$ usando la formula $A^{-1} = \\frac{1}{|A|} \\cdot \\text{adj}(A)$. Muestra el calculo del determinante, todos los cofactores, la adjunta y el resultado final.",
                  autoConfig: null,
                  status: "pending",
                  studentAnswer: null,
                  photoUrl: null
                }
              ]
            }
          ]
        },
        { ...sistemas, order: 2 },
        { ...probabilidad, order: 3 },
        { ...estadistica, order: 4 },
        { ...funciones, order: 5 },
        { ...derivadas, order: 6 },
        { ...optimizacion, order: 7 }
      ],
      weeklyPlan: []
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
