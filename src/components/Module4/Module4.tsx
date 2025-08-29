import React, { useState } from 'react';
import './Module4.css';
import WordInputSection from './WordInputSection';
import WordVisualization3D from './WordVisualization3D';
import WordCloudVisualization from './WordCloudVisualization';
import WordAnalysisPanel from './WordAnalysisPanel';

interface Module4Props {
  onBack: () => void;
  onComplete: () => void; // 完成所有模块，返回首页
}

export interface WordNode {
  id: string;
  word: string;
  category: string;
  position: { x: number; y: number; z: number };
  similarity: number;
  relevance: number;
  popularity: number;
  color: string;
  size: number;
  connections: string[];
  metadata: {
    description: string;
    tags: string[];
    price?: number;
    brand?: string;
    rating?: number;
    salesVolume?: number;
  };
}

export interface WordCluster {
  id: string;
  name: string;
  center: { x: number; y: number; z: number };
  words: WordNode[];
  color: string;
  radius: number;
  category: string;
}

export interface WordGenerationResult {
  inputWord: string;
  clusters: WordCluster[];
  totalWords: number;
  categories: string[];
  processingTime: number;
}

const Module4: React.FC<Module4Props> = ({ onBack, onComplete }) => {
  const [inputWord, setInputWord] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<WordGenerationResult | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordNode | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'cloud' | 'analysis'>('3d');
  const [animationSpeed, setAnimationSpeed] = useState(1);

    // 智能词汇生成算法
  const generateRelatedWords = async (word: string): Promise<void> => {
    setIsGenerating(true);
    setInputWord(word);

    const startTime = Date.now();

    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    const words = await expandWordAssociations(word);

    // 分析相似度分布（开发调试用）
    analyzeSimilarityDistribution(words);

    const clusters = await generateWordClusters(words, word);

    const processingTime = Date.now() - startTime;

    const result: WordGenerationResult = {
      inputWord: word,
      clusters,
      totalWords: clusters.reduce((sum, cluster) => sum + cluster.words.length, 0),
      categories: Array.from(new Set(clusters.map(cluster => cluster.category))),
      processingTime
    };
    
    setCurrentResult(result);
    setIsGenerating(false);
  };

  // 词汇扩展算法
  const expandWordAssociations = async (inputWord: string): Promise<WordNode[]> => {
    const productDatabase: { [key: string]: any } = {
      '手机': {
        direct: ['智能手机', '移动电话', '手机设备', '通讯设备', '移动终端', '手机产品', '便携电话', '无线电话'],
        brands: ['iPhone', '华为', '小米', '三星', 'OPPO', 'vivo', '一加', '魅族', 'Redmi', '荣耀', 'Realme'],
        categories: ['5G手机', '拍照手机', '游戏手机', '商务手机', '旗舰机', '入门机', '折叠屏', '全面屏手机'],
        features: ['摄像头', '屏幕', '电池', '处理器', '内存', '5G', '快充', '防水', '指纹识别', '人脸识别'],
        accessories: ['手机壳', '钢化膜', '充电器', '耳机', '数据线', '支架', '移动电源', '车载支架', '清洁套装', '手机链']
      },
      '电脑': {
        direct: ['个人电脑', '计算机', 'PC设备', '电脑设备', '计算设备', '数字设备', '办公设备', '电子设备'],
        brands: ['苹果', '联想', '惠普', '戴尔', '华硕', '微软', '宏碁', '神舟', 'MSI', '雷神', '机械革命'],
        categories: ['笔记本电脑', '台式电脑', '游戏电脑', '办公电脑', '设计电脑', '超极本', '工作站', '一体机'],
        features: ['CPU', 'GPU', '内存', '硬盘', '显示器', '散热系统', '键盘', '触控板', '续航', '接口'],
        accessories: ['鼠标', '键盘', '显示器', '音箱', '摄像头', '麦克风', '硬盘', '内存条', '散热器', '机械键盘']
      },
      '汽车': {
        direct: ['轿车', '车辆', '交通工具', '机动车', '私家车', '小汽车', '座驾', '代步工具'],
        brands: ['奔驰', '宝马', '奥迪', '大众', '丰田', '本田', '比亚迪', '特斯拉', '蔚来', '理想', '小鹏'],
        categories: ['新能源车', '燃油车', 'SUV', '轿车', '跑车', '商务车', '家用车', '豪华车'],
        features: ['发动机', '变速箱', '底盘', '车身', '内饰', '智能驾驶', '安全配置', '动力系统', '悬架', '制动'],
        accessories: ['轮胎', '机油', '车载充电器', '行车记录仪', '车膜', '脚垫', '座椅套', '香水', '导航', '音响']
      },
      '服装': {
        direct: ['衣服', '服饰', '衣物', '穿着', '服装用品', '时装', '衣着', '着装'],
        brands: ['优衣库', 'ZARA', 'H&M', '阿迪达斯', '耐克', '李宁', '安踏', '波司登', '太平鸟', '海澜之家'],
        categories: ['休闲装', '正装', '运动装', '内衣', '外套', '裙装', '裤装', '童装'],
        features: ['面料', '版型', '颜色', '尺码', '款式', '工艺', '舒适度', '透气性', '保暖性', '防水性'],
        accessories: ['鞋子', '帽子', '包包', '腰带', '围巾', '手套', '袜子', '领带', '胸针', '手表']
      },
      '书籍': {
        direct: ['图书', '读物', '书本', '文学作品', '出版物', '著作', '典籍', '文献'],
        brands: ['人民文学', '三联书店', '商务印书馆', '中华书局', '机械工业', '清华大学', '北京大学', '电子工业'],
        categories: ['小说', '散文', '诗歌', '传记', '历史', '科技', '教育', '儿童读物'],
        features: ['内容', '作者', '装帧', '印刷', '页数', '开本', '纸张', '字体', '排版', '插图'],
        accessories: ['书签', '护封', '书立', '书灯', '放大镜', '笔记本', '荧光笔', '书包', '书架', '阅读架']
      }
    };

    const baseWord = inputWord.toLowerCase();
    let associations = productDatabase[baseWord] || {
      // 高相似度：直接相关词汇
      direct: [
        inputWord + '产品', inputWord + '设备', inputWord + '系统', 
        inputWord + '器材', inputWord + '工具', inputWord + '机器'
      ],
      // 中高相似度：知名品牌
      brands: [
        '知名品牌', '国际品牌', '专业品牌', '高端品牌', 
        '行业领导者', '创新企业', '老牌厂商'
      ],
      // 中等相似度：产品类别
      categories: [
        inputWord + '类产品', '同类商品', '相关产品', '升级版', 
        '专业级', '商用级', '消费级', '入门级'
      ],
      // 中低相似度：产品特征
      features: [
        '质量', '性能', '功能', '设计', '外观', 
        '材质', '工艺', '技术', '创新', '实用性'
      ],
      // 低相似度：配件周边
      accessories: [
        '配件', '附件', '组件', '零件', '工具', 
        '说明书', '包装', '服务', '维护', '保养'
      ]
    };

    const allWords: WordNode[] = [];
    let idCounter = 0;

    const createWordNode = (word: string, category: string, similarity: number): WordNode => {
      const angle = (idCounter * 2.3) % (2 * Math.PI);
      const radius = 150 + Math.random() * 100;
      const height = (Math.random() - 0.5) * 200;
      
      return {
        id: `word_${idCounter++}`,
        word,
        category,
        position: {
          x: Math.cos(angle) * radius,
          y: height,
          z: Math.sin(angle) * radius
        },
        similarity,
        relevance: similarity * (0.7 + Math.random() * 0.3),
        popularity: Math.random(),
        color: getCategoryColor(category),
        size: 4 + similarity * 8,
        connections: [],
        metadata: {
          description: `与"${inputWord}"相关的${category}`,
          tags: [category, inputWord],
          rating: 3.5 + Math.random() * 1.5
        }
      };
    };

    // 重新设计相似度分配逻辑，确保逻辑性
    const wordCategories = [
      { key: 'direct', name: '直接相关', baseWeight: 0.85, variance: 0.1 }, // 高相似度：0.75-0.95
      { key: 'brands', name: '相关品牌', baseWeight: 0.75, variance: 0.15 }, // 高-中相似度：0.6-0.9
      { key: 'categories', name: '产品类别', baseWeight: 0.65, variance: 0.15 }, // 中相似度：0.5-0.8
      { key: 'features', name: '产品特征', baseWeight: 0.55, variance: 0.2 }, // 中-低相似度：0.35-0.75
      { key: 'accessories', name: '配件周边', baseWeight: 0.35, variance: 0.2 } // 低相似度：0.15-0.55
    ];

    wordCategories.forEach(({ key, name, baseWeight, variance }) => {
      if (associations[key]) {
        associations[key].forEach((word: string, index: number) => {
          // 基于词汇在数组中的位置和随机因子计算相似度
          const positionFactor = 1 - (index / associations[key].length) * 0.3; // 前面的词汇相似度更高
          const randomFactor = (Math.random() - 0.5) * variance;
          const similarity = Math.max(0.1, Math.min(0.95, baseWeight * positionFactor + randomFactor));
          
          allWords.push(createWordNode(word, name, similarity));
        });
      }
    });

    return allWords;
  };

  // 相似度分析和验证函数
  const analyzeSimilarityDistribution = (words: WordNode[]): void => {
    const highSim = words.filter(w => w.similarity >= 0.7);
    const mediumSim = words.filter(w => w.similarity >= 0.4 && w.similarity < 0.7);
    const lowSim = words.filter(w => w.similarity < 0.4);
    
    console.log(`=== 词汇相似度分析 ===`);
    console.log(`总词汇数: ${words.length}`);
    console.log(`高相似度 (≥0.7): ${highSim.length}个`);
    console.log(`中相似度 (0.4-0.7): ${mediumSim.length}个`);
    console.log(`低相似度 (<0.4): ${lowSim.length}个`);
    
    console.log(`\n高相似度词汇:`, highSim.map(w => `${w.word}(${w.similarity.toFixed(2)})`));
    console.log(`中相似度词汇:`, mediumSim.map(w => `${w.word}(${w.similarity.toFixed(2)})`));
    console.log(`低相似度词汇:`, lowSim.map(w => `${w.word}(${w.similarity.toFixed(2)})`));
  };

  // 生成词汇聚类 - 按相似度分类
  const generateWordClusters = async (words: WordNode[], inputWord: string): Promise<WordCluster[]> => {
    // 按相似度分为三个类别
    const highSimilarity = words.filter(word => word.similarity >= 0.7);
    const mediumSimilarity = words.filter(word => word.similarity >= 0.4 && word.similarity < 0.7);
    const lowSimilarity = words.filter(word => word.similarity < 0.4);
    
    const similarityGroups = [
      { words: highSimilarity, category: '高相似度', color: '#ef4444' },
      { words: mediumSimilarity, category: '中等相似度', color: '#f59e0b' },
      { words: lowSimilarity, category: '低相似度', color: '#10b981' }
    ];
    
    return similarityGroups
      .filter(group => group.words.length > 0) // 只包含有词汇的分组
      .map((group, index) => {
        const center = group.words.reduce(
          (acc, word) => ({
            x: acc.x + word.position.x,
            y: acc.y + word.position.y,
            z: acc.z + word.position.z
          }),
          { x: 0, y: 0, z: 0 }
        );
        
        if (group.words.length > 0) {
          center.x /= group.words.length;
          center.y /= group.words.length;
          center.z /= group.words.length;
        }

        // 重新定位词汇位置
        group.words.forEach((word, wordIndex) => {
          const angle = (wordIndex / group.words.length) * 2 * Math.PI;
          const radius = 30 + Math.random() * 40;
          word.position.x = center.x + Math.cos(angle) * radius;
          word.position.z = center.z + Math.sin(angle) * radius;
          word.color = group.color; // 使用相似度分组的颜色
        });

        return {
          id: `similarity_cluster_${index}`,
          name: group.category,
          center,
          words: group.words,
          color: group.color,
          radius: 60 + group.words.length * 5,
          category: group.category
        };
      });
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      '高相似度': '#ef4444',
      '中等相似度': '#f59e0b',
      '低相似度': '#10b981',
      // 兼容旧的产品分类
      '直接相关': '#ff6b6b',
      '产品特征': '#4ecdc4',
      '相关品牌': '#45b7d1',
      '配件周边': '#96ceb4',
      '产品类别': '#feca57'
    };
    return colorMap[category] || '#666';
  };

  const handleWordSubmit = (word: string) => {
    generateRelatedWords(word);
  };

  const handleWordSelect = (word: WordNode) => {
    setSelectedWord(word);
  };

  return (
    <div className="module4-container">
      <header className="app-header module4-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← 返回
          </button>
          <div className="header-text">
            <h1>模块四：智能商品词汇宇宙</h1>
            <p>输入关键词，自动生成相关商品词汇并在3D空间中可视化展示</p>
          </div>
          <button className="complete-btn" onClick={onComplete}>
            🎉 完成学习
          </button>
          <div className="header-controls">
            <div className="view-mode-selector">
              <button 
                className={`view-btn ${viewMode === '3d' ? 'active' : ''}`}
                onClick={() => setViewMode('3d')}
              >
                🌌 3D空间
              </button>
              <button 
                className={`view-btn ${viewMode === 'cloud' ? 'active' : ''}`}
                onClick={() => setViewMode('cloud')}
              >
                ☁️ 词云图
              </button>
              <button 
                className={`view-btn ${viewMode === 'analysis' ? 'active' : ''}`}
                onClick={() => setViewMode('analysis')}
              >
                📊 分析面板
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="module4-main">
        <div className="left-panel">
          <WordInputSection
            onWordSubmit={handleWordSubmit}
            isGenerating={isGenerating}
            currentWord={inputWord}
            result={currentResult}
          />
        </div>
        
        <div className="right-panel">
          {viewMode === '3d' && (
            <WordVisualization3D
              result={currentResult}
              selectedWord={selectedWord}
              onWordSelect={handleWordSelect}
              animationSpeed={animationSpeed}
              isGenerating={isGenerating}
            />
          )}
          
          {viewMode === 'cloud' && (
            <WordCloudVisualization
              result={currentResult}
              selectedWord={selectedWord}
              onWordSelect={handleWordSelect}
            />
          )}
          
          {viewMode === 'analysis' && (
            <WordAnalysisPanel
              result={currentResult}
              selectedWord={selectedWord}
              onAnimationSpeedChange={setAnimationSpeed}
              animationSpeed={animationSpeed}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Module4;
