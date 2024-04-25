import "@assets/scss/Spells.scss";
import { ActionType, EffectCategory, EffectType, EffectTypeCategory, StateName, TrapClasses } from "@src/enums";
import Action from "@classes/Action";
import { Trans } from "react-i18next";
import { colorToInt } from "@src/utils/utils";
import SpellData from "@json/Spells";
import { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  type: ActionType;
  action: Action;
};

export interface ActionComponentRef {
  setHighlight: (highlight: boolean) => void
}

const ActionComponent = forwardRef<ActionComponentRef, Props>((props: Props, ref) => {

  const { type, action } = props;

  const [isHighlighted, setHighlighted] = useState(false);

  useImperativeHandle(ref, () => ({
    setHighlight: (highlight: boolean) => {
      setHighlighted(highlight)
    },
  }));

  const onMouseEnter = () => {
    action.originTrap?.component?.current?.setHighlight(true);
    action.target.component.current?.setHighlight(true);
  }

  const onMouseLeave = () => {
    action.originTrap?.component?.current?.setHighlight(false);
    action.target.component.current?.setHighlight(false);
  }

  const actionClasses = {
    [ActionType.Waiting]: "waiting",
    [ActionType.Current]: "current",
    [ActionType.Completed]: "completed"
  };

  const effectClasses: { [key: number]: string } = {
    [EffectCategory.Meta]: "effect-meta",
    [EffectCategory.Movement]: "effect-movement",
    [EffectCategory.Damage]: "effect-damage",
    [EffectCategory.State]: "effect-state",
    [EffectCategory.Secondary]: "effect-secondary",
    [EffectCategory.Spell]: "effect-spell",
  };

  type ActionText = { count: number } & { text: JSX.Element } | { text: JSX.Element }

  const actionTexts: Partial<Record<EffectType, ActionText>> = {
    [EffectType.Pull]: {
      count: action.value, text: <>Attracts {{ value: action.value }} cells</>
    },
    [EffectType.Push]: {
      count: action.value, text: <>Pushes back {{ value: action.value }} cells</>
    },
    [EffectType.WaterDamage]: {
      count: action.value, text: <>{{ value: action.value }} water damage</>
    },
    [EffectType.FireDamage]: {
      count: action.value, text: <>{{ value: action.value }} fire damage</>
    },
    [EffectType.EarthDamage]: {
      count: action.value, text: <>{{ value: action.value }} earth damage</>
    },
    [EffectType.AirDamage]: {
      count: action.value, text: <>{{ value: action.value }} air damage</>
    },
    [EffectType.PushDamage]: {
      count: action.value, text: <>{{ value: action.value }} push damage</>
    },
    [EffectType.IndirectPushDamage]: {
      count: action.value, text: <>{{ value: action.value }} push damage (indirect)</>
    },
    [EffectType.SpellAsTarget]: {
      text: <>Spell &apos;{{ value: SpellData[action.effect.min]?.name }}&apos; casted as target</>
    },
    [EffectType.SpellAsCaster]: {
      text: <>Spell &apos;{{ value: SpellData[action.effect.min]?.name }}&apos; casted as caster</>
    },
    [EffectType.State]: {
      text: <>Add state &apos;{{ value: StateName[action.effect.min] }}&apos;</>
    },
    [EffectType.RemoveState]: {
      text: <>Remove state &apos;{{ value: StateName[action.effect.min] }}&apos;</>
    },
    [EffectType.SymmetricalTeleport]: {
      text: <>Symmetrical TP</>
    },
    [EffectType.StealBestElement]: {
      text: <>Steals {{ value: action.value }} in best element</>
    },
    [EffectType.HealLastDamage]: {
      text: <>Heals {{ value: action.value }} (last damage taken)</>
    },
    [EffectType.PlaceEndTurnGlyph]: {
      text: <>Places a glyph</>
    },
    [EffectType.BoostSpell]: {
      text: <>Boosts the spell {{ spell: SpellData[action.effect.min]?.name }} by {{ value: action.effect.max }}</>
    },
    [EffectType.CancelSpell]: {
      text: <>Cancels the effects of {{ spell: SpellData[action.effect.min]?.name }}</>
    },
    [EffectType.MPDamage]: {
      text: <>Removes {{ value: action.effect.min }} MP</>
    },
    [EffectType.DodgeDamage]: {
      text: <>Removes {{ value: action.effect.min }} dodge</>
    },
  };

  const getCount = (action: { type: EffectType, value: number }) => {
    const actionText = actionTexts[action.type]; // This will be undefined if not explicitly set

    if (actionText && 'count' in actionText) {
      return actionText.count;
    } else {
      console.warn(`Count asked for ${action.type} but count is a missing property`)
      return -1; // TODO: maybe throw an error
    }

  }

  const getElement = (action: { type: EffectType, value: number }) => {
    const actionText = actionTexts[action.type]; // This will be undefined if not explicitly set

     const textElement = actionText?.text as React.ReactElement;

     return textElement?.props.children;
  }


  return (
    <div className={`action ${actionClasses[type]} ${effectClasses[EffectTypeCategory[action.type] ?? EffectType.Unknown]} ${isHighlighted ? 'highlighted' : ''} ${action.originTrap ? `action-${TrapClasses[colorToInt(action.originTrap.color)]}` : ''} ${action.cancelled ? 'cancelled' : ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
      <div className="action-img">
        <img src={action.originTrap?.getSpellIcon()} alt="" width="25px" height="25px" />
      </div>
      <div className="action-infos">
        {actionTexts[action.type]
          ? <Trans count={getCount(action)}>{getElement(action)}</Trans>
          : `type =  ${action.type}, value = ${action.value}`}
      </div>
    </div>
  );
});

export default ActionComponent;
