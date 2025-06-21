'use client';

import { motion } from 'framer-motion';
import { Fragment } from 'react';

interface Props {
  text: string;
}

export default function HeadingAnimated({ text }: Props) {
  const words = text.trim().split(/\s+/);

  return (
    <motion.h1
      className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold max-w-4xl leading-relaxed mb-12 
        break-words text-cyan-100 drop-shadow-[0_2px_18px_rgba(20,230,255,0.22)]"
      initial="hidden"
      animate="visible"
      aria-label={text}
      role="heading"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.045,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className="inline-block whitespace-nowrap px-[0.14em] sm:px-[0.23em]
              transition-all duration-300 will-change-transform
              hover:text-cyan-300 hover:drop-shadow-[0_4px_24px_rgba(6,224,255,0.30)] cursor-pointer"
            variants={{
              hidden: { opacity: 0, y: 28, filter: 'blur(2.5px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0)' },
            }}
            whileHover={{
              scale: 1.055,
              rotate: [-1.5, 1.5, 0],
              transition: { type: 'spring', stiffness: 220, damping: 14 },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </Fragment>
      ))}
    </motion.h1>
  );
}
