import React from "react";

export default function SnapikaLogo({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer mystical circle - the boundary between us and them */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke="#E94560" 
        strokeWidth="3"
        strokeDasharray="12 8"
        opacity="0.8"
      >
        <animate attributeName="stroke-dashoffset" values="0;20;0" dur="8s" repeatCount="indefinite"/>
      </circle>
      
      {/* Inner sacred circle - our exclusive group */}
      <circle 
        cx="50" 
        cy="50" 
        r="32" 
        fill="#1a1a1a" 
        stroke="#7e30e1" 
        strokeWidth="2"
        opacity="0.9"
      />
      
      {/* The core friend group - positioned like they're huddled together */}
      <g>
        {/* Friend 1 */}
        <circle cx="42" cy="42" r="6" fill="#E94560" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        {/* Friend 2 */}
        <circle cx="58" cy="42" r="6" fill="#00B8A9" opacity="0.9">
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
        
        {/* Friend 3 */}
        <circle cx="42" cy="58" r="6" fill="#F9D923" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="1s"/>
        </circle>
        
        {/* Friend 4 */}
        <circle cx="58" cy="58" r="6" fill="#7e30e1" opacity="0.9">
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" begin="1.5s"/>
        </circle>
      </g>
      
      {/* Central memory core - where all shared secrets live */}
      <circle cx="50" cy="50" r="8" fill="#fff" opacity="0.15"/>
      <circle cx="50" cy="50" r="4" fill="#fff" opacity="0.3"/>
      
      {/* Connection lines between friends - like mind links */}
      <line x1="42" y1="42" x2="58" y2="42" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      <line x1="42" y1="58" x2="58" y2="58" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      <line x1="42" y1="42" x2="42" y2="58" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      <line x1="58" y1="42" x2="58" y2="58" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      
      {/* Cross connections - showing deep bonds */}
      <line x1="42" y1="42" x2="58" y2="58" stroke="#7e30e1" strokeWidth="1" opacity="0.4"/>
      <line x1="58" y1="42" x2="42" y2="58" stroke="#7e30e1" strokeWidth="1" opacity="0.4"/>
      
      {/* Protective energy rings */}
      <circle 
        cx="50" 
        cy="50" 
        r="25" 
        fill="none" 
        stroke="#00B8A9" 
        strokeWidth="1" 
        opacity="0.2"
        strokeDasharray="4 4"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          values="0 50 50;360 50 50" 
          dur="20s" 
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Memory fragments floating around */}
      <g opacity="0.6">
        <rect x="20" y="25" width="2" height="2" fill="#F9D923" transform="rotate(45 21 26)">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
        </rect>
        <rect x="78" y="30" width="2" height="2" fill="#E94560" transform="rotate(45 79 31)">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" begin="1s"/>
        </rect>
        <rect x="25" y="75" width="2" height="2" fill="#00B8A9" transform="rotate(45 26 76)">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" begin="2s"/>
        </rect>
        <rect x="75" y="72" width="2" height="2" fill="#7e30e1" transform="rotate(45 76 73)">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" begin="3s"/>
        </rect>
      </g>
      
      {/* Camera lens integration - subtle */}
      <circle cx="50" cy="20" r="3" fill="#fff" opacity="0.4"/>
      <circle cx="50" cy="20" r="1.5" fill="#222" opacity="0.6"/>
    </svg>
  );
}