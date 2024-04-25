import Entity from "@classes/Entity";
import Game from "@classes/Game";

import { DefensiveStats, OffensiveStats, SpellType, Team, TriggerType } from "@src/enums";
import { useEffect, useState } from "react";

import { Trans } from "react-i18next";

type Props = {
  configObj: Entity;
};

type ConfigState = {
  triggers: {
    misere: boolean;
    corruption: boolean;
  };
  off: OffensiveStats;
  def: DefensiveStats;
  moving: boolean;
  health: {
    shield: number;
    max: number;
    current: number;
    initial: {
      shield: number;
      max: number;
      current: number;
    };
  };
};

const ConfigComponent: React.FC<Props> = ({ configObj }) => {

  const [entityState, setEntityState] = useState<ConfigState>({
    moving: false,
    health: configObj.health,
    triggers: {
      misere: configObj.triggers.some(trigger => trigger.spellId === SpellType.Misere),
      corruption: configObj.triggers.some(trigger => trigger.spellId === SpellType.Corruption),
    },
    off: configObj.offensiveStats,
    def: configObj.defensiveStats,
  });


  useEffect(() => {
    setEntityState({
      triggers: {
        misere: configObj.hasTrigger(SpellType.Misere, 0),
        corruption: configObj.hasTrigger(SpellType.Corruption, 0)
      },
      off: configObj.offensiveStats,
      def: configObj.defensiveStats,
      moving: false,
      health: configObj.health
    });
  }, [configObj]);



  const handleChange = (key: string, value: string) => {
    if (Game.isRunning) return;

    const parsed: number = value.length === 0 ? 0 : parseInt(value);
    if (isNaN(parsed)) return;

    setEntityState(state => {
      const newState = JSON.parse(JSON.stringify(state));

      switch (key) {
        case 'shield':
          newState.health.shield = Math.min(state.health.initial.max, Math.max(0, parsed));
          newState.health.initial.shield = newState.health.shield;
          break;
        case 'maxHealth':
          newState.health.max = Math.max(1, parsed);
          newState.health.initial.max = newState.health.max;
          if (newState.health.max < newState.health.current) {
            newState.health.current = newState.health.max;
            newState.health.initial.current = newState.health.max;
          }
          if (newState.health.max < newState.health.shield) {
            newState.health.shield = newState.health.max;
            newState.health.initial.shield = newState.health.max;
          }
          break;
        case 'currentHealth':
          newState.health.current = Math.max(1, parsed);
          newState.health.initial.current = newState.health.current;
          if (newState.health.current > newState.health.max) {
            newState.health.max = newState.health.current;
            newState.health.initial.max = newState.health.current;
          }
          break;
        case 'erosion': newState.def.erosion = parsed; break;
        case 'str': newState.off.strength = parsed; break;
        case 'cha': newState.off.chance = parsed; break;
        case 'int': newState.off.intelligence = parsed; break;
        case 'agi': newState.off.agility = parsed; break;
        case 'power': newState.off.power = parsed; break;
        case 'trap': newState.off.powerTrap = parsed; break;
        case 'damage': newState.off.damage = parsed; break;
        case 'daNeutral': newState.off.damageNeutral = parsed; break;
        case 'daEarth': newState.off.damageEarth = parsed; break;
        case 'daWater': newState.off.damageWater = parsed; break;
        case 'daFire': newState.off.damageFire = parsed; break;
        case 'daAir': newState.off.damageAir = parsed; break;
        case 'daTrap': newState.off.damageTrap = parsed; break;
        case 'daPush': newState.off.damagePush = parsed; break;
        case 'ranged': newState.off.damageRanged = parsed; break;
        case 'melee': newState.off.damageMelee = parsed; break;
        case 'spell': newState.off.damageSpell = parsed; break;
        case 'final': newState.off.damageFinal = parsed; break;
        case 'neutral': newState.def.neutral = parsed; break;
        case 'earth': newState.def.earth = parsed; break;
        case 'water': newState.def.water = parsed; break;
        case 'fire': newState.def.fire = parsed; break;
        case 'air': newState.def.air = parsed; break;
        case 'resNeutral': newState.def.resistanceNeutral = parsed; break;
        case 'resEarth': newState.def.resistanceEarth = parsed; break;
        case 'resWater': newState.def.resistanceWater = parsed; break;
        case 'resFire': newState.def.resistanceFire = parsed; break;
        case 'resAir': newState.def.resistanceAir = parsed; break;
        case 'resPush': newState.def.resistancePush = parsed; break;
        case 'rangedRes': newState.def.resistanceRanged = parsed; break;
        case 'meleeRes': newState.def.resistanceMelee = parsed; break;
        case 'spellRes': newState.def.resistanceSpell = parsed; break;
        case 'sustained': newState.def.damageSustained = parsed; break;
        default: break;
      }
      return newState;
    });
  }

  const onMoveBtnClick = () => {
    if (Game.isRunning) return;

    const moving: boolean = !entityState.moving;
    setEntityState((state) => {
      return {
        ...state,
        moving
      }
    });

    if (moving) {
      Game.setMovingEntity(configObj);
    }

  }

  const onCorruptionClick = () => {
    if (Game.isRunning) return;

    if (configObj.hasTrigger(SpellType.Corruption, 0)) {
      configObj.removeTrigger(SpellType.Corruption, 0);
    } else {
      configObj.addTrigger({
        triggers: [TriggerType.onHeal],
        spellId: SpellType.Corruption,
        spellLevel: 0,
        caster: configObj,
      });
    }

    setEntityState((state) => {
      return {
        ...state,
        triggers: {
          ...state.triggers,
          corruption: !state.triggers.corruption
        }
      }
    })
  }

  const onMisereClick = () => {
    if (Game.isRunning) return;


    if (configObj.hasTrigger(SpellType.Misere, 0)) {
      configObj.removeTrigger(SpellType.Misere, 0);
    } else {
      configObj.addTrigger({
        triggers: [TriggerType.onDamage],
        spellId: SpellType.Misere,
        spellLevel: 0,
        caster: configObj,
      });
    }
    setEntityState((state) => {
      return {
        ...state,
        triggers: {
          ...state.triggers,
          misere: !state.triggers.misere
        }
      }
    })

  }

  const healthPercent = Math.max(0, Math.min(1, configObj.health.current / (configObj.health.max <= 0 ? 1 : configObj.health.max)));
  
  return (<div>
    <div className="entity-infos">
      <div className={`image team-${configObj.team === Team.Attacker ? 'red' : 'blue'}`}>
        <img src={configObj.data.image} alt="" />
      </div>
      <div className="base-infos">
        <span><Trans>{configObj.data.name}</Trans></span>
        <div className="health">
          {entityState.health.shield > 0 ?
            (<>
              <img className="armor" src="./assets/img/other/icon_armor.png" alt="Armor" />
              <img className="hp-full" src="./assets/img/other/icon_shield_full.png" alt="Shield" />
              <span className="shield">{Math.floor(configObj.health.shield)}</span>
            </>) :
            <img className="hp-full" src="./assets/img/other/icon_hp_full.png" alt="Life" />
          }
          <img style={{ height: 50 * (1 - healthPercent) }} className="hp-empty" src="./assets/img/other/icon_hp_empty.png" alt="Life" />
          <span className="hp-current">{Math.floor(configObj.health.current)}</span>
          <span className="hp-max">{configObj.health.max}</span>
        </div>
        <div className={`btn-move ${entityState.moving ? 'active' : ''}`} onClick={() => { onMoveBtnClick(); }}><Trans>Move</Trans></div>
      </div>
    </div>
    <h3><Trans>Health characteristics</Trans></h3>
    <ul className="offensive-stats">
      <li><img src="./assets/img/characteristics/tx_shield.png" alt="" /><span><Trans>Shield</Trans></span><input onChange={(e) => { handleChange('shield', e.target.value); }} type="number" value={entityState.health.initial.shield} /></li>
      <li><img src="./assets/img/characteristics/tx_vitality.png" alt="" /><span><Trans>Max HP</Trans></span><input onChange={(e) => { handleChange('maxHealth', e.target.value); }} type="number" value={entityState.health.initial.max} /></li>
      <li><img src="./assets/img/characteristics/tx_vitality.png" alt="" /><span><Trans>Current HP</Trans></span><input onChange={(e) => { handleChange('currentHealth', e.target.value); }} type="number" value={entityState.health.initial.current} /></li>
      <li><img src="./assets/img/characteristics/tx_erosion.png" alt="" /><span><Trans>Erosion</Trans></span><input onChange={(e) => { handleChange('erosion', e.target.value); }} type="number" value={entityState.def.erosion} /></li>
    </ul>
    <h3><Trans>Offensive characteristics</Trans></h3>
    <ul className="offensive-stats">
      <li><img src="./assets/img/characteristics/tx_strength.png" alt="" /><span><Trans>Strength</Trans></span><input onChange={(e) => { handleChange('str', e.target.value); }} type="number" value={entityState.off.strength} /></li>
      <li><img src="./assets/img/characteristics/tx_intelligence.png" alt="" /><span><Trans>Intelligence</Trans></span><input onChange={(e) => { handleChange('int', e.target.value); }} type="number" value={entityState.off.intelligence} /></li>
      <li><img src="./assets/img/characteristics/tx_chance.png" alt="" /><span><Trans>Chance</Trans></span><input onChange={(e) => { handleChange('cha', e.target.value); }} type="number" value={entityState.off.chance} /></li>
      <li><img src="./assets/img/characteristics/tx_agility.png" alt="" /><span><Trans>Agility</Trans></span><input onChange={(e) => { handleChange('agi', e.target.value); }} type="number" value={entityState.off.agility} /></li>
      <li><img src="./assets/img/characteristics/tx_damagesPercent.png" alt="" /><span><Trans>Power</Trans></span><input onChange={(e) => { handleChange('power', e.target.value); }} type="number" value={entityState.off.power} /></li>
      <li><img src="./assets/img/characteristics/tx_trapPercent.png" alt="" /><span><Trans>Trap Power</Trans></span><input onChange={(e) => { handleChange('trap', e.target.value); }} type="number" value={entityState.off.powerTrap} /></li>
      <hr />
      <li><img src="./assets/img/characteristics/tx_damage.png" alt="" /><span><Trans>Damage</Trans></span><input onChange={(e) => { handleChange('damage', e.target.value); }} type="number" value={entityState.off.damage} /></li>
      <li><img src="" alt="" /><span><Trans>Neutral da.</Trans></span><input onChange={(e) => { handleChange('daNeutral', e.target.value); }} type="number" value={entityState.off.damageNeutral} /></li>
      <li><img src="" alt="" /><span><Trans>Earth da.</Trans></span><input onChange={(e) => { handleChange('daEarth', e.target.value); }} type="number" value={entityState.off.damageEarth} /></li>
      <li><img src="" alt="" /><span><Trans>Fire da.</Trans></span><input onChange={(e) => { handleChange('daFire', e.target.value); }} type="number" value={entityState.off.damageFire} /></li>
      <li><img src="" alt="" /><span><Trans>Water da.</Trans></span><input onChange={(e) => { handleChange('daWater', e.target.value); }} type="number" value={entityState.off.damageWater} /></li>
      <li><img src="" alt="" /><span><Trans>Air da.</Trans></span><input onChange={(e) => { handleChange('daAir', e.target.value); }} type="number" value={entityState.off.damageAir} /></li>
      <li><img src="./assets/img/characteristics/tx_trap.png" alt="" /><span><Trans>Trap da.</Trans></span><input onChange={(e) => { handleChange('daTrap', e.target.value); }} type="number" value={entityState.off.damageTrap} /></li>
      <li><img src="./assets/img/characteristics/tx_push.png" alt="" /><span><Trans>Push da.</Trans></span><input onChange={(e) => { handleChange('daPush', e.target.value); }} type="number" value={entityState.off.damagePush} /></li>
      <hr />
      <li><img src="" alt="" /><span><Trans>Ranged %</Trans></span><input onChange={(e) => { handleChange('ranged', e.target.value); }} type="number" value={entityState.off.damageRanged} /></li>
      <li><img src="" alt="" /><span><Trans>Melee %</Trans></span><input onChange={(e) => { handleChange('melee', e.target.value); }} type="number" value={entityState.off.damageMelee} /></li>
      <li><img src="" alt="" /><span><Trans>Spell %</Trans></span><input onChange={(e) => { handleChange('spell', e.target.value); }} type="number" value={entityState.off.damageSpell} /></li>
      <li><img src="" alt="" /><span><Trans>Final %</Trans></span><input onChange={(e) => { handleChange('final', e.target.value); }} type="number" value={entityState.off.damageFinal} /></li>
    </ul>
    <h3><Trans>Defensive characteristics</Trans></h3>
    <ul className="offensive-stats">
      <li><img src="./assets/img/characteristics/tx_neutral.png" alt="" /><span><Trans>Neutral %</Trans></span><input onChange={(e) => { handleChange('neutral', e.target.value); }} type="number" value={entityState.def.neutral} /></li>
      <li><img src="./assets/img/characteristics/tx_strength.png" alt="" /><span><Trans>Earth %</Trans></span><input onChange={(e) => { handleChange('earth', e.target.value); }} type="number" value={entityState.def.earth} /></li>
      <li><img src="./assets/img/characteristics/tx_intelligence.png" alt="" /><span><Trans>Fire %</Trans></span><input onChange={(e) => { handleChange('fire', e.target.value); }} type="number" value={entityState.def.fire} /></li>
      <li><img src="./assets/img/characteristics/tx_chance.png" alt="" /><span><Trans>Water %</Trans></span><input onChange={(e) => { handleChange('water', e.target.value); }} type="number" value={entityState.def.water} /></li>
      <li><img src="./assets/img/characteristics/tx_agility.png" alt="" /><span><Trans>Air %</Trans></span><input onChange={(e) => { handleChange('air', e.target.value); }} type="number" value={entityState.def.air} /></li>
      <hr />
      <li><img src="" alt="" /><span><Trans>Neutral res.</Trans></span><input onChange={(e) => { handleChange('resNeutral', e.target.value); }} type="number" value={entityState.def.resistanceNeutral} /></li>
      <li><img src="" alt="" /><span><Trans>Earth res.</Trans></span><input onChange={(e) => { handleChange('resEarth', e.target.value); }} type="number" value={entityState.def.resistanceEarth} /></li>
      <li><img src="" alt="" /><span><Trans>Fire res.</Trans></span><input onChange={(e) => { handleChange('resFire', e.target.value); }} type="number" value={entityState.def.resistanceFire} /></li>
      <li><img src="" alt="" /><span><Trans>Water res.</Trans></span><input onChange={(e) => { handleChange('resWater', e.target.value); }} type="number" value={entityState.def.resistanceWater} /></li>
      <li><img src="" alt="" /><span><Trans>Air res.</Trans></span><input onChange={(e) => { handleChange('resAir', e.target.value); }} type="number" value={entityState.def.resistanceAir} /></li>
      <li><img src="./assets/img/characteristics/tx_push.png" alt="" /><span><Trans>Push res.</Trans></span><input onChange={(e) => { handleChange('resPush', e.target.value); }} type="number" value={entityState.def.resistancePush} /></li>
      <hr />
      <li><img src="" alt="" /><span><Trans>Ranged res. %</Trans></span><input onChange={(e) => { handleChange('rangedRes', e.target.value); }} type="number" value={entityState.def.resistanceRanged} /></li>
      <li><img src="" alt="" /><span><Trans>Melee res. %</Trans></span><input onChange={(e) => { handleChange('meleeRes', e.target.value); }} type="number" value={entityState.def.resistanceMelee} /></li>
      <li><img src="" alt="" /><span><Trans>Spell res. %</Trans></span><input onChange={(e) => { handleChange('spellRes', e.target.value); }} type="number" value={entityState.def.resistanceSpell} /></li>
      <li><img src="" alt="" /><span><Trans>Sustained da. %</Trans></span><input onChange={(e) => { handleChange('sustained', e.target.value); }} type="number" value={entityState.def.damageSustained} /></li>
    </ul>
    <div>
      <div className={`btn-misere ${entityState.triggers.misere ? 'active' : ''}`} onClick={() => { onMisereClick(); }}><Trans>Misère</Trans></div>
      <div className={`btn-corruption ${entityState.triggers.corruption ? 'active' : ''}`} onClick={() => { onCorruptionClick(); }}><Trans>Hub Corruption</Trans></div>
    </div>
    {/* Effets déclenchés */}
    {/* États */}
  </div>)
}

export default ConfigComponent;
