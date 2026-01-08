'use client';

import { useState, useEffect } from 'react';

interface GoodBoyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

type Step = 'confirm' | 'scale' | 'goodboy';

export default function GoodBoyModal({ isOpen, onClose, onConfirm }: GoodBoyModalProps) {
  const [step, setStep] = useState<Step>('confirm');

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
    }
  }, [isOpen]);

  // Auto-close after showing "Good Boy" message
  useEffect(() => {
    if (step === 'goodboy') {
      const timer = setTimeout(() => {
        onConfirm();
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, onConfirm, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setStep('scale');
  };

  const handleScaleSelect = () => {
    setStep('goodboy');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={step !== 'goodboy' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 overflow-hidden animate-fade-in">
        
        {/* Step 1: Confirm */}
        {step === 'confirm' && (
          <div className="p-8">
            <h2 className="text-center text-lg font-medium text-gray-900 mb-8">
              Bitte bestätigen Sie dass Sie Gay sind.
            </h2>
            <button
              onClick={handleConfirm}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors duration-150"
            >
              Ja
            </button>
          </div>
        )}

        {/* Step 2: Scale */}
        {step === 'scale' && (
          <div className="p-8">
            <h2 className="text-center text-lg font-medium text-gray-900 mb-6">
              Wie sehr?
            </h2>
            <div className="space-y-3">
              {[10, 9, 8, 7].map((num) => (
                <button
                  key={num}
                  onClick={handleScaleSelect}
                  className="w-full h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-150"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Good Boy */}
        {step === 'goodboy' && (
          <div className="p-12 text-center">
            <div className="text-4xl font-bold text-emerald-500 tracking-wide">
              GOOOOOD BOOOYYY
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Download startet...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
