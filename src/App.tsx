import React, { useState } from 'react';
import './App.css';
import ModuleNavigation from './components/ModuleNavigation';
import IntroductionPanel from './components/IntroductionPanel';
import WordInputSection from './components/WordInputSection';
import FeatureControlsSection from './components/FeatureControlsSection';
import VectorVisualizationSection from './components/VectorVisualizationSection';
import Module2 from './components/Module2/Module2';
import Module3 from './components/Module3/Module3';
import Module4 from './components/Module4/Module4';
import { WordFeatures } from './types';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<number>(0); // 0 = 导航, 1 = 模块1, 2 = 模块2, 3 = 模块3, 4 = 模块4
  const [currentWord, setCurrentWord] = useState<string>('');
  const [features, setFeatures] = useState<WordFeatures>({
    color: 5,      // 颜色强度 (0-10)
    size: 5,       // 大小 (0-10)
    emotion: 5,    // 情感 (0-10, 0=负面, 10=正面)
    abstract: 5,   // 抽象程度 (0-10, 0=具体, 10=抽象)
    frequency: 5   // 使用频率 (0-10)
  });

  // 显示模块导航 - 新的左右布局
  if (currentModule === 0) {
    return (
      <div className="container homepage-container">
        <div className="homepage-left">
          <ModuleNavigation 
            currentModule={currentModule}
            onModuleChange={setCurrentModule}
          />
        </div>
        <div className="homepage-right">
          <IntroductionPanel />
        </div>
      </div>
    );
  }

  // 模块一：词语转向量
  if (currentModule === 1) {
    return (
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <button 
              className="back-btn"
              onClick={() => setCurrentModule(0)}
            >
              ← 返回
            </button>
            <div className="header-text">
              <h1>词向量探索实验室</h1>
              <p>模块一：词语如何转化为数学向量</p>
            </div>
            <button 
              className="next-btn"
              onClick={() => setCurrentModule(2)}
            >
              下一个模块 →
            </button>
          </div>
        </header>
        
        <main className="app-main">
          <div className="left-panel">
            <WordInputSection 
              currentWord={currentWord}
              onWordChange={setCurrentWord}
            />
            <FeatureControlsSection 
              features={features}
              onFeaturesChange={setFeatures}
              currentWord={currentWord}
            />
          </div>
          
          <div className="right-panel">
            <VectorVisualizationSection 
              features={features}
              currentWord={currentWord}
            />
          </div>
        </main>
      </div>
    );
  }

    // 模块二：3D空间关系
  if (currentModule === 2) {
    return (
      <div className="container">
        <Module2 
          onBack={() => setCurrentModule(0)} 
          onNext={() => setCurrentModule(3)}
        />
      </div>
    );
  }

  // 模块三：词向量运算
  if (currentModule === 3) {
    return (
      <div className="container">
        <Module3 
          onBack={() => setCurrentModule(0)} 
          onNext={() => setCurrentModule(4)}
        />
      </div>
    );
  }

  // 模块四：智能商品推荐
  if (currentModule === 4) {
    return (
      <div className="container">
        <Module4 
          onBack={() => setCurrentModule(0)} 
          onComplete={() => setCurrentModule(0)}
        />
      </div>
    );
  }

  return null;
};

export default App;
