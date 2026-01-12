'use client';

import { useState } from 'react';
import { MitarbeiterFormData } from '@/lib/types';

interface MitarbeiterFormProps {
  onSubmit: (data: MitarbeiterFormData) => void;
}

const initialFormState: MitarbeiterFormData = {
  vollstaendigerName: '',
  strasse: '',
  plz: '',
  stadt: '',
  geburtsdatum: '',
};

export default function MitarbeiterForm({ onSubmit }: MitarbeiterFormProps) {
  const [formData, setFormData] = useState<MitarbeiterFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof MitarbeiterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.vollstaendigerName.trim() || !formData.strasse.trim() || 
        !formData.plz.trim() || !formData.stadt.trim() || !formData.geburtsdatum) {
      return;
    }

    setIsSubmitting(true);
    
    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    onSubmit(formData);
    setFormData(initialFormState);
    setIsSubmitting(false);
  };

  const isFormValid = 
    formData.vollstaendigerName.trim() && 
    formData.strasse.trim() && 
    formData.plz.trim() && 
    formData.stadt.trim() && 
    formData.geburtsdatum;

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="bg-white rounded-xl shadow-soft p-6">
      <div className="space-y-5">
        {/* Row 1: Name and Birthday */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Vollständiger Name
            </label>
            <input
              type="text"
              value={formData.vollstaendigerName}
              onChange={handleChange('vollstaendigerName')}
              placeholder="Max Mustermann"
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-colors duration-150 hover:border-gray-300 focus:border-gray-400"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Geburtsdatum
            </label>
            <input
              type="text"
              value={formData.geburtsdatum}
              onChange={handleChange('geburtsdatum')}
              placeholder="TT.MM.JJJJ"
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-colors duration-150 hover:border-gray-300 focus:border-gray-400"
            />
          </div>
        </div>

        {/* Row 2: Street */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Straße und Hausnummer
          </label>
          <input
            type="text"
            value={formData.strasse}
            onChange={handleChange('strasse')}
            placeholder="Musterstraße 12"
            className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-colors duration-150 hover:border-gray-300 focus:border-gray-400"
          />
        </div>

        {/* Row 3: PLZ and City */}
        <div className="grid grid-cols-3 gap-5">
          {/* PLZ */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              PLZ
            </label>
            <input
              type="text"
              value={formData.plz}
              onChange={handleChange('plz')}
              placeholder="12345"
              maxLength={5}
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-colors duration-150 hover:border-gray-300 focus:border-gray-400"
            />
          </div>

          {/* City */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Stadt
            </label>
            <input
              type="text"
              value={formData.stadt}
              onChange={handleChange('stadt')}
              placeholder="Berlin"
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-colors duration-150 hover:border-gray-300 focus:border-gray-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`
            w-full h-11 rounded-lg font-medium text-sm transition-all duration-150
            ${isFormValid && !isSubmitting
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Wird hinzugefügt...
            </span>
          ) : (
            '+ Mitarbeiter hinzufügen'
          )}
        </button>
      </div>
    </form>
  );
}
