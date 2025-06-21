'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface TileCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  href: string;
}

// Цвета для иконки и glow
const iconColorMap: Record<TileCardProps['color'], string> = {
  blue: 'text-blue-400 shadow-blue-500/30',
  green: 'text-green-400 shadow-green-500/30',
  purple: 'text-purple-400 shadow-purple-500/30',
  yellow: 'text-yellow-300 shadow-yellow-400/30',
  red: 'text-red-400 shadow-red-500/30',
};

export default function TileCard({
  title,
  description,
  icon: Icon,
  color,
  href,
}: TileCardProps) {
  return (
    <Link href={href} className="block focus:outline-none group">
      <div
        tabIndex={0}
        className={`
          rounded-2xl p-7 flex flex-col items-center justify-center
          bg-gradient-to-br from-white/10 to-white/5
          border border-cyan-300/15
          shadow-2xl
          transition-all duration-200
          hover:scale-105 hover:border-cyan-300/40
          focus:scale-105 focus:border-cyan-300/40
          cursor-pointer outline-none
          group
        `}
      >
        <span
          className={`
            mb-4 rounded-full p-4 bg-white/10 shadow-lg
            group-hover:shadow-2xl group-focus:shadow-2xl
            transition-all duration-200
            ${iconColorMap[color]}
          `}
        >
          <Icon className={`w-12 h-12 ${iconColorMap[color]} drop-shadow-md`} />
        </span>
        <h2 className="text-xl font-bold text-white text-center mb-1">{title}</h2>
        <p className="text-cyan-100/80 text-base text-center">{description}</p>
      </div>
    </Link>
  );
}
