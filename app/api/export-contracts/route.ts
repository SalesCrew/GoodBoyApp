import { NextRequest, NextResponse } from 'next/server';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import JSZip from 'jszip';
import { promises as fs } from 'fs';
import path from 'path';

interface Mitarbeiter {
  id: string;
  vollstaendigerName: string;
  strasse: string;
  plz: string;
  stadt: string;
  geburtsdatum: string;
  createdAt: number;
}

// Helper to sanitize filename (keep spaces, just remove invalid chars)
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .trim();
}

// Get today's date in DD.MM.YYYY format
function getTodayDate(): string {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
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

    // Read the template file
    const templatePath = path.join(process.cwd(), 'public', 'template.docx');
    
    let templateContent: Buffer;
    try {
      templateContent = await fs.readFile(templatePath);
    } catch {
      // If template doesn't exist, return an error with instructions
      return NextResponse.json(
        { 
          error: 'Template nicht gefunden',
          message: 'Bitte legen Sie die Datei template.docx im public Ordner ab.'
        },
        { status: 404 }
      );
    }

    // Create ZIP archive
    const zip = new JSZip();

    // Generate a document for each Mitarbeiter
    for (const m of mitarbeiter) {
      try {
        // Create a new instance of PizZip with the template
        const pizzip = new PizZip(templateContent);
        
        // Create docxtemplater instance
        const doc = new Docxtemplater(pizzip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        // Set the template variables
        doc.render({
          vollstaendigerName: m.vollstaendigerName,
          strasse: m.strasse,
          plz: m.plz,
          stadt: m.stadt,
          geburtsdatum: m.geburtsdatum,
        });

        // Generate the document
        const buffer = doc.getZip().generate({
          type: 'nodebuffer',
          compression: 'DEFLATE',
        });

        // Add to ZIP with sanitized filename: Dienstvertrag_Nespresso_{Name}_ {DD.MM.YYYY}.docx
        const todayDate = getTodayDate();
        const filename = `Dienstvertrag_Nespresso_${sanitizeFilename(m.vollstaendigerName)}_ ${todayDate}.docx`;
        zip.file(filename, buffer);
      } catch (error) {
        console.error(`Error generating document for ${m.vollstaendigerName}:`, error);
        // Continue with other documents even if one fails
      }
    }

    // Generate the final ZIP
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    // Return as file download
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="dienstvertraege.zip"',
      },
    });
  } catch (error) {
    console.error('Contract export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
