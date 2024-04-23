import { SpellCategory, EffectType, TriggerType, Area } from "@src/enums";
import { Nullable } from "./NullableType";

export type Effect = {
  targetMask: string,
  value: number,
  min: number, // DiceNum in SpellLevels
  max: number, // DiceSide in SpellLevels
  triggers: Nullable<TriggerType>, // TODO: need to be able to put multiple triggers
  effectType: EffectType,
  area: Area
}

export type SpellLevel = {
  spellId: number;
  apCost: number,
  maxStack: number,
  maxCastPerTurn: number,
  maxCastPerTarget: number,
  minCastInterval: number,
  initialCooldown: number,
  globalCooldown: number,
  minPlayerLevel: number,
  effects: Array<Effect>
}

export type Spell = {
  name: string,
  icon: Nullable<string>,
  sfx: Nullable<string>,
  sfxSize: number,
  category: Nullable<SpellCategory>,
  levels: Array<SpellLevel>
}

export type SpellDataType = {
  [key: number]: Spell
}
