import * as React from "react";
import "@assets/scss/Spells.scss";
import { Spell } from "@src/@types/SpellDataType";

type Props = {
  spell: Spell;
  onClick: (spell: Spell) => void;
  selected: boolean;
};

const SpellComponent: React.FC<Props> = ({ spell, onClick, selected }) => {
  return (<div className={`spell ${selected ? "selected-spell" : ""}`} onClick={() => { onClick(spell); }}>
    <img
      width="45"
      height="45"
      src={spell.icon}
      alt={spell.name}
      draggable="false"
    />
  </div>);
}

export default SpellComponent;
