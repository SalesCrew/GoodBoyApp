import { NextRequest, NextResponse } from 'next/server';
import { getAllMitarbeiter, addMitarbeiterDB, isDatabaseAvailable } from '@/lib/db';

// GET all Mitarbeiter
export async function GET() {
  try {
    // If database is not configured, return empty array
    // (frontend will use localStorage)
    if (!isDatabaseAvailable()) {
      return NextResponse.json([]);
    }
    
    const mitarbeiter = await getAllMitarbeiter();
    return NextResponse.json(mitarbeiter);
  } catch (error) {
    console.error('Failed to get Mitarbeiter:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

// POST new Mitarbeiter
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.vollstaendigerName || !data.strasse || !data.plz || !data.stadt || !data.geburtsdatum) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // If database is not configured, return error
    // (frontend will use localStorage)
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 501 });
    }
    
    const mitarbeiter = await addMitarbeiterDB({
      vollstaendigerName: data.vollstaendigerName,
      strasse: data.strasse,
      plz: data.plz,
      stadt: data.stadt,
      geburtsdatum: data.geburtsdatum,
    });
    
    return NextResponse.json(mitarbeiter);
  } catch (error) {
    console.error('Failed to add Mitarbeiter:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
