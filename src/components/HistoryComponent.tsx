import Game from "@classes/Game";
import "@assets/scss/History.scss";
import ActionComponent from "./ActionComponent";
import { ActionType, EffectCategory, EventValue } from "@src/enums";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

type Props = {};

interface HiddenEffectsState {
  [key: number]: boolean;
}

export interface HistoryComponentRef {
  // setHighlight: (highlight: boolean) => void;
  forceUpdate: () => void;
}

const HistoryComponent = forwardRef<HistoryComponentRef, Props>((props: Props, ref) => {

  
  
  const [hiddenEffects, setHiddenEffects] = useState<HiddenEffectsState>({
    [EffectCategory.Meta]: false,
    [EffectCategory.Movement]: false,
    [EffectCategory.Damage]: false,
    [EffectCategory.State]: false,
    [EffectCategory.Secondary]: false,
    [EffectCategory.Spell]: false,
  });

  const [forceRender, setForceRender] = useState<number>(0);

  const forceUpdate = useCallback(() => {
    setForceRender(forceRender + 1);
  }, []);

  useEffect(() => {
    const handleForceUpdate = () => {
      forceUpdate();
    }

    window.addEventListener(EventValue.forceUpdateHistory, handleForceUpdate);

    return () => {
      window.removeEventListener(EventValue.forceUpdateHistory, handleForceUpdate);
    }

  }, []);

  useImperativeHandle(ref, () => ({
    forceUpdate,
  }));


  const onFilter = (filter: EffectCategory) => {
    setHiddenEffects(prevState => ({
      ...prevState,
      [filter]: !prevState[filter]
    }));
  };

  const actions = Game.getActionStack();
  const actionComponents: Array<JSX.Element> = [];
  const hiddenEffectClasses: Record<EffectCategory, string> = {
    [EffectCategory.Meta]: "no-meta",
    [EffectCategory.Movement]: "no-movement",
    [EffectCategory.Damage]: "no-damage",
    [EffectCategory.State]: "no-state",
    [EffectCategory.Secondary]: "no-secondary",
    [EffectCategory.Spell]: "no-spell",
  };

  for (let i: number = 0; i < actions.waiting.length; i++) {
    actionComponents.push(
      <ActionComponent
        type={ActionType.Waiting}
        action={actions.waiting[i]}
        key={actions.waiting[i].uuid}
        ref={actions.waiting[i].component}
      />);
  }

  if (actions.current) {
    actionComponents.push(<ActionComponent
      type={ActionType.Current}
      action={actions.current}
      key={actions.current.uuid}
      ref={actions.current.component}
    />);
  }

  for (let i: number = actions.completed.length - 1; i >= 0; i--) {
    actionComponents.push(<ActionComponent
      type={ActionType.Completed}
      action={actions.completed[i]}
      key={actions.completed[i].uuid}
      ref={actions.completed[i].component}
    />);
  }

  const additionalClasses: Array<string> = [];
  Object.keys(hiddenEffects).forEach((key) => {
    const categoryKey = Number(key) as EffectCategory;
    if (hiddenEffects[categoryKey]) {
      additionalClasses.push(hiddenEffectClasses[categoryKey]);
    }
  });

  return (
    <div className={`relative-height history ${additionalClasses.join(' ')}`}>
      <div className="actions">
        {actionComponents}
      </div>
      <div className="filters">
        <button className={hiddenEffects[EffectCategory.Damage] ? "active" : ""} onClick={() => { onFilter(EffectCategory.Damage); }}><img src="./assets/img/actions/damage.svg" alt="damage" /></button>
        <button className={hiddenEffects[EffectCategory.Movement] ? "active" : ""} onClick={() => { onFilter(EffectCategory.Movement); }}><img src="./assets/img/actions/movement.svg" alt="movement" /></button>
        <button className={hiddenEffects[EffectCategory.Secondary] ? "active" : ""} onClick={() => { onFilter(EffectCategory.Secondary); }}><img src="./assets/img/actions/secondary.svg" alt="secondary" /></button>
        <button className={hiddenEffects[EffectCategory.State] ? "active" : ""} onClick={() => { onFilter(EffectCategory.State); }}><img src="./assets/img/actions/state.svg" alt="state" /></button>
        <button className={hiddenEffects[EffectCategory.Spell] ? "active" : ""} onClick={() => { onFilter(EffectCategory.Spell); }}><img src="./assets/img/actions/spell.svg" alt="spell" /></button>
      </div>
    </div>
  );
});

export default HistoryComponent;
