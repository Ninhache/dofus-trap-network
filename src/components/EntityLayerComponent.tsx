import Cell from "@classes/Cell";
import Entity from "@classes/Entity";
import Game from "@classes/Game";
import TrapCell from "@classes/TrapCell";
import * as React from "react";
import CellComponent from "./CellComponent";
import EntityComponent from "./EntityComponent";
import TrapCellComponent from "./TrapCellComponent";

type Props = {
  entities: Array<Entity | Cell | TrapCell>;
};

class EntityLayerComponent extends React.Component<Props>
{
  render() {
    let entities: Array<JSX.Element> = [];
    let cellWidth: number = 100 / (Game.width + 0.5);
    let cellHeight: number = cellWidth / 2;

    for (let i: number = 0; i < this.props.entities.length; i++) {
      let entity = this.props.entities[i];
      if (entity instanceof TrapCell) {
        entities.push(<TrapCellComponent
          x={entity.x}
          y={entity.y}
          id={entity.y * Game.width + entity.x}
          width={cellWidth}
          height={cellHeight}
          type={entity.type}
          borders={entity.borders}
        />);
      } else if (entity instanceof Cell) {
        entities.push(<CellComponent
          x={entity.x}
          y={entity.y}
          id={entity.y * Game.width + entity.x}
          width={cellWidth}
          height={cellHeight}
        />);
      } else {
        entities.push(<EntityComponent
          x={entity.x}
          y={entity.y}
          data={entity.data}
          team={entity.team}
        />);
      }
    }
    return <g>{entities}</g>;
  }
}

export default EntityLayerComponent;
