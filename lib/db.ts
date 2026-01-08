import { createClient } from '@libsql/client';

// Create database client
// For local development, uses a local file
// For production, uses Turso cloud database
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database schema
export async function initDatabase() {
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
}

// Get all Mitarbeiter
export async function getAllMitarbeiter() {
  await initDatabase();
  const result = await db.execute('SELECT * FROM mitarbeiter ORDER BY createdAt DESC');
  return result.rows.map(row => ({
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
  await initDatabase();
  await db.execute({
    sql: 'DELETE FROM mitarbeiter WHERE id = ?',
    args: [id],
  });
}

export default db;
