import { NextRequest, NextResponse } from 'next/server';
import { deleteMitarbeiterDB } from '@/lib/db';

// DELETE a Mitarbeiter
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteMitarbeiterDB(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete Mitarbeiter:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
