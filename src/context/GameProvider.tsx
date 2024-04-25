import { HistoryComponentRef } from '@components/HistoryComponent';
import { MapComponentRef } from '@components/MapComponent';
import { SpellsComponentRef } from '@components/SpellsComponent';
import { StatsComponentRef } from '@components/StatsComponent';
import React, { createContext, useContext, useRef, ReactNode } from 'react';

interface GameContextValue {
  statsComponent: React.RefObject<StatsComponentRef>;
  mapComponent: React.RefObject<MapComponentRef>;
  historyComponent: React.RefObject<HistoryComponentRef>;
  spellsComponent: React.RefObject<SpellsComponentRef>;
}

const GameContext = createContext<GameContextValue | null>(null);

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const statsComponentRef = useRef<SpellsComponentRef>(null);
  const mapComponentRef = useRef<MapComponentRef>(null);
  const historyComponentRef = useRef<HTMLDivElement>(null);
  const spellsComponentRef = useRef<HTMLDivElement>(null);

  const game = {
    statsComponent: statsComponentRef,
    mapComponent: mapComponentRef,
    historyComponent: historyComponentRef,
    spellsComponent: spellsComponentRef,
  };

  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};
