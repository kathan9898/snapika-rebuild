import React from "react";

export default function SnapikaLogo({ size = 60, animated = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Brand glow gradient */}
        <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7AD7FF" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#A887FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FF4D85" stopOpacity="0.15" />
        </radialGradient>

        {/* Inner node gradient */}
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#7AD7FF" stopOpacity="0.8" />
        </radialGradient>

        {/* Soft glass highlight */}
        <linearGradient id="glassHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Outer glowing orb */}
      <circle cx="100" cy="100" r="80" fill="url(#orbGlow)" />
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="url(#glassHighlight)"
        strokeWidth="2"
        fill="none"
      />

      {/* Connection lines */}
      <g stroke="#A887FF" strokeOpacity="0.3" strokeWidth="2">
        <line x1="70" y1="90" x2="130" y2="85" />
        <line x1="70" y1="90" x2="85" y2="130" />
        <line x1="130" y1="85" x2="115" y2="125" />
        <line x1="85" y1="130" x2="115" y2="125" />
        <line x1="100" y1="70" x2="130" y2="85" />
        <line x1="100" y1="70" x2="70" y2="90" />
      </g>

      {/* Memory nodes */}
      <circle cx="70" cy="90" r="7" fill="url(#nodeGrad)">
        {animated && (
          <animate
            attributeName="r"
            values="6.5;7.5;6.5"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="130" cy="85" r="7" fill="url(#nodeGrad)">
        {animated && (
          <animate
            attributeName="r"
            values="7;8;7"
            dur="3s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        )}
      </circle>
      <circle cx="85" cy="130" r="7" fill="url(#nodeGrad)">
        {animated && (
          <animate
            attributeName="r"
            values="7;8;7"
            dur="3s"
            repeatCount="indefinite"
            begin="1s"
          />
        )}
      </circle>
      <circle cx="115" cy="125" r="7" fill="url(#nodeGrad)">
        {animated && (
          <animate
            attributeName="r"
            values="6.5;7.5;6.5"
            dur="3s"
            repeatCount="indefinite"
            begin="1.5s"
          />
        )}
      </circle>
      <circle cx="100" cy="70" r="6" fill="url(#nodeGrad)">
        {animated && (
          <animate
            attributeName="r"
            values="5.5;6.5;5.5"
            dur="3s"
            repeatCount="indefinite"
            begin="0.8s"
          />
        )}
      </circle>

      {/* Center core - the heart of memories */}
      <circle cx="100" cy="100" r="5" fill="#fff" opacity="0.6" />
      <circle cx="100" cy="100" r="2" fill="#fff" opacity="0.9" />
    </svg>
  );
}
