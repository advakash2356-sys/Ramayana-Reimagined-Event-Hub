/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MandalaSVGProps {
  className?: string;
  size?: number;
  color?: string;
}

export const MandalaSVG: React.FC<MandalaSVGProps> = ({
  className = '',
  size = 120,
  color = 'currentColor',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="0.5"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer concentric sacred circle */}
      <circle cx="50" cy="50" r="48" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="44" strokeWidth="0.75" />
      <circle cx="50" cy="50" r="40" strokeDasharray="4 2" />

      {/* Decorative lotus petals */}
      <g transform="translate(50,50)">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <path
              key={i}
              d="M 0,-40 C 4,-20 8,-10 0,-10 C -8,-10 -4,-20 0,-40"
              transform={`rotate(${angle})`}
              fill="url(#saffron_gold_grad)"
              fillOpacity="0.12"
              strokeWidth="0.5"
            />
          );
        })}

        {[...Array(6)].map((_, i) => {
          const angle = (i * 360) / 6;
          return (
            <path
              key={i}
              d="M 0,-25 C 6,-12 6,-6 0,-2 C -6,-2 -6,-12 0,-25"
              transform={`rotate(${angle + 30})`}
              fill="url(#saffron_gold_grad_dense)"
              fillOpacity="0.2"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Central core energy star */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="0"
              y2="-18"
              transform={`rotate(${angle})`}
              strokeWidth="0.8"
            />
          );
        })}
      </g>

      <circle cx="50" cy="50" r="10" strokeWidth="0.75" fill="none" />
      <circle cx="50" cy="50" r="4" fill="url(#saffron_gold_grad_dense)" />

      <defs>
        <radialGradient id="saffron_gold_grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF4500" />
        </radialGradient>
        <linearGradient id="saffron_gold_grad_dense" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#FF4500" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MandalaSVG;
