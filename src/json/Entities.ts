import { EntityDataType } from "@src/@types/EntityDataType"
import { EntityType } from "@src/enums"

const entities: EntityDataType = {
  [EntityType.Cawwot]: {
    "name": "Cawwot",
    "image": "./assets/img/entities/Cawwot.png",
    "offsetX": 0.03,
    "offsetY": 0.15,
    "defaultScale": 1.48,
    "movable": false
  },
  [EntityType.Poutch]: {
    "name": "Poutch",
    "image": "./assets/img/entities/Poutch.png",
    "offsetX": -0.05,
    "offsetY": 0.05,
    "defaultScale": 1.46,
    "movable": true
  },
  [EntityType.Player]: {
    "name": "Player",
    "image": "./assets/img/entities/Poutch.png",
    "offsetX": -0.05,
    "offsetY": 0.05,
    "defaultScale": 1.46,
    "movable": true
  }
}

export default entities;