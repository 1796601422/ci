import React from 'react';
import './MathPrincipleExplanation.css';
import { VectorOperation } from './Module3';

interface MathPrincipleExplanationProps {
  currentOperation: VectorOperation | null;
  showSteps: boolean;
}

const MathPrincipleExplanation: React.FC<MathPrincipleExplanationProps> = ({
  currentOperation,
  showSteps
}) => {
  if (!currentOperation) {
    return (
      <div className="math-principle-explanation">
        <div className="explanation-header">
          <h2>📚 数学原理</h2>
          <p>选择一个词向量运算示例，了解背后的数学原理</p>
        </div>
        
        <div className="principle-card">
          <h3>🧮 向量运算基础</h3>
          <div className="principle-content">
            <p>词向量运算基于线性代数中的向量加减法：</p>
            <ul>
              <li><strong>向量加法：</strong> 对应维度的数值相加</li>
              <li><strong>向量减法：</strong> 对应维度的数值相减</li>
              <li><strong>几何意义：</strong> 在语义空间中的位移</li>
            </ul>
          </div>
        </div>

        <div className="principle-card">
          <h3>✨ 语义魔法的秘密</h3>
          <div className="principle-content">
            <p>词向量能够进行有意义的运算，是因为：</p>
            <ul>
              <li>相似的词在向量空间中位置接近</li>
              <li>语义关系可以用向量间的方向表示</li>
              <li>运算结果保持了语义的一致性</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const vectors = currentOperation.vectors;
  const v1 = vectors[0]; // 第一个词
  const v2 = vectors[1]; // 要减去的词  
  const v3 = vectors[2]; // 要加上的词
  const result = vectors[3]; // 结果

  return (
    <div className="math-principle-explanation">
      <div className="explanation-header">
        <h2>📚 数学原理解析</h2>
        <p>深入理解当前运算的数学过程</p>
      </div>

      <div className="principle-card">
        <h3>🔢 向量坐标</h3>
        <div className="vector-coordinates">
          <div className="coord-item">
            <span className="word-label add">{v1.word}</span>
            <span className="coord-value">({v1.x.toFixed(1)}, {v1.y.toFixed(1)}, {v1.z.toFixed(1)})</span>
          </div>
          <div className="coord-item">
            <span className="word-label subtract">{v2.word}</span>
            <span className="coord-value">({v2.x.toFixed(1)}, {v2.y.toFixed(1)}, {v2.z.toFixed(1)})</span>
          </div>
          <div className="coord-item">
            <span className="word-label add">{v3.word}</span>
            <span className="coord-value">({v3.x.toFixed(1)}, {v3.y.toFixed(1)}, {v3.z.toFixed(1)})</span>
          </div>
          <div className="coord-item result">
            <span className="word-label result">{result.word}</span>
            <span className="coord-value">({result.x.toFixed(1)}, {result.y.toFixed(1)}, {result.z.toFixed(1)})</span>
          </div>
        </div>
      </div>

      <div className="principle-card">
        <h3>🧮 计算过程</h3>
        <div className="calculation-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <div className="step-title">起始向量</div>
              <div className="step-formula">
                <span className="formula-text">
                  {v1.word}: ({v1.x.toFixed(1)}, {v1.y.toFixed(1)}, {v1.z.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <div className="step-title">减去向量</div>
              <div className="step-formula">
                <span className="formula-text">
                  ({v1.x.toFixed(1)}, {v1.y.toFixed(1)}, {v1.z.toFixed(1)}) - ({v2.x.toFixed(1)}, {v2.y.toFixed(1)}, {v2.z.toFixed(1)}) = 
                  ({(v1.x - v2.x).toFixed(1)}, {(v1.y - v2.y).toFixed(1)}, {(v1.z - v2.z).toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <div className="step-title">加上向量</div>
              <div className="step-formula">
                <span className="formula-text">
                  ({(v1.x - v2.x).toFixed(1)}, {(v1.y - v2.y).toFixed(1)}, {(v1.z - v2.z).toFixed(1)}) + ({v3.x.toFixed(1)}, {v3.y.toFixed(1)}, {v3.z.toFixed(1)}) = 
                  ({(v1.x - v2.x + v3.x).toFixed(1)}, {(v1.y - v2.y + v3.y).toFixed(1)}, {(v1.z - v2.z + v3.z).toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          <div className="step result-step">
            <div className="step-number">✓</div>
            <div className="step-content">
              <div className="step-title">最终结果</div>
              <div className="step-formula">
                <span className="formula-text result-highlight">
                  {result.word}: ({result.x.toFixed(1)}, {result.y.toFixed(1)}, {result.z.toFixed(1)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="principle-card">
        <h3>🎯 语义解释</h3>
        <div className="semantic-explanation">
          <div className="semantic-item">
            <div className="semantic-icon">🔍</div>
            <div className="semantic-content">
              <div className="semantic-title">运算含义</div>
              <div className="semantic-text">
                {currentOperation.operation} = {currentOperation.result}
              </div>
              <div className="semantic-desc">
                通过向量运算，我们从"{v1.word}"出发，去除"{v2.word}"的特征，
                增加"{v3.word}"的特征，最终得到"{result.word}"
              </div>
            </div>
          </div>

          <div className="semantic-item">
            <div className="semantic-icon">⚡</div>
            <div className="semantic-content">
              <div className="semantic-title">数学魔法</div>
              <div className="semantic-desc">
                这种运算之所以有效，是因为词向量捕捉了词语间的语义关系。
                相同的语义关系在向量空间中表现为相同的方向和距离。
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSteps && (
        <div className="principle-card animation-info">
          <h3>🎬 3D可视化说明</h3>
          <div className="animation-description">
            <p>右侧3D可视化展示了向量运算的几何过程：</p>
            <ul>
              <li>🟢 <strong>绿色箭头：</strong> 第一个向量({v1.word})</li>
              <li>🔴 <strong>红色箭头：</strong> 减去的向量({v2.word})</li>
              <li>🟡 <strong>黄色箭头：</strong> 中间结果({v1.word}-{v2.word})</li>
              <li>🟣 <strong>紫色箭头：</strong> 加上的向量({v3.word})</li>
              <li>🔴 <strong>最终红色箭头：</strong> 运算结果({result.word})</li>
            </ul>
            <div className="coordinate-info">
              <h4>📐 3D坐标系统</h4>
              <p>X, Y, Z 三个维度分别代表不同的语义特征维度，向量在这个3D空间中的位置体现了词语的语义特征。</p>
            </div>
            <p className="tip">
              💡 通过拖拽可以旋转视角，观察向量如何在3D空间中一步步组合，最终指向正确的语义位置！
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathPrincipleExplanation;
