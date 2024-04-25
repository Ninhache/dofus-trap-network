import Entity from "@classes/Entity";
import Game from "@classes/Game";
import { AreaType, Coordinates, State, Team } from "@src/enums";
import { isInArea } from "@src/utils/mapUtils";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface EntityComponentRef {
  setHighlight: (highlight: boolean) => void;
  show: () => void;
  hide: () => void;
  move: (fromPos: Coordinates, toPos: Coordinates) => void;
}

type ToDisplayState = State.Chakra | State.Gravity;

type Props = {
  entity: Entity;
};

const EntityComponent = forwardRef<EntityComponentRef, Props>((props, ref) => {
  
  const { entity } = props;

  let transitionCounter: number = 0;

  const [animX, setAnimX] = useState<number>(0);
  const [animY, setAnimY] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);
  const [display, setDisplay] = useState<boolean>(true); // Maybe for a future feature
  const [highlight, setHighlight] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    setHighlight: (highlight: boolean) => {
      setHighlight(highlight);
    },
    show: () => {
      setDisplay(true);
    },
    hide: () => {
      setDisplay(false);
    },
    move: (fromPos: Coordinates, toPos: Coordinates) => {
      move(fromPos, toPos);
    }
  }));

  /**
   * Moves an element on the screen.
   * *toPos* is used to know how many coordinates are changed
   * at the end of the css animation.
   * 
   * @param {Coordinates} fromPos Starting position
   * @param {Coordinates} toPos Ending position
   */
  const move = (fromPos: Coordinates, toPos: Coordinates) => {
    transitionCounter = 2;
    if (isInArea(fromPos, { type: AreaType.Diagonal, min: 0, max: 40 }, toPos)) {
      transitionCounter = 1;
    }

    setAnimX(toPos.x);
    setAnimY(toPos.y);
    setAnimate(true);
  }

  /**
   * Function triggered when a css transition of the entity circle ends.
   */
  const onTransitionEnd = () => {
    if (transitionCounter <= 1) {

      setAnimX(0);
      setAnimY(0);
      setAnimate(false);

      Game.onEntityTransitionEnd();
    } else {
      transitionCounter += -1;
    }
  }

  if (!display) return <></>;

  const cellWidth: number = 100 / (Game.width + 0.5);
  const cellHeight: number = cellWidth / 2;

  const width: number = 200 / (Game.width * 2 + (Game.width > 1 ? 1 : 0)) * entity.data.defaultScale;
  const height: number = width; // Square image with transparent padding

  const root: Coordinates = {
    x: (animX ?? entity.pos.x) * cellWidth + (animY ?? entity.pos.y) % 2 === 0 ? 0 : (cellWidth / 2),
    y: (animY ?? entity.pos.y) * cellHeight / 2
  };

  const states: Record<ToDisplayState, string> = {
    [State.Chakra]: "./assets/img/states/Chakra.svg",
    [State.Gravity]: "./assets/img/states/Gravity.svg"
  };

  const stateComponents: Array<JSX.Element> = [];
  const stateNum: number = entity.states.toString(2).split('1').length - 1;
  let i: number = 0;
  for (const key in states) {
    if (states.hasOwnProperty(key) && key in State) {
      const stateKey = State[key as keyof typeof State];

      if (entity.hasState(stateKey)) {
        stateComponents.push(<image
          className="entity-state"
          href={states[stateKey as ToDisplayState]}
          x={root.x - cellWidth / 5 + cellWidth / 2 + (2 * i - (stateNum - 1)) * cellWidth / 8}
          y={root.y - cellWidth / 5}
          width={cellWidth / 2.5}
          height={cellWidth / 2.5}
        />);
        i++;
      }
    }
  }

  return (
    <g className={`entity ${animate ? "animating" : ""} ${entity.team === Team.Attacker ? "attacker" : "defender"} ${highlight ? "highlighted" : ""}`}>
      <ellipse
        className="entity-circle"
        cx={root.x + cellWidth / 2}
        cy={root.y + cellHeight / 2}
        rx={cellWidth * 0.3}
        ry={cellHeight * 0.3}
        onTransitionEnd={() => { onTransitionEnd() }}
      />
      <image
        className="entity-image"
        href={entity.data.image}
        x={root.x - width / 2 + cellWidth / 2 + entity.data.offsetX * cellWidth}
        y={root.y - height + cellHeight * 0.75 + entity.data.offsetY * cellHeight}
        width={width}
        height={height}
      />
      {stateComponents}
    </g>
  );

});

export default EntityComponent
