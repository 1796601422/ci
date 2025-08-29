import React, { useState, useEffect } from 'react';
import './IntroductionPanel.css';

const IntroductionPanel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      title: '什么是词向量？',
      content: '词向量是将文字转换为数学向量的技术，让计算机能够理解和处理人类语言。',
      animation: 'word-to-vector',
      icon: '📝➡️🔢'
    },
    {
      title: '为什么需要词向量？',
      content: '计算机只能理解数字，而人类使用文字交流。词向量架起了这座桥梁。',
      animation: 'bridge',
      icon: '🤖💬👨'
    },
    {
      title: '词向量的应用',
      content: '搜索引擎、机器翻译、智能客服、推荐系统等都离不开词向量技术。',
      animation: 'applications',
      icon: '🔍🔄🤖🛒'
    },
    {
      title: '开始探索',
      content: '通过四个互动模块，体验词向量的神奇世界，理解AI如何理解语言。',
      animation: 'exploration',
      icon: '🎯🚀✨'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSlideChange = (index: number) => {
    if (index !== currentSlide) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="introduction-panel">
      {/* 主标题区域 */}
      <div className="intro-header">
        <div className="title-animation">
          <h1 className="main-title">
            <span className="title-icon">🎓</span>
            <span className="title-text">词向量探索实验室</span>
          </h1>
          <div className="subtitle-container">
            <p className="subtitle">让AI理解语言的魔法</p>
            <div className="magic-particles">
              <span className="particle">✨</span>
              <span className="particle">💫</span>
              <span className="particle">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* 动态内容展示区域 */}
      <div className="intro-content">
        <div className={`slide-container ${isAnimating ? 'animating' : ''}`}>
          <div className="slide-header">
            <div className="slide-icon">
              {slides[currentSlide].icon}
            </div>
            <h2 className="slide-title">{slides[currentSlide].title}</h2>
          </div>
          
          <div className="slide-content">
            <p>{slides[currentSlide].content}</p>
          </div>

          {/* 动画演示区域 */}
          <div className="animation-area">
            <div className={`animation ${slides[currentSlide].animation}`}>
              {slides[currentSlide].animation === 'word-to-vector' && (
                <div className="word-vector-demo">
                  <div className="word-input">
                    <span className="demo-word">苹果</span>
                  </div>
                  <div className="arrow">→</div>
                  <div className="vector-output">
                    <span className="vector">[0.2, -0.1, 0.8, 0.3, ...]</span>
                  </div>
                </div>
              )}
              
              {slides[currentSlide].animation === 'bridge' && (
                <div className="bridge-demo">
                  <div className="human-side">
                    <span className="emoji">👨</span>
                    <span className="text">文字</span>
                  </div>
                  <div className="bridge-animation">
                    <div className="bridge">
                      <span>词向量</span>
                    </div>
                  </div>
                  <div className="computer-side">
                    <span className="emoji">🤖</span>
                    <span className="text">数字</span>
                  </div>
                </div>
              )}
              
              {slides[currentSlide].animation === 'applications' && (
                <div className="applications-demo">
                  <div className="app-grid">
                    <div className="app-item">🔍<br/>搜索</div>
                    <div className="app-item">🔄<br/>翻译</div>
                    <div className="app-item">🤖<br/>客服</div>
                    <div className="app-item">🛒<br/>推荐</div>
                  </div>
                </div>
              )}
              
              {slides[currentSlide].animation === 'exploration' && (
                <div className="exploration-demo">
                  <div className="journey-path">
                    <div className="step">📝<br/>模块1</div>
                    <div className="path-line"></div>
                    <div className="step">🌐<br/>模块2</div>
                    <div className="path-line"></div>
                    <div className="step">🧮<br/>模块3</div>
                    <div className="path-line"></div>
                    <div className="step">🛍️<br/>模块4</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 轮播指示器 */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      </div>

      {/* 特性亮点 */}
      <div className="features-highlight">
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <div className="feature-text">
            <strong>互动学习</strong>
            <br/>通过实际操作理解概念
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">📊</div>
          <div className="feature-text">
            <strong>可视化展示</strong>
            <br/>3D图表直观呈现
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">🚀</div>
          <div className="feature-text">
            <strong>实际应用</strong>
            <br/>体验真实场景案例
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="bottom-hint">
        <div className="hint-content">
          <span className="hint-icon">👈</span>
          <span className="hint-text">选择左侧模块开始学习之旅</span>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPanel;