import { Mitarbeiter } from './types';

const STORAGE_KEY = 'mitarbeiter-data';

export function getMitarbeiter(): Mitarbeiter[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveMitarbeiter(mitarbeiter: Mitarbeiter[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mitarbeiter));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function addMitarbeiter(data: Omit<Mitarbeiter, 'id' | 'createdAt'>): Mitarbeiter {
  const mitarbeiter: Mitarbeiter = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  const existing = getMitarbeiter();
  saveMitarbeiter([...existing, mitarbeiter]);
  
  return mitarbeiter;
}

export function deleteMitarbeiter(id: string): void {
  const existing = getMitarbeiter();
  const filtered = existing.filter(m => m.id !== id);
  saveMitarbeiter(filtered);
}

export function generateId(): string {
  return crypto.randomUUID();
}
