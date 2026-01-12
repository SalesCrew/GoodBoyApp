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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:25',message:'addMitarbeiter called',data:{data},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  
  const mitarbeiter: Mitarbeiter = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:35',message:'Mitarbeiter object created',data:{mitarbeiter},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
  // #endregion
  
  const existing = getMitarbeiter();
  saveMitarbeiter([...existing, mitarbeiter]);
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:43',message:'Saved to localStorage',data:{mitarbeiter},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  
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
