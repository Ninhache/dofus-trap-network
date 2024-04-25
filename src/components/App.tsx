import "@assets/js/script.js";
import "@assets/scss/App.scss";
import Game from "@classes/Game";
import HistoryComponent from "@components/HistoryComponent";
import MapComponent from "@components/MapComponent";
import SpellsComponent from "@components/SpellsComponent";
import StatsComponent from "@components/StatsComponent";
import Consts from "@json/Consts.json";
import { useGame } from "@src/context/GameProvider";

declare global { // Debug
  interface Window { Game: typeof Game; }
}

const App: React.FC<{}> = ({ }) => {

  const game = useGame();

  return (
    <div className="app">
      <StatsComponent ref={game.statsComponent} />
      <MapComponent ref={game.mapComponent} cellNum={Consts.mapWidth} rowNum={Consts.mapHeight} />
      <HistoryComponent ref={game.historyComponent} />
      <SpellsComponent ref={game.spellsComponent} />
    </div>
  );
};

export default App;
