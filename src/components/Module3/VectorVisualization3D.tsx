import React, { useEffect, useRef, useState } from 'react';
import './VectorVisualization3D.css';
import { VectorOperation } from './Module3';

interface VectorVisualization3DProps {
  operation: VectorOperation | null;
  showSteps: boolean;
}

interface Vector3D {
  x: number;
  y: number;
  z: number;
  word: string;
  color: string;
  operation: '+' | '-' | '=';
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

type DragMode = 'rotate' | 'translate';

const VectorVisualization3D: React.FC<VectorVisualization3DProps> = ({ operation, showSteps }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.3 });
  const [zoom, setZoom] = useState(180);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef<number>();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState<'rotate' | 'translate'>('rotate');

  useEffect(() => {
    if (!showSteps || !operation) return;

    let animationId: number;
    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const totalDuration = 8000; // 8秒
      const progress = Math.min(elapsed / totalDuration, 1);

      setAnimationProgress(progress);
      setCurrentStep(Math.floor(progress * 6));

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
  }, [operation, showSteps]);

  // 自动旋转效果
  useEffect(() => {
    if (!autoRotate) {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current);
      }
      return;
    }

    const rotateAnimation = () => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 0.01
      }));
      autoRotateRef.current = requestAnimationFrame(rotateAnimation);
    };

    autoRotateRef.current = requestAnimationFrame(rotateAnimation);

    return () => {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current);
      }
    };
  }, [autoRotate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 设置画布中心
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 绘制3D坐标系
      draw3DCoordinateSystem(ctx, centerX, centerY);

      if (operation && showSteps) {
        draw3DVectorOperation(ctx, operation, centerX, centerY);
      }
    };

    const project3D = (point: Point3D): Point2D => {
      // 3D到2D的投影变换
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      // 旋转变换
      const x1 = point.x * cosY - point.z * sinY;
      const y1 = point.x * sinY * sinX + point.y * cosX + point.z * cosY * sinX;
      const z1 = point.x * sinY * cosX - point.y * sinX + point.z * cosY * cosX;

      // 透视投影
      const distance = 8;
      const scale = zoom / (distance + z1);

      return {
        x: x1 * scale + offset.x,
        y: -y1 * scale + offset.y
      };
    };

    const draw3DCoordinateSystem = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
      // 网格已移除，只保留坐标轴

      // 绘制3D坐标轴
      ctx.lineWidth = 3;
      
      // X轴 (灰色半透明)
      const xAxisStart = project3D({ x: 0, y: 0, z: 0 });
      const xAxisEnd = project3D({ x: 6, y: 0, z: 0 });
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX + xAxisStart.x, centerY + xAxisStart.y);
      ctx.lineTo(centerX + xAxisEnd.x, centerY + xAxisEnd.y);
      ctx.stroke();
      
      // 绘制X轴箭头
      drawArrowHead(ctx, centerX + xAxisEnd.x, centerY + xAxisEnd.y, 
        Math.atan2(xAxisEnd.y - xAxisStart.y, xAxisEnd.x - xAxisStart.x), 'rgba(107, 114, 128, 0.8)');
      
      // Y轴 (灰色半透明)
      const yAxisStart = project3D({ x: 0, y: 0, z: 0 });
      const yAxisEnd = project3D({ x: 0, y: 6, z: 0 });
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX + yAxisStart.x, centerY + yAxisStart.y);
      ctx.lineTo(centerX + yAxisEnd.x, centerY + yAxisEnd.y);
      ctx.stroke();
      
      // 绘制Y轴箭头
      drawArrowHead(ctx, centerX + yAxisEnd.x, centerY + yAxisEnd.y, 
        Math.atan2(yAxisEnd.y - yAxisStart.y, yAxisEnd.x - yAxisStart.x), 'rgba(107, 114, 128, 0.8)');
      
      // Z轴 (灰色半透明)
      const zAxisStart = project3D({ x: 0, y: 0, z: 0 });
      const zAxisEnd = project3D({ x: 0, y: 0, z: 6 });
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX + zAxisStart.x, centerY + zAxisStart.y);
      ctx.lineTo(centerX + zAxisEnd.x, centerY + zAxisEnd.y);
      ctx.stroke();
      
      // 绘制Z轴箭头
      drawArrowHead(ctx, centerX + zAxisEnd.x, centerY + zAxisEnd.y, 
        Math.atan2(zAxisEnd.y - zAxisStart.y, zAxisEnd.x - zAxisStart.x), 'rgba(107, 114, 128, 0.8)');

      // 绘制坐标轴标签
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      
      // X轴标签
      const xLabelPos = project3D({ x: 6.5, y: 0, z: 0 });
      ctx.fillStyle = 'rgba(75, 85, 99, 0.8)';
      ctx.font = 'bold 13px Arial';
      ctx.fillText('X (语义维度1)', centerX + xLabelPos.x, centerY + xLabelPos.y);
      
      // Y轴标签
      const yLabelPos = project3D({ x: 0, y: 6.5, z: 0 });
      ctx.fillStyle = 'rgba(75, 85, 99, 0.8)';
      ctx.font = 'bold 13px Arial';
      ctx.fillText('Y (语义维度2)', centerX + yLabelPos.x, centerY + yLabelPos.y);
      
      // Z轴标签
      const zLabelPos = project3D({ x: 0, y: 0, z: 6.5 });
      ctx.fillStyle = 'rgba(75, 85, 99, 0.8)';
      ctx.font = 'bold 13px Arial';
      ctx.fillText('Z (语义维度3)', centerX + zLabelPos.x, centerY + zLabelPos.y);

      // 绘制3D刻度标记
      ctx.fillStyle = 'rgba(107, 114, 128, 0.6)';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // X轴刻度
      for (let i = 1; i <= 5; i++) {
        const tickPos = project3D({ x: i, y: 0, z: 0 });
        ctx.fillText(i.toString(), centerX + tickPos.x, centerY + tickPos.y + 12);
      }
      
      // Y轴刻度
      for (let i = 1; i <= 5; i++) {
        const tickPos = project3D({ x: 0, y: i, z: 0 });
        ctx.fillText(i.toString(), centerX + tickPos.x - 12, centerY + tickPos.y);
      }
      
      // Z轴刻度
      for (let i = 1; i <= 5; i++) {
        const tickPos = project3D({ x: 0, y: 0, z: i });
        ctx.fillText(i.toString(), centerX + tickPos.x + 12, centerY + tickPos.y);
      }

      // 绘制原点 - 增强视觉效果
      const originRadius = 5;
      ctx.fillStyle = 'rgba(107, 114, 128, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX + xAxisStart.x, centerY + xAxisStart.y, originRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // 原点外圈
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX + xAxisStart.x, centerY + xAxisStart.y, originRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // 原点标签
      ctx.fillStyle = 'rgba(75, 85, 99, 0.8)';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('(0,0,0)', centerX + xAxisStart.x + 8, centerY + xAxisStart.y + 8);
    };

    const drawArrowHead = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string) => {
      const arrowLength = 12;
      const arrowAngle = Math.PI / 6;
      
      // 箭头主体
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x - arrowLength * Math.cos(angle - arrowAngle),
        y - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        x - arrowLength * Math.cos(angle + arrowAngle),
        y - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();
      
      // 箭头边框
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw3DVectorOperation = (ctx: CanvasRenderingContext2D, op: VectorOperation, centerX: number, centerY: number) => {
      const vectors = op.vectors;
      const v1 = vectors[0]; // 第一个向量
      const v2 = vectors[1]; // 第二个向量  
      const v3 = vectors[2]; // 第三个向量
      const result = vectors[3]; // 结果向量

      // 计算当前步骤的进度 (0-1)
      const currentStepProgress = ((animationProgress * 6) - currentStep);

      // 步骤0: 绘制第一个向量
      if (currentStep >= 0) {
        const alpha = currentStep === 0 ? Math.max(0, Math.min(1, currentStepProgress)) : 1;
        draw3DVector(ctx, { x: 0, y: 0, z: 0 }, { x: v1.x * alpha, y: v1.y * alpha, z: v1.z * alpha }, 
          '#10b981', v1.word, centerX, centerY, alpha);
      }

      // 步骤1: 绘制第二个向量
      if (currentStep >= 1) {
        const alpha = currentStep === 1 ? Math.max(0, Math.min(1, currentStepProgress)) : 1;
        draw3DVector(ctx, { x: 0, y: 0, z: 0 }, { x: v2.x * alpha, y: v2.y * alpha, z: v2.z * alpha }, 
          '#ef4444', v2.word, centerX, centerY, alpha);
      }

      // 步骤2: 绘制第一次运算结果
      if (currentStep >= 2) {
        const alpha = currentStep === 2 ? Math.max(0, Math.min(1, currentStepProgress)) : 1;
        const resultX = (v1.x - v2.x) * alpha;
        const resultY = (v1.y - v2.y) * alpha;
        const resultZ = (v1.z - v2.z) * alpha;
        draw3DVector(ctx, { x: 0, y: 0, z: 0 }, { x: resultX, y: resultY, z: resultZ }, 
          '#f59e0b', `${v1.word}-${v2.word}`, centerX, centerY, alpha);
      }

      // 步骤3: 绘制第三个向量
      if (currentStep >= 3) {
        const alpha = currentStep === 3 ? Math.max(0, Math.min(1, currentStepProgress)) : 1;
        draw3DVector(ctx, { x: 0, y: 0, z: 0 }, { x: v3.x * alpha, y: v3.y * alpha, z: v3.z * alpha }, 
          '#8b5cf6', v3.word, centerX, centerY, alpha);
      }

      // 步骤4: 绘制最终结果
      if (currentStep >= 4) {
        const alpha = currentStep === 4 ? Math.max(0, Math.min(1, currentStepProgress)) : 1;
        const finalX = (v1.x - v2.x + v3.x) * alpha;
        const finalY = (v1.y - v2.y + v3.y) * alpha;
        const finalZ = (v1.z - v2.z + v3.z) * alpha;
        draw3DVector(ctx, { x: 0, y: 0, z: 0 }, { x: finalX, y: finalY, z: finalZ }, 
          '#dc2626', result.word, centerX, centerY, alpha);
      }
    };

    const draw3DVector = (ctx: CanvasRenderingContext2D, start: Point3D, end: Point3D, color: string, 
      label: string, centerX: number, centerY: number, alpha: number = 1) => {
      
      const startProj = project3D(start);
      const endProj = project3D(end);
      
      const startX = centerX + startProj.x;
      const startY = centerY + startProj.y;
      const endX = centerX + endProj.x;
      const endY = centerY + endProj.y;

      const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      if (length < 1) return;

      // 计算深度，调整透明度和线宽
      const depth = (end.z + 3) / 6; // 归一化深度值
      const adjustedAlpha = alpha * (0.5 + depth * 0.5);
      const adjustedLineWidth = 2 + depth * 3;

      // 绘制向量箭头
      ctx.globalAlpha = adjustedAlpha;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = adjustedLineWidth;
      
      // 向量线
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // 箭头头部
      const angle = Math.atan2(endY - startY, endX - startX);
      const arrowLength = 12;
      const arrowAngle = Math.PI / 6;

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - arrowAngle),
        endY - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + arrowAngle),
        endY - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();

      // 向量标签
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 文字阴影效果（增强可读性）
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillText(label, midX + 1, midY + 1);
      
      // 主文字
      ctx.fillStyle = color;
      ctx.fillText(label, midX, midY);
      
      // 恢复透明度
      ctx.globalAlpha = 1;
    };

    draw();
  }, [operation, showSteps, animationProgress, currentStep, rotation, zoom, offset, dragMode]);

  // 独立的事件监听器useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // 停止自动旋转当用户开始拖拽
      setAutoRotate(false);
      
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      if (dragMode === 'rotate') {
        setRotation(prev => ({
          x: prev.x + deltaY * 0.01,
          y: prev.y + deltaX * 0.01
        }));
      } else if (dragMode === 'translate') {
        setOffset(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
      }
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => Math.max(80, Math.min(600, prev - e.deltaY * 0.3)));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging, lastMousePos, dragMode]);

  const drawOperationSteps = () => {
    if (!operation || !showSteps) return null;

    const steps = [
      `绘制向量: ${operation.vectors[0].word}`,
      `绘制向量: ${operation.vectors[1].word}`,
      `计算: ${operation.vectors[0].word} - ${operation.vectors[1].word}`,
      `绘制向量: ${operation.vectors[2].word}`,
      `计算最终结果: ${operation.result}`,
      `运算完成！`
    ];

    return (
      <div className="operation-steps">
        <h4>当前步骤：</h4>
        <p className="current-step">{steps[currentStep] || steps[steps.length - 1]}</p>
      </div>
    );
  };

  return (
    <div className="vector-visualization-3d">
      <div className="visualization-header">
        <h2>🎯 3D向量运算可视化</h2>
        <p>观察向量在三维空间中的运算过程</p>
      </div>

      {!operation ? (
        <div className="empty-state">
          <div className="empty-icon">📐</div>
          <h3>选择运算示例</h3>
          <p>请在左侧选择一个向量运算示例开始演示</p>
        </div>
      ) : (
        <div className="visualization-content">
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              className="vector-canvas"
            />
            <div className="controls-panel">
              <div className="controls-hint">
                <p>💡 {dragMode === 'rotate' ? '拖拽旋转视角' : '拖拽移动坐标系'}，滚轮缩放</p>
              </div>
              <div className="control-buttons">
                <button 
                  className={`control-btn ${dragMode === 'rotate' ? 'active' : ''}`}
                  onClick={() => setDragMode('rotate')}
                  title="拖拽旋转视角"
                >
                  🔄 旋转模式
                </button>
                <button 
                  className={`control-btn ${dragMode === 'translate' ? 'active' : ''}`}
                  onClick={() => setDragMode('translate')}
                  title="拖拽移动坐标系"
                >
                  ✋ 移动模式
                </button>
                <button 
                  className={`control-btn ${autoRotate ? 'active' : ''}`}
                  onClick={() => setAutoRotate(!autoRotate)}
                  title="自动旋转"
                >
                  {autoRotate ? '⏸️ 停止' : '▶️ 自动'}
                </button>
                <button 
                  className="control-btn"
                  onClick={() => {
                    setRotation({ x: 0.3, y: 0.3 });
                    setZoom(180);
                    setOffset({ x: 0, y: 0 });
                    setAutoRotate(true);
                    setDragMode('rotate');
                  }}
                  title="重置所有设置"
                >
                  🏠 重置
                </button>
              </div>
            </div>
          </div>
          
          {showSteps && drawOperationSteps()}
        </div>
      )}
    </div>
  );
};

export default VectorVisualization3D;