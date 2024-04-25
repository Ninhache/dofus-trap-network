import { CellBorders, Coordinates } from "@src/enums";
import * as React from "react";

type Props = {
  x: number;
  y: number;

  center: boolean;
  width: number;
  height: number;
  type: string;
  borders: CellBorders;
};


const TrapCellComponent: React.FC<Props> = ({ x, y, center, width, height, borders, type }) => {

  const root: Coordinates = {
    x: x * width + (y % 2 === 0 ? 0 : width / 2),
    y: y * (height / 2)
  };

  const components: Array<JSX.Element> = [];
  components.push(<polygon key='polygon' points={`
      ${root.x + width / 2},${root.y}
      ${root.x + width},${root.y + height / 2}
      ${root.x + width / 2},${root.y + height}
      ${root.x},${root.y + height / 2}`}
  ></polygon>);

  let path: string = "";
  if (borders & CellBorders.North) path += ` M ${root.x + width / 2},${root.y} L ${root.x + width},${root.y + height / 2} `;
  if (borders & CellBorders.East) path += ` M ${root.x + width},${root.y + height / 2} L ${root.x + width / 2},${root.y + height} `;
  if (borders & CellBorders.South) path += ` M ${root.x + width / 2},${root.y + height} L ${root.x},${root.y + height / 2} `;
  if (borders & CellBorders.West) path += ` M ${root.x},${root.y + height / 2} L ${root.x + width / 2},${root.y} `;

  components.push(<path key='path' d={path} />);

  return <g className={`trap-cell ${center ? 'trap-center' : ''} trap-${type}`}>{components}</g>;
}

export default TrapCellComponent;