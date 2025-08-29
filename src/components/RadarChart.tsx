import React from 'react';
import './RadarChart.css';
import { WordFeatures } from '../types';

interface RadarChartProps {
  features: WordFeatures;
  currentWord: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ features, currentWord }) => {
  const featureLabels = {
    color: '颜色鲜艳度',
    size: '大小',
    emotion: '情感',
    abstract: '抽象程度',
    frequency: '使用频率'
  };

  const featureData = Object.entries(features).map(([key, value]) => ({
    key: key as keyof WordFeatures,
    label: featureLabels[key as keyof WordFeatures],
    value,
    normalizedValue: value / 10 // 归一化到0-1
  }));

  // 计算雷达图的点坐标
  const center = { x: 150, y: 150 };
  const radius = 120;
  const maxRadius = radius;

  const getPointCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / featureData.length - Math.PI / 2;
    const distance = (value / 10) * maxRadius;
    return {
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance
    };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = (index * 2 * Math.PI) / featureData.length - Math.PI / 2;
    const distance = maxRadius + 30;
    return {
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance
    };
  };

  // 生成雷达图的多边形路径
  const polygonPoints = featureData.map((item, index) => {
    const point = getPointCoordinates(index, item.value);
    return `${point.x},${point.y}`;
  }).join(' ');

  // 生成背景网格线
  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <div className="radar-chart">
      <div className="chart-title">
        <h3>🕸️ 「{currentWord}」特征雷达图</h3>
        <p>图形越大表示该词在各维度上的特征越强</p>
      </div>

      <div className="radar-container">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* 背景网格 */}
          <g className="grid">
            {gridLevels.map((level) => {
              const gridPoints = featureData.map((_, index) => {
                const point = getPointCoordinates(index, level);
                return `${point.x},${point.y}`;
              }).join(' ');
              
              return (
                <polygon
                  key={level}
                  points={gridPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  opacity={0.5}
                />
              );
            })}
          </g>

          {/* 轴线 */}
          <g className="axes">
            {featureData.map((_, index) => {
              const endPoint = getPointCoordinates(index, 10);
              return (
                <line
                  key={index}
                  x1={center.x}
                  y1={center.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* 数据多边形 */}
          <polygon
            points={polygonPoints}
            fill="rgba(79, 70, 229, 0.2)"
            stroke="#4f46e5"
            strokeWidth="3"
            className="data-polygon"
          />

          {/* 数据点 */}
          <g className="data-points">
            {featureData.map((item, index) => {
              const point = getPointCoordinates(index, item.value);
              return (
                <circle
                  key={item.key}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#4f46e5"
                  stroke="white"
                  strokeWidth="2"
                  className="data-point"
                >
                  <title>{item.label}: {item.value}</title>
                </circle>
              );
            })}
          </g>

          {/* 标签 */}
          <g className="labels">
            {featureData.map((item, index) => {
              const labelPos = getLabelCoordinates(index);
              return (
                <g key={item.key}>
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 5}
                    textAnchor="middle"
                    className="feature-label-text"
                    fontSize="12"
                    fill="#475569"
                  >
                    {item.label}
                  </text>
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 10}
                    textAnchor="middle"
                    className="feature-value-text"
                    fontSize="14"
                    fill="#4f46e5"
                    fontWeight="bold"
                  >
                    {item.value}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 中心点 */}
          <circle
            cx={center.x}
            cy={center.y}
            r="4"
            fill="#4f46e5"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="radar-insights">
        <h4>🎯 雷达图解读</h4>
        <div className="insights-content">
          <p>雷达图显示了「{currentWord}」在五个维度上的特征分布：</p>
          <ul>
            {featureData.map((item) => (
              <li key={item.key}>
                <span className="dimension-name">{item.label}：</span>
                <span className="dimension-value">{item.value}/10</span>
                <div className="dimension-bar">
                  <div 
                    className="dimension-fill"
                    style={{ width: `${item.normalizedValue * 100}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
