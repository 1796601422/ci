import React from 'react';
import './ModuleNavigation.css';

interface ModuleNavigationProps {
  currentModule: number;
  onModuleChange: (module: number) => void;
}

const ModuleNavigation: React.FC<ModuleNavigationProps> = ({
  currentModule,
  onModuleChange
}) => {
  const modules = [
    {
      id: 1,
      title: '模块一：词语转向量',
      description: '了解词语如何转化为数学向量',
      icon: '🔧'
    },
    {
      id: 2,
      title: '模块二：3D空间关系',
      description: '探索词语在三维空间中的位置关系',
      icon: '🌐'
    },
    {
      id: 3,
      title: '模块三：向量运算',
      description: '学习向量运算如何体现语义关系',
      icon: '🧮',
      disabled: false
    },
    {
      id: 4,
      title: '模块四：智能商品推荐',
      description: '体验词向量在电商推荐系统中的实际应用',
      icon: '🛍️',
      disabled: false
    }
  ];

  return (
    <div className="module-navigation">
      <div className="nav-header">
        <h2>🎓 词向量探索实验室</h2>
        <p>选择一个模块开始学习</p>
      </div>
      
      <div className="nav-modules">
        {modules.map((module) => (
          <button
            key={module.id}
            className={`nav-module ${currentModule === module.id ? 'active' : ''} ${module.disabled ? 'disabled' : ''}`}
            onClick={() => !module.disabled && onModuleChange(module.id)}
            disabled={module.disabled}
          >
            <div className="module-icon">{module.icon}</div>
            <div className="module-content">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </div>
            {module.disabled && <span className="coming-soon">敬请期待</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuleNavigation;
