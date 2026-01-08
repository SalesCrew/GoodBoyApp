import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface Mitarbeiter {
  id: string;
  vollstaendigerName: string;
  strasse: string;
  plz: string;
  stadt: string;
  geburtsdatum: string;
  createdAt: number;
}

export async function POST(request: NextRequest) {
  try {
    const { mitarbeiter } = await request.json() as { mitarbeiter: Mitarbeiter[] };

    if (!mitarbeiter || !Array.isArray(mitarbeiter)) {
      return NextResponse.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }

    // Prepare data for Excel
    const excelData = mitarbeiter.map((m) => ({
      'Name': m.vollstaendigerName,
      'Straße': m.strasse,
      'PLZ': m.plz,
      'Stadt': m.stadt,
      'Geburtsdatum': m.geburtsdatum,
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 30 }, // Name
      { wch: 35 }, // Straße
      { wch: 10 }, // PLZ
      { wch: 20 }, // Stadt
      { wch: 15 }, // Geburtsdatum
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mitarbeiter');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Return as file download
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="mitarbeiter.xlsx"',
      },
    });
  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
