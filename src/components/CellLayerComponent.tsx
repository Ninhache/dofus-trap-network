import Game from "@classes/Game";
import Trap from "@classes/Trap";

import TrapComponent from "@components/TrapComponent";
import { Coordinates, TrapClasses } from "@src/enums";
import { colorToInt } from "@src/utils/utils";
import SpellData from "@json/Spells";
import { Fragment, useCallback, useState } from "react";

interface Props {
  rows: Array<JSX.Element>;
  traps: Array<Trap>;
}

const CellLayerComponent: React.FC<Props> = ({ rows, traps }) => {
  const [highlighted, setHighlighted] = useState<string[]>([]);

  const setHighlight = useCallback((uuid: string, highlight: boolean) => {
    setHighlighted(currentHighlighted => {
      const newHighlighted = [...currentHighlighted];
      let index = newHighlighted.indexOf(uuid);
      if (highlight) {
        if (index === -1) {
          newHighlighted.push(uuid);
        }
      } else {
        while (index !== -1) {
          newHighlighted.splice(index, 1);
          index = newHighlighted.indexOf(uuid);
        }
      }
      return newHighlighted;
    });
  }, []);

  const cellWidth: number = 100 / (Game.width + 0.5);
  const celHeight: number = cellWidth / 2;

  const trapElements = traps.map((trap, i) => {
    const sizeCoef: number = 0.7 * SpellData[trap.spellId].sfxSize;
    const root: Coordinates = {
      x: trap.pos.x * cellWidth + (trap.pos.y % 2 === 0 ? 0 : cellWidth / 2),
      y: trap.pos.y * (celHeight / 2)
    };
    const keyBase = `trap-${trap.uuid}`;
    const isHighlighted = highlighted.includes(trap.uuid);
    const imageSizeCoef = isHighlighted ? 1.2 : 1;
    return (
      <Fragment key={keyBase}>
        <TrapComponent
          trap={trap}
          setHighlight={setHighlight}
          highlight={isHighlighted}
          key={keyBase}
        />
        <image
          className={`trap-image ${TrapClasses[colorToInt(trap.color)]}`}
          href={SpellData[trap.spellId].sfx || "NULL"}
          x={root.x + cellWidth * ((1 - (sizeCoef * imageSizeCoef)) / 2)}
          y={root.y + celHeight * ((1 - (sizeCoef * imageSizeCoef)) / 2)}
          width={cellWidth * sizeCoef * imageSizeCoef}
          height={celHeight * sizeCoef * imageSizeCoef}
          key={`${keyBase}-img`}
          style={{ display: trap.active ? "" : "none" }}
        />
        {Game.options.order && (
          <text className='trap-text' x={root.x + 2} y={root.y + 1.2}>
            {traps.length - i}
          </text>
        )}
      </Fragment>
    );
  });

  return (
    <g>
      <g key='g-1' className="tiles">{rows}</g>
      <g key='g-2' className="traps">{trapElements}</g>
    </g>
  );
};


export default CellLayerComponent;
