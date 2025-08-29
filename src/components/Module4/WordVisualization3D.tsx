import React, { useRef, useEffect, useState } from 'react';
import './WordVisualization3D.css';
import { WordGenerationResult, WordNode, WordCluster } from './Module4';

interface WordVisualization3DProps {
  result: WordGenerationResult | null;
  selectedWord: WordNode | null;
  onWordSelect: (word: WordNode) => void;
  animationSpeed: number;
  isGenerating: boolean;
}

const WordVisualization3D: React.FC<WordVisualization3DProps> = ({
  result,
  selectedWord,
  onWordSelect,
  animationSpeed,
  isGenerating
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hoveredWord, setHoveredWord] = useState<WordNode | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [stars, setStars] = useState<Array<{x: number, y: number, brightness: number, size: number}>>([]);

  // 初始化星空
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 200; i++) {
        newStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          brightness: Math.random() * 0.8 + 0.2,
          size: Math.random() * 2 + 0.5
        });
      }
      setStars(newStars);
    };
    
    generateStars();
  }, []);

  useEffect(() => {
    if (!result) return;

    let animationId: number;

    const animate = () => {
      // 自动旋转
      if (autoRotate && !isDragging) {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + 0.008 * animationSpeed
        }));
      }

      draw3DVisualization();
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [result, rotation, zoom, selectedWord, hoveredWord, animationSpeed, isDragging, autoRotate]);

  const draw3DVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制星空背景
    drawStarryBackground(ctx, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const perspective = 800;

    // 绘制坐标轴（灰色）
    drawAxes(ctx, centerX, centerY, perspective);

    // 绘制所有词汇
    const allWords = result.clusters.flatMap(cluster => cluster.words);
    allWords.forEach(word => {
      drawWord(ctx, word, centerX, centerY, perspective);
    });

    // 绘制选中词汇的高亮
    if (selectedWord) {
      drawWordHighlight(ctx, selectedWord, centerX, centerY, perspective);
    }

    // 绘制悬停词汇的提示
    if (hoveredWord) {
      drawWordTooltip(ctx, hoveredWord, centerX, centerY, perspective);
    }
  };

  const drawStarryBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 绘制深色渐变背景
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.7, '#0f3460');
    gradient.addColorStop(1, '#0a1225');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 绘制星星
    const time = Date.now() * 0.001;
    stars.forEach((star, index) => {
      // 添加闪烁动画
      const flicker = Math.sin(time * 2 + index * 0.5) * 0.3 + 0.7;
      const brightness = star.brightness * flicker;
      
      ctx.globalAlpha = brightness;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
      ctx.fill();
      
      // 添加星星光晕效果
      if (star.brightness > 0.6) {
        ctx.globalAlpha = brightness * 0.2;
        ctx.fillStyle = '#e6f3ff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    ctx.globalAlpha = 1;
  };

  const project3D = (pos: { x: number; y: number; z: number }, centerX: number, centerY: number, perspective: number) => {
    // 应用旋转
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);

    // 旋转变换
    let x = pos.x;
    let y = pos.y * cosX - pos.z * sinX;
    let z = pos.y * sinX + pos.z * cosX;

    const tempX = x * cosY + z * sinY;
    z = -x * sinY + z * cosY;
    x = tempX;

    // 应用缩放
    x *= zoom;
    y *= zoom;
    z *= zoom;

    // 透视投影
    const scale = perspective / (perspective + z);
    const projectedX = centerX + x * scale;
    const projectedY = centerY + y * scale;

    return { 
      x: projectedX, 
      y: projectedY, 
      z: z, 
      scale: scale,
      visible: z > -perspective 
    };
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, start: any, end: any, color: string) => {
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6; // 30度
    
    // 计算箭头方向
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    
    // 箭头的两个边
    const arrowX1 = end.x - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = end.y - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = end.x - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = end.y - arrowLength * Math.sin(angle + arrowAngle);
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    
    // 绘制箭头
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(arrowX1, arrowY1);
    ctx.lineTo(arrowX2, arrowY2);
    ctx.closePath();
    ctx.fill();
  };

  const drawAxes = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, perspective: number) => {
    ctx.strokeStyle = '#9ca3af'; // 灰色坐标轴
    ctx.lineWidth = 3; // 加粗坐标轴
    ctx.globalAlpha = 0.8;

    const axisLength = 150;

    // X轴 (灰色)
    const xStart = project3D({ x: -axisLength, y: 0, z: 0 }, centerX, centerY, perspective);
    const xEnd = project3D({ x: axisLength, y: 0, z: 0 }, centerX, centerY, perspective);
    
    if (xStart.visible && xEnd.visible) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(xStart.x, xStart.y);
      ctx.lineTo(xEnd.x, xEnd.y);
      ctx.stroke();
      
      // X轴箭头
      drawArrow(ctx, xStart, xEnd, '#9ca3af');
      
      // X轴标签
      ctx.fillStyle = '#d1d5db';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('X', xEnd.x + 20, xEnd.y + 5);
    }

    // Y轴 (灰色)
    const yStart = project3D({ x: 0, y: -axisLength, z: 0 }, centerX, centerY, perspective);
    const yEnd = project3D({ x: 0, y: axisLength, z: 0 }, centerX, centerY, perspective);
    
    if (yStart.visible && yEnd.visible) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(yStart.x, yStart.y);
      ctx.lineTo(yEnd.x, yEnd.y);
      ctx.stroke();
      
      // Y轴箭头
      drawArrow(ctx, yStart, yEnd, '#9ca3af');
      
      // Y轴标签
      ctx.fillStyle = '#d1d5db';
      ctx.fillText('Y', yEnd.x + 5, yEnd.y - 15);
    }

    // Z轴 (灰色)
    const zStart = project3D({ x: 0, y: 0, z: -axisLength }, centerX, centerY, perspective);
    const zEnd = project3D({ x: 0, y: 0, z: axisLength }, centerX, centerY, perspective);
    
    if (zStart.visible && zEnd.visible) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(zStart.x, zStart.y);
      ctx.lineTo(zEnd.x, zEnd.y);
      ctx.stroke();
      
      // Z轴箭头
      drawArrow(ctx, zStart, zEnd, '#9ca3af');
      
      // Z轴标签
      ctx.fillStyle = '#d1d5db';
      ctx.fillText('Z', zEnd.x + 20, zEnd.y + 5);
    }

    ctx.globalAlpha = 1;
  };

  const drawWord = (ctx: CanvasRenderingContext2D, word: WordNode, centerX: number, centerY: number, perspective: number) => {
    const projected = project3D(word.position, centerX, centerY, perspective);
    
    if (!projected.visible) return;

    const isSelected = selectedWord?.id === word.id;
    const isHovered = hoveredWord?.id === word.id;

    // 绘制词汇圆圈
    ctx.globalAlpha = 0.8 * projected.scale;
    ctx.fillStyle = word.color;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, word.size * projected.scale, 0, 2 * Math.PI);
    ctx.fill();

    // 选中或悬停时的边框
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#000000' : '#666666';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 绘制词汇文本
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(10, 12 * projected.scale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word.word, projected.x, projected.y);

    ctx.globalAlpha = 1;
  };

  const drawWordHighlight = (ctx: CanvasRenderingContext2D, word: WordNode, centerX: number, centerY: number, perspective: number) => {
    const projected = project3D(word.position, centerX, centerY, perspective);
    
    if (!projected.visible) return;

    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, (word.size + 5) * projected.scale, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  const drawWordTooltip = (ctx: CanvasRenderingContext2D, word: WordNode, centerX: number, centerY: number, perspective: number) => {
    const projected = project3D(word.position, centerX, centerY, perspective);
    
    if (!projected.visible) return;

    const tooltipX = projected.x + 30;
    const tooltipY = projected.y - 30;
    const tooltipWidth = 150;
    const tooltipHeight = 60;

    // 绘制提示框背景
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#000000';
    ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

    // 绘制提示框文本
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`词汇: ${word.word}`, tooltipX + 10, tooltipY + 20);
    ctx.fillText(`类别: ${word.category}`, tooltipX + 10, tooltipY + 35);
    ctx.fillText(`相似度: ${(word.similarity * 100).toFixed(1)}%`, tooltipX + 10, tooltipY + 50);
  };

  const findWordAtPosition = (x: number, y: number): WordNode | null => {
    if (!result) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const perspective = 800;

    const allWords = result.clusters.flatMap(cluster => cluster.words);
    
    for (const word of allWords) {
      const projected = project3D(word.position, centerX, centerY, perspective);
      if (!projected.visible) continue;

      const distance = Math.sqrt(
        Math.pow(x - projected.x, 2) + Math.pow(y - projected.y, 2)
      );

      if (distance <= word.size * projected.scale) {
        return word;
      }
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedWord = findWordAtPosition(x, y);
    if (clickedWord) {
      onWordSelect(clickedWord);
      return;
    }

    setIsDragging(true);
    setAutoRotate(false);
    setLastMousePos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = x - lastMousePos.x;
      const deltaY = y - lastMousePos.y;

      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }));

      setLastMousePos({ x, y });
    } else {
      const hoveredWord = findWordAtPosition(x, y);
      setHoveredWord(hoveredWord);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setAutoRotate(true), 2000); // 2秒后恢复自动旋转
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * zoomFactor)));
  };

  if (isGenerating) {
    return (
      <div className="word-visualization-3d">
        <div className="generating-state">
          <div className="generating-animation">
            <div className="orbit orbit-1"></div>
            <div className="orbit orbit-2"></div>
            <div className="orbit orbit-3"></div>
            <div className="center-node"></div>
          </div>
          <h3>生成词汇宇宙中...</h3>
          <p>正在构建3D词汇空间，请稍候</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="word-visualization-3d">
        <div className="empty-state">
          <div className="empty-icon">🌌</div>
          <h3>3D词汇空间</h3>
          <p>输入一个词汇，探索相关词汇的3D宇宙</p>
        </div>
      </div>
    );
  }

  return (
    <div className="word-visualization-3d">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="visualization-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
    </div>
  );
};

export default WordVisualization3D;