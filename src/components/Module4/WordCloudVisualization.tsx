import React, { useRef, useEffect, useState } from 'react';
import './WordCloudVisualization.css';
import { WordGenerationResult, WordNode } from './Module4';

interface WordCloudVisualizationProps {
  result: WordGenerationResult | null;
  selectedWord: WordNode | null;
  onWordSelect: (word: WordNode) => void;
}

const WordCloudVisualization: React.FC<WordCloudVisualizationProps> = ({
  result,
  selectedWord,
  onWordSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredWord, setHoveredWord] = useState<WordNode | null>(null);
  const [layoutMode, setLayoutMode] = useState<'spiral' | 'cluster' | 'random'>('spiral');
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!result) return;

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 2000, 1);
      
      setAnimationProgress(progress);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [result, layoutMode]);

  // 分离绘制逻辑到单独的useEffect
  useEffect(() => {
    drawWordCloud();
  }, [result, layoutMode, selectedWord, hoveredWord, animationProgress, zoom, panOffset]);

  const drawWordCloud = () => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // 应用缩放和平移变换
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    const allWords = result.clusters.flatMap(cluster => cluster.words);
    
    // 调试日志
    console.log('WordCloud Debug:', {
      totalClusters: result.clusters.length,
      totalWords: allWords.length,
      animationProgress,
      canvasSize: { width, height }
    });
    
    if (allWords.length === 0) {
      console.warn('No words to display in word cloud');
      return;
    }
    
    // 按相似度分为三个类别
    const highSimilarity = allWords.filter(word => word.similarity >= 0.7);
    const mediumSimilarity = allWords.filter(word => word.similarity >= 0.4 && word.similarity < 0.7);
    const lowSimilarity = allWords.filter(word => word.similarity < 0.4);
    
    console.log('Similarity distribution:', {
      high: highSimilarity.length,
      medium: mediumSimilarity.length,
      low: lowSimilarity.length
    });
    
    const similarityGroups = [
      { words: highSimilarity, category: 'high', color: '#ef4444', label: '高相似度' },
      { words: mediumSimilarity, category: 'medium', color: '#f59e0b', label: '中等相似度' },
      { words: lowSimilarity, category: 'low', color: '#10b981', label: '低相似度' }
    ];

    const layoutWords = calculateWordLayoutBySimilarity(similarityGroups, width, height);
    console.log('Layout words count:', layoutWords.length);

    // 绘制词汇
    layoutWords.forEach((word, index) => {
      drawWordInCloud(ctx, word, index, allWords.length);
    });

    // 恢复画布状态
    ctx.restore();
  };

  const calculateWordLayoutBySimilarity = (similarityGroups: any[], width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const allLayoutWords: any[] = [];
    
    similarityGroups.forEach((group, groupIndex) => {
      const { words, color, category } = group;
      
      words.forEach((word: WordNode, wordIndex: number) => {
        let x, y;
        const fontSize = Math.max(
          category === 'high' ? 24 : category === 'medium' ? 18 : 14,
          word.similarity * 30 + word.popularity * 15
        );
        
        // 根据相似度分组布局
        if (category === 'high') {
          // 高相似度 - 中心区域
          const angle = wordIndex * 0.8;
          const radius = 20 + wordIndex * 8;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
        } else if (category === 'medium') {
          // 中等相似度 - 中间环形区域
          const angle = wordIndex * 0.6;
          const radius = 120 + wordIndex * 12;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
        } else {
          // 低相似度 - 外围区域
          const angle = wordIndex * 0.4;
          const radius = 220 + wordIndex * 15;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
        }
        
        // 确保词汇不超出画布边界
        x = Math.max(fontSize, Math.min(width - fontSize, x));
        y = Math.max(fontSize, Math.min(height - fontSize, y));

        allLayoutWords.push({
          ...word,
          layout: { x, y, fontSize },
          similarityGroup: category,
          groupColor: color
        });
      });
    });
    
    return allLayoutWords;
  };

  const calculateWordLayout = (words: WordNode[], width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    return words.map((word, index) => {
      let x, y;
      const fontSize = Math.max(12, word.similarity * 40 + word.popularity * 20);
      
      switch (layoutMode) {
        case 'spiral':
          const angle = index * 0.5;
          const radius = Math.sqrt(index) * 15;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
          break;
          
        case 'cluster':
          const clusterIndex = result!.clusters.findIndex(c => c.words.includes(word));
          const clusterAngle = (clusterIndex / result!.clusters.length) * 2 * Math.PI;
          const clusterRadius = 150;
          const clusterCenterX = centerX + Math.cos(clusterAngle) * clusterRadius;
          const clusterCenterY = centerY + Math.sin(clusterAngle) * clusterRadius;
          
          const wordIndex = result!.clusters[clusterIndex].words.indexOf(word);
          const wordAngle = (wordIndex / result!.clusters[clusterIndex].words.length) * 2 * Math.PI;
          const wordRadius = 30 + Math.random() * 40;
          
          x = clusterCenterX + Math.cos(wordAngle) * wordRadius;
          y = clusterCenterY + Math.sin(wordAngle) * wordRadius;
          break;
          
        case 'random':
        default:
          x = centerX + (Math.random() - 0.5) * (width - 100);
          y = centerY + (Math.random() - 0.5) * (height - 100);
          break;
      }

      return {
        ...word,
        layout: { x, y, fontSize }
      };
    });
  };

  const drawWordInCloud = (ctx: CanvasRenderingContext2D, word: any, index: number, totalWords: number) => {
    const { x, y, fontSize } = word.layout;
    const progress = Math.min(1, (animationProgress * totalWords - index) / 2);
    
    if (progress <= 0) return;

    const isSelected = selectedWord?.id === word.id;
    const isHovered = hoveredWord?.id === word.id;
    
    // 应用动画进度
    const currentFontSize = fontSize * progress;
    const alpha = progress;

    ctx.save();
    
    // 根据相似度确定颜色
    const similarity = word.similarity;
    let displayColor = '#6b7280'; // 默认颜色
    let fontWeight = 'normal';
    
    if (similarity >= 0.7) {
      displayColor = '#ef4444'; // 红色 - 高相似度
      fontWeight = 'bold';
    } else if (similarity >= 0.4) {
      displayColor = '#f59e0b'; // 橙色 - 中等相似度
      fontWeight = '600';
    } else {
      displayColor = '#10b981'; // 绿色 - 低相似度
      fontWeight = 'normal';
    }
    
    // 绘制词汇阴影
    if (isSelected || isHovered) {
      ctx.shadowColor = displayColor;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    // 设置字体和颜色
    ctx.globalAlpha = alpha;
    ctx.fillStyle = displayColor;
    ctx.font = `${isSelected ? 'bold' : fontWeight} ${currentFontSize}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 绘制词汇背景（如果选中或悬停）
    if (isSelected || isHovered) {
      const metrics = ctx.measureText(word.word);
      const padding = 8;
      
      ctx.globalAlpha = 0.1 * alpha;
      ctx.fillStyle = displayColor;
      ctx.fillRect(
        x - metrics.width / 2 - padding,
        y - currentFontSize / 2 - padding,
        metrics.width + padding * 2,
        currentFontSize + padding * 2
      );
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = displayColor;
    }

    // 绘制词汇文本
    ctx.fillText(word.word, x, y);
    
    // 绘制相似度指示器
    if (word.similarity >= 0.7) {
      ctx.globalAlpha = 0.8 * alpha;
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('★', x + currentFontSize * 0.4, y - currentFontSize * 0.4);
    }

    ctx.restore();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!result || isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedWord = findWordAtPosition(x, y);
    if (clickedWord) {
      onWordSelect(clickedWord);
    }
  };

  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * zoomFactor)));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setLastMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = x - lastMousePos.x;
      const deltaY = y - lastMousePos.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastMousePos({ x, y });
    } else {
      const hoveredWord = findWordAtPosition(x, y);
      setHoveredWord(hoveredWord);
    }
  };

  const findWordAtPosition = (x: number, y: number): WordNode | null => {
    if (!result || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 将鼠标坐标转换为画布坐标（考虑缩放和平移）
    const transformedX = (x - canvas.width / 2 - panOffset.x) / zoom + canvas.width / 2;
    const transformedY = (y - canvas.height / 2 - panOffset.y) / zoom + canvas.height / 2;

    const allWords = result.clusters.flatMap(cluster => cluster.words);
    
    // 使用相似度分组布局
    const highSimilarity = allWords.filter(word => word.similarity >= 0.7);
    const mediumSimilarity = allWords.filter(word => word.similarity >= 0.4 && word.similarity < 0.7);
    const lowSimilarity = allWords.filter(word => word.similarity < 0.4);
    
    const similarityGroups = [
      { words: highSimilarity, category: 'high', color: '#ef4444', label: '高相似度' },
      { words: mediumSimilarity, category: 'medium', color: '#f59e0b', label: '中等相似度' },
      { words: lowSimilarity, category: 'low', color: '#10b981', label: '低相似度' }
    ];

    const layoutWords = calculateWordLayoutBySimilarity(similarityGroups, canvas.width, canvas.height);

    for (const word of layoutWords) {
      const { x: wordX, y: wordY, fontSize } = word.layout;
      
      ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
      const metrics = ctx.measureText(word.word);
      
      const left = wordX - metrics.width / 2;
      const right = wordX + metrics.width / 2;
      const top = wordY - fontSize / 2;
      const bottom = wordY + fontSize / 2;
      
      if (transformedX >= left && transformedX <= right && transformedY >= top && transformedY <= bottom) {
        return word;
      }
    }

    return null;
  };

  if (!result) {
    return (
      <div className="word-cloud-visualization">
        <div className="empty-state">
          <div className="empty-icon">☁️</div>
          <h3>词云可视化</h3>
          <p>输入关键词生成美丽的词云图</p>
        </div>
      </div>
    );
  }

  return (
    <div className="word-cloud-visualization">
      <div className="cloud-header">
        <h3>☁️ 智能词云图 - 相似度分类</h3>
        <div className="header-controls">
          <div className="similarity-info">
            <span className="info-text">按相似度自动分层显示</span>
          </div>
          <div className="zoom-controls">
            <button 
              className="zoom-btn"
              onClick={() => setZoom(prev => Math.max(0.3, prev - 0.2))}
              disabled={zoom <= 0.3}
            >
              ➖
            </button>
            <span className="zoom-display">{Math.round(zoom * 100)}%</span>
            <button 
              className="zoom-btn"
              onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
              disabled={zoom >= 3}
            >
              ➕
            </button>
            <button 
              className="reset-btn"
              onClick={() => {
                setZoom(1);
                setPanOffset({ x: 0, y: 0 });
              }}
            >
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="cloud-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="cloud-canvas"
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheel={handleCanvasWheel}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
        
        {hoveredWord && (
          <div className="word-info-panel">
            <h4>{hoveredWord.word}</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">相似度分类</span>
                <span className="info-value" style={{ 
                  color: hoveredWord.similarity >= 0.7 ? '#ef4444' : 
                         hoveredWord.similarity >= 0.4 ? '#f59e0b' : '#10b981',
                  fontWeight: 'bold'
                }}>
                  {hoveredWord.similarity >= 0.7 ? '高相似度' : 
                   hoveredWord.similarity >= 0.4 ? '中等相似度' : '低相似度'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">相似度</span>
                <span className="info-value">{(hoveredWord.similarity * 100).toFixed(1)}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">类别</span>
                <span className="info-value">{hoveredWord.category}</span>
              </div>
              <div className="info-item">
                <span className="info-label">相关度</span>
                <span className="info-value">{(hoveredWord.relevance * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="word-description">
              {hoveredWord.metadata.description}
            </div>
          </div>
        )}
      </div>

      <div className="cloud-legend">
        <div className="legend-section">
          <h4>相似度分类</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-symbol" style={{ fontSize: '20px', color: '#ef4444', fontWeight: 'bold' }}>高</div>
              <span>高相似度 (≥70%) - 中心区域</span>
            </div>
            <div className="legend-item">
              <div className="legend-symbol" style={{ fontSize: '18px', color: '#f59e0b', fontWeight: '600' }}>中</div>
              <span>中等相似度 (40%-70%) - 中间环形</span>
            </div>
            <div className="legend-item">
              <div className="legend-symbol" style={{ fontSize: '16px', color: '#10b981' }}>低</div>
              <span>低相似度 (&lt;40%) - 外围区域</span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h4>统计信息</h4>
          <div className="stats-grid">
            {(() => {
              const allWords = result.clusters.flatMap(cluster => cluster.words);
              const highCount = allWords.filter(word => word.similarity >= 0.7).length;
              const mediumCount = allWords.filter(word => word.similarity >= 0.4 && word.similarity < 0.7).length;
              const lowCount = allWords.filter(word => word.similarity < 0.4).length;
              
              return (
                <>
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: '#ef4444' }}>{highCount}</span>
                    <span className="stat-label">高相似度</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: '#f59e0b' }}>{mediumCount}</span>
                    <span className="stat-label">中等相似度</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: '#10b981' }}>{lowCount}</span>
                    <span className="stat-label">低相似度</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloudVisualization;
