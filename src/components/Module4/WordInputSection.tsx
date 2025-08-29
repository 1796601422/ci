import React, { useState } from 'react';
import './WordInputSection.css';
import { WordGenerationResult } from './Module4';

interface WordInputSectionProps {
  onWordSubmit: (word: string) => void;
  isGenerating: boolean;
  currentWord: string;
  result: WordGenerationResult | null;
}

const WordInputSection: React.FC<WordInputSectionProps> = ({
  onWordSubmit,
  isGenerating,
  currentWord,
  result
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const suggestedWords = [
    '手机', '电脑', '耳机', '运动', '美食', '家居', 
    '汽车', '旅行', '健康', '学习', '娱乐', '时尚'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = inputValue.trim() || selectedSuggestion;
    if (word && !isGenerating) {
      onWordSubmit(word);
    }
  };

  const handleSuggestionClick = (word: string) => {
    setSelectedSuggestion(word);
    setInputValue(word);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedSuggestion('');
  };

  return (
    <div className="word-input-section">
      <div className="input-header">
        <h2>🚀 智能词汇扩展器</h2>
        <p className="input-description">
          输入任意关键词，系统将自动生成相关的商品词汇并在3D空间中可视化展示
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="请输入关键词，如：手机、电脑、美食..."
              className="word-input"
              disabled={isGenerating}
            />
            <button 
              type="submit"
              disabled={(!inputValue.trim() && !selectedSuggestion) || isGenerating}
              className="submit-btn"
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner"></div>
                  生成中...
                </>
              ) : (
                <>
                  ✨ 生成词汇宇宙
                </>
              )}
            </button>
          </div>
          
          {isGenerating && (
            <div className="generation-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="progress-text">
                正在分析"{currentWord}"的语义关联...
              </div>
            </div>
          )}
        </div>

        <div className="suggestions-section">
          <div className="suggestions-label">推荐关键词：</div>
          <div className="suggestions-grid">
            {suggestedWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => handleSuggestionClick(word)}
                className={`suggestion-btn ${selectedSuggestion === word ? 'active' : ''}`}
                disabled={isGenerating}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </form>

      {result && (
        <div className="result-summary">
          <div className="summary-header">
            <h3>🎯 生成结果概览</h3>
          </div>
          
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{result.totalWords}</div>
                <div className="stat-label">生成词汇</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🏷️</div>
              <div className="stat-content">
                <div className="stat-value">{result.clusters.length}</div>
                <div className="stat-label">词汇簇</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🎨</div>
              <div className="stat-content">
                <div className="stat-value">{result.categories.length}</div>
                <div className="stat-label">类别</div>
              </div>
            </div>
          </div>

          <div className="categories-overview">
            <div className="categories-label">词汇类别：</div>
            <div className="categories-list">
              {result.categories.map((category, index) => (
                <span key={category} className="category-tag" style={{
                  backgroundColor: `hsl(${index * 60 % 360}, 70%, 85%)`,
                  color: `hsl(${index * 60 % 360}, 70%, 30%)`
                }}>
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="input-tips">
        <h4>💡 使用提示</h4>
        <div className="tips-grid">
          <div className="tip-item">
            <div className="tip-icon">🎯</div>
            <div className="tip-content">
              <h5>精准输入</h5>
              <p>输入具体的商品类别或品牌名，获得更精准的词汇扩展</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">🌐</div>
            <div className="tip-content">
              <h5>探索关联</h5>
              <p>系统会智能分析词汇间的语义关联和商业关系</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">🎨</div>
            <div className="tip-content">
              <h5>可视化展示</h5>
              <p>在3D空间中查看词汇分布，或切换到词云图模式</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">⚡</div>
            <div className="tip-content">
              <h5>智能算法</h5>
              <p>采用先进的词向量技术，基于语义相似度进行词汇扩展</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">📊</div>
            <div className="tip-content">
              <h5>数据分析</h5>
              <p>实时计算词汇间的关联度和商业价值评分</p>
            </div>
          </div>
          
          <div className="tip-item">
            <div className="tip-icon">🔄</div>
            <div className="tip-content">
              <h5>动态更新</h5>
              <p>支持实时交互，点击词汇可查看详细信息和关联关系</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordInputSection;
