'use client';

import { useState } from 'react';
import { Mitarbeiter } from '@/lib/types';

interface MitarbeiterCardProps {
  mitarbeiter: Mitarbeiter;
  onDelete: (id: string) => void;
}

export default function MitarbeiterCard({ mitarbeiter, onDelete }: MitarbeiterCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // Small delay for animation
    await new Promise((resolve) => setTimeout(resolve, 150));
    onDelete(mitarbeiter.id);
  };

  const fullAddress = `${mitarbeiter.strasse}, ${mitarbeiter.plz} ${mitarbeiter.stadt}`;

  return (
    <div
      className={`
        group relative px-4 py-3 transition-all duration-150
        ${isDeleting ? 'animate-fade-out opacity-0' : ''}
        hover:bg-gray-50
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {mitarbeiter.vollstaendigerName}
          </h3>
          
          {/* Address */}
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {fullAddress}
          </p>
          
          {/* Birthday */}
          <p className="text-xs text-gray-400 mt-1">
            {mitarbeiter.geburtsdatum}
          </p>
        </div>

        {/* Delete Button */}
        <div className="flex-shrink-0">
          {showConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                Löschen
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
              aria-label="Löschen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
