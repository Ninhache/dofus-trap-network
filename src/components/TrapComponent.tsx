import Game from "@classes/Game";
import Trap from "@classes/Trap";
import { CellType, TrapClasses } from "@src/enums";
import { colorToInt } from "@src/utils/utils";

import TrapCellComponent from "./TrapCellComponent";
import { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  trap: Trap;
  setHighlight: (uuid: string, highlight: boolean) => void;
  highlight: boolean;
};

export interface TrapComponentRef {
  show: () => void,
  hide: () => void,
  setHighlight: (highlight: boolean) => void
}

const TrapComponent = forwardRef<TrapComponentRef, Props>((props: Props, ref) => {

  const { trap, setHighlight, highlight } = props;

  const [display, setDisplay] = useState<boolean>(true);

  useImperativeHandle(ref, () => ({
    show,
    hide,
    setHighlight: (highlight: boolean) => {
      setHighlighted(highlight)
    },
  }));

  /**
   * Shows the trap component.
   */
  const show = () => {
    setDisplay(true);
    if (trap.imgComponent.current) {
      trap.imgComponent.current.style.display = "";
    }
  }

  /**
   * Hides the trap component.
   */
  const hide = () => {
    setDisplay(false);
    if (trap.imgComponent.current) {
      trap.imgComponent.current.style.display = "none";
    }
  }

  /**
   * Set the highlight value of the trap component.
   */
  const setHighlighted = (highlight: boolean) => {
    const actions = Game.getActionsFromTrap(trap);
    actions.forEach(action => {
      // action.component?.current.setHighlight(highlight);
      action.component.current?.setHighlight(highlight);
    });
    setHighlight(trap.uuid, highlight);
  }


  const cells: Array<JSX.Element> = [];
  const cellWidth: number = 100 / (Game.width + 0.5);
  const cellHeight: number = cellWidth / 2;

  const trapCells = trap.getTrapCells(highlight);
  for (let j: number = 0; j < trapCells.length; j++) {
    const center: boolean = trapCells[j].pos.x === trap.pos.x && trapCells[j].pos.y === trap.pos.y;
    if (!display && !center) continue;
    if (Game.getCell(trapCells[j].pos)?.type !== CellType.Ground) continue;

    trapCells[j].borders |= Game.getCellBorders(trapCells[j].pos);
    cells.push(<TrapCellComponent
      x={trapCells[j].pos.x}
      y={trapCells[j].pos.y}
      id={trapCells[j].pos.y * Game.width + trapCells[j].pos.x}
      center={center}
      setHighlight={(highlight: boolean) => { setHighlighted(highlight); }}
      width={cellWidth}
      height={cellHeight}
      type={TrapClasses[colorToInt(trapCells[j].color)]}
      borders={trapCells[j].borders}
      key={j}
    />);
  }
  return (
    <g className={`trap trap-${TrapClasses[colorToInt(trap.color)]}`}>
      {cells}
    </g>
  );
});


export default TrapComponent;
