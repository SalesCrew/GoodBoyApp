import { createClient } from '@libsql/client';

// Check if database is configured
const isDatabaseConfigured = !!process.env.TURSO_DATABASE_URL;

// Create database client only if configured
let db: any = null;

if (isDatabaseConfigured) {
  const dbConfig: any = {
    url: process.env.TURSO_DATABASE_URL,
  };

  if (process.env.TURSO_AUTH_TOKEN) {
    dbConfig.authToken = process.env.TURSO_AUTH_TOKEN;
  }

  db = createClient(dbConfig);
}

// Initialize database schema
export async function initDatabase() {
  if (!db) return;
  
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mitarbeiter (
        id TEXT PRIMARY KEY,
        vollstaendigerName TEXT NOT NULL,
        strasse TEXT NOT NULL,
        plz TEXT NOT NULL,
        stadt TEXT NOT NULL,
        geburtsdatum TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      )
    `);
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Get all Mitarbeiter
export async function getAllMitarbeiter() {
  if (!db) {
    throw new Error('Database not configured');
  }
  
  await initDatabase();
  const result = await db.execute('SELECT * FROM mitarbeiter ORDER BY createdAt DESC');
  return result.rows.map((row: any) => ({
    id: row.id as string,
    vollstaendigerName: row.vollstaendigerName as string,
    strasse: row.strasse as string,
    plz: row.plz as string,
    stadt: row.stadt as string,
    geburtsdatum: row.geburtsdatum as string,
    createdAt: row.createdAt as number,
  }));
}

// Add a Mitarbeiter
export async function addMitarbeiterDB(data: {
  vollstaendigerName: string;
  strasse: string;
  plz: string;
  stadt: string;
  geburtsdatum: string;
}) {
  if (!db) {
    throw new Error('Database not configured');
  }
  
  await initDatabase();
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  
  await db.execute({
    sql: `INSERT INTO mitarbeiter (id, vollstaendigerName, strasse, plz, stadt, geburtsdatum, createdAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.vollstaendigerName, data.strasse, data.plz, data.stadt, data.geburtsdatum, createdAt],
  });
  
  return {
    id,
    ...data,
    createdAt,
  };
}

// Delete a Mitarbeiter
export async function deleteMitarbeiterDB(id: string) {
  if (!db) {
    throw new Error('Database not configured');
  }
  
  await initDatabase();
  await db.execute({
    sql: 'DELETE FROM mitarbeiter WHERE id = ?',
    args: [id],
  });
}

// Check if database is configured
export function isDatabaseAvailable() {
  return isDatabaseConfigured;
}

export default db;
