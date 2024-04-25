import Game from "@classes/Game";
import { CellType, Coordinates } from "@src/enums";
import * as React from "react";

type Props = {
  x: number;
  y: number;
  id: number;
  width: number;
  height: number;
  onMouseEnter: (pos: Coordinates, entityPriority: boolean) => void;
  onMouseLeave: (pos: Coordinates, entityPriority: boolean) => void;
};

const CellComponent: React.FC<Props> = ({ x, y, id, width, height, onMouseEnter, onMouseLeave }) => {
  const [isHighlighted, setHighlighted] = React.useState(false);

  const handleClick = (top: boolean) => {
    Game.onCellClick({ x, y }, top);
  }

  const handleMouseEnter = (top: boolean) => {
    setHighlighted(true)
    onMouseEnter({ x, y }, top);
  }

  const handleMouseLeave = (top: boolean) => {
    setHighlighted(false);
    onMouseLeave({ x, y }, top);
  }

  const type: CellType = Game.getCell({ x, y }).type;
  const even: boolean = y % 2 === 0;
  const root = {
    x: x * width + (even ? 0 : width / 2),
    y: y * (height / 2)
  };

  const typeClasses = {
    [CellType.Ground]: "ground",
    [CellType.Empty]: "empty",
    [CellType.Wall]: "wall"
  };

  const poly: Array<JSX.Element> = [];
  if (type === CellType.Wall) {
    poly.push(
      <polygon key='polygon-1' points={`
          ${root.x + width / 2},${root.y - height / 2}
          ${root.x + width},${root.y}
          ${root.x + width / 2},${root.y + height / 2}
          ${root.x},${root.y}
        `}></polygon>,
      <polygon key='polygon-2' points={`
          ${root.x},${root.y}
          ${root.x},${root.y + height / 2}
          ${root.x + width / 2},${root.y + height}
          ${root.x + width / 2},${root.y + height / 2}
        `}></polygon>,
      <polygon key='polygon-3' points={`
          ${root.x + width / 2},${root.y + height / 2}
          ${root.x + width / 2},${root.y + height}
          ${root.x + width},${root.y + height / 2}
          ${root.x + width},${root.y}
        `}></polygon>
    );
  } else {
    poly.push(<polygon key='polygon-4' points={`
        ${root.x + width / 2},${root.y}
        ${root.x + width},${root.y + height / 2}
        ${root.x + width / 2},${root.y + height}
        ${root.x},${root.y + height / 2}
      `}
    ></polygon>);
  }

  poly.push(<polygon className='base top' key='base-top' points={`
      ${root.x + width / 2},${root.y}
      ${root.x + width},${root.y + height / 2}
      ${root.x},${root.y + height / 2}
    `}
    onMouseEnter={() => { handleMouseEnter(true); }}
    onMouseLeave={() => { handleMouseLeave(true); }}
    onMouseUp={() => { handleClick(true); }}
  ></polygon>,
    <polygon className='base bottom' key='base-bottom' points={`
      ${root.x + width},${root.y + height / 2}
      ${root.x + width / 2},${root.y + height}
      ${root.x},${root.y + height / 2}
    `}
      onMouseEnter={() => { handleMouseEnter(false); }}
      onMouseLeave={() => { handleMouseLeave(false); }}
      onMouseUp={() => { handleClick(false); }}
    ></polygon>);

  return (<g className={`cell ${even ? 'even' : 'odd'} ${isHighlighted ? 'hover' : ''} ${typeClasses[type]}`}>{poly}</g>);
}


export default CellComponent;