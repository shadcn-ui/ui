import React from "react";
import './styles-stars-moving.css';

const TYPE_ANIMATIONS = {
  'up': 'animate-starsMovingAnimationUp',
  'down': 'animate-starsMovingAnimationDown',
  'left_to_right_down': 'animate-starsMovingAnimationLRDown',
  'left_to_right_up': 'animate-starsMovingAnimationLRUp',
  'right_to_left_down': 'animate-starsMovingAnimationRLDown',
  'right_to_left_up': 'animate-starsMovingAnimationRLUp',
};

const SIZES = {
  1: 'w-[1px] h-[1px]',
  2: 'w-[2px] h-[2px]',
  3: 'w-[3px] h-[3px]',
  4: 'w-[4px] h-[4px]',
  5: 'w-[5px] h-[5px]',
}

type StarsMovingProps = {
  typeAnimation: string
  starsSize: number
}

const StarsMoving = ({
  typeAnimation = 'up',
  starsSize = 2,
}: StarsMovingProps) => {

  typeAnimation = typeAnimation ? TYPE_ANIMATIONS[typeAnimation] : 'animate-starsMovingAnimationUp';
  starsSize = starsSize <= 5 ? SIZES[starsSize] : 'w-[2px] h-[2px]';

  return (
    <div className={'cont-stars-moving'}>
      <div className="stars-moving">
        <div className={`${starsSize} ${typeAnimation}`}></div>
        <div className={`${starsSize} ${typeAnimation}`}></div>
        <div className={`${starsSize} ${typeAnimation}`}></div>
      </div>
    </div>
  )
}

export { StarsMoving }
