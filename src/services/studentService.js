import { db } from '../db';
import { MOCK_USER } from '../data/diagnosticData';

const LOCAL_STORAGE_STUDENTS_KEY = 'registeredStudentsList';

function getInitials(name = '') {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || 'AL').toUpperCase();
}

// Inicializa al menos a María Rodríguez como alumna base si no existe nadie registrado
export async function seedInitialStudentIfEmpty() {
  const existing = await getAllStudentsRaw();
  if (existing.length === 0) {
    const maria = {
      id: 'student-maria-default',
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      password: MOCK_USER.password,
      role: 'student',
      initials: MOCK_USER.initials,
      grade: MOCK_USER.grade,
      subject: MOCK_USER.subject,
      createdAt: new Date().toISOString()
    };
    await saveStudentToStorage(maria);
    return [maria];
  }
  return existing;
}

// Lee alumnos desde localStorage y Dexie
async function getAllStudentsRaw() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error leyendo alumnos de localStorage:', err);
  }

  // Fallback Dexie
  try {
    if (db.users) {
      const dbUsers = await db.users.where({ role: 'student' }).toArray();
      if (dbUsers.length > 0) {
        return dbUsers;
      }
    }
  } catch (err) {
    console.warn('Error leyendo alumnos de Dexie:', err);
  }

  return [];
}

async function saveStudentToStorage(student) {
  const all = await getAllStudentsRaw();
  const index = all.findIndex((s) => s.id === student.id || s.email.toLowerCase() === student.email.toLowerCase());

  if (index >= 0) {
    all[index] = { ...all[index], ...student };
  } else {
    all.push(student);
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn('Error guardando en localStorage:', e);
  }

  try {
    if (db.users) {
      await db.users.put({
        email: student.email,
        password: student.password,
        name: student.name,
        role: 'student',
        createdAt: student.createdAt || new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Error guardando en Dexie:', e);
  }

  return all;
}

// Obtiene todos los alumnos con sus resultados reales calculados de evaluationResults
export async function getAllStudentsWithProgress() {
  const students = await seedInitialStudentIfEmpty();

  // Obtenemos todos los resultados de evaluaciones registrados
  let allResults = [];
  try {
    if (db.evaluationResults) {
      allResults = await db.evaluationResults.toArray();
    }
  } catch (err) {
    console.warn('Error consultando evaluationResults en Dexie:', err);
  }

  // Revisar también si hay un resultado en localStorage
  let lastLocalResult = null;
  try {
    const raw = localStorage.getItem('lastEvaluationResult');
    if (raw) lastLocalResult = JSON.parse(raw);
  } catch (e) {
    console.warn('Error parsing lastEvaluationResult:', e);
  }

  // Mapeamos cada estudiante a sus métricas reales
  return students.map((st) => {
    // Buscar evaluaciones de este estudiante
    const studentResults = allResults.filter(
      (r) => r.email?.toLowerCase() === st.email.toLowerCase() || r.userId?.toLowerCase() === st.email.toLowerCase()
    );

    // Si el estudiante activo es María y tiene resultado en localStorage, lo incluimos
    let latestResult = studentResults.length > 0 ? studentResults[studentResults.length - 1] : null;
    if (!latestResult && lastLocalResult && (lastLocalResult.studentName === st.name || st.email === MOCK_USER.email)) {
      latestResult = lastLocalResult;
    }

    let level = 'Sin evaluación';
    let average = null;
    let attemptsCount = studentResults.length;
    if (!attemptsCount && latestResult) attemptsCount = 1;

    let scoreRatio = null;

    if (latestResult && latestResult.total > 0) {
      const pct = Math.round((latestResult.score / latestResult.total) * 100);
      scoreRatio = `${latestResult.score}/${latestResult.total}`;
      average = ((latestResult.score / latestResult.total) * 10).toFixed(1);

      if (pct >= 80) {
        level = 'Avanzado';
      } else if (pct >= 50) {
        level = 'Intermedio';
      } else {
        level = 'Básico';
      }
    }

    return {
      id: st.id || st.email,
      name: st.name,
      email: st.email,
      password: st.password,
      initials: st.initials || getInitials(st.name),
      grade: st.grade || '3° "B" Secundaria',
      subject: st.subject || 'Matemáticas Aplicadas',
      level,
      average: average ? parseFloat(average) : null,
      scoreRatio,
      attemptsCount,
      hasCompletedDiagnostic: Boolean(latestResult),
      latestResult,
      createdAt: st.createdAt || new Date().toISOString()
    };
  });
}

// Crear nuevo estudiante
export async function createStudent({ name, email, password, grade = '3° "B" Secundaria' }) {
  const newStudent = {
    id: `student-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    role: 'student',
    initials: getInitials(name),
    grade,
    subject: 'Matemáticas Aplicadas',
    createdAt: new Date().toISOString()
  };

  await saveStudentToStorage(newStudent);
  return newStudent;
}

// Modificar estudiante
export async function updateStudent(id, { name, email, password, grade }) {
  const all = await getAllStudentsRaw();
  const index = all.findIndex((s) => s.id === id || s.email.toLowerCase() === email?.toLowerCase());

  if (index >= 0) {
    all[index] = {
      ...all[index],
      name: name?.trim() || all[index].name,
      email: email?.trim().toLowerCase() || all[index].email,
      password: password?.trim() || all[index].password,
      grade: grade || all[index].grade,
      initials: getInitials(name || all[index].name)
    };

    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(all));
    return all[index];
  }
  return null;
}

// Eliminar estudiante
export async function deleteStudent(id, email) {
  const all = await getAllStudentsRaw();
  const filtered = all.filter((s) => s.id !== id && s.email.toLowerCase() !== email?.toLowerCase());

  localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(filtered));

  try {
    if (db.users) {
      await db.users.where({ email: email?.toLowerCase() }).delete();
    }
  } catch (err) {
    console.warn('Error eliminando de Dexie users:', err);
  }

  return filtered;
}

// Validador de credenciales para login
export async function validateStudentCredentials(email, password) {
  const all = await seedInitialStudentIfEmpty();
  const student = all.find(
    (s) => s.email.toLowerCase() === email.trim().toLowerCase() && s.password === password.trim()
  );
  return student || null;
}
