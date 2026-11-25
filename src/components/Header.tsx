import React from 'react';
import { Layers } from 'lucide-react';

export type AppView = 'catalog' | 'studio' | 'discover' | 'api' | 'instructions';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  selectionCount: number;
  onOpenSceneDrawer: () => void;
}

const NAV_ITEMS: Array<{ id: AppView; label: string }> = [
  { id: 'catalog', label: 'Katalog' },
  { id: 'studio', label: '3D Stüdyo' },
  { id: 'discover', label: 'Havuz' },
  { id: 'api', label: 'AI & API' },
  { id: 'instructions', label: 'Talimatlar' },
];

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  selectionCount,
  onOpenSceneDrawer,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-5 h-12 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="font-display text-[15px] font-bold tracking-tight text-[#09090B] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
        >
          MimarKatalog
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Ana gezinme" className="hidden md:flex items-center gap-6 h-full">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`h-full inline-flex items-center text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                  isActive
                    ? 'text-[#09090B] border-[#09090B]'
                    : 'text-[#6B7280] border-transparent hover:text-[#09090B]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 compact primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenSceneDrawer}
            aria-label={`Sahne Listesi, ${selectionCount} varlık seçili`}
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-[#09090B] hover:bg-[#1D4ED8] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">Sahne ({selectionCount})</span>
          </button>
        </div>
      </div>

      {/* Compact mobile navigation row */}
      <nav
        aria-label="Mobil gezinme"
        className="flex md:hidden items-center gap-4 px-4 border-t border-[#E5E7EB] overflow-x-auto h-9"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`h-full inline-flex items-center text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'text-[#09090B] border-[#09090B]'
                  : 'text-[#6B7280] border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
