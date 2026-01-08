'use client';

import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function parseGermanDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('.').map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

function formatGermanDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert to Monday = 0
}

export default function DatePicker({ value, onChange, placeholder = 'TT.MM.JJJJ' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseGermanDate(value);
    return parsed || new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseGermanDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  // Calculate calendar grid
  const calendarDays: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month - 1, day),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    });
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
    });
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDayClick = (date: Date) => {
    onChange(formatGermanDate(date));
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToPrevYear = () => {
    setViewDate(new Date(year - 1, month, 1));
  };

  const goToNextYear = () => {
    setViewDate(new Date(year + 1, month, 1));
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer transition-colors duration-150 hover:border-gray-300 focus-within:border-gray-400"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50 animate-slide-down min-w-[280px]">
          {/* Header with Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goToPrevYear}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToPrevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <span className="text-sm font-medium text-gray-700">
              {MONTHS[month]} {year}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goToNextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToNextYear}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="w-9 h-6 flex items-center justify-center text-xs text-gray-400 font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">
            {calendarDays.map((item, index) => {
              const selected = isSelected(item.date);
              const todayDate = isToday(item.date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayClick(item.date)}
                  className={`
                    calendar-day
                    ${!item.isCurrentMonth ? 'other-month' : 'text-gray-700'}
                    ${selected ? 'selected' : ''}
                    ${todayDate && !selected ? 'today' : ''}
                  `}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Today Button */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                onChange(formatGermanDate(today));
                setIsOpen(false);
              }}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 transition-colors py-1"
            >
              Heute
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
