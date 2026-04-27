const sistemas = {
  name: "Sistemas de ecuaciones",
  order: 2,
  status: "locked",
  extraMaterials: [
    { id: 1, url: "/pau_macs_sistemes.pdf", name: "Exercicis PAU MACS - Sistemes d'equacions (Catalunya)", type: "application/pdf", uploadDate: "2026-04-27T00:00:00.000Z" }
  ],
  theoryBlocks: [
    {
      id: "sist-1",
      status: "available",
      title: "Introduccion y clasificacion de sistemas",
      content: "Un sistema de ecuaciones lineales es un conjunto de ecuaciones de primer grado con varias incognitas que deben satisfacerse simultaneamente. La forma general de un sistema de $m$ ecuaciones con $n$ incognitas es:\n\n$\\begin{cases} a_{11}x_1 + a_{12}x_2 + \\cdots + a_{1n}x_n = b_1 \\\\ a_{21}x_1 + a_{22}x_2 + \\cdots + a_{2n}x_n = b_2 \\\\ \\vdots \\\\ a_{m1}x_1 + a_{m2}x_2 + \\cdots + a_{mn}x_n = b_m \\end{cases}$\n\nEn forma matricial se escribe como $A \\cdot X = B$, donde $A$ es la matriz de coeficientes, $X$ el vector de incognitas y $B$ el vector de terminos independientes.\n\nLos sistemas se clasifican segun el numero de soluciones:\n\n**Sistema compatible determinado (SCD):** tiene una unica solucion. Ejemplo: $\\begin{cases} x + y = 3 \\\\ x - y = 1 \\end{cases}$ tiene solucion unica $x = 2$, $y = 1$.\n\n**Sistema compatible indeterminado (SCI):** tiene infinitas soluciones que dependen de uno o mas parametros libres. Ejemplo: $\\begin{cases} x + y = 3 \\\\ 2x + 2y = 6 \\end{cases}$ tiene infinitas soluciones: $x = 3 - t$, $y = t$ para cualquier $t \\in \\mathbb{R}$.\n\n**Sistema incompatible (SI):** no tiene solucion. Ejemplo: $\\begin{cases} x + y = 3 \\\\ x + y = 5 \\end{cases}$ no tiene solucion porque las dos ecuaciones se contradicen.\n\nUn sistema se llama **homogeneo** cuando todos los terminos independientes son cero ($B = 0$). Un sistema homogeneo siempre es compatible, ya que $X = 0$ siempre es solucion (la solucion trivial). La cuestion es si ademas tiene soluciones no triviales.\n\nLa **matriz ampliada** $(A|B)$ se forma anadiendo la columna de terminos independientes a la derecha de la matriz de coeficientes. Es fundamental para la resolucion y clasificacion de sistemas.",
      exercises: [
        {
          id: "sist-1-1",
          type: "auto",
          question: "El sistema $\\begin{cases} x + y = 5 \\\\ 2x + 2y = 10 \\end{cases}$ es:",
          autoConfig: { type: "multiple_choice", choices: ["Compatible determinado", "Compatible indeterminado", "Incompatible", "No se puede clasificar sin resolver"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-2",
          type: "auto",
          question: "El sistema $\\begin{cases} x + y = 3 \\\\ x + y = 7 \\end{cases}$ es:",
          autoConfig: { type: "multiple_choice", choices: ["Compatible determinado", "Compatible indeterminado", "Incompatible", "Homogeneo"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-3",
          type: "auto",
          question: "Un sistema homogeneo siempre es compatible porque:",
          autoConfig: { type: "multiple_choice", choices: ["Tiene infinitas soluciones", "La solucion trivial $X = 0$ siempre satisface el sistema", "Su determinante es cero", "Sus ecuaciones son proporcionales"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-4",
          type: "auto",
          question: "La forma matricial de un sistema de ecuaciones lineales es:",
          autoConfig: { type: "multiple_choice", choices: ["$A + X = B$", "$A \\cdot X = B$", "$X \\cdot A = B$", "$A \\cdot B = X$"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-5",
          type: "auto",
          question: "Un sistema compatible determinado tiene:",
          autoConfig: { type: "fill_blank", expectedAnswer: "1" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-6",
          type: "auto",
          question: "La matriz ampliada del sistema $\\begin{cases} 2x + 3y = 5 \\\\ x - y = 1 \\end{cases}$ tiene dimension:",
          autoConfig: { type: "fill_blank", expectedAnswer: "2x3" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-7",
          type: "auto",
          question: "Si un sistema tiene mas incognitas que ecuaciones independientes, el sistema es:",
          autoConfig: { type: "multiple_choice", choices: ["Siempre incompatible", "Siempre compatible determinado", "Compatible indeterminado (si es compatible)", "Imposible de clasificar"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-8",
          type: "manual",
          question: "Clasifica cada sistema sin resolverlo, justificando tu respuesta:\n\na) $\\begin{cases} 2x - y = 4 \\\\ 4x - 2y = 8 \\end{cases}$\n\nb) $\\begin{cases} x + y + z = 1 \\\\ x - y = 2 \\\\ 2x + z = 3 \\end{cases}$\n\nc) $\\begin{cases} x + y = 1 \\\\ x + y = 3 \\end{cases}$",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-9",
          type: "manual",
          question: "Escribe la forma matricial $A \\cdot X = B$ del sistema $\\begin{cases} 3x - 2y + z = 5 \\\\ x + y - 3z = -1 \\\\ 2x - y + 4z = 8 \\end{cases}$. Identifica las matrices $A$, $X$ y $B$, y escribe la matriz ampliada $(A|B)$.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-10",
          type: "manual",
          question: "Dado el sistema homogeneo $\\begin{cases} x + 2y - z = 0 \\\\ 3x - y + 2z = 0 \\end{cases}$, verifica que $x = 0$, $y = 0$, $z = 0$ es solucion. Explica por que un sistema homogeneo nunca puede ser incompatible.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-11",
          type: "manual",
          question: "Pon un ejemplo de sistema de 3 ecuaciones con 3 incognitas que sea: a) compatible determinado, b) compatible indeterminado, c) incompatible. Justifica cada caso.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-1-12",
          type: "auto",
          question: "En un sistema incompatible, el numero de soluciones es:",
          autoConfig: { type: "fill_blank", expectedAnswer: "0" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        }
      ]
    },
    {
      id: "sist-2",
      status: "locked",
      title: "Metodo de Gauss",
      content: "El metodo de Gauss (o eliminacion gaussiana) es el procedimiento mas general para resolver sistemas de ecuaciones lineales. Consiste en transformar la matriz ampliada del sistema en una forma escalonada mediante operaciones elementales por filas, y despues resolver por sustitucion regresiva.\n\nLas **operaciones elementales** permitidas son:\n1. Intercambiar dos filas: $F_i \\leftrightarrow F_j$\n2. Multiplicar una fila por un escalar no nulo: $F_i \\to k \\cdot F_i$ con $k \\neq 0$\n3. Sumar a una fila un multiplo de otra: $F_i \\to F_i + k \\cdot F_j$\n\nEstas operaciones no cambian las soluciones del sistema (producen sistemas equivalentes).\n\nUna matriz esta en **forma escalonada** cuando: los ceros a la izquierda de cada fila aumentan al bajar, y las filas nulas (si las hay) estan al final.\n\nEjemplo completo: resolver $\\begin{cases} x + y + z = 6 \\\\ 2x + 3y - z = 5 \\\\ 3x + y + 2z = 12 \\end{cases}$\n\nEscribimos la matriz ampliada:\n$\\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 2 & 3 & -1 & 5 \\\\ 3 & 1 & 2 & 12 \\end{array}\\right)$\n\n$F_2 \\to F_2 - 2F_1$: $\\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & 1 & -3 & -7 \\\\ 3 & 1 & 2 & 12 \\end{array}\\right)$\n\n$F_3 \\to F_3 - 3F_1$: $\\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & 1 & -3 & -7 \\\\ 0 & -2 & -1 & -6 \\end{array}\\right)$\n\n$F_3 \\to F_3 + 2F_2$: $\\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & 1 & -3 & -7 \\\\ 0 & 0 & -7 & -20 \\end{array}\\right)$\n\nSustitucion regresiva: De la 3a ecuacion: $-7z = -20 \\Rightarrow z = 20/7$. De la 2a: $y - 3 \\cdot \\frac{20}{7} = -7 \\Rightarrow y = -7 + \\frac{60}{7} = \\frac{11}{7}$. De la 1a: $x + \\frac{11}{7} + \\frac{20}{7} = 6 \\Rightarrow x = 6 - \\frac{31}{7} = \\frac{11}{7}$.\n\nSegun la forma escalonada resultante:\n- Si aparece una fila $(0\\ 0\\ \\cdots\\ 0\\ |\\ k)$ con $k \\neq 0$: el sistema es **incompatible**.\n- Si el numero de pivotes (filas no nulas) es igual al numero de incognitas: es **SCD**.\n- Si el numero de pivotes es menor que el numero de incognitas: es **SCI**, con tantos parametros libres como la diferencia.",
      exercises: [
        {
          id: "sist-2-1",
          type: "auto",
          question: "La operacion $F_2 \\to F_2 - 3F_1$ es una operacion elemental de tipo:",
          autoConfig: { type: "multiple_choice", choices: ["Intercambio de filas", "Multiplicacion de una fila por un escalar", "Suma de un multiplo de una fila a otra", "Ninguna de las anteriores"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-2",
          type: "auto",
          question: "Al escalonar un sistema 3x3, si obtenemos la fila $(0\\ 0\\ 0\\ |\\ 4)$, el sistema es:",
          autoConfig: { type: "multiple_choice", choices: ["Compatible determinado", "Compatible indeterminado", "Incompatible", "Hay que seguir operando"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-3",
          type: "auto",
          question: "En un sistema 3x3 escalonado con 2 pivotes y sin filas contradictorias, el sistema es:",
          autoConfig: { type: "multiple_choice", choices: ["Incompatible", "Compatible determinado", "Compatible indeterminado con 1 parametro", "Compatible indeterminado con 2 parametros"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-4",
          type: "auto",
          question: "Las operaciones elementales por filas producen:",
          autoConfig: { type: "multiple_choice", choices: ["Sistemas con mas soluciones", "Sistemas equivalentes (mismas soluciones)", "Sistemas con menos soluciones", "Sistemas incompatibles"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-5",
          type: "auto",
          question: "La operacion $F_1 \\to 0 \\cdot F_1$ (multiplicar una fila por cero):",
          autoConfig: { type: "multiple_choice", choices: ["Es una operacion elemental valida", "No es una operacion elemental valida", "Solo es valida en sistemas homogeneos", "Es valida pero no recomendable"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-6",
          type: "auto",
          question: "En la sustitucion regresiva, se empieza a resolver por la ecuacion:",
          autoConfig: { type: "fill_blank", expectedAnswer: "ultima" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-7",
          type: "auto",
          question: "Si un sistema 4x4 escalonado tiene 4 pivotes y ninguna fila contradictoria, el numero de soluciones es:",
          autoConfig: { type: "fill_blank", expectedAnswer: "1" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-8",
          type: "manual",
          question: "Resuelve por el metodo de Gauss: $\\begin{cases} x + 2y - z = 3 \\\\ 2x + y + z = 4 \\\\ 3x + 3y + 0z = 7 \\end{cases}$. Escribe la matriz ampliada, realiza las operaciones paso a paso y clasifica el sistema.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-9",
          type: "manual",
          question: "Resuelve por Gauss: $\\begin{cases} 2x + y - z = 1 \\\\ x - y + 2z = 5 \\\\ 3x + 2y - 3z = -2 \\end{cases}$. Indica cada operacion elemental que realizas.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-10",
          type: "manual",
          question: "Aplica el metodo de Gauss al sistema: $\\begin{cases} x + y + z = 1 \\\\ 2x + 2y + 2z = 2 \\\\ x + y + 2z = 3 \\end{cases}$. Clasifica el sistema y, si tiene solucion, expresala.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-11",
          type: "manual",
          question: "Resuelve por Gauss: $\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 5 \\end{cases}$. Comprueba tu solucion sustituyendo en las tres ecuaciones originales.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-2-12",
          type: "manual",
          question: "Demuestra que el sistema $\\begin{cases} x + y + z = 1 \\\\ x + y + z = 3 \\\\ 2x + y - z = 0 \\end{cases}$ es incompatible usando el metodo de Gauss. Explica que ocurre al escalonar.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        }
      ]
    },
    {
      id: "sist-3",
      status: "locked",
      title: "Regla de Cramer",
      content: "La regla de Cramer es un metodo que permite resolver sistemas de $n$ ecuaciones con $n$ incognitas (sistemas cuadrados) usando determinantes. Solo es aplicable cuando el determinante de la matriz de coeficientes es distinto de cero, es decir, cuando el sistema es compatible determinado.\n\nDado el sistema $A \\cdot X = B$ con $|A| \\neq 0$, cada incognita $x_i$ se calcula como:\n\n$x_i = \\frac{|A_i|}{|A|}$\n\ndonde $A_i$ es la matriz que resulta de sustituir la columna $i$-esima de $A$ por el vector de terminos independientes $B$.\n\nEjemplo con sistema $2 \\times 2$: $\\begin{cases} 3x + 2y = 7 \\\\ x - y = 1 \\end{cases}$\n\n$A = \\begin{pmatrix} 3 & 2 \\\\ 1 & -1 \\end{pmatrix}$, $|A| = 3 \\cdot (-1) - 2 \\cdot 1 = -5$\n\nPara $x$: $|A_x| = \\begin{vmatrix} 7 & 2 \\\\ 1 & -1 \\end{vmatrix} = -7 - 2 = -9 \\Rightarrow x = \\frac{-9}{-5} = \\frac{9}{5}$\n\nPara $y$: $|A_y| = \\begin{vmatrix} 3 & 7 \\\\ 1 & 1 \\end{vmatrix} = 3 - 7 = -4 \\Rightarrow y = \\frac{-4}{-5} = \\frac{4}{5}$\n\nEjemplo con sistema $3 \\times 3$: $\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 5 \\end{cases}$\n\n$|A| = \\begin{vmatrix} 1 & 1 & 1 \\\\ 2 & -1 & 1 \\\\ 1 & 2 & -1 \\end{vmatrix}$\n\nUsando la regla de Sarrus: $|A| = 1 \\cdot(-1)\\cdot(-1) + 1 \\cdot 1 \\cdot 1 + 1 \\cdot 2 \\cdot 2 - 1 \\cdot(-1)\\cdot 1 - 1 \\cdot 1 \\cdot 2 - 1 \\cdot 2 \\cdot(-1) = 1 + 1 + 4 + 1 - 2 + 2 = 7$\n\n**Ventajas:** permite calcular una sola incognita sin resolver todo el sistema; formula directa y sistematica.\n\n**Limitaciones:** solo para sistemas cuadrados con $|A| \\neq 0$; para sistemas grandes es ineficiente (muchos determinantes). Si $|A| = 0$, Cramer no se aplica y hay que usar Gauss o Rouche-Frobenius.",
      exercises: [
        {
          id: "sist-3-1",
          type: "auto",
          question: "La regla de Cramer se puede aplicar cuando:",
          autoConfig: { type: "multiple_choice", choices: ["El sistema tiene mas ecuaciones que incognitas", "El determinante de $A$ es cero", "El determinante de $A$ es distinto de cero", "El sistema es incompatible"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-2",
          type: "auto",
          question: "En la regla de Cramer para un sistema 3x3, para calcular $y$ se sustituye por $B$ la columna:",
          autoConfig: { type: "multiple_choice", choices: ["Primera", "Segunda", "Tercera", "Cualquiera"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-3",
          type: "auto",
          question: "Si $|A| = 4$ y $|A_x| = 12$, entonces $x$ vale:",
          autoConfig: { type: "multiple_choice", choices: ["48", "3", "1/3", "8"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-4",
          type: "auto",
          question: "Si $|A| = 0$, al intentar aplicar Cramer:",
          autoConfig: { type: "multiple_choice", choices: ["Se obtiene solucion unica", "La division no esta definida y no se puede aplicar", "El sistema es siempre incompatible", "Se obtienen infinitas soluciones"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-5",
          type: "auto",
          question: "Para un sistema $2 \\times 2$ la regla de Cramer requiere calcular en total:",
          autoConfig: { type: "fill_blank", expectedAnswer: "3" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-6",
          type: "auto",
          question: "Para un sistema $3 \\times 3$ la regla de Cramer requiere calcular en total:",
          autoConfig: { type: "fill_blank", expectedAnswer: "4" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-7",
          type: "auto",
          question: "La principal ventaja de Cramer frente a Gauss es que permite:",
          autoConfig: { type: "multiple_choice", choices: ["Resolver sistemas no cuadrados", "Calcular una sola incognita sin resolver todo el sistema", "Clasificar sistemas con parametros", "Resolver sistemas incompatibles"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-8",
          type: "manual",
          question: "Resuelve por Cramer: $\\begin{cases} 2x + y = 5 \\\\ 3x - 2y = 4 \\end{cases}$. Calcula $|A|$, $|A_x|$ y $|A_y|$ paso a paso.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-9",
          type: "manual",
          question: "Resuelve por Cramer: $\\begin{cases} x + y + z = 6 \\\\ 2x - y + 3z = 9 \\\\ x + 3y - z = 2 \\end{cases}$. Usa la regla de Sarrus para los determinantes $3 \\times 3$.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-10",
          type: "manual",
          question: "Dado el sistema $\\begin{cases} x + 2y - z = 3 \\\\ 2x - y + z = 1 \\\\ 3x + y + 2z = 4 \\end{cases}$, calcula solo el valor de $z$ usando la regla de Cramer sin resolver las otras incognitas.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-11",
          type: "manual",
          question: "Explica por que la regla de Cramer no puede aplicarse al sistema $\\begin{cases} x + y + z = 1 \\\\ 2x + 2y + 2z = 2 \\\\ x + y + z = 3 \\end{cases}$. Calcula $|A|$ para demostrarlo.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-3-12",
          type: "manual",
          question: "Un problema PAU: dos kilos de manzanas y un kilo de peras cuestan 5 euros. Un kilo de manzanas y tres kilos de peras cuestan 7 euros. Plantea el sistema de ecuaciones y resuelvelo por Cramer.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        }
      ]
    },
    {
      id: "sist-4",
      status: "locked",
      title: "Discusion de sistemas: Teorema de Rouche-Frobenius",
      content: "El teorema de Rouche-Frobenius es la herramienta fundamental para clasificar (discutir) un sistema de ecuaciones lineales sin necesidad de resolverlo. Se basa en comparar los rangos de la matriz de coeficientes $A$ y de la matriz ampliada $(A|B)$.\n\nRecordemos que el **rango** de una matriz es el numero maximo de filas (o columnas) linealmente independientes. Equivale al orden del mayor menor (subdeterminante) no nulo. Se puede calcular:\n- Escalonando la matriz y contando filas no nulas.\n- Buscando el mayor menor no nulo por orlados sucesivos.\n\n**Enunciado del teorema:** Dado un sistema con $n$ incognitas, matriz de coeficientes $A$ y matriz ampliada $(A|B)$:\n\n1. Si $\\text{rang}(A) \\neq \\text{rang}(A|B)$: el sistema es **incompatible** (SI).\n2. Si $\\text{rang}(A) = \\text{rang}(A|B) = r$:\n   - Si $r = n$: es **compatible determinado** (SCD), solucion unica.\n   - Si $r < n$: es **compatible indeterminado** (SCI) con $n - r$ parametros libres.\n\nObservacion importante: siempre se cumple que $\\text{rang}(A) \\leq \\text{rang}(A|B)$, ya que $A$ es submatriz de $(A|B)$. Ademas, $\\text{rang}(A|B) \\leq \\text{rang}(A) + 1$ (anadir una columna sube el rango como maximo en 1).\n\nEjemplo: $\\begin{cases} x + y + z = 3 \\\\ 2x + 2y + 2z = 6 \\\\ x + y + 2z = 5 \\end{cases}$\n\n$A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 2 & 2 & 2 \\\\ 1 & 1 & 2 \\end{pmatrix}$, $(A|B) = \\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 3 \\\\ 2 & 2 & 2 & 6 \\\\ 1 & 1 & 2 & 5 \\end{array}\\right)$\n\nLa fila 2 es el doble de la fila 1, asi que $\\text{rang}(A) = 2$ (las filas 1 y 3 son independientes). Comprobamos: $\\text{rang}(A|B) = 2$ (la fila 2 ampliada tambien es doble de la 1). Como $\\text{rang}(A) = \\text{rang}(A|B) = 2 < n = 3$, el sistema es SCI con $3 - 2 = 1$ parametro libre.",
      exercises: [
        {
          id: "sist-4-1",
          type: "auto",
          question: "Si $\\text{rang}(A) = 2$ y $\\text{rang}(A|B) = 3$, el sistema es:",
          autoConfig: { type: "multiple_choice", choices: ["Compatible determinado", "Compatible indeterminado", "Incompatible", "No se puede determinar"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-2",
          type: "auto",
          question: "Si $\\text{rang}(A) = \\text{rang}(A|B) = 3$ y hay 3 incognitas, el sistema es:",
          autoConfig: { type: "multiple_choice", choices: ["Compatible determinado", "Compatible indeterminado con 1 parametro", "Incompatible", "Compatible indeterminado con 3 parametros"], correctIndex: 0 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-3",
          type: "auto",
          question: "Un SCI con 4 incognitas y $\\text{rang}(A) = \\text{rang}(A|B) = 2$ tiene:",
          autoConfig: { type: "multiple_choice", choices: ["1 parametro libre", "2 parametros libres", "4 parametros libres", "Solucion unica"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-4",
          type: "auto",
          question: "Siempre se cumple que $\\text{rang}(A)$ es:",
          autoConfig: { type: "multiple_choice", choices: ["Mayor que $\\text{rang}(A|B)$", "Igual a $\\text{rang}(A|B)$", "Menor o igual que $\\text{rang}(A|B)$", "El doble de $\\text{rang}(A|B)$"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-5",
          type: "auto",
          question: "Si un sistema tiene 5 incognitas y $\\text{rang}(A) = \\text{rang}(A|B) = 3$, el numero de parametros libres es:",
          autoConfig: { type: "fill_blank", expectedAnswer: "2" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-6",
          type: "auto",
          question: "Para que un sistema sea incompatible segun Rouche-Frobenius, se necesita que $\\text{rang}(A|B) - \\text{rang}(A)$ sea:",
          autoConfig: { type: "fill_blank", expectedAnswer: "1" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-7",
          type: "auto",
          question: "El rango de una matriz se puede calcular:",
          autoConfig: { type: "multiple_choice", choices: ["Solo con determinantes", "Solo escalonando", "Escalonando o buscando el mayor menor no nulo", "Solo si la matriz es cuadrada"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-8",
          type: "manual",
          question: "Clasifica el sistema usando el teorema de Rouche-Frobenius:\n$\\begin{cases} x + y + z = 4 \\\\ 2x + y - z = 2 \\\\ 4x + 3y + z = 10 \\end{cases}$\nCalcula los rangos de $A$ y $(A|B)$ y determina si es SCD, SCI o SI.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-9",
          type: "manual",
          question: "Clasifica y resuelve (si es posible) el sistema:\n$\\begin{cases} x + 2y - z = 1 \\\\ 2x + 4y - 2z = 2 \\\\ 3x + 6y - 3z = 3 \\end{cases}$\nUsa Rouche-Frobenius y justifica tu clasificacion.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-10",
          type: "manual",
          question: "Dado el sistema $\\begin{cases} x + y + z = 1 \\\\ x + 2y + 3z = 2 \\\\ 2x + 3y + 4z = 4 \\end{cases}$, calcula $\\text{rang}(A)$ y $\\text{rang}(A|B)$. Clasifica el sistema.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-4-11",
          type: "manual",
          question: "Explica con tus propias palabras el teorema de Rouche-Frobenius. Usa un ejemplo concreto para cada caso (SCD, SCI, SI) calculando los rangos.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        }
      ]
    },
    {
      id: "sist-5",
      status: "locked",
      title: "Sistemas con parametros",
      content: "En PAU es muy frecuente que se pida discutir un sistema que contiene un parametro $k$ (o $a$, $m$, etc.). El objetivo es determinar para que valores del parametro el sistema es SCD, SCI o SI.\n\nEstrategia general:\n1. Calcular $|A|$ (que dependera de $k$).\n2. Resolver $|A| = 0$ para encontrar los valores criticos de $k$.\n3. Para $k$ tal que $|A| \\neq 0$: el sistema es SCD (se puede resolver por Cramer).\n4. Para cada valor critico ($|A| = 0$): aplicar Rouche-Frobenius calculando $\\text{rang}(A)$ y $\\text{rang}(A|B)$ para determinar si es SCI o SI.\n\nEjemplo tipico PAU: Discutir segun $k$:\n$\\begin{cases} x + y + z = 1 \\\\ x + ky + z = k \\\\ 2x + y + (k+1)z = 2 \\end{cases}$\n\n$|A| = \\begin{vmatrix} 1 & 1 & 1 \\\\ 1 & k & 1 \\\\ 2 & 1 & k+1 \\end{vmatrix}$\n\nDesarrollando por Sarrus: $|A| = k(k+1) + 2 + 1 - 2k - 1 - (k+1) = k^2 + k + 3 - 2k - 1 - k - 1 = k^2 - 2k + 1 = (k-1)^2$\n\nAsi, $|A| = 0 \\Leftrightarrow k = 1$.\n\n**Si $k \\neq 1$:** $|A| \\neq 0$, el sistema es SCD. Se resuelve por Cramer.\n\n**Si $k = 1$:** el sistema queda $\\begin{cases} x + y + z = 1 \\\\ x + y + z = 1 \\\\ 2x + y + 2z = 2 \\end{cases}$\n\nLas ecuaciones 1 y 2 son iguales, $\\text{rang}(A) = \\text{rang}(A|B) = 2 < 3$. Es SCI con 1 parametro.\n\nPara resolver el SCI: tomamos $z = t$ como parametro libre. De la 3a ecuacion: $2x + y = 2 - 2t$. De la 1a: $x + y = 1 - t$. Restando: $x = 1 - t$, luego $y = 0$. Solucion: $(x,y,z) = (1-t, 0, t)$ con $t \\in \\mathbb{R}$.\n\n**Consejo PAU:** Siempre que te pidan discutir un sistema con parametro, organiza la respuesta por casos y resuelve en los casos compatibles. Es una pregunta clasica que vale 2-3 puntos.",
      exercises: [
        {
          id: "sist-5-1",
          type: "auto",
          question: "Para discutir un sistema con parametro $k$, el primer paso es:",
          autoConfig: { type: "multiple_choice", choices: ["Resolver el sistema por Gauss", "Calcular el determinante $|A|$ y resolver $|A| = 0$", "Aplicar directamente Rouche-Frobenius", "Sustituir $k$ por valores concretos"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-2",
          type: "auto",
          question: "Si $|A| = k^2 - 4$, los valores criticos de $k$ son:",
          autoConfig: { type: "multiple_choice", choices: ["$k = 0$", "$k = 2$ y $k = -2$", "$k = 4$", "$k = 2$"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-3",
          type: "auto",
          question: "Si $|A| = (k-3)(k+1)$ y $k = 5$, el sistema es:",
          autoConfig: { type: "multiple_choice", choices: ["Incompatible", "Compatible determinado", "Compatible indeterminado", "No se puede saber"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-4",
          type: "auto",
          question: "Si $|A| = 0$ para un valor de $k$ y $\\text{rang}(A) = \\text{rang}(A|B)$, el sistema es:",
          autoConfig: { type: "multiple_choice", choices: ["Incompatible", "Compatible determinado", "Compatible indeterminado", "Indeterminable"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-5",
          type: "auto",
          question: "Si $|A| = k^2 - 5k + 6$, los valores criticos son $k =$",
          autoConfig: { type: "fill_blank", expectedAnswer: "2 y 3" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-6",
          type: "auto",
          question: "Si $|A| \\neq 0$ para todo valor de $k$, el sistema es siempre:",
          autoConfig: { type: "fill_blank", expectedAnswer: "compatible determinado" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-7",
          type: "manual",
          question: "Discute segun los valores de $k$ el sistema:\n$\\begin{cases} x + y + kz = 1 \\\\ x + ky + z = 1 \\\\ kx + y + z = 1 \\end{cases}$\nResuelve en los casos compatibles.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-8",
          type: "manual",
          question: "Discute segun $a$ el sistema:\n$\\begin{cases} x + y + z = a \\\\ x + ay + z = 1 \\\\ ax + y + z = 1 \\end{cases}$\nCalcula $|A|$, encuentra los valores criticos y clasifica en cada caso.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-9",
          type: "manual",
          question: "Discute y resuelve segun $m$:\n$\\begin{cases} x + y - z = 2 \\\\ 2x + my + z = 3 \\\\ x + y + mz = 1 \\end{cases}$",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-10",
          type: "manual",
          question: "(PAU) Discute y resuelve segun $k$:\n$\\begin{cases} kx + y + z = k \\\\ x + ky + z = 1 \\\\ x + y + kz = 1 \\end{cases}$\nOrganiza la respuesta indicando: valores criticos, clasificacion para cada caso, y resolucion cuando sea compatible.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-5-11",
          type: "manual",
          question: "Para el sistema $\\begin{cases} x + 2y + z = 1 \\\\ 2x + y + kz = 2 \\\\ x - y + (k-1)z = 1 \\end{cases}$, determina para que valores de $k$ el sistema tiene solucion unica, infinitas soluciones o ninguna solucion.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        }
      ]
    },
    {
      id: "sist-6",
      status: "locked",
      title: "Problemas de aplicacion (PAU)",
      content: "En la PAU Catalunya aparecen problemas contextualizados donde hay que plantear un sistema de ecuaciones a partir de un enunciado, resolverlo y interpretar el resultado. La clave esta en traducir el enunciado a ecuaciones.\n\nEstrategia para plantear problemas:\n1. **Identificar las incognitas:** leer el enunciado y decidir que representan $x$, $y$, $z$.\n2. **Traducir a ecuaciones:** cada condicion del enunciado genera una ecuacion.\n3. **Resolver:** elegir el metodo mas adecuado (Gauss, Cramer, Rouche-Frobenius si hay parametro).\n4. **Interpretar:** comprobar que la solucion tiene sentido en el contexto (no pueden ser negativas si son cantidades fisicas, etc.).\n\nEjemplo 1 (mezclas): Una tienda vende tres tipos de cafe: colombiano a 8 euros/kg, keniata a 10 euros/kg y etiope a 12 euros/kg. Se quiere preparar 10 kg de mezcla que cueste 9.5 euros/kg. Si se usa el doble de colombiano que de etiope, calcula las cantidades.\n\nVariables: $x$ = kg colombiano, $y$ = kg keniata, $z$ = kg etiope.\n\nEcuaciones:\n$x + y + z = 10$ (peso total)\n$8x + 10y + 12z = 95$ (coste total: $10 \\times 9.5$)\n$x = 2z$ (condicion de proporcion)\n\nEjemplo 2 (geometria): Hallar la ecuacion de la parabola $y = ax^2 + bx + c$ que pasa por los puntos $(0, 1)$, $(1, 4)$ y $(-1, 2)$.\n\nSustituyendo cada punto: $c = 1$, $a + b + c = 4$, $a - b + c = 2$. Se obtiene: $a = 2$, $b = 1$, $c = 1$, asi que $y = 2x^2 + x + 1$.\n\nEjemplo 3 (edades, inversiones, produccion): estos problemas siguen la misma logica: identificar variables, escribir ecuaciones y resolver.\n\n**Errores frecuentes en PAU:**\n- No definir claramente las incognitas.\n- Olvidar una ecuacion y no poder resolver.\n- No comprobar si la solucion tiene sentido en el contexto.\n- Errores de calculo en los determinantes.",
      exercises: [
        {
          id: "sist-6-1",
          type: "auto",
          question: "Para un problema con 3 incognitas, normalmente necesitamos al menos:",
          autoConfig: { type: "multiple_choice", choices: ["1 ecuacion", "2 ecuaciones", "3 ecuaciones", "4 ecuaciones"], correctIndex: 2 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-2",
          type: "auto",
          question: "Si un problema de mezclas da como solucion una cantidad negativa, esto significa:",
          autoConfig: { type: "multiple_choice", choices: ["La solucion es correcta", "Hay un error en el planteamiento o el problema no tiene solucion fisica", "Hay que cambiar el signo", "Se necesitan mas ecuaciones"], correctIndex: 1 },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-3",
          type: "auto",
          question: "La parabola $y = ax^2 + bx + c$ que pasa por $(0, 3)$ cumple que $c$ vale:",
          autoConfig: { type: "fill_blank", expectedAnswer: "3" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-4",
          type: "auto",
          question: "Si compramos 3 manzanas y 2 peras por 4 euros, y 1 manzana y 4 peras por 3 euros, el precio de una manzana es (en euros):",
          autoConfig: { type: "fill_blank", expectedAnswer: "1" },
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-5",
          type: "manual",
          question: "En una granja hay gallinas y conejos. En total hay 20 animales y 56 patas. Plantea un sistema de ecuaciones, resuelvelo y da el numero de gallinas y conejos.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-6",
          type: "manual",
          question: "Un inversor reparte 10000 euros entre tres fondos: A al 3%, B al 5% y C al 7% anual. Al cabo de un ano gana 520 euros de intereses. Si invierte en C el doble que en A, calcula cuanto invierte en cada fondo.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-7",
          type: "manual",
          question: "Halla la ecuacion de la parabola $y = ax^2 + bx + c$ que pasa por los puntos $(1, 2)$, $(2, 7)$ y $(-1, 4)$. Plantea el sistema, resuelvelo y escribe la ecuacion.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-8",
          type: "manual",
          question: "(PAU) Una empresa fabrica tres productos A, B y C. Cada unidad de A necesita 2 horas de maquina, 1 de acabado y 3 de embalaje. Cada B necesita 1, 2 y 2 respectivamente. Cada C necesita 3, 1 y 1. Se dispone de 100 horas de maquina, 80 de acabado y 120 de embalaje. Plantea el sistema y determina cuantas unidades de cada producto se pueden fabricar usando todos los recursos.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-9",
          type: "manual",
          question: "La edad de un padre es el triple de la de su hijo. Dentro de 10 anos, la edad del padre sera el doble de la del hijo. Plantea el sistema y halla las edades actuales.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-10",
          type: "manual",
          question: "(PAU) Se mezclan tres tipos de zumo: naranja a 2 euros/litro, manzana a 1.5 euros/litro y pinya a 3 euros/litro. Se quieren preparar 20 litros de mezcla a 2.1 euros/litro. Si la cantidad de zumo de naranja es igual a la suma de los otros dos, halla las cantidades de cada tipo.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        },
        {
          id: "sist-6-11",
          type: "manual",
          question: "Tres amigos compran entradas: 2 de patio, 1 de anfiteatro y 3 de grada por 85 euros. Si patio cuesta el doble que grada, y anfiteatro cuesta 5 euros mas que grada, plantea y resuelve el sistema.",
          autoConfig: null,
          status: "pending",
          studentAnswer: null,
          photoUrl: null
        }
      ]
    }
  ]
};

export default sistemas;
