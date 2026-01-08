'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MitarbeiterForm from '@/components/MitarbeiterForm';
import MitarbeiterList from '@/components/MitarbeiterList';
import { Mitarbeiter, MitarbeiterFormData } from '@/lib/types';
import { getMitarbeiter, addMitarbeiter, deleteMitarbeiter } from '@/lib/storage';

export default function Home() {
  const [mitarbeiter, setMitarbeiter] = useState<Mitarbeiter[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const data = getMitarbeiter();
    setMitarbeiter(data);
    setIsLoaded(true);
  }, []);

  const handleAddMitarbeiter = (formData: MitarbeiterFormData) => {
    const newMitarbeiter = addMitarbeiter(formData);
    setMitarbeiter((prev) => [...prev, newMitarbeiter]);
  };

  const handleDeleteMitarbeiter = (id: string) => {
    deleteMitarbeiter(id);
    setMitarbeiter((prev) => prev.filter((m) => m.id !== id));
  };

  // Show nothing until localStorage is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Wird geladen...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header mitarbeiter={mitarbeiter} />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Entry Form */}
          <MitarbeiterForm onSubmit={handleAddMitarbeiter} />
          
          {/* List */}
          <MitarbeiterList
            mitarbeiter={mitarbeiter}
            onDelete={handleDeleteMitarbeiter}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-400">
          Daten werden lokal im Browser gespeichert
        </p>
      </footer>
    </div>
  );
}
