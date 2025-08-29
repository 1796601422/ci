import React, { useState } from 'react';
import './Module3.css';
import VectorOperationInput from './VectorOperationInput';
import VectorVisualization3D from './VectorVisualization3D';
import MathPrincipleExplanation from './MathPrincipleExplanation';

export interface VectorOperation {
  operation: string; // 如: "国王 - 男人 + 女人"
  result: string;   // 如: "女王"
  vectors: {
    word: string;
    x: number;
    y: number;
    z: number;
    operation: '+' | '-' | '=';
  }[];
}

interface Module3Props {
  onBack: () => void;
  onNext: () => void;
}

const Module3: React.FC<Module3Props> = ({ onBack, onNext }) => {
  const [currentOperation, setCurrentOperation] = useState<VectorOperation | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  // 预定义的经典词向量运算示例
  const classicExamples: VectorOperation[] = [
    {
      operation: "国王 - 男人 + 女人",
      result: "女王",
      vectors: [
        { word: "国王", x: 4, y: 3, z: 2, operation: '+' },
        { word: "男人", x: 2, y: 1, z: 1, operation: '-' },
        { word: "女人", x: 1, y: 3, z: 2, operation: '+' },
        { word: "女王", x: 3, y: 5, z: 3, operation: '=' }
      ]
    },
    {
      operation: "巴黎 - 法国 + 中国",
      result: "北京",
      vectors: [
        { word: "巴黎", x: 3, y: 4, z: 1, operation: '+' },
        { word: "法国", x: 2, y: 2, z: 0, operation: '-' },
        { word: "中国", x: 5, y: 1, z: 2, operation: '+' },
        { word: "北京", x: 6, y: 3, z: 3, operation: '=' }
      ]
    },
    {
      operation: "走 - 现在时 + 过去时",
      result: "走了",
      vectors: [
        { word: "走", x: 2, y: 3, z: 1, operation: '+' },
        { word: "现在时", x: 0, y: 1, z: 0, operation: '-' },
        { word: "过去时", x: 1, y: 2, z: 1, operation: '+' },
        { word: "走了", x: 3, y: 4, z: 2, operation: '=' }
      ]
    },
    {
      operation: "好 - 积极 + 消极",
      result: "坏",
      vectors: [
        { word: "好", x: 4, y: 4, z: 2, operation: '+' },
        { word: "积极", x: 2, y: 3, z: 1, operation: '-' },
        { word: "消极", x: -1, y: 1, z: -1, operation: '+' },
        { word: "坏", x: 1, y: 2, z: 0, operation: '=' }
      ]
    }
  ];

  const handleExampleSelect = (example: VectorOperation) => {
    setCurrentOperation(example);
    setShowSteps(false);
    setTimeout(() => setShowSteps(true), 500);
  };

  const handleCustomOperation = (operation: VectorOperation) => {
    setCurrentOperation(operation);
    setShowSteps(false);
    setTimeout(() => setShowSteps(true), 500);
  };

  return (
    <div className="module3-container">
      <div className="module3-header">
        <button className="back-btn" onClick={onBack}>
          ← 返回
        </button>
        <div className="header-content">
          <h1>📊 模块三：词向量运算</h1>
          <p>体验词向量的"数学魔法" - 向量运算如何产生新的语义</p>
        </div>
        <button className="next-btn" onClick={onNext}>
          下一个模块 →
        </button>
      </div>

      <div className="module3-main">
        <div className="left-panel">
          <VectorOperationInput
            classicExamples={classicExamples}
            onExampleSelect={handleExampleSelect}
            onCustomOperation={handleCustomOperation}
            currentOperation={currentOperation}
          />
          
          <MathPrincipleExplanation 
            currentOperation={currentOperation}
            showSteps={showSteps}
          />
        </div>

                <div className="right-panel">
          <VectorVisualization3D 
            operation={currentOperation}
            showSteps={showSteps}
          />
        </div>
      </div>
    </div>
  );
};

export default Module3;
