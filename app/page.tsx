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
  const [useDatabase, setUseDatabase] = useState(false);

  // Load data on mount - try database first, fallback to localStorage
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/mitarbeiter');
        if (response.ok) {
          const result = await response.json();
          
          // Check if database is actually available
          if (result.dbAvailable === true) {
            setMitarbeiter(result.data || []);
            setUseDatabase(true);
            setIsLoaded(true);
            return;
          }
        }
      } catch (error) {
        console.log('Database not available, using localStorage');
      }
      
      // Fallback to localStorage
      const data = getMitarbeiter();
      setMitarbeiter(data);
      setUseDatabase(false);
      setIsLoaded(true);
    }
    loadData();
  }, []);

  const handleAddMitarbeiter = async (formData: MitarbeiterFormData) => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:31',message:'handleAddMitarbeiter called',data:{formData,useDatabase},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    
    if (useDatabase) {
      try {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:36',message:'Attempting database API call',data:{formData},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        
        const response = await fetch('/api/mitarbeiter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:46',message:'API response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        
        if (response.ok) {
          const newMitarbeiter = await response.json();
          setMitarbeiter((prev) => [newMitarbeiter, ...prev]);
          return;
        }
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:55',message:'API call failed, falling back',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        console.error('Failed to add to database, using localStorage');
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:62',message:'Using localStorage fallback',data:{formData},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    // Fallback to localStorage
    const newMitarbeiter = addMitarbeiter(formData);
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/8e3d9533-8b08-4cc1-bed5-8650680b5417',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:69',message:'localStorage addMitarbeiter returned',data:{newMitarbeiter},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    setMitarbeiter((prev) => [newMitarbeiter, ...prev]);
  };

  const handleDeleteMitarbeiter = async (id: string) => {
    if (useDatabase) {
      try {
        const response = await fetch(`/api/mitarbeiter/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setMitarbeiter((prev) => prev.filter((m) => m.id !== id));
          return;
        }
      } catch (error) {
        console.error('Failed to delete from database, using localStorage');
      }
    }
    
    // Fallback to localStorage
    deleteMitarbeiter(id);
    setMitarbeiter((prev) => prev.filter((m) => m.id !== id));
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
          {useDatabase ? 'Daten werden in der Datenbank gespeichert' : 'Daten werden lokal im Browser gespeichert'}
        </p>
      </footer>
    </div>
  );
}
