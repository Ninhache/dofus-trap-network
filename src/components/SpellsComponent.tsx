import "@assets/scss/Spells.scss";
import Game from "@classes/Game";
import SpellComponent from "@components/SpellComponent";
import SpellData from "@json/Spells";
import { Nullable } from "@src/@types/NullableType";
import { Spell } from "@src/@types/SpellDataType";
import { SpellCategory } from "@src/enums";
import { forwardRef, useImperativeHandle, useState } from "react";

type Props = {};

export interface SpellsComponentRef {
  setPlay: (play: boolean) => void;
}

const SpellsComponent = forwardRef<SpellsComponentRef, Props>((props: Props, ref) => {

  const [selectedSpell, setSelectedSpell] = useState<Nullable<Spell>>();
  const [play, setPlay] = useState<boolean>(false);
  const [leukide, setLeukide] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    setPlay: (play: boolean) => {
      setPlay(play)
    },
  }));

  const onClick = (spell: Spell) => {
    if (selectedSpell === spell) {
      Game.selectSpell(null);
      setSelectedSpell(null);
    } else {
      Game.selectSpell(spell);
      setSelectedSpell(spell);
    }
  }

  const onPlay = () => {
    setPlay(true);
    Game.run();
  }

  const onPause = () => {
    setPlay(false);
    Game.pause();
  }

  const onStep = () => {
    setPlay(false);
    Game.runOne();
  }

  const onStop = () => {
    setPlay(false);
    Game.resetAll();
  }

  const onLeukide = () => {
    if (Game.isRunning) return;

    const active = Game.toggleLeukide();
    setLeukide(active);
  }

  const spellCategories: Array<JSX.Element> = [];

  const categoryOrder: Array<SpellCategory> = [
    SpellCategory.AirTrap,
    SpellCategory.FireTrap,
    SpellCategory.EarthTrap,
    SpellCategory.WaterTrap,
    SpellCategory.MalusTrap,
    SpellCategory.Entity,
    SpellCategory.Other,
    SpellCategory.Action
  ];

  for (const cat of categoryOrder) {
    const spells: Array<JSX.Element> = [];
    for (const type in SpellData) {
      if (SpellData[type].category !== cat) continue;

      spells.push(<SpellComponent
        key={`spell-${type}`}
        spell={SpellData[type]}
        onClick={(spell: Spell) => { onClick(spell); }}
        selected={selectedSpell?.name === SpellData[type].name}
      />);
    }
    spellCategories.push(
      <div className="spell-category" key={Math.random()}>
        {spells}
      </div>
    );
  }

  return <div className="spells">
    <div className="spells-options">
      <div className={`btn btn-leukide ${leukide ? 'active' : ''}`} onClick={() => { onLeukide(); }}>
        <img className="img-leukide" src="./assets/img/other/leukide.png" alt="leukide" />
      </div>
    </div>
    {spellCategories}
    <div className="controls">
      <button className={play ? "pause" : "play"} onClick={() => { play ? onPause() : onPlay(); }}>
        <img className="img-play" src="./assets/img/other/play.png" alt="play" draggable="false" />
        <img className="img-pause" src="./assets/img/other/pause.png" alt="pause" draggable="false" />
      </button>
      <button className="step" onClick={() => { onStep(); }}>
        <img className="img-step" src="./assets/img/other/step.png" alt="step" draggable="false" />
      </button>
      <button className="stop" onClick={() => { onStop(); }}>
        <img className="img-stop" src="./assets/img/other/stop.png" alt="stop" draggable="false" />
      </button>
    </div>
  </div>;
});

export default SpellsComponent;
