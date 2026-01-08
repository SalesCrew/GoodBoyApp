'use client';

import { useState, useEffect, useRef } from 'react';

interface BossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

type Step = 'boss' | 'wrong' | 'goodboy' | 'deleting' | 'spass' | 'spassHund';

const BOSSES = ['Jack', 'Liam', 'Henrik', 'Kilian', 'Maurice', 'Dani'];
const CORRECT_ANSWER = 'Kilian';

export default function BossModal({ isOpen, onClose, onConfirm }: BossModalProps) {
  const [step, setStep] = useState<Step>('boss');
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);
  const [showColors, setShowColors] = useState(false);
  const hasTriggeredDownload = useRef(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('boss');
      setSelectedBoss(null);
      setShowColors(false);
      hasTriggeredDownload.current = false;
    }
  }, [isOpen]);

  // Handle step transitions
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === 'wrong') {
      // Show colors for 1 second, then go to fake delete
      timer = setTimeout(() => {
        setShowColors(false);
        setStep('deleting');
      }, 1000);
    } else if (step === 'goodboy') {
      // Show good boy for 2 seconds
      timer = setTimeout(() => {
        setStep('deleting');
      }, 2000);
    } else if (step === 'deleting') {
      // Show deleting for 3 seconds (correct) or 5 seconds (wrong)
      const duration = selectedBoss === CORRECT_ANSWER ? 3000 : 5000;
      timer = setTimeout(() => {
        setStep(selectedBoss === CORRECT_ANSWER ? 'spass' : 'spassHund');
      }, duration);
    } else if ((step === 'spass' || step === 'spassHund') && !hasTriggeredDownload.current) {
      // Trigger download immediately
      hasTriggeredDownload.current = true;
      onConfirm();
      
      // Close modal after 1.5 seconds
      timer = setTimeout(() => {
        onClose();
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [step, selectedBoss, onConfirm, onClose]);

  if (!isOpen) return null;

  const handleBossSelect = (boss: string) => {
    setSelectedBoss(boss);
    if (boss === CORRECT_ANSWER) {
      setStep('goodboy');
    } else {
      setShowColors(true);
      setStep('wrong');
    }
  };

  const getButtonStyle = (boss: string) => {
    if (!showColors) {
      return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
    }
    if (boss === CORRECT_ANSWER) {
      return 'bg-emerald-100 text-emerald-700';
    }
    if (boss === selectedBoss) {
      return 'bg-red-100/60 text-red-600';
    }
    return 'bg-gray-100 text-gray-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={step === 'boss' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 overflow-hidden animate-fade-in">
        
        {/* Step 1: Boss Selection */}
        {(step === 'boss' || step === 'wrong') && (
          <div className="p-8">
            <h2 className="text-center text-lg font-medium text-gray-900 mb-6">
              Wer ist Boss 1?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {BOSSES.map((boss) => (
                <button
                  key={boss}
                  onClick={() => !showColors && handleBossSelect(boss)}
                  disabled={showColors}
                  className={`
                    h-11 font-medium rounded-xl transition-all duration-200
                    ${getButtonStyle(boss)}
                  `}
                >
                  {boss}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Good Boy (correct answer) */}
        {step === 'goodboy' && (
          <div className="p-12 text-center">
            <div className="text-4xl font-bold text-emerald-500 tracking-wide">
              GOOOD BOOOY
            </div>
          </div>
        )}

        {/* Step 3: Deleting (fake) */}
        {step === 'deleting' && (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="animate-spin w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-lg font-medium text-red-500">
                {selectedBoss === CORRECT_ANSWER ? 'Alle Daten werden gelöscht...' : 'Alle Daten löschen...'}
              </span>
            </div>
            <p className="text-sm text-gray-400">Bitte warten...</p>
          </div>
        )}

        {/* Step 4a: Spaß (correct path) */}
        {step === 'spass' && (
          <div className="p-12 text-center">
            <div className="text-3xl font-bold text-gray-900">
              Spaß 😄
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Download startet...
            </p>
          </div>
        )}

        {/* Step 4b: Spaß hier du Hund (wrong path) */}
        {step === 'spassHund' && (
          <div className="p-12 text-center">
            <div className="text-2xl font-bold text-gray-900">
              Spaß hier du Hund 🐕
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Download startet...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
