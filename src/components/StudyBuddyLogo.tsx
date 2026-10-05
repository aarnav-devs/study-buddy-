import React from 'react';

interface StudyBuddyLogoProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
}

export const StudyBuddyLogo: React.FC<StudyBuddyLogoProps> = ({
  size = 40,
  className = '',
  animated = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 512 512"
        className={`w-full h-full ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="buddyFaceGrad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </radialGradient>
          <filter id="buddySoftShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#3b82f6" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Outer White Plate with Shadow */}
        <circle
          cx="256"
          cy="256"
          r="230"
          fill="url(#buddyFaceGrad)"
          filter="url(#buddySoftShadow)"
          stroke="#e2e8f0"
          strokeWidth="3"
        />

        {/* Colorful Dashed Perimeter Ring (Google Rainbow palette) */}
        <g className={animated ? 'origin-center animate-spin' : ''} style={{ animationDuration: '30s' }}>
          {/* Top/Right Green & Yellow */}
          <circle
            cx="256"
            cy="256"
            r="204"
            fill="none"
            stroke="#22c55e"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="14 18"
            opacity="0.9"
          />
          <path
            d="M 256,52 A 204,204 0 0,1 460,256 A 204,204 0 0,1 360,428"
            fill="none"
            stroke="#eab308"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="14 18"
          />
          <path
            d="M 360,428 A 204,204 0 0,1 256,460 A 204,204 0 0,1 150,428"
            fill="none"
            stroke="#f97316"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="14 18"
          />
          <path
            d="M 150,428 A 204,204 0 0,1 52,256 A 204,204 0 0,1 256,52"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="14 18"
          />
        </g>

        {/* Headphone Arc (Google Blue) */}
        <path
          d="M 156,215 C 156,105 356,105 356,215"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* Top Yellow Center Jewel/Button */}
        <circle cx="256" cy="112" r="17" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />

        {/* Left Earphone (Google Green) */}
        <rect
          x="128"
          y="180"
          width="36"
          height="72"
          rx="18"
          fill="#22c55e"
          stroke="#16a34a"
          strokeWidth="3"
        />

        {/* Right Earphone (Google Red) */}
        <rect
          x="348"
          y="180"
          width="36"
          height="72"
          rx="18"
          fill="#ef4444"
          stroke="#dc2626"
          strokeWidth="3"
        />

        {/* Left Eye with Sparkle Reflection */}
        <circle cx="200" cy="250" r="22" fill="#1e293b" />
        <circle cx="206" cy="244" r="7.5" fill="#ffffff" />
        <circle cx="195" cy="256" r="3" fill="#ffffff" />

        {/* Right Eye with Sparkle Reflection */}
        <circle cx="312" cy="250" r="22" fill="#1e293b" />
        <circle cx="318" cy="244" r="7.5" fill="#ffffff" />
        <circle cx="307" cy="256" r="3" fill="#ffffff" />

        {/* Rosy Pink Cheeks */}
        <ellipse cx="172" cy="292" rx="20" ry="17" fill="#fca5a5" opacity="0.85" />
        <ellipse cx="340" cy="292" rx="20" ry="17" fill="#fca5a5" opacity="0.85" />

        {/* Sweet Happy Curved Smile */}
        <path
          d="M 222,286 Q 256,316 290,286"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
