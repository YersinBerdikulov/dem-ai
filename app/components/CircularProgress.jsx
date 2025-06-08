// app/pages/Discover/Test/WorryTest/components/CircularProgress.js
import React from 'react';
import { Svg, Circle } from 'react-native-svg';

const CircularProgress = ({ progress, size = 200, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <Svg width={size} height={size}>
      {/* Background Circle */}
      <Circle
        stroke="rgba(255, 255, 255, 0.2)"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      {/* Progress Circle */}
      <Circle
        stroke="white"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

export default CircularProgress;