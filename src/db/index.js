import Dexie from 'dexie';

export const db = new Dexie('AprenderJarochaDB');

db.version(1).stores({
  users: '++id, email, name, role',
  topics: '++id, title, grade, subject',
  messages: '++id, sessionId, role, text, timestamp',
  syncQueue: '++id, type, payload, status, createdAt'
});
