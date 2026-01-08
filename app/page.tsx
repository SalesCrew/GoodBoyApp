'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MitarbeiterForm from '@/components/MitarbeiterForm';
import MitarbeiterList from '@/components/MitarbeiterList';
import { Mitarbeiter, MitarbeiterFormData } from '@/lib/types';

export default function Home() {
  const [mitarbeiter, setMitarbeiter] = useState<Mitarbeiter[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from database on mount
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/mitarbeiter');
        if (response.ok) {
          const data = await response.json();
          setMitarbeiter(data);
        }
      } catch (error) {
        console.error('Failed to load Mitarbeiter:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  const handleAddMitarbeiter = async (formData: MitarbeiterFormData) => {
    try {
      const response = await fetch('/api/mitarbeiter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const newMitarbeiter = await response.json();
        setMitarbeiter((prev) => [newMitarbeiter, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add Mitarbeiter:', error);
    }
  };

  const handleDeleteMitarbeiter = async (id: string) => {
    try {
      const response = await fetch(`/api/mitarbeiter/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMitarbeiter((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete Mitarbeiter:', error);
    }
  };

  // Show loading state
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
          Daten werden in der Datenbank gespeichert
        </p>
      </footer>
    </div>
  );
}
