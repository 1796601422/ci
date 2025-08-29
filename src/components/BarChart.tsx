import React from 'react';
import './BarChart.css';
import { WordFeatures } from '../types';

interface BarChartProps {
  features: WordFeatures;
  currentWord: string;
}

const BarChart: React.FC<BarChartProps> = ({ features, currentWord }) => {
  const featureLabels = {
    color: '颜色鲜艳度',
    size: '大小',
    emotion: '情感',
    abstract: '抽象程度',
    frequency: '使用频率'
  };

  const featureColors = {
    color: '#ef4444',
    size: '#f59e0b',
    emotion: '#10b981',
    abstract: '#8b5cf6',
    frequency: '#06b6d4'
  };

  const maxValue = 10;
  const chartData = Object.entries(features).map(([key, value]) => ({
    key: key as keyof WordFeatures,
    label: featureLabels[key as keyof WordFeatures],
    value,
    color: featureColors[key as keyof WordFeatures],
    percentage: (value / maxValue) * 100
  }));

  return (
    <div className="bar-chart">
      <div className="chart-title">
        <h3>📊 「{currentWord}」特征柱状图</h3>
        <p>每根柱子的高度代表该特征的强度值</p>
      </div>
      
      <div className="chart-area">
        <div className="y-axis">
          {[10, 8, 6, 4, 2, 0].map(value => (
            <div key={value} className="y-axis-label">{value}</div>
          ))}
        </div>
        
        <div className="bars-container">
          {chartData.map((item, index) => (
            <div key={item.key} className="bar-wrapper">
              <div className="bar-container">
                <div
                  className="bar"
                  style={{
                    height: `${item.percentage}%`,
                    backgroundColor: item.color,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="bar-value">{item.value}</div>
                </div>
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="chart-insights">
        <h4>📈 图表解读</h4>
        <div className="insights-grid">
          <div className="insight">
            <span className="insight-label">最强特征：</span>
            <span className="insight-value">
              {featureLabels[chartData.reduce((max, item) => item.value > max.value ? item : max).key]}
            </span>
          </div>
          <div className="insight">
            <span className="insight-label">平均值：</span>
            <span className="insight-value">
              {(Object.values(features).reduce((sum, val) => sum + val, 0) / Object.values(features).length).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
