import React, { createContext, useContext, useRef, ReactNode } from 'react';

interface MapProps {
  cellNum: number;
  rowNum: number;
}

interface GameContextValue {
  statsComponent: React.RefObject<HTMLDivElement>;
  mapComponent: React.RefObject<HTMLDivElement>;
  historyComponent: React.RefObject<HTMLDivElement>;
  spellsComponent: React.RefObject<HTMLDivElement>;
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
  const statsComponentRef = useRef<HTMLDivElement>(null);
  const mapComponentRef = useRef<HTMLDivElement>(null);
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
