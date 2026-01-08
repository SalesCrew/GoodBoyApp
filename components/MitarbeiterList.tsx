'use client';

import { Mitarbeiter } from '@/lib/types';
import MitarbeiterCard from './MitarbeiterCard';

interface MitarbeiterListProps {
  mitarbeiter: Mitarbeiter[];
  onDelete: (id: string) => void;
}

export default function MitarbeiterList({ mitarbeiter, onDelete }: MitarbeiterListProps) {
  if (mitarbeiter.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          Keine Mitarbeiter
        </h3>
        <p className="text-sm text-gray-500">
          Fügen Sie oben den ersten Mitarbeiter hinzu.
        </p>
      </div>
    );
  }

  // Sort by creation date (newest first)
  const sortedMitarbeiter = [...mitarbeiter].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">
          Mitarbeiter
        </h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {mitarbeiter.length} {mitarbeiter.length === 1 ? 'Eintrag' : 'Einträge'}
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {sortedMitarbeiter.map((m, index) => (
          <div
            key={m.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <MitarbeiterCard
              mitarbeiter={m}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
