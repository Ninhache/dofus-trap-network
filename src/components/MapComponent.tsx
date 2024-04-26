import "@assets/js/followMouse.js";
import Cell from "@classes/Cell";
import Entity from "@classes/Entity";
import Game from "@classes/Game";
import Trap from "@classes/Trap";
import { CellType, Coordinates, EventValue } from "@src/enums";

import "@assets/scss/Map.scss";
import CellComponent from "@components/CellComponent";
import EntityLayerComponent from "@components/EntityLayerComponent";
import CellLayerComponent from "@components/CellLayerComponent";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Nullable } from "@src/@types/NullableType";

type Props = {
  cellNum: number;
  rowNum: number;
};

export interface MapComponentRef {
  forceUpdate: () => void;
  setMouseIcon: (icon: string) => void;
}

const MapComponent = forwardRef<MapComponentRef, Props>((props: Props, ref) => {
  const { cellNum, rowNum } = props;

  const [mouseIcon, setMouseIcon] = useState<string>("");
  const [forceRender, setForceRender] = useState<number>(0);

  const forceUpdate = useCallback(() => {
    setForceRender(forceRender + 1);
  }, []);

  useImperativeHandle(ref, () => ({
    forceUpdate,
    setMouseIcon: (icon: string) => {
      setMouseIcon(icon);
    }
  }));

  

  useEffect(() => {
    const handleForceUpdate = () => {
      forceUpdate();
    }

    window.addEventListener(EventValue.forceUpdateMap, handleForceUpdate);

    return () => {
      window.removeEventListener(EventValue.forceUpdateMap, handleForceUpdate);
    }

  }, []);

  const onMouseEnterCell = (pos: Coordinates, entityPriority: boolean) => {
    const entity = Game.getEntity(pos);
    const trap = Game.getTrap(pos);
    if (entityPriority && entity || !entityPriority && !trap && entity) {
      entity.component.current?.setHighlight(true);
    } else if (trap) {
      trap.component.current?.setHighlight(true);
    }
  }

  const onMouseLeaveCell = (pos: Coordinates) => {
    const entity = Game.getEntity(pos);
    if (entity) {
      entity.component.current?.setHighlight(false);
    }
    const trap = Game.getTrap(pos);
    if (trap) {
      trap.component.current?.setHighlight(false);
    }
  }

  const rows: Array<JSX.Element> = [];
  const traps: Array<Trap> = [];
  const walls: Array<Cell | Entity> = [];

  const cellWidth: number = 100 / (cellNum + 0.5);
  const cellHeight: number = cellWidth / 2;

  try {
    for (let i: number = 0; i < rowNum; i++) {
      const cells: Array<JSX.Element> = [];
      for (let j: number = 0; j < cellNum; j++) {
        let cell: Cell = Game.getCell({ x: j, y: i });

        if (cell?.type === CellType.Wall) {
          walls.push(cell);
        } else {
          cells.push(<CellComponent
            key={`cell-${i * cellNum + j}`}
            y={i} x={j}
            // id={i * cellNum + j}
            width={cellWidth}
            height={cellHeight}
            onMouseEnter={(pos: Coordinates, entityPriority: boolean) => { onMouseEnterCell(pos, entityPriority); }}
            onMouseLeave={(pos: Coordinates) => { onMouseLeaveCell(pos); }}
          />);
        }
      }
      rows.push(<g className={`row ${i % 2 === 0 ? "even" : "odd"}`} key={`row-${i}`}>{cells}</g>);
    }

  } catch (err) {
    console.warn(err)
  }

  traps.concat(Game.traps);

  let entities = Array<Cell | Entity>();
  entities.concat(walls);
  entities.concat(Game.entities);
  entities = entities.toSorted((a, b) => a.pos.y - b.pos.y);

  const w: number = cellNum * 2 + (rowNum > 1 ? 1 : 0);
  const h: number = (rowNum + 1) / 2;
  const height: number = h / w * 100;

  return (
    <div className="relative-height-source map">
      <div className="mouse-icon">
        {mouseIcon
          ? <img src={mouseIcon} />
          : undefined
        }
      </div>
      <svg className="tiles" viewBox={`0 0 100 ${height}`}>
        <CellLayerComponent rows={rows} traps={traps} />
      </svg>
      <svg className="entities" viewBox={`0 0 100 ${height}`}>
        <EntityLayerComponent entitiesProps={entities} startPoint={Game.startPoint} />
      </svg>
    </div>
  );
});

export default MapComponent;
