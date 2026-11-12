import Dexie from 'dexie';

export const db = new Dexie('AprenderJarochaDB');

db.version(1).stores({
  users: '++id, email, name, role',
  evaluationResults: '++id, userId, email, score, total, answers, feedback, createdAt'
});

db.version(2).stores({
  users: '++id, email, name, role',
  evaluationResults: '++id, userId, email, score, total, answers, feedback, createdAt',
  activeDiagnostics: '++id, title, subject, grade, isActive, updatedAt'
});
