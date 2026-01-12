import { NextRequest, NextResponse } from 'next/server';
import { deleteMitarbeiterDB, isDatabaseAvailable } from '@/lib/db';

// DELETE a Mitarbeiter
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // If database is not configured, return error
    // (frontend will use localStorage)
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 501 });
    }
    
    await deleteMitarbeiterDB(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete Mitarbeiter:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
