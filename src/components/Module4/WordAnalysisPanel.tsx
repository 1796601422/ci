import React from 'react';
import './WordAnalysisPanel.css';
import { WordGenerationResult, WordNode } from './Module4';

interface WordAnalysisPanelProps {
  result: WordGenerationResult | null;
  selectedWord: WordNode | null;
  onAnimationSpeedChange: (speed: number) => void;
  animationSpeed: number;
}

const WordAnalysisPanel: React.FC<WordAnalysisPanelProps> = ({
  result,
  selectedWord,
  onAnimationSpeedChange,
  animationSpeed
}) => {
  if (!result) {
    return (
      <div className="word-analysis-panel">
        <div className="empty-analysis">
          <div className="empty-icon">📊</div>
          <h3>数据分析面板</h3>
          <p>生成词汇后查看详细的分析数据</p>
        </div>
      </div>
    );
  }

  const allWords = result.clusters.flatMap(cluster => cluster.words);
  const averageSimilarity = allWords.reduce((sum, word) => sum + word.similarity, 0) / allWords.length;
  const averagePopularity = allWords.reduce((sum, word) => sum + word.popularity, 0) / allWords.length;
  const topWords = [...allWords].sort((a, b) => b.similarity - a.similarity).slice(0, 5);

  return (
    <div className="word-analysis-panel">
      <div className="analysis-header">
        <h3>📊 词汇数据分析</h3>
        <div className="animation-control">
          <label>动画速度:</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
            className="speed-slider"
          />
          <span>{animationSpeed.toFixed(1)}x</span>
        </div>
      </div>

      <div className="analysis-content">
        <div className="overview-section">
          <h4>🎯 生成概览</h4>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-icon">📝</div>
              <div className="card-content">
                <div className="card-value">{result.inputWord}</div>
                <div className="card-label">输入词汇</div>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="card-icon">🔢</div>
              <div className="card-content">
                <div className="card-value">{result.totalWords}</div>
                <div className="card-label">生成词汇</div>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="card-icon">🏷️</div>
              <div className="card-content">
                <div className="card-value">{result.clusters.length}</div>
                <div className="card-label">聚类数量</div>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="card-icon">⚡</div>
              <div className="card-content">
                <div className="card-value">{result.processingTime}ms</div>
                <div className="card-label">处理时间</div>
              </div>
            </div>
          </div>
        </div>

        <div className="metrics-section">
          <h4>📈 统计指标</h4>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-icon">🎯</span>
                <span className="metric-name">平均相似度</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{ 
                    width: `${averageSimilarity * 100}%`,
                    backgroundColor: '#10b981'
                  }}
                />
              </div>
              <div className="metric-value">{(averageSimilarity * 100).toFixed(1)}%</div>
            </div>
            
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-icon">🔥</span>
                <span className="metric-name">平均热度</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{ 
                    width: `${averagePopularity * 100}%`,
                    backgroundColor: '#f59e0b'
                  }}
                />
              </div>
              <div className="metric-value">{(averagePopularity * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="clusters-section">
          <h4>🎪 聚类分析</h4>
          <div className="clusters-list">
            {result.clusters.map((cluster) => (
              <div key={cluster.id} className="cluster-card">
                <div className="cluster-header">
                  <div 
                    className="cluster-color" 
                    style={{ backgroundColor: cluster.color }}
                  />
                  <span className="cluster-name">{cluster.name}</span>
                  <span className="cluster-count">({cluster.words.length})</span>
                </div>
                <div className="cluster-words">
                  {cluster.words.slice(0, 6).map((word) => (
                    <span key={word.id} className="cluster-word">
                      {word.word}
                    </span>
                  ))}
                  {cluster.words.length > 6 && (
                    <span className="more-words">+{cluster.words.length - 6}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-words-section">
          <h4>🏆 高相似度词汇</h4>
          <div className="top-words-list">
            {topWords.map((word, index) => (
              <div key={word.id} className="top-word-item">
                <div className="word-rank">#{index + 1}</div>
                <div className="word-info">
                  <div className="word-name">{word.word}</div>
                  <div className="word-category">{word.category}</div>
                </div>
                <div className="word-metrics">
                  <div className="word-similarity">
                    相似度: {(word.similarity * 100).toFixed(1)}%
                  </div>
                  <div className="similarity-bar">
                    <div 
                      className="similarity-fill" 
                      style={{ 
                        width: `${word.similarity * 100}%`,
                        backgroundColor: word.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedWord && (
          <div className="selected-word-section">
            <h4>🔍 选中词汇详情</h4>
            <div className="selected-word-card">
              <div className="word-header">
                <div 
                  className="word-icon" 
                  style={{ backgroundColor: selectedWord.color }}
                >
                  {selectedWord.word.charAt(0)}
                </div>
                <div className="word-details">
                  <h5>{selectedWord.word}</h5>
                  <p>{selectedWord.category}</p>
                </div>
              </div>
              
              <div className="word-properties">
                <div className="property-grid">
                  <div className="property-item">
                    <span className="property-label">相似度</span>
                    <span className="property-value">{(selectedWord.similarity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="property-item">
                    <span className="property-label">相关度</span>
                    <span className="property-value">{(selectedWord.relevance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="property-item">
                    <span className="property-label">热度</span>
                    <span className="property-value">{(selectedWord.popularity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="property-item">
                    <span className="property-label">节点大小</span>
                    <span className="property-value">{selectedWord.size.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="word-metadata">
                  <p className="word-description">{selectedWord.metadata.description}</p>
                  <div className="word-tags">
                    {selectedWord.metadata.tags.map((tag, index) => (
                      <span key={index} className="word-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default WordAnalysisPanel;
