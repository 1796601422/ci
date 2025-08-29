import React, { useState } from 'react';
import './VectorVisualizationSection.css';
import { WordFeatures } from '../types';
import BarChart from './BarChart';
import RadarChart from './RadarChart';

interface VectorVisualizationSectionProps {
  features: WordFeatures;
  currentWord: string;
}

const VectorVisualizationSection: React.FC<VectorVisualizationSectionProps> = ({
  features,
  currentWord
}) => {
  const [activeChart, setActiveChart] = useState<'bar' | 'radar'>('bar');

  if (!currentWord) {
    return (
      <div className="vector-visualization-section">
        <h2>📊 向量可视化</h2>
        <div className="empty-visualization">
          <div className="empty-icon">📈</div>
          <p>选择一个词语并调整特征后，这里将显示向量的可视化图表！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vector-visualization-section">
      <div className="visualization-header">
        <h2>📊 「{currentWord}」的向量可视化</h2>
        <p className="visualization-description">
          下面是根据你设置的特征生成的词向量图表
        </p>
      </div>

      <div className="chart-selector">
        <button
          className={`chart-button ${activeChart === 'bar' ? 'active' : ''}`}
          onClick={() => setActiveChart('bar')}
        >
          📊 柱状图
        </button>
        <button
          className={`chart-button ${activeChart === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveChart('radar')}
        >
          🕸️ 雷达图
        </button>
      </div>

      <div className="chart-container">
        {activeChart === 'bar' ? (
          <BarChart features={features} currentWord={currentWord} />
        ) : (
          <RadarChart features={features} currentWord={currentWord} />
        )}
      </div>

      <div className="vector-explanation">
        <h3>💡 理解词向量</h3>
        <div className="explanation-content">
          <p>
            <strong>词向量</strong>是把词语转换成数字的方法。每个数字代表词语的一个特征：
          </p>
          <ul>
            <li>🎨 <strong>颜色鲜艳度：</strong> {features.color}</li>
            <li>📏 <strong>大小：</strong> {features.size}</li>
            <li>😊 <strong>情感：</strong> {features.emotion}</li>
            <li>💭 <strong>抽象程度：</strong> {features.abstract}</li>
            <li>📊 <strong>使用频率：</strong> {features.frequency}</li>
          </ul>
          <p className="vector-summary">
            所以「{currentWord}」的向量是：<span className="vector-display">
              [{Object.values(features).join(', ')}]
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VectorVisualizationSection;
