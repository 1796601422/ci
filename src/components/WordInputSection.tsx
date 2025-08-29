import React from 'react';
import './WordInputSection.css';

interface WordInputSectionProps {
  currentWord: string;
  onWordChange: (word: string) => void;
}

const WordInputSection: React.FC<WordInputSectionProps> = ({
  currentWord,
  onWordChange
}) => {
  const suggestedWords = [
    '苹果', '快乐', '友谊', '阳光', '书籍', '大海',
    '温暖', '勇敢', '梦想', '希望', '智慧', '自由',
    '音乐', '星空', '花朵', '微笑', '彩虹', '爱情',
    '小狗', '孙悟空', '猪八戒', '曹操', '刘备', '林黛玉', 
    '贾宝玉', '武松', '李逵'
  ];

  return (
    <div className="module1-word-input-section">
      <h2>🎯 选择一个词语</h2>
      <p className="section-description">
        选择或输入一个词语，然后我们一起探索它的特征！
      </p>
      
      <div className="input-container">
        <input
          type="text"
          value={currentWord}
          onChange={(e) => onWordChange(e.target.value)}
          placeholder="输入一个词语..."
          className="word-input"
        />
      </div>
      
      <div className="suggested-words">
        <p className="suggested-label">或者选择一个推荐词语：</p>
        <div className="word-buttons">
          {suggestedWords.map((word) => (
            <button
              key={word}
              onClick={() => onWordChange(word)}
              className={`word-button ${currentWord === word ? 'active' : ''}`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      
      {currentWord && (
        <div className="current-word-display">
          <p>当前词语：<span className="highlight-word">{currentWord}</span></p>
        </div>
      )}
    </div>
  );
};

export default WordInputSection;
