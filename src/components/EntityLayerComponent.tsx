import Cell from "@classes/Cell";
import Entity from "@classes/Entity";
import Game from "@classes/Game";
import * as React from "react";
import CellComponent from "@components/CellComponent";
import EntityComponent from "@components/EntityComponent";
import { Coordinates } from "@src/enums";
import { Nullable } from "@src/@types/NullableType";

type Props = {
  entitiesProps: Array<Entity | Cell>;
  startPoint: Nullable<Coordinates>;
};

const EntityLayerComponent: React.FC<Props> = ({ entitiesProps, startPoint }) => {

  const entities: Array<JSX.Element> = [];
  const cellWidth: number = 100 / (Game.width + 0.5);
  const cellHeight: number = cellWidth / 2;

  for (let i: number = 0; i < entitiesProps.length; i++) {
    const entity = entitiesProps[i];
    if (entity instanceof Cell) {
      entities.push(<CellComponent
        x={entity.pos.x}
        y={entity.pos.y}
        // id={entity.pos.y * Game.width + entity.pos.x}
        width={cellWidth}
        height={cellHeight}
        key={entity.uuid}
        onMouseEnter={() => { return; }}
        onMouseLeave={() => { return; }}
      />);
    } else {
      entities.push(<EntityComponent
        key={entity.uuid}
        entity={entity}
        ref={entity.component}
      />);
    }
  }

  if (startPoint) {
    const root: Coordinates = {
      x: (startPoint.x) * cellWidth + ((startPoint.y) % 2 === 0 ? 0 : cellWidth / 2),
      y: (startPoint.y) * cellHeight / 2
    };

    entities.push(
      <image
        className="entity-image"
        key="startpoint"
        href="./assets/img/entities/Target.svg"
        x={root.x + cellWidth * 0.15}
        y={root.y + cellHeight * 0.15}
        width={cellWidth * 0.7}
        height={cellHeight * 0.7}
      />);
  }

  return (<>
    {entities}
  </>);
}


export default EntityLayerComponent;