import React, { useState } from 'react';
import './Module2.css';
import WordSelection3D from './WordSelection3D';
import SpaceVisualization3D from './SpaceVisualization3D';
import SimilarityExplanation from './SimilarityExplanation';

interface Module2Props {
  onBack: () => void;
  onNext: () => void;
}

const Module2: React.FC<Module2Props> = ({ onBack, onNext }) => {
  const [centerWord, setCenterWord] = useState<string>('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  return (
    <div className="module2-container">
      <header className="module2-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← 返回
          </button>
          <div className="header-text">
            <h1>🌐 词语的3D空间关系</h1>
            <p>模块二：探索词语在三维空间中的位置关系</p>
          </div>
          <button className="next-btn" onClick={onNext}>
            下一个模块 →
          </button>
        </div>
      </header>
      
      <main className="module2-main">
        <div className="module2-left">
          <WordSelection3D 
            centerWord={centerWord}
            onCenterWordChange={setCenterWord}
            selectedWords={selectedWords}
            onSelectedWordsChange={setSelectedWords}
          />
          <SimilarityExplanation 
            centerWord={centerWord}
            selectedWords={selectedWords}
          />
        </div>
        
        <div className="module2-right">
          <SpaceVisualization3D 
            centerWord={centerWord}
            selectedWords={selectedWords}
          />
        </div>
      </main>
    </div>
  );
};

export default Module2;
