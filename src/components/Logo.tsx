/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo(props: LogoProps) {
  const showText = props.showText !== false;
  
  return (
    <div className={`flex items-center gap-3 ${props.className || ''}`} id="aem-logo-container">
      {/* Geometric Green Badge based on the attached AEM logo */}
      <svg
        className="h-10 w-10 drop-shadow-sm rounded-[4px]"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="aem-logo-svg"
      >
        {/* Geometric Green Rounded Badge Shape */}
        <rect
          x="20"
          y="20"
          width="460"
          height="460"
          rx="100"
          fill="#005A36"
        />
        
        {/* Golden-Yellow Elegant Swoosh from the logo */}
        <path
          d="M100 180 C200 110, 300 110, 450 120 C400 150, 250 145, 100 180 Z"
          fill="#F9C513"
        />

        {/* White Elegant Serif 'AEM' */}
        <text
          x="250"
          y="320"
          fontFamily="'Playfair Display', 'Georgia', serif"
          fontWeight="800"
          fontSize="150"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          AEM
        </text>

        {/* Text 'FROZEN FOOD' on bottom in clean sans-serif */}
        <text
          x="250"
          y="410"
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          fontSize="42"
          fill="#FFFFFF"
          textAnchor="middle"
          letterSpacing="4"
        >
          FROZEN FOOD
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col text-left leading-none" id="aem-logo-text-box">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-black text-xl tracking-tight text-[#005A36] uppercase">
              AEM FOOD
            </span>
            <span className="font-sans font-normal text-sm text-slate-400">
              | AEM 食品
            </span>
          </div>
          <span className="font-sans font-bold text-[8px] sm:text-[9px] tracking-tight sm:tracking-widest text-slate-500 uppercase mt-1">
            Authentic China Muslim Cuisine Delight
          </span>
        </div>
      )}
    </div>
  );
}
