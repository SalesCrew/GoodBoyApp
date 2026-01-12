'use client';

import { Mitarbeiter } from '@/lib/types';
import ExportMenu from './ExportMenu';
import ImportButton from './ImportButton';

interface HeaderProps {
  mitarbeiter: Mitarbeiter[];
  onImport: (data: any[]) => void;
}

export default function Header({ mitarbeiter, onImport }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
            Vertragsverwaltung
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ImportButton onImport={onImport} />
          <ExportMenu mitarbeiter={mitarbeiter} />
        </div>
      </div>
    </header>
  );
}
