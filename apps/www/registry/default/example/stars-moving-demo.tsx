import { StarsMoving } from "@/registry/default/ui/stars-moving/stars-moving"
import Image from "next/image";
import img1 from '@/public/images/sphere-with-smoke-and-water.jpg';
import img2 from '@/public/images/candle.jpg';
import img3 from '@/public/images/crystal-ball.png';
import img4 from '@/public/images/crystal-ball-with-base.png';
import img5 from '@/public/images/arcade-room.jpg';
import img6 from '@/public/images/moon-mountain.jpg';

export default function StarsMovingDemo() {
  return (
    <div>
      <div className={'mw-[800px] w-full h-auto mb-8 flex justify-center items-center'}>
        <Image
          src={img1}
          alt={''}
          className={'image-background lazy-image'}
        />
        <div className={'absolute w-[500px]'}>
          <StarsMoving
            typeAnimation={'up'}
            starsSize={3}
          />
        </div>
      </div>


      <div className={'mw-[800px] w-full h-auto mb-8 flex justify-center items-center'}>
        <Image
          src={img2}
          alt={''}
          className={'image-background lazy-image'}
        />
        <div className={'absolute w-[500px]'}>
          <StarsMoving
            typeAnimation={'down'}
            starsSize={2}
          />
        </div>
      </div>



      <div className={'mw-[800px] w-full h-auto mb-8 flex justify-center items-center'}>
        <Image
          src={img3}
          alt={''}
          className={'image-background lazy-image'}
        />
        <div className={'absolute w-[500px]'}>
          <StarsMoving
            typeAnimation={'left_to_right_down'}
            starsSize={3}
          />
        </div>
      </div>



      <div className={'mw-[800px] w-full h-auto mb-8 flex justify-center items-center'}>
        <Image
          src={img4}
          alt={''}
          className={'image-background lazy-image'}
        />
        <div className={'absolute w-[500px]'}>
          <StarsMoving
            typeAnimation={'left_to_right_up'}
            starsSize={4}
          />
        </div>
      </div>



      <div className={'mw-[800px] w-full h-auto mb-8 flex justify-center items-center'}>
        <Image
          src={img5}
          alt={''}
          className={'relative w-[800px] h-auto block transition(1s cubic-bezier(.6, .6, 0, 1) opacity)'}
        />
        <div className={'absolute w-[800px]'}>
          <StarsMoving
            typeAnimation={'right_to_left_down'}
            starsSize={5}
          />
        </div>
      </div>



      <div className={'mw-[800px] w-full h-auto mb-8 flex justify-center items-center'}>
        <Image
          src={img6}
          alt={''}
          className={'relative w-[600px] h-auto block transition(1s cubic-bezier(.6, .6, 0, 1) opacity)'}
        />
        <div className={'absolute w-[500px]'}>
          <StarsMoving
            typeAnimation={'right_to_left_up'}
            starsSize={3}
          />
        </div>
      </div>

    </div>
  )
}
