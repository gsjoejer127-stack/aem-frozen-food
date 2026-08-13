import React from 'react';

interface HalalLogoProps {
  className?: string;
  light?: boolean;
}

export default function HalalLogo({ className = 'w-20 h-24', light = false }: HalalLogoProps) {
  const textColorClass = light ? 'text-white' : 'text-slate-950';
  const innerTextColorClass = 'text-slate-950'; // Inside the white star, it is always dark/black

  return (
    <div className={`flex flex-col items-center justify-center select-none shrink-0 ${className}`} id="halal-logo-component">
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="4.5" className={textColorClass} />
        
        {/* Inner Circle defining the text channel */}
        <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="1.5" className={textColorClass} />
        
        {/* Center Black Circle background */}
        <circle cx="100" cy="100" r="56" fill="currentColor" stroke="none" className={textColorClass} />
        
        {/* Paths for text curving */}
        {/* Top text path - clockwise */}
        <path
          id="halal-top-path"
          d="M 23 100 A 77 77 0 0 1 177 100"
          fill="none"
          stroke="none"
        />
        {/* Bottom text path - counter-clockwise */}
        <path
          id="halal-bottom-path"
          d="M 177 100 A 77 77 0 0 1 23 100"
          fill="none"
          stroke="none"
        />

        {/* Top Text "MALAYSIA" with stars */}
        <text className={`fill-current font-sans font-black text-[13px] tracking-[0.22em] ${textColorClass}`} dy="-4">
          <textPath href="#halal-top-path" startOffset="50%" textAnchor="middle">
            ★ MALAYSIA ★
          </textPath>
        </text>

        {/* Bottom Text "ماليزيا" (Arabic for Malaysia) */}
        <text className={`fill-current font-sans font-black text-[15px] ${textColorClass}`} dy="15">
          <textPath href="#halal-bottom-path" startOffset="50%" textAnchor="middle">
            ماليزيا
          </textPath>
        </text>

        {/* Center Star Group - Eight Pointed Star (Rub el Hizb) */}
        <polygon
          points="
            100,62
            111,73
            126,73
            126,89
            138,100
            126,111
            126,126
            111,126
            100,138
            89,126
            74,126
            74,111
            62,100
            74,89
            74,73
            89,73
          "
          fill="#FFFFFF"
          stroke="none"
        />

        {/* Arabic Calligraphy "حلال" in the center */}
        <path
          d="M 96,80 
             C 96,75 88,77 82,79 
             C 80,80 78,82 81,84
             C 85,86 92,84 94,88
             C 95,90 94,94 91,98
             C 88,102 81,108 77,112
             C 75,114 77,117 80,117
             L 105,117
             C 107,117 109,116 109,113
             L 109,83
             C 109,80 113,80 113,83
             L 113,113
             C 113,117 116,117 118,117
             C 120,117 122,115 122,113
             L 122,81
             C 122,78 126,78 126,81
             L 126,113
             C 126,119 120,123 115,123
             L 81,123
             C 74,123 70,118 73,113
             C 77,108 85,100 89,95
             C 93,91 95,88 95,85
             Z"
          fill="currentColor"
          className={innerTextColorClass}
        />

        {/* Latin Text "HALAL" at bottom of star */}
        <text
          x="100"
          y="114"
          fontFamily="'Inter', sans-serif"
          fontWeight="900"
          fontSize="10.5"
          fill="currentColor"
          className={innerTextColorClass}
          textAnchor="middle"
          letterSpacing="0.5"
        >
          HALAL
        </text>

        {/* Lower Metadata below circle */}
        {/* MS 1500 */}
        <text
          x="100"
          y="204"
          fontFamily="'Inter', sans-serif"
          fontWeight="900"
          fontSize="15"
          fill="currentColor"
          className={textColorClass}
          textAnchor="middle"
        >
          MS 1500
        </text>

        {/* 1 233-08/2025 */}
        <text
          x="100"
          y="224"
          fontFamily="'Inter', sans-serif"
          fontWeight="900"
          fontSize="15"
          fill="currentColor"
          className={textColorClass}
          textAnchor="middle"
        >
          1 233-08/2025
        </text>
      </svg>
    </div>
  );
}
