'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mitarbeiter } from '@/lib/types';
import GoodBoyModal from './GoodBoyModal';
import BossModal from './BossModal';

interface ExportMenuProps {
  mitarbeiter: Mitarbeiter[];
}

export default function ExportMenu({ mitarbeiter }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<'excel' | 'contracts' | null>(null);
  const [showGoodBoyModal, setShowGoodBoyModal] = useState(false);
  const [showBossModal, setShowBossModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDisabled = mitarbeiter.length === 0;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportExcelClick = () => {
    if (isDisabled) return;
    setIsOpen(false);
    setShowBossModal(true);
  };

  const handleExportExcelConfirmed = useCallback(async () => {
    setIsExporting('excel');
    
    try {
      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mitarbeiter }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mitarbeiter.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(null);
    }
  }, [mitarbeiter]);

  const handleExportContractsClick = () => {
    if (isDisabled) return;
    setIsOpen(false);
    setShowGoodBoyModal(true);
  };

  const handleExportContractsConfirmed = useCallback(async () => {
    setIsExporting('contracts');
    
    try {
      const response = await fetch('/api/export-contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mitarbeiter }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dienstvertraege.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Contract export failed:', error);
      alert('Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(null);
    }
  }, [mitarbeiter]);

  return (
    <div ref={menuRef} className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`
          h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-150
          ${isDisabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exportieren
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isDisabled && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-slide-down">
          {/* Excel Export */}
          <button
            onClick={handleExportExcelClick}
            disabled={isExporting !== null}
            className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              {isExporting === 'excel' ? (
                <svg className="animate-spin w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">Excel exportieren</div>
              <div className="text-xs text-gray-500">Namen & Adressen als .xlsx</div>
            </div>
          </button>

          {/* Contracts Export */}
          <button
            onClick={handleExportContractsClick}
            disabled={isExporting !== null}
            className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              {isExporting === 'contracts' ? (
                <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">Verträge als ZIP</div>
              <div className="text-xs text-gray-500">Alle Dienstverträge als .docx</div>
            </div>
          </button>
        </div>
      )}

      {/* Good Boy Modal (for ZIP) */}
      <GoodBoyModal
        isOpen={showGoodBoyModal}
        onClose={() => setShowGoodBoyModal(false)}
        onConfirm={handleExportContractsConfirmed}
      />

      {/* Boss Modal (for Excel) */}
      <BossModal
        isOpen={showBossModal}
        onClose={() => setShowBossModal(false)}
        onConfirm={handleExportExcelConfirmed}
      />
    </div>
  );
}
