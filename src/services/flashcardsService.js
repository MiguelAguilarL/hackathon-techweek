const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Fallback curado local para funcionamiento offline 100% garantizado
const OFFLINE_FALLBACK = {
  basico: [
    {
      id: 1,
      category: 'Definición Clave',
      front: '¿Qué es una ecuación lineal de primer grado?',
      back: 'Es una igualdad matemática con variables elevadas únicamente a la potencia 1 (sin exponentes al cuadrado ni al cubo).',
      hint: 'Imagina una balanza equilibrada donde ambos lados pesan lo mismo.',
      level: 'basico'
    },
    {
      id: 2,
      category: 'Operaciones Inversas',
      front: 'Si un número está SUMANDO en un lado de la ecuación, ¿cómo pasa al otro lado?',
      back: 'Pasa con la operación inversa: RESTANDO. En realidad, se resta esa misma cantidad en ambos miembros de la ecuación.',
      hint: '¿Cuál es la operación opuesta a sumar?',
      level: 'basico'
    },
    {
      id: 3,
      category: 'Operaciones Inversas',
      front: 'En la ecuación 3x = 15, ¿qué operación debes realizar para despejar x?',
      back: 'Debes DIVIDIR ambos lados entre 3, ya que el 3 está multiplicando a la x (x = 15 / 3 = 5).',
      hint: 'El número está pegado a la variable multiplicándola.',
      level: 'basico'
    },
    {
      id: 4,
      category: 'Partes de la Ecuación',
      front: '¿Cuál es la diferencia entre un término con incógnita y un término independiente?',
      back: 'El término con incógnita tiene letra (ej: 4x, -2y). El término independiente es solo un número fijo sin letras (ej: +7, -10).',
      hint: 'Fíjate si el número está acompañado de una incógnita o si está solo.',
      level: 'basico'
    },
    {
      id: 5,
      category: 'Comprobación',
      front: '¿Cómo compruebas si el valor que obtuviste para x es correcto?',
      back: 'Sustituyes el valor encontrado en la ecuación original y verificas que el resultado del lado izquierdo sea exactamente igual al derecho.',
      hint: 'Sustituye la letra por tu número y verifica la igualdad.',
      level: 'basico'
    }
  ],
  intermedio: [
    {
      id: 1,
      category: 'Agrupación de Términos',
      front: 'En la ecuación 5x - 8 = 2x + 7, ¿cuál es el primer paso estratégico para resolverla?',
      back: 'Agrupar los términos con "x" en un solo miembro (5x - 2x) y los términos independientes en el otro (7 + 8).',
      hint: 'Reúne las incógnitas de un lado y los números conocidos del otro.',
      level: 'intermedio'
    },
    {
      id: 2,
      category: 'Propiedad Distributiva',
      front: '¿Cómo se resuelve una ecuación con paréntesis como 3(x - 4) = 18?',
      back: 'Se aplica la propiedad distributiva multiplicando el 3 por cada término dentro del paréntesis: 3x - 12 = 18, luego se despeja x = 10.',
      hint: 'Multiplica el factor exterior por cada término interior.',
      level: 'intermedio'
    },
    {
      id: 3,
      category: 'Signos y Paréntesis',
      front: '¿Qué ocurre con los signos cuando hay un signo negativo antes de un paréntesis: -(2x - 5)?',
      back: 'Todos los términos interiores cambian de signo al eliminar el paréntesis: resulta -2x + 5.',
      hint: 'El signo menos equivale a multiplicar por -1 todo lo interior.',
      level: 'intermedio'
    },
    {
      id: 4,
      category: 'Ecuaciones Fraccionarias',
      front: 'En la ecuación (x + 2) / 4 = 3, ¿qué paso elimina la fracción de inmediato?',
      back: 'Multiplicar ambos lados de la igualdad por el denominador 4: x + 2 = 12, por lo tanto x = 10.',
      hint: 'El 4 divide a todo el miembro izquierdo.',
      level: 'intermedio'
    },
    {
      id: 5,
      category: 'Modelado de Problemas',
      front: 'Si el triple de la edad de Juan aumentado en 5 años es 26, ¿cuál es la ecuación planteada?',
      back: 'La ecuación es 3x + 5 = 26. Al despejar: 3x = 21 -> x = 7 años.',
      hint: '"Triple" = multiplicar por 3; "aumentado" = sumar.',
      level: 'intermedio'
    }
  ],
  avanzado: [
    {
      id: 1,
      category: 'Mínimo Común Múltiplo (MCM)',
      front: '¿Cómo se resuelve una ecuación lineal con varios denominadores como x/2 + x/3 = 5?',
      back: 'Se multiplica toda la ecuación por el MCM de los denominadores (6): 3x + 2x = 30 -> 5x = 30 -> x = 6.',
      hint: 'Encuentra el múltiplo común para eliminar todos los denominadores a la vez.',
      level: 'avanzado'
    },
    {
      id: 2,
      category: 'Casos Especiales: Sin Solución',
      front: '¿Cuándo se dice que una ecuación lineal NO tiene solución (es inconsistente)?',
      back: 'Cuando al simplificar se cancelan las variables y se llega a una falsedad matemática como 0 = 7 (ej: 2x + 3 = 2x + 10).',
      hint: 'En la gráfica las rectas son paralelas y jamás se intersectan.',
      level: 'avanzado'
    },
    {
      id: 3,
      category: 'Casos Especiales: Infinitas Soluciones',
      front: '¿Qué es una identidad algebraica y cuántas soluciones tiene?',
      back: 'Es una igualdad que se cumple para CUALQUIER valor de la incógnita (ej: 2(x + 1) = 2x + 2 -> 0 = 0). Tiene infinitas soluciones.',
      hint: 'Ambos miembros de la ecuación son idénticos.',
      level: 'avanzado'
    },
    {
      id: 4,
      category: 'Ecuaciones Literales',
      front: '¿Cómo despejas la variable "x" en la ecuación literal ax + b = c (donde a ≠ 0)?',
      back: 'Primero restas b: ax = c - b. Luego divides entre el coeficiente a: x = (c - b) / a.',
      hint: 'Trata a las letras a, b y c como si fuesen constantes numéricas.',
      level: 'avanzado'
    },
    {
      id: 5,
      category: 'Propiedades de la Igualdad',
      front: '¿Cuál es la justificación formal para multiplicar una ecuación por una cantidad negativa?',
      back: 'La propiedad multiplicativa de la igualdad: si a = b, entonces a * c = b * c para todo c ≠ 0. Si c = -1, los signos de ambos lados se invierten.',
      hint: 'La igualdad se mantiene si aplicas la misma operación en ambos miembros.',
      level: 'avanzado'
    }
  ]
};

export async function fetchFlashcards(nivel = 'intermedio', tema = 'ecuaciones lineales') {
  const normalizedLevel = nivel.toLowerCase().includes('bás') || nivel.toLowerCase().includes('bas')
    ? 'basico'
    : nivel.toLowerCase().includes('avan')
    ? 'avanzado'
    : 'intermedio';

  // 1. Intentar llamar al backend si está disponible
  try {
    const res = await fetch(`${API_BASE}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nivel: normalizedLevel, tema })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.flashcards && data.flashcards.length > 0) {
        // Guardar en cache local para offline
        localStorage.setItem(`flashcards_${normalizedLevel}`, JSON.stringify(data.flashcards));
        return data.flashcards;
      }
    }
  } catch (err) {
    console.warn('Backend no disponible para flashcards, consultando almacenamiento local/fallback:', err);
  }

  // 2. Intentar leer de localStorage si ya había sido descargado previamente
  try {
    const cached = localStorage.getItem(`flashcards_${normalizedLevel}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Error leyendo flashcards de localStorage:', e);
  }

  // 3. Fallback curado de alta calidad
  return OFFLINE_FALLBACK[normalizedLevel] || OFFLINE_FALLBACK.intermedio;
}
