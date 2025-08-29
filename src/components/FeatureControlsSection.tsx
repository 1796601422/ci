import React from 'react';
import './FeatureControlsSection.css';
import { WordFeatures, FeatureConfig } from '../types';

interface FeatureControlsSectionProps {
  features: WordFeatures;
  onFeaturesChange: (features: WordFeatures) => void;
  currentWord: string;
}

const FeatureControlsSection: React.FC<FeatureControlsSectionProps> = ({
  features,
  onFeaturesChange,
  currentWord
}) => {
  const featureConfigs: FeatureConfig[] = [
    {
      key: 'color',
      label: '颜色鲜艳度',
      description: '这个词让你联想到的颜色有多鲜艳？',
      color: '#ef4444',
      icon: '🎨'
    },
    {
      key: 'size',
      label: '大小',
      description: '这个词代表的事物有多大？',
      color: '#f59e0b',
      icon: '📏'
    },
    {
      key: 'emotion',
      label: '情感',
      description: '这个词给你的感觉是正面还是负面？',
      color: '#10b981',
      icon: '😊'
    },
    {
      key: 'abstract',
      label: '抽象程度',
      description: '这个词是具体的事物还是抽象的概念？',
      color: '#8b5cf6',
      icon: '💭'
    },
    {
      key: 'frequency',
      label: '使用频率',
      description: '这个词在日常生活中使用得多吗？',
      color: '#06b6d4',
      icon: '📊'
    }
  ];

  const handleFeatureChange = (key: keyof WordFeatures, value: number) => {
    onFeaturesChange({
      ...features,
      [key]: value
    });
  };

  if (!currentWord) {
    return (
      <div className="feature-controls-section">
        <h2>🔧 调整词语特征</h2>
        <div className="empty-state">
          <p>请先选择一个词语，然后就可以调整它的特征了！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-controls-section">
      <h2>🔧 调整「{currentWord}」的特征</h2>
      <p className="section-description">
        滑动滑块设置特征值，组成词向量
      </p>
      
      <div className="feature-controls">
        {featureConfigs.map((config) => (
          <div key={config.key} className="feature-control">
            <div className="feature-header">
              <span className="feature-icon">{config.icon}</span>
              <span className="feature-label">{config.label}</span>
              <span className="feature-value" style={{ color: config.color }}>
                {features[config.key]}
              </span>
            </div>
            
            <p className="feature-description">{config.description}</p>
            
            <div className="slider-container">
              <span className="slider-label">0</span>
              <input
                type="range"
                min="0"
                max="10"
                value={features[config.key]}
                onChange={(e) => handleFeatureChange(config.key, Number(e.target.value))}
                className="feature-slider"
                style={{
                  background: `linear-gradient(to right, ${config.color}20 0%, ${config.color} ${features[config.key] * 10}%, #e2e8f0 ${features[config.key] * 10}%, #e2e8f0 100%)`
                }}
              />
              <span className="slider-label">10</span>
            </div>
            
            <div className="feature-explanation">
              {config.key === 'emotion' && (
                <div className="emotion-scale">
                  <span>😢 负面</span>
                  <span>😊 正面</span>
                </div>
              )}
              {config.key === 'abstract' && (
                <div className="abstract-scale">
                  <span>🏠 具体</span>
                  <span>💭 抽象</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="vector-preview">
        <h3>📊 当前向量值</h3>
        <div className="vector-values">
          <span>[</span>
          {Object.values(features).map((value, index) => (
            <span key={index}>
              {value}{index < Object.values(features).length - 1 ? ', ' : ''}
            </span>
          ))}
          <span>]</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureControlsSection;
