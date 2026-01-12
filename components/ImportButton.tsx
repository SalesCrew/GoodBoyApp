'use client';

import { useRef } from 'react';
import * as XLSX from 'xlsx';

interface ImportButtonProps {
  onImport: (data: any[]) => void;
}

export default function ImportButton({ onImport }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Transform Excel data to Mitarbeiter format
      const mitarbeiterData = data.map((row: any) => ({
        vollstaendigerName: row['Name'] || '',
        strasse: row['Straße'] || '',
        plz: row['PLZ'] || '',
        stadt: row['Stadt'] || '',
        geburtsdatum: row['Geburtsdatum'] || '',
      }));

      onImport(mitarbeiterData);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import fehlgeschlagen. Bitte überprüfen Sie die Datei.');
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-150"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Importieren
      </button>
    </>
  );
}
