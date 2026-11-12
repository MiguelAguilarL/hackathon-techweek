// Datos de prueba para evaluación diagnóstica de matemáticas básicas (secundaria/bachillerato)
export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    type: 'choice',
    prompt: 'Si 2x + 6 = 14, ¿cuál es el valor de x?',
    options: [
      { key: 'a', text: 'x = 3' },
      { key: 'b', text: 'x = 4' },
      { key: 'c', text: 'x = 5' },
      { key: 'd', text: 'x = 8' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 2,
    type: 'choice',
    prompt: '¿Cuál es el resultado de simplificar la expresión: 3(x + 4) - 2x?',
    options: [
      { key: 'a', text: 'x + 12' },
      { key: 'b', text: '5x + 12' },
      { key: 'c', text: 'x + 4' },
      { key: 'd', text: 'x - 12' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 3,
    type: 'choice',
    prompt: 'En la ecuación 5x - 10 = 0, ¿cuánto vale x?',
    options: [
      { key: 'a', text: 'x = -2' },
      { key: 'b', text: 'x = 0' },
      { key: 'c', text: 'x = 2' },
      { key: 'd', text: 'x = 5' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 4,
    type: 'choice',
    prompt: 'Si x / 3 + 2 = 5, ¿cuál es el valor de x?',
    options: [
      { key: 'a', text: 'x = 6' },
      { key: 'b', text: 'x = 9' },
      { key: 'c', text: 'x = 15' },
      { key: 'd', text: 'x = 3' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 5,
    type: 'choice',
    prompt: '¿Qué valor de x satisface la igualdad: 4x - 7 = 2x + 5?',
    options: [
      { key: 'a', text: 'x = 6' },
      { key: 'b', text: 'x = -1' },
      { key: 'c', text: 'x = 12' },
      { key: 'd', text: 'x = 4' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 6,
    type: 'open',
    prompt: 'Explica con tus palabras o describe el procedimiento para despejar x en la ecuación: 3x - 9 = 0.',
    placeholder: 'Escribe aquí tu procedimiento (ej: sumo 9 a ambos lados y luego divido entre 3)...'
  }
];

export const MOCK_USER = {
  name: 'María Rodríguez',
  email: 'maria.rodriguez@jarocha.edu.mx',
  password: '123',
  initials: 'MR',
  grade: '3° "B" Secundaria',
  subject: 'Matemáticas Aplicadas',
  role: 'student'
};

export const MOCK_TEACHER = {
  name: 'Prof. Javier Hernández',
  email: 'profesor.javier@jarocha.edu.mx',
  password: '123',
  initials: 'JH',
  school: 'Secundaria Técnica #26 - Veracruz',
  subject: 'Matemáticas y Álgebra',
  group: 'Grupo 4to B • Matemáticas',
  role: 'teacher'
};

export const MOCK_STUDENTS_LIST = [
  {
    id: 1,
    name: 'María Rodríguez López',
    email: 'm.rodriguez@escuela.edu',
    initials: 'MR',
    level: 'Avanzado',
    average: 9.5,
    algebra: { attempts: '1 int.', status: 'success' },
    geometria: { attempts: '2 int.', status: 'success' },
    ecuaciones: { attempts: '1 int.', status: 'success' },
    trigonometria: { attempts: '1 int.', status: 'success' }
  },
  {
    id: 2,
    name: 'Juan Carlos Perea',
    email: 'j.perea@escuela.edu',
    initials: 'JC',
    level: 'Intermedio',
    average: 8.1,
    algebra: { attempts: '2 int.', status: 'success' },
    geometria: { attempts: '3 int.', status: 'error' },
    ecuaciones: { attempts: '1 int.', status: 'success' },
    trigonometria: { attempts: '-', status: 'none' }
  },
  {
    id: 3,
    name: 'Ana Gaby Solís',
    email: 'a.solis@escuela.edu',
    initials: 'AG',
    level: 'Avanzado',
    average: 9.8,
    algebra: { attempts: '1 int.', status: 'success' },
    geometria: { attempts: '1 int.', status: 'success' },
    ecuaciones: { attempts: '1 int.', status: 'success' },
    trigonometria: { attempts: '1 int.', status: 'success' }
  },
  {
    id: 4,
    name: 'Luis Miguel Domínguez',
    email: 'l.dominguez@escuela.edu',
    initials: 'LM',
    level: 'Básico',
    average: 7.2,
    algebra: { attempts: '3 int.', status: 'success' },
    geometria: { attempts: '4 int.', status: 'error' },
    ecuaciones: { attempts: '2 int.', status: 'success' },
    trigonometria: { attempts: '-', status: 'none' }
  }
];
