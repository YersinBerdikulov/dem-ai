// app/pages/Discover/Test/WorryTest/components/ProgressChart.js
import React from 'react';
import { View, Dimensions } from 'react-native';
import { Svg, Line, Text as SvgText, Path, Circle } from 'react-native-svg';

const ProgressChart = ({ data = [] }) => {
  const chartWidth = Dimensions.get('window').width - 72;
  const chartHeight = 160;
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const scores = [0, 20, 40, 60, 80];
  const padding = 20;

  const getY = (score) => {
    return chartHeight - (score / 80) * (chartHeight - padding * 2) - padding;
  };

  const getX = (index) => {
    return (index * (chartWidth - padding * 2) / 11) + padding;
  };

  const getPathFromData = () => {
    if (data.length < 2) return '';

    let pathCommands = [];
    let lastValidPoint = null;

    data.forEach((item, index) => {
      if (item.hasData) {
        const x = getX(index);
        const y = getY(item.score);

        if (lastValidPoint === null) {
          pathCommands.push(`M ${x} ${y}`);
        } else {
          pathCommands.push(`L ${x} ${y}`);
        }
        lastValidPoint = { x, y };
      }
    });

    return pathCommands.join(' ');
  };

  return (
    <Svg width={chartWidth} height={chartHeight}>
      {/* Grid lines */}
      {scores.map((score) => (
        <React.Fragment key={score}>
          <Line
            x1={padding}
            y1={getY(score)}
            x2={chartWidth - padding}
            y2={getY(score)}
            stroke="white"
            strokeWidth="1"
            opacity="0.2"
          />
          <SvgText
            x={padding - 5}
            y={getY(score) + 4}
            fill="white"
            fontSize="12"
            textAnchor="end"
            opacity="0.5"
          >
            {score}
          </SvgText>
        </React.Fragment>
      ))}

      {/* Month labels */}
      {months.map((month, index) => (
        <SvgText
          key={month}
          x={getX(index)}
          y={chartHeight - 5}
          fill="white"
          fontSize="10"
          opacity="0.5"
          textAnchor="middle"
        >
          {month}
        </SvgText>
      ))}

      {/* Data line */}
      <Path
        d={getPathFromData()}
        stroke="white"
        strokeWidth="2"
        fill="none"
      />

      {/* Data points */}
      {data.map((item, index) => (
        item.hasData && (
          <React.Fragment key={index}>
            <Circle
              cx={getX(index)}
              cy={getY(item.score)}
              r="4"
              fill="white"
            />
            <Circle
              cx={getX(index)}
              cy={getY(item.score)}
              r="2"
              fill="#8B7FFF"
            />
          </React.Fragment>
        )
      ))}
    </Svg>
  );
};

export default ProgressChart;