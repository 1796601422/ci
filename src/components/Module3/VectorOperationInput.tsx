import React, { useState } from 'react';
import './VectorOperationInput.css';
import { VectorOperation } from './Module3';

interface VectorOperationInputProps {
  classicExamples: VectorOperation[];
  onExampleSelect: (example: VectorOperation) => void;
  onCustomOperation: (operation: VectorOperation) => void;
  currentOperation: VectorOperation | null;
}

const VectorOperationInput: React.FC<VectorOperationInputProps> = ({
  classicExamples,
  onExampleSelect,
  onCustomOperation,
  currentOperation
}) => {
  const [customWords, setCustomWords] = useState({
    word1: '',
    word2: '',
    word3: '',
    result: ''
  });

  const handleExampleClick = (example: VectorOperation) => {
    onExampleSelect(example);
  };

  const handleCustomSubmit = () => {
    if (customWords.word1 && customWords.word2 && customWords.word3 && customWords.result) {
      const customOperation: VectorOperation = {
        operation: `${customWords.word1} - ${customWords.word2} + ${customWords.word3}`,
        result: customWords.result,
        vectors: [
          { word: customWords.word1, x: Math.random() * 4 + 1, y: Math.random() * 4 + 1, z: Math.random() * 3 + 0.5, operation: '+' },
          { word: customWords.word2, x: Math.random() * 3 + 0.5, y: Math.random() * 3 + 0.5, z: Math.random() * 2 + 0.5, operation: '-' },
          { word: customWords.word3, x: Math.random() * 3 + 0.5, y: Math.random() * 4 + 1, z: Math.random() * 3 + 0.5, operation: '+' },
          { word: customWords.result, x: Math.random() * 4 + 2, y: Math.random() * 4 + 2, z: Math.random() * 3 + 1, operation: '=' }
        ]
      };
      onCustomOperation(customOperation);
    }
  };

  return (
    <div className="vector-operation-input">
      <div className="section">
        <h2>🎯 经典示例</h2>
        <p className="section-desc">
          点击下面的经典词向量运算示例，体验语义的数学魔法
        </p>
        
        <div className="classic-examples">
          {classicExamples.map((example, index) => (
            <div
              key={index}
              className={`example-card ${currentOperation?.operation === example.operation ? 'active' : ''}`}
              onClick={() => handleExampleClick(example)}
            >
              <div className="operation-text">
                {example.operation}
              </div>
              <div className="equals">=</div>
              <div className="result-text">
                {example.result}
              </div>
              <div className="magic-icon">✨</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>🛠️ 自定义运算</h2>
        <p className="section-desc">
          创建你自己的词向量运算表达式
        </p>
        
        <div className="custom-operation">
          <div className="operation-builder">
            <div className="operation-row">
              <input
                type="text"
                placeholder="第一个词"
                value={customWords.word1}
                onChange={(e) => setCustomWords(prev => ({ ...prev, word1: e.target.value }))}
                className="word-input"
              />
              <span className="operator">-</span>
              <input
                type="text"
                placeholder="第二个词"
                value={customWords.word2}
                onChange={(e) => setCustomWords(prev => ({ ...prev, word2: e.target.value }))}
                className="word-input"
              />
              <span className="operator">+</span>
              <input
                type="text"
                placeholder="第三个词"
                value={customWords.word3}
                onChange={(e) => setCustomWords(prev => ({ ...prev, word3: e.target.value }))}
                className="word-input"
              />
            </div>
            
            <div className="result-row">
              <span className="equals-sign">=</span>
              <input
                type="text"
                placeholder="期望结果"
                value={customWords.result}
                onChange={(e) => setCustomWords(prev => ({ ...prev, result: e.target.value }))}
                className="result-input"
              />
            </div>
          </div>
          
          <button
            className="calculate-btn"
            onClick={handleCustomSubmit}
            disabled={!customWords.word1 || !customWords.word2 || !customWords.word3 || !customWords.result}
          >
            🧮 开始计算
          </button>
        </div>
      </div>

      {currentOperation && (
        <div className="current-operation-display">
          <h3>📐 当前运算</h3>
          <div className="operation-formula">
            <span className="formula-text">{currentOperation.operation}</span>
            <span className="equals-symbol"> = </span>
            <span className="result-highlight">{currentOperation.result}</span>
          </div>
          <div className="operation-info">
            点击右侧可视化查看向量运算过程
          </div>
        </div>
      )}
    </div>
  );
};

export default VectorOperationInput;
