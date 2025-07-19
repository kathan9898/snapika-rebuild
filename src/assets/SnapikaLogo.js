import React from "react";

const SnapikaLogo = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="28" fill="#7e30e1" />
    <circle cx="28" cy="28" r="16" fill="#fff" />
    <circle cx="28" cy="28" r="9" fill="#7e30e1" />
    <ellipse cx="33" cy="25" rx="2" ry="4" fill="#fff" opacity="0.7" />
    <ellipse cx="24" cy="30" rx="1.5" ry="2.5" fill="#fff" opacity="0.4" />
    {/* Snapika "spark" */}
    <rect x="27" y="8" width="2" height="8" rx="1" fill="#fff" opacity="0.7"/>
    <rect x="8" y="27" width="8" height="2" rx="1" fill="#fff" opacity="0.7"/>
    <rect x="46" y="27" width="8" height="2" rx="1" fill="#fff" opacity="0.7"/>
    <rect x="27" y="46" width="2" height="8" rx="1" fill="#fff" opacity="0.7"/>
  </svg>
);

export default SnapikaLogo;
