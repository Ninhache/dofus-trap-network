import * as React from "react";
import "@assets/scss/App.scss";
import "@assets/js/script.js";
import MapComponent from "@components/MapComponent";
import StatsComponent from "@components/StatsComponent";
import HistoryComponent from "@components/HistoryComponent";
import SpellsComponent from "@components/SpellsComponent";
import Consts from "@json/Consts.json";
import Game from "@classes/Game";
import { GameProvider } from "@src/context/GameProvider";

declare global { // Debug
  interface Window { Game: typeof Game; }
}

const App: React.FC<{ }> = ({ }) => {
  return (
    <div className="app">
      <GameProvider>
        <StatsComponent />
        <MapComponent cellNum={Consts.mapWidth} rowNum={Consts.mapHeight} />
        <HistoryComponent />
        <SpellsComponent />
      </GameProvider>
    </div>
  );
};

export default App;
