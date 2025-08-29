import React, { useEffect, useRef, useState, useCallback } from 'react';
import './SpaceVisualization3D.css';

interface SpaceVisualization3DProps {
  centerWord: string;
  selectedWords: string[];
}

interface WordPosition {
  word: string;
  x: number;
  y: number;
  z: number;
  similarity: number;
  isRelated: boolean;
}

const SpaceVisualization3D: React.FC<SpaceVisualization3DProps> = ({
  centerWord,
  selectedWords
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [animationTime, setAnimationTime] = useState(0);
  const [wordsAppearProgress, setWordsAppearProgress] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [stars, setStars] = useState<Array<{x: number, y: number, size: number, opacity: number, twinkleSpeed: number}>>([]);
  const animationFrameRef = useRef<number>();

  // 预定义的词语相似性关系
  const similarityData: Record<string, Record<string, number>> = {
    '国王': {
      // 相关词语 (高相似性)
      '王后': 0.9, '城堡': 0.8, '皇冠': 0.85, '权力': 0.75, '统治': 0.7, '贵族': 0.65, '王子': 0.8, '公主': 0.8,
      '王国': 0.85, '君主': 0.9, '宝座': 0.75, '王室': 0.8, '骑士': 0.7, '大臣': 0.6, '宫殿': 0.75, '帝王': 0.85, '皇室': 0.8, '臣民': 0.6,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.15, '数字': 0.05, '颜色': 0.1, '声音': 0.05, '时间': 0.2, '空间': 0.15, '方向': 0.1,
      '机器': 0.05, '电脑': 0.1, '水果': 0.05, '天气': 0.1, '月亮': 0.15, '星星': 0.1, '汽车': 0.05, '飞机': 0.05, '树木': 0.1, '花朵': 0.2, '建筑': 0.3, '金属': 0.05
    },
    '医生': {
      // 相关词语 (高相似性)
      '护士': 0.85, '医院': 0.9, '病人': 0.8, '手术': 0.75, '药物': 0.7, '治疗': 0.8, '健康': 0.85, '诊断': 0.7,
      '医疗': 0.9, '救护': 0.8, '病房': 0.85, '医师': 0.95, '临床': 0.75, '处方': 0.7, '康复': 0.75, '医学': 0.85, '疗法': 0.8, '检查': 0.75,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '数字': 0.15, '颜色': 0.05, '声音': 0.1, '时间': 0.2, '空间': 0.1, '方向': 0.05,
      '机器': 0.2, '电脑': 0.25, '水果': 0.1, '天气': 0.05, '月亮': 0.05, '星星': 0.05, '汽车': 0.1, '飞机': 0.05, '树木': 0.05, '花朵': 0.05, '建筑': 0.15, '金属': 0.1
    },
    '学校': {
      // 相关词语 (高相似性)
      '老师': 0.9, '学生': 0.9, '教室': 0.85, '书本': 0.8, '考试': 0.75, '学习': 0.85, '知识': 0.8, '课程': 0.8,
      '校园': 0.9, '教育': 0.9, '作业': 0.8, '同学': 0.85, '讲台': 0.75, '黑板': 0.7, '笔记': 0.7, '毕业': 0.8, '上课': 0.85, '教学': 0.85,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.2, '数字': 0.25, '颜色': 0.1, '声音': 0.15, '时间': 0.3, '空间': 0.2, '方向': 0.1,
      '机器': 0.1, '电脑': 0.4, '水果': 0.05, '天气': 0.05, '月亮': 0.05, '星星': 0.05, '汽车': 0.1, '飞机': 0.05, '树木': 0.1, '花朵': 0.1, '建筑': 0.5, '金属': 0.1
    },
    '快乐': {
      // 相关词语 (高相似性)
      '开心': 0.95, '笑容': 0.85, '喜悦': 0.9, '幸福': 0.9, '愉快': 0.85, '高兴': 0.9, '欢乐': 0.85, '满足': 0.8,
      '快活': 0.9, '兴奋': 0.85, '愉悦': 0.9, '欢喜': 0.85, '乐趣': 0.8, '甜蜜': 0.75, '舒心': 0.8, '畅快': 0.85, '欣喜': 0.9, '陶醉': 0.75,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.05, '数字': 0.05, '颜色': 0.2, '声音': 0.3, '时间': 0.1, '空间': 0.05, '方向': 0.05,
      '机器': 0.05, '电脑': 0.05, '水果': 0.2, '天气': 0.3, '月亮': 0.2, '星星': 0.25, '汽车': 0.1, '飞机': 0.15, '树木': 0.25, '花朵': 0.4, '建筑': 0.1, '金属': 0.05
    },
    '美丽': {
      // 相关词语 (高相似性)
      '漂亮': 0.95, '优雅': 0.85, '迷人': 0.9, '动人': 0.85, '秀丽': 0.9, '华丽': 0.8, '精美': 0.85, '绚丽': 0.85,
      '俊美': 0.9, '典雅': 0.85, '娇美': 0.9, '端庄': 0.8, '清秀': 0.85, '靓丽': 0.9, '风雅': 0.8, '秀美': 0.9, '妩媚': 0.85, '娇艳': 0.85,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.1, '数字': 0.05, '颜色': 0.6, '声音': 0.2, '时间': 0.1, '空间': 0.15, '方向': 0.05,
      '机器': 0.05, '电脑': 0.05, '水果': 0.3, '天气': 0.4, '月亮': 0.6, '星星': 0.7, '汽车': 0.2, '飞机': 0.15, '树木': 0.5, '花朵': 0.8, '建筑': 0.4, '金属': 0.1
    },
    '跑步': {
      // 相关词语 (高相似性)
      '奔跑': 0.95, '运动': 0.9, '健身': 0.85, '锻炼': 0.85, '速度': 0.8, '体育': 0.85, '竞赛': 0.8, '马拉松': 0.9,
      '慢跑': 0.9, '冲刺': 0.85, '赛跑': 0.9, '田径': 0.85, '训练': 0.8, '健康': 0.7, '耐力': 0.8, '跨步': 0.8, '疾跑': 0.9, '长跑': 0.9,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '数字': 0.15, '颜色': 0.05, '声音': 0.15, '时间': 0.3, '空间': 0.4, '方向': 0.6,
      '机器': 0.1, '电脑': 0.05, '水果': 0.1, '天气': 0.2, '月亮': 0.05, '星星': 0.05, '汽车': 0.3, '飞机': 0.2, '树木': 0.2, '花朵': 0.1, '建筑': 0.1, '金属': 0.05
    },
    '音乐': {
      // 相关词语 (高相似性)
      '歌曲': 0.95, '乐器': 0.9, '旋律': 0.9, '节拍': 0.85, '演奏': 0.9, '歌声': 0.9, '作曲': 0.85, '音符': 0.85,
      '和声': 0.8, '乐队': 0.85, '歌手': 0.85, '钢琴': 0.8, '吉他': 0.8, '小提琴': 0.8, '合唱': 0.85, '音响': 0.75, '录音': 0.75, '演唱': 0.9,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '数字': 0.1, '颜色': 0.2, '声音': 0.6, '时间': 0.3, '空间': 0.2, '方向': 0.05,
      '机器': 0.2, '电脑': 0.3, '水果': 0.05, '天气': 0.1, '月亮': 0.3, '星星': 0.3, '汽车': 0.1, '飞机': 0.1, '树木': 0.1, '花朵': 0.2, '建筑': 0.2, '金属': 0.1
    },
    '家庭': {
      // 相关词语 (高相似性)
      '父母': 0.9, '孩子': 0.9, '兄弟': 0.85, '姐妹': 0.85, '亲情': 0.95, '家人': 0.95, '温暖': 0.8, '团聚': 0.85,
      '爱心': 0.8, '照顾': 0.8, '陪伴': 0.8, '关怀': 0.8, '守护': 0.75, '传承': 0.7, '血缘': 0.85, '亲人': 0.9, '家族': 0.85, '和睦': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.2, '数字': 0.1, '颜色': 0.1, '声音': 0.15, '时间': 0.4, '空间': 0.3, '方向': 0.05,
      '机器': 0.1, '电脑': 0.15, '水果': 0.2, '天气': 0.2, '月亮': 0.2, '星星': 0.2, '汽车': 0.3, '飞机': 0.1, '树木': 0.2, '花朵': 0.3, '建筑': 0.6, '金属': 0.1
    },
    '科技': {
      // 相关词语 (高相似性)
      '电脑': 0.9, '手机': 0.9, '互联网': 0.85, '人工智能': 0.9, '编程': 0.85, '数据': 0.8, '创新': 0.8, '发明': 0.8,
      '软件': 0.85, '硬件': 0.85, '网络': 0.8, '算法': 0.8, '芯片': 0.85, '应用': 0.75, '数字': 0.7, '智能': 0.85, '技术': 0.95, '科学': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '颜色': 0.1, '声音': 0.2, '时间': 0.2, '空间': 0.2, '方向': 0.1,
      '水果': 0.05, '天气': 0.1, '月亮': 0.1, '星星': 0.15, '汽车': 0.4, '飞机': 0.4, '树木': 0.05, '花朵': 0.05, '建筑': 0.3, '金属': 0.3
    },
    '旅行': {
      // 相关词语 (高相似性)
      '出游': 0.95, '风景': 0.85, '探索': 0.8, '冒险': 0.8, '景点': 0.9, '旅游': 0.95, '度假': 0.85, '背包': 0.8,
      '酒店': 0.8, '机票': 0.85, '护照': 0.85, '文化': 0.7, '体验': 0.8, '放松': 0.75, '拍照': 0.8, '纪念': 0.75, '旅程': 0.9, '远方': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.1, '数字': 0.1, '颜色': 0.3, '声音': 0.2, '时间': 0.4, '空间': 0.5, '方向': 0.6,
      '机器': 0.1, '电脑': 0.2, '水果': 0.2, '天气': 0.4, '月亮': 0.3, '星星': 0.3, '汽车': 0.6, '飞机': 0.8, '树木': 0.4, '花朵': 0.3, '建筑': 0.5, '金属': 0.1
    },
    '美食': {
      // 相关词语 (高相似性)
      '料理': 0.9, '烹饪': 0.9, '食材': 0.85, '味道': 0.9, '餐厅': 0.8, '厨师': 0.85, '菜谱': 0.8, '香味': 0.85,
      '营养': 0.75, '品尝': 0.9, '食谱': 0.8, '佳肴': 0.9, '美味': 0.95, '口感': 0.9, '烹调': 0.85, '饮食': 0.85, '食物': 0.9, '享受': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.15, '数字': 0.05, '颜色': 0.3, '声音': 0.2, '时间': 0.2, '空间': 0.1, '方向': 0.05,
      '机器': 0.2, '电脑': 0.1, '水果': 0.6, '天气': 0.1, '月亮': 0.05, '星星': 0.05, '汽车': 0.05, '飞机': 0.05, '树木': 0.2, '花朵': 0.2, '建筑': 0.3, '金属': 0.15
    },
    '阅读': {
      // 相关词语 (高相似性)
      '书籍': 0.95, '文字': 0.9, '知识': 0.85, '故事': 0.85, '作者': 0.8, '小说': 0.85, '文学': 0.85, '思考': 0.8,
      '智慧': 0.8, '学习': 0.85, '理解': 0.8, '想象': 0.75, '启发': 0.8, '感悟': 0.75, '书页': 0.9, '图书': 0.9, '文章': 0.85, '经典': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.2, '数字': 0.3, '颜色': 0.1, '声音': 0.1, '时间': 0.4, '空间': 0.2, '方向': 0.05,
      '机器': 0.1, '电脑': 0.4, '水果': 0.05, '天气': 0.1, '月亮': 0.2, '星星': 0.2, '汽车': 0.05, '飞机': 0.05, '树木': 0.1, '花朵': 0.1, '建筑': 0.2, '金属': 0.05
    },
    '海洋': {
      // 相关词语 (高相似性)
      '大海': 0.95, '波浪': 0.9, '海水': 0.95, '海岸': 0.85, '沙滩': 0.8, '鱼类': 0.8, '海豚': 0.85, '珊瑚': 0.8,
      '潮汐': 0.85, '深蓝': 0.8, '海风': 0.8, '海鸟': 0.75, '船只': 0.75, '航海': 0.8, '海底': 0.85, '贝壳': 0.8, '海藻': 0.8, '浪花': 0.85,
      // 无关词语 (低相似性)
      '石头': 0.2, '椅子': 0.05, '数字': 0.05, '颜色': 0.4, '声音': 0.3, '时间': 0.2, '空间': 0.4, '方向': 0.3,
      '机器': 0.05, '电脑': 0.05, '水果': 0.1, '天气': 0.4, '月亮': 0.4, '星星': 0.4, '汽车': 0.05, '飞机': 0.1, '树木': 0.1, '花朵': 0.2, '建筑': 0.1, '金属': 0.1
    },
    '森林': {
      // 相关词语 (高相似性)
      '树木': 0.95, '绿叶': 0.9, '小鸟': 0.85, '动物': 0.85, '空气': 0.8, '阳光': 0.75, '露水': 0.8, '树林': 0.95,
      '野花': 0.85, '蘑菇': 0.8, '松果': 0.8, '溪流': 0.8, '清新': 0.85, '自然': 0.9, '徒步': 0.75, '野营': 0.8, '生态': 0.85, '氧气': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.3, '椅子': 0.05, '数字': 0.05, '颜色': 0.4, '声音': 0.4, '时间': 0.2, '空间': 0.4, '方向': 0.3,
      '机器': 0.05, '电脑': 0.05, '水果': 0.3, '天气': 0.5, '月亮': 0.3, '星星': 0.3, '汽车': 0.05, '飞机': 0.05, '花朵': 0.7, '建筑': 0.1, '金属': 0.05
    },
    '城市': {
      // 相关词语 (高相似性)
      '高楼': 0.9, '街道': 0.9, '交通': 0.85, '人群': 0.85, '繁华': 0.85, '商店': 0.8, '地铁': 0.8, '公园': 0.7,
      '广场': 0.8, '霓虹': 0.8, '建筑': 0.9, '市民': 0.85, '生活': 0.8, '文化': 0.7, '现代': 0.8, '都市': 0.95, '车辆': 0.8, '社区': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.2, '椅子': 0.1, '数字': 0.2, '颜色': 0.3, '声音': 0.4, '时间': 0.3, '空间': 0.4, '方向': 0.4,
      '机器': 0.3, '电脑': 0.3, '水果': 0.1, '天气': 0.2, '月亮': 0.2, '星星': 0.2, '汽车': 0.7, '飞机': 0.3, '树木': 0.3, '花朵': 0.2, '金属': 0.4
    },
    '时间': {
      // 相关词语 (高相似性)
      '钟表': 0.85, '岁月': 0.9, '历史': 0.8, '未来': 0.85, '过去': 0.85, '现在': 0.85, '秒钟': 0.9, '分钟': 0.9,
      '小时': 0.85, '日子': 0.8, '年华': 0.85, '永恒': 0.8, '瞬间': 0.8, '流逝': 0.85, '记忆': 0.75, '变化': 0.75, '节奏': 0.7, '时光': 0.9,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.1, '数字': 0.4, '颜色': 0.1, '声音': 0.2, '空间': 0.3, '方向': 0.2,
      '机器': 0.2, '电脑': 0.3, '水果': 0.05, '天气': 0.3, '月亮': 0.3, '星星': 0.3, '汽车': 0.2, '飞机': 0.2, '树木': 0.2, '花朵': 0.1, '建筑': 0.2, '金属': 0.1
    },
    '梦想': {
      // 相关词语 (高相似性)
      '理想': 0.95, '希望': 0.9, '目标': 0.85, '追求': 0.9, '奋斗': 0.85, '成功': 0.8, '实现': 0.85, '愿望': 0.9,
      '抱负': 0.85, '志向': 0.85, '努力': 0.8, '坚持': 0.8, '信念': 0.8, '未来': 0.8, '激情': 0.8, '勇气': 0.75, '创造': 0.75, '超越': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.05, '数字': 0.1, '颜色': 0.2, '声音': 0.2, '时间': 0.4, '空间': 0.3, '方向': 0.3,
      '机器': 0.1, '电脑': 0.1, '水果': 0.05, '天气': 0.2, '月亮': 0.4, '星星': 0.5, '汽车': 0.1, '飞机': 0.2, '树木': 0.1, '花朵': 0.3, '建筑': 0.2, '金属': 0.05
    },
    '友谊': {
      // 相关词语 (高相似性)
      '朋友': 0.95, '伙伴': 0.9, '信任': 0.85, '分享': 0.8, '陪伴': 0.85, '支持': 0.8, '理解': 0.8, '关心': 0.85,
      '真诚': 0.85, '忠诚': 0.8, '互助': 0.8, '温暖': 0.75, '珍贵': 0.8, '永恒': 0.75, '回忆': 0.75, '默契': 0.8, '情谊': 0.9, '纯真': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.05, '数字': 0.05, '颜色': 0.2, '声音': 0.3, '时间': 0.4, '空间': 0.2, '方向': 0.05,
      '机器': 0.05, '电脑': 0.1, '水果': 0.1, '天气': 0.1, '月亮': 0.2, '星星': 0.2, '汽车': 0.05, '飞机': 0.05, '树木': 0.1, '花朵': 0.3, '建筑': 0.1, '金属': 0.05
    },
    '春天': {
      // 相关词语 (高相似性)
      '花朵': 0.9, '绿芽': 0.9, '温暖': 0.8, '生机': 0.85, '樱花': 0.85, '春雨': 0.85, '鸟鸣': 0.8, '复苏': 0.85,
      '清香': 0.8, '柳絮': 0.8, '阳光': 0.8, '踏青': 0.85, '播种': 0.8, '希望': 0.75, '万物': 0.8, '生长': 0.85, '桃花': 0.85, '春风': 0.85,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.05, '数字': 0.05, '颜色': 0.4, '声音': 0.3, '时间': 0.3, '空间': 0.2, '方向': 0.1,
      '机器': 0.05, '电脑': 0.05, '水果': 0.3, '天气': 0.6, '月亮': 0.2, '星星': 0.2, '汽车': 0.05, '飞机': 0.05, '树木': 0.7, '建筑': 0.1, '金属': 0.05
    },
    '工作': {
      // 相关词语 (高相似性)
      '职业': 0.9, '事业': 0.85, '同事': 0.8, '办公': 0.85, '会议': 0.8, '项目': 0.8, '责任': 0.75, '努力': 0.8,
      '成就': 0.8, '团队': 0.8, '任务': 0.85, '目标': 0.8, '专业': 0.8, '技能': 0.75, '效率': 0.75, '合作': 0.8, '挑战': 0.75, '发展': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.2, '数字': 0.3, '颜色': 0.1, '声音': 0.2, '时间': 0.5, '空间': 0.3, '方向': 0.2,
      '机器': 0.3, '电脑': 0.6, '水果': 0.05, '天气': 0.1, '月亮': 0.05, '星星': 0.05, '汽车': 0.2, '飞机': 0.1, '树木': 0.05, '花朵': 0.1, '建筑': 0.4, '金属': 0.2
    },
    '爱情': {
      // 相关词语 (高相似性)
      '恋人': 0.9, '浪漫': 0.9, '心动': 0.85, '温柔': 0.8, '甜蜜': 0.85, '依恋': 0.8, '相伴': 0.8, '关怀': 0.8,
      '深情': 0.85, '牵手': 0.85, '拥抱': 0.8, '约会': 0.8, '思念': 0.8, '承诺': 0.8, '永恒': 0.75, '真心': 0.85, '情话': 0.8, '幸福': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.05, '数字': 0.05, '颜色': 0.3, '声音': 0.3, '时间': 0.4, '空间': 0.2, '方向': 0.05,
      '机器': 0.05, '电脑': 0.05, '水果': 0.2, '天气': 0.2, '月亮': 0.6, '星星': 0.6, '汽车': 0.1, '飞机': 0.1, '树木': 0.2, '花朵': 0.7, '建筑': 0.1, '金属': 0.05
    },
    '创造': {
      // 相关词语 (高相似性)
      '发明': 0.9, '想象': 0.85, '艺术': 0.85, '设计': 0.85, '灵感': 0.9, '原创': 0.9, '创新': 0.95, '构思': 0.85,
      '表达': 0.8, '作品': 0.85, '美感': 0.8, '独特': 0.8, '才华': 0.8, '突破': 0.8, '实现': 0.75, '创意': 0.95, '制作': 0.8, '诞生': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.1, '数字': 0.2, '颜色': 0.4, '声音': 0.3, '时间': 0.3, '空间': 0.3, '方向': 0.1,
      '机器': 0.3, '电脑': 0.4, '水果': 0.05, '天气': 0.1, '月亮': 0.2, '星星': 0.2, '汽车': 0.2, '飞机': 0.2, '树木': 0.2, '花朵': 0.4, '建筑': 0.5, '金属': 0.2
    },
    '勇气': {
      // 相关词语 (高相似性)
      '坚强': 0.9, '无畏': 0.95, '勇敢': 0.95, '胆量': 0.9, '挑战': 0.85, '面对': 0.8, '克服': 0.85, '坚持': 0.8,
      '决心': 0.85, '意志': 0.85, '英雄': 0.8, '冒险': 0.85, '突破': 0.8, '自信': 0.8, '力量': 0.85, '征服': 0.8, '奋斗': 0.8, '超越': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.05, '数字': 0.05, '颜色': 0.1, '声音': 0.2, '时间': 0.3, '空间': 0.3, '方向': 0.3,
      '机器': 0.1, '电脑': 0.1, '水果': 0.05, '天气': 0.2, '月亮': 0.2, '星星': 0.3, '汽车': 0.2, '飞机': 0.3, '树木': 0.1, '花朵': 0.1, '建筑': 0.2, '金属': 0.1
    },
    '小狗': {
      // 相关词语 (高相似性)
      '有毛': 0.9, '会叫': 0.95, '是宠物': 0.95, '忠诚': 0.85, '可爱': 0.9, '活泼': 0.85, '陪伴': 0.8, '摇尾巴': 0.9,
      '散步': 0.8, '玩耍': 0.85, '守护': 0.8, '温顺': 0.85, '机灵': 0.8, '听话': 0.85, '亲人': 0.8, '毛茸茸': 0.9, '汪汪': 0.95, '小动物': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '数字': 0.05, '颜色': 0.2, '声音': 0.4, '时间': 0.1, '空间': 0.1, '方向': 0.05,
      '机器': 0.05, '电脑': 0.05, '水果': 0.1, '天气': 0.2, '月亮': 0.1, '星星': 0.1, '汽车': 0.1, '飞机': 0.05, '树木': 0.2, '花朵': 0.2, '建筑': 0.1, '金属': 0.05
    },
    '孙悟空': {
      // 相关词语 (高相似性)
      '会变身': 0.95, '有金箍棒': 0.95, '打妖怪': 0.9, '齐天大圣': 0.95, '火眼金睛': 0.9, '筋斗云': 0.9, '七十二变': 0.95, '花果山': 0.85,
      '美猴王': 0.9, '大闹天宫': 0.9, '保护唐僧': 0.85, '降妖除魔': 0.9, '神通广大': 0.9, '机智勇敢': 0.85, '石猴': 0.8, '取西经': 0.8, '斗战胜佛': 0.85, '本领高强': 0.85,
      // 无关词语 (低相似性)
      '石头': 0.2, '椅子': 0.05, '数字': 0.05, '颜色': 0.1, '声音': 0.2, '时间': 0.3, '空间': 0.4, '方向': 0.2,
      '机器': 0.1, '电脑': 0.05, '水果': 0.3, '天气': 0.2, '月亮': 0.3, '星星': 0.3, '汽车': 0.05, '飞机': 0.2, '树木': 0.3, '花朵': 0.2, '建筑': 0.2, '金属': 0.1
    },
    '猪八戒': {
      // 相关词语 (高相似性)
      '喊散伙': 0.9, '背媳妇': 0.9, '九齿钉耙': 0.95, '天蓬元帅': 0.9, '好吃懒做': 0.85, '贪财好色': 0.8, '憨厚老实': 0.85, '高老庄': 0.85,
      '嫦娥仙子': 0.75, '投胎转世': 0.8, '取西经': 0.8, '二师兄': 0.9, '净坛使者': 0.85, '搞笑幽默': 0.85, '怕困难': 0.8, '爱抱怨': 0.8, '善良本性': 0.75, '忠心耿耿': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '数字': 0.05, '颜色': 0.1, '声音': 0.2, '时间': 0.2, '空间': 0.2, '方向': 0.1,
      '机器': 0.05, '电脑': 0.05, '水果': 0.4, '天气': 0.2, '月亮': 0.4, '星星': 0.3, '汽车': 0.05, '飞机': 0.05, '树木': 0.2, '花朵': 0.2, '建筑': 0.1, '金属': 0.05
    },
    '曹操': {
      // 相关词语 (高相似性)
      '政治家': 0.95, '有雄心': 0.9, '打天下': 0.9, '魏武帝': 0.95, '挟天子': 0.85, '令诸侯': 0.85, '统一北方': 0.85, '文韬武略': 0.9,
      '求贤若渴': 0.8, '奸雄': 0.8, '枭雄': 0.85, '诗人': 0.7, '军事家': 0.9, '野心勃勃': 0.85, '权谋': 0.85, '乱世英雄': 0.85, '三国霸主': 0.9, '治世能臣': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '数字': 0.1, '颜色': 0.1, '声音': 0.1, '时间': 0.4, '空间': 0.2, '方向': 0.2,
      '机器': 0.1, '电脑': 0.05, '水果': 0.05, '天气': 0.1, '月亮': 0.1, '星星': 0.1, '汽车': 0.05, '飞机': 0.05, '树木': 0.05, '花朵': 0.05, '建筑': 0.3, '金属': 0.2
    },
    '刘备': {
      // 相关词语 (高相似性)
      '刘皇叔': 0.95, '仁德宽厚': 0.95, '双股剑': 0.9, '蜀汉皇帝': 0.95, '桃园结义': 0.9, '三顾茅庐': 0.85, '仁义之君': 0.9, '爱民如子': 0.9,
      '礼贤下士': 0.85, '白帝托孤': 0.8, '复兴汉室': 0.85, '仁者无敌': 0.85, '宽容大度': 0.85, '知人善任': 0.8, '仁慈善良': 0.9, '皇室血统': 0.8, '仁君典范': 0.85, '爱哭鼻子': 0.7,
      // 无关词语 (低相似性)
      '石头': 0.05, '椅子': 0.1, '数字': 0.05, '颜色': 0.1, '声音': 0.1, '时间': 0.4, '空间': 0.2, '方向': 0.1,
      '机器': 0.05, '电脑': 0.05, '水果': 0.05, '天气': 0.1, '月亮': 0.1, '星星': 0.1, '汽车': 0.05, '飞机': 0.05, '树木': 0.1, '花朵': 0.2, '建筑': 0.2, '金属': 0.1
    },
    '林黛玉': {
      // 相关词语 (高相似性)
      '爱写诗': 0.95, '住大观园': 0.9, '多愁善感': 0.95, '绛珠仙子': 0.9, '还泪之说': 0.85, '才华横溢': 0.9, '体弱多病': 0.8, '清高孤傲': 0.85,
      '尖酸刻薄': 0.7, '敏感聪慧': 0.9, '诗情画意': 0.9, '红颜薄命': 0.8, '葬花词': 0.9, '潇湘妃子': 0.85, '眼泪如珠': 0.85, '冰雪聪明': 0.85, '孤芳自赏': 0.8, '凄美动人': 0.85,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.1, '数字': 0.05, '颜色': 0.3, '声音': 0.2, '时间': 0.4, '空间': 0.2, '方向': 0.05,
      '机器': 0.05, '电脑': 0.05, '水果': 0.2, '天气': 0.3, '月亮': 0.5, '星星': 0.4, '汽车': 0.05, '飞机': 0.05, '树木': 0.3, '花朵': 0.7, '建筑': 0.4, '金属': 0.05
    },
    '贾宝玉': {
      // 相关词语 (高相似性)
      '荣国府公子': 0.95, '厌弃科举': 0.9, '通灵宝玉': 0.95, '怡红公子': 0.9, '贾府嫡孙': 0.9, '叛逆公子': 0.85, '情痴情种': 0.9, '女儿国里': 0.85,
      '富贵闲人': 0.8, '温文尔雅': 0.85, '多情善感': 0.9, '不务正业': 0.8, '诗书传家': 0.8, '红楼梦主': 0.95, '风流倜傥': 0.85, '纨绔子弟': 0.8, '痴情种子': 0.9, '贵族公子': 0.85,
      // 无关词语 (低相似性)
      '石头': 0.2, '椅子': 0.1, '数字': 0.05, '颜色': 0.3, '声音': 0.2, '时间': 0.3, '空间': 0.2, '方向': 0.05,
      '机器': 0.05, '电脑': 0.05, '水果': 0.2, '天气': 0.2, '月亮': 0.4, '星星': 0.4, '汽车': 0.05, '飞机': 0.05, '树木': 0.2, '花朵': 0.6, '建筑': 0.5, '金属': 0.1
    },
    '武松': {
      // 相关词语 (高相似性)
      '打虎': 0.95, '梁山好汉': 0.9, '打抱不平': 0.95, '行者武松': 0.95, '景阳冈': 0.9, '醉打蒋门神': 0.85, '血溅鸳鸯楼': 0.85, '都头': 0.8,
      '英雄好汉': 0.9, '武艺高强': 0.9, '嫉恶如仇': 0.9, '义薄云天': 0.85, '豪侠仗义': 0.85, '刚正不阿': 0.85, '除暴安良': 0.9, '快意恩仇': 0.85, '侠肝义胆': 0.85, '威震天下': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.05, '数字': 0.05, '颜色': 0.1, '声音': 0.2, '时间': 0.2, '空间': 0.3, '方向': 0.2,
      '机器': 0.05, '电脑': 0.05, '水果': 0.1, '天气': 0.2, '月亮': 0.1, '星星': 0.1, '汽车': 0.1, '飞机': 0.05, '树木': 0.2, '花朵': 0.1, '建筑': 0.2, '金属': 0.2
    },
    '李逵': {
      // 相关词语 (高相似性)
      '黑旋风': 0.95, '双板斧': 0.95, '头脑简单': 0.9, '梁山好汉': 0.9, '沂岭杀四虎': 0.85, '真假李逵': 0.8, '为母杀虎': 0.85, '忠义双全': 0.85,
      '性格率直': 0.9, '粗中有细': 0.8, '孝顺母亲': 0.85, '义气深重': 0.85, '勇猛无敌': 0.85, '天真烂漫': 0.8, '单纯直率': 0.85, '嫉恶如仇': 0.85, '赤胆忠心': 0.85, '莽撞冲动': 0.8,
      // 无关词语 (低相似性)
      '石头': 0.1, '椅子': 0.05, '数字': 0.05, '颜色': 0.1, '声音': 0.3, '时间': 0.2, '空间': 0.2, '方向': 0.2,
      '机器': 0.05, '电脑': 0.05, '水果': 0.1, '天气': 0.2, '月亮': 0.1, '星星': 0.1, '汽车': 0.1, '飞机': 0.05, '树木': 0.3, '花朵': 0.1, '建筑': 0.1, '金属': 0.3
    }
  };

  // 创建基于词语的伪随机数生成器
  const getSeededRandom = (seed: string, index: number = 0): number => {
    let hash = 0;
    const fullSeed = seed + index.toString();
    for (let i = 0; i < fullSeed.length; i++) {
      const char = fullSeed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    // 将hash转换为0-1之间的数
    return Math.abs(hash % 10000) / 10000;
  };

  const generateWordPositions = (): WordPosition[] => {
    if (!centerWord || selectedWords.length === 0) return [];

    const positions: WordPosition[] = [];
    const centerSimilarities = similarityData[centerWord] || {};

    // 按相似度分组
    const relatedWords = selectedWords.filter(word => (centerSimilarities[word] || 0) >= 0.6);
    const unrelatedWords = selectedWords.filter(word => (centerSimilarities[word] || 0) < 0.6);

    // 处理相关词语 - 聚团显示
    relatedWords.forEach((word, index) => {
      const similarity = centerSimilarities[word] || 0;
      
      // 相关词语距离中心较近，形成聚团
      const baseDistance = 1.5 + (1 - similarity) * 1.5; // 距离范围 1.5-3
      
      // 使用词语名称作为种子，确保位置固定
      const clusterAngle = (index / relatedWords.length) * Math.PI * 2;
      const randomOffset1 = getSeededRandom(word, 1);
      const randomOffset2 = getSeededRandom(word, 2);
      const randomOffset3 = getSeededRandom(word, 3);
      
      const clusterRadius = 0.8 + randomOffset1 * 0.4; // 聚团内的固定分布
      
      const x = baseDistance * Math.cos(clusterAngle) + clusterRadius * (randomOffset2 - 0.5);
      const y = baseDistance * Math.sin(clusterAngle) + clusterRadius * (randomOffset3 - 0.5);
      const z = (getSeededRandom(word, 4) - 0.5) * 1.5; // Z轴上的小幅变化

      positions.push({
        word,
        x, y, z,
        similarity,
        isRelated: true
      });
    });

    // 处理无关词语 - 分散显示
    unrelatedWords.forEach((word, index) => {
      const similarity = centerSimilarities[word] || 0;
      
      // 无关词语距离中心较远，分散分布
      const distance = 4 + getSeededRandom(word, 5) * 2; // 距离范围 4-6
      
      // 在外围球面上固定分布
      const angle1 = getSeededRandom(word, 6) * Math.PI * 2;
      const angle2 = Math.acos(1 - 2 * getSeededRandom(word, 7));
      
      const x = distance * Math.sin(angle2) * Math.cos(angle1);
      const y = distance * Math.sin(angle2) * Math.sin(angle1);
      const z = distance * Math.cos(angle2);

      positions.push({
        word,
        x, y, z,
        similarity,
        isRelated: false
      });
    });

    return positions;
  };

  const wordPositions = generateWordPositions();

  // 动画循环
  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const time = (currentTime - startTime) * 0.001; // 转换为秒
      setAnimationTime(time);
      
      // 自动旋转
      if (autoRotate && !isDragging) {
        setRotation(prev => ({
          x: prev.x + 0.003, // X轴缓慢旋转
          y: prev.y + 0.005  // Y轴稍快旋转
        }));
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoRotate, isDragging]);

  // 词语出现动画
  useEffect(() => {
    if (selectedWords.length > 0) {
      setWordsAppearProgress(0);
      const duration = 1500; // 1.5秒
      const startTime = Date.now();
      
      const animateAppear = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setWordsAppearProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animateAppear);
        }
      };
      
      animateAppear();
    }
  }, [selectedWords.length]);

  // 初始化星空背景
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newStars = [];
    for (let i = 0; i < 150; i++) {
      newStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }
    setStars(newStars);
  }, []);

  // 3D点投影到2D屏幕坐标
  const project3DTo2D = (x: number, y: number, z: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, scale: 1 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fov = 300;

    // 应用旋转
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);

    // 绕Y轴旋转
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    
    // 绕X轴旋转
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // 透视投影
    const scale = fov / (fov + z2);
    // 在最终屏幕坐标计算时应用缩放
    const screenX = centerX + x1 * scale * 50 * zoom;
    const screenY = centerY + y2 * scale * 50 * zoom;

    return { x: screenX, y: screenY, scale };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制星空背景
      drawStarryBackground(ctx);

      // 绘制背景网格（带动画）
      drawAnimatedGrid(ctx);

      // 绘制坐标轴（带动画）
      drawAnimatedAxes(ctx);

      // 绘制中心词
      if (centerWord) {
        const centerPos = project3DTo2D(0, 0, 0);
        const pulseScale = 1 + Math.sin(animationTime * 2) * 0.1; // 脉动效果
        drawWord(ctx, centerWord, centerPos.x, centerPos.y, centerPos.scale * pulseScale, true, centerWord === hoveredWord);
      }

      // 绘制其他词语（带出现动画）
      wordPositions.forEach((wordPos, index) => {
        const appearDelay = (index / wordPositions.length) * 0.5; // 错开出现时间
        const appearProgress = Math.max(0, Math.min(1, (wordsAppearProgress - appearDelay) / 0.5));
        
        if (appearProgress > 0) {
          // 计算动画位置（从中心飞出）
          const animatedX = wordPos.x * appearProgress;
          const animatedY = wordPos.y * appearProgress;
          const animatedZ = wordPos.z * appearProgress;
          
          const pos = project3DTo2D(animatedX, animatedY, animatedZ);
          
          // 连接线已移除，使用颜色和位置聚类来表示关联度
          
          // 绘制词语（带缩放动画）
          const scaleAnimation = appearProgress * (1 + Math.sin(animationTime * 3 + index) * 0.05);
          drawWord(ctx, wordPos.word, pos.x, pos.y, pos.scale * scaleAnimation, false, wordPos.word === hoveredWord, wordPos.isRelated, wordPos.similarity, appearProgress);
        }
      });

      // 绘制说明
      drawLegend(ctx);
    };

    const drawStarryBackground = (ctx: CanvasRenderingContext2D) => {
      // 创建深色星空渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, '#0a1225');
      gradient.addColorStop(0.6, '#16213e');
      gradient.addColorStop(1, '#0f172a');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星星
      stars.forEach((star, index) => {
        const twinkle = Math.sin(animationTime * star.twinkleSpeed + index) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;
        
        // 星星光晕效果
        const glowSize = star.size * 3;
        const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
        glowGradient.addColorStop(0.5, `rgba(200, 220, 255, ${alpha * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 星星主体
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawAnimatedGrid = (ctx: CanvasRenderingContext2D) => {
      const opacity = 0.15 + Math.sin(animationTime * 0.8) * 0.05; // 更柔和的透明度动画
      
      // 绘制多层网格，创造3D深度感
      const layers = [
        { z: 0, opacity: opacity * 1.2, color: '#9ca3af' },
        { z: -2, opacity: opacity * 0.6, color: '#6b7280' },
        { z: 2, opacity: opacity * 0.6, color: '#6b7280' }
      ];
      
      layers.forEach(layer => {
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.z === 0 ? 1.5 : 0.8;
        ctx.globalAlpha = layer.opacity;
        
        for (let i = -4; i <= 4; i++) {
          if (i === 0) continue;
          
          // X方向网格线
          const start1 = project3DTo2D(i, -4, layer.z);
          const end1 = project3DTo2D(i, 4, layer.z);
          ctx.beginPath();
          ctx.moveTo(start1.x, start1.y);
          ctx.lineTo(end1.x, end1.y);
          ctx.stroke();
          
          // Y方向网格线
          const start2 = project3DTo2D(-4, i, layer.z);
          const end2 = project3DTo2D(4, i, layer.z);
          ctx.beginPath();
          ctx.moveTo(start2.x, start2.y);
          ctx.lineTo(end2.x, end2.y);
          ctx.stroke();
        }
      });
      
      // 绘制网格交点
      ctx.globalAlpha = opacity * 0.8;
      for (let x = -4; x <= 4; x += 2) {
        for (let y = -4; y <= 4; y += 2) {
          if (x === 0 && y === 0) continue;
          const point = project3DTo2D(x, y, 0);
          ctx.fillStyle = '#9ca3af';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.globalAlpha = 1;
    };

    const drawAnimatedAxes = (ctx: CanvasRenderingContext2D) => {
      const axisLength = 6;
      const pulseIntensity = 1 + Math.sin(animationTime * 1.2) * 0.15;
      
      // 绘制原点
      const origin = project3DTo2D(0, 0, 0);
      ctx.fillStyle = '#d1d5db';
      ctx.shadowColor = '#d1d5db';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // X轴 (灰色) - 语义维度1
      drawStylizedAxis(ctx, -axisLength, 0, 0, axisLength, 0, 0, '#9ca3af', 'X', '语义维度1', pulseIntensity);
      
      // Y轴 (灰色) - 语义维度2  
      drawStylizedAxis(ctx, 0, -axisLength, 0, 0, axisLength, 0, '#9ca3af', 'Y', '语义维度2', pulseIntensity);
      
      // Z轴 (灰色) - 语义维度3
      drawStylizedAxis(ctx, 0, 0, -axisLength, 0, 0, axisLength, '#9ca3af', 'Z', '语义维度3', pulseIntensity);
    };

    const drawStylizedAxis = (ctx: CanvasRenderingContext2D, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: string, label: string, description: string, pulse: number) => {
      const start = project3DTo2D(x1, y1, z1);
      const end = project3DTo2D(x2, y2, z2);
      
      // 主轴线 - 渐变效果
      const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, `${color}40`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3 + pulse * 0.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 + pulse * 4;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // 绘制箭头
      drawArrowHead(ctx, start, end, color, pulse);
      
      // 绘制轴标签
      drawAxisLabel(ctx, end, label, description, color);
      
      // 绘制刻度
      drawAxisTicks(ctx, x1, y1, z1, x2, y2, z2, color);
    };

    const drawArrowHead = (ctx: CanvasRenderingContext2D, start: any, end: any, color: string, pulse: number) => {
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const arrowLength = 15 + pulse * 3;
      const arrowAngle = Math.PI / 6;
      
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle - arrowAngle),
        end.y - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle + arrowAngle),
        end.y - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawAxisLabel = (ctx: CanvasRenderingContext2D, pos: any, label: string, description: string, color: string) => {
      // 主标签
      ctx.fillStyle = color;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
      ctx.fillText(label, pos.x + 20, pos.y - 20);
      ctx.shadowBlur = 0;
      
      // 描述文字
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Arial';
      ctx.fillText(description, pos.x + 20, pos.y - 5);
    };

    const drawAxisTicks = (ctx: CanvasRenderingContext2D, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: string) => {
      const steps = 5;
      ctx.strokeStyle = `${color}80`;
      ctx.lineWidth = 1;
      
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const tickX = x1 + (x2 - x1) * t;
        const tickY = y1 + (y2 - y1) * t;
        const tickZ = z1 + (z2 - z1) * t;
        
        const tickPos = project3DTo2D(tickX, tickY, tickZ);
        
        // 绘制刻度线
        ctx.beginPath();
        ctx.arc(tickPos.x, tickPos.y, 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // 刻度数字
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), tickPos.x + 8, tickPos.y - 8);
      }
    };

    const drawConnection = (ctx: CanvasRenderingContext2D, start: any, end: any, similarity: number, alpha: number = 1) => {
      const color = similarity > 0.5 ? '#10b981' : '#ef4444';
      const animatedWidth = Math.max(1, similarity * 3) + Math.sin(animationTime * 2) * 0.5;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = animatedWidth;
      ctx.globalAlpha = 0.6 * alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    // 根据相似度获取彩虹色
    const getSimilarityColor = (similarity: number): { r: number, g: number, b: number } => {
      // 将相似度映射到彩虹色谱 (0-1 对应红到紫)
      const hue = similarity * 300; // 0-300度，红色到紫色
      const saturation = 0.8;
      const lightness = 0.6;
      
      // HSL转RGB
      const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
      const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
      const m = lightness - c / 2;
      
      let r, g, b;
      if (hue < 60) {
        r = c; g = x; b = 0;
      } else if (hue < 120) {
        r = x; g = c; b = 0;
      } else if (hue < 180) {
        r = 0; g = c; b = x;
      } else if (hue < 240) {
        r = 0; g = x; b = c;
      } else if (hue < 300) {
        r = x; g = 0; b = c;
      } else {
        r = c; g = 0; b = x;
      }
      
      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    };

    const drawWord = (ctx: CanvasRenderingContext2D, word: string, x: number, y: number, scale: number, isCenter: boolean, isHovered: boolean, isRelated?: boolean, similarity?: number, alpha: number = 1) => {
      const baseSize = Math.max(8, 12 * scale);
      const hoverMultiplier = isHovered ? 1.2 : 1;
      const breatheEffect = isCenter ? (1 + Math.sin(animationTime * 3) * 0.1) : 1;
      const size = baseSize * hoverMultiplier * breatheEffect;
      
      const radius = size + 4;
      
      if (isCenter) {
        // 中心词特殊样式 - 金色光环效果
        const glowRadius = radius + Math.sin(animationTime * 2) * 3;
        
        // 外层光环
        ctx.fillStyle = `rgba(251, 191, 36, ${0.3 * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 主体圆圈
        ctx.fillStyle = isHovered ? `rgba(245, 158, 11, ${alpha})` : `rgba(251, 191, 36, ${alpha})`;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
      } else {
        // 根据相似度使用彩虹色
        const sim = similarity || 0;
        const color = getSimilarityColor(sim);
        const pulse = 1 + Math.sin(animationTime * 4 + x + y) * 0.05;
        
        const baseColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        const hoverColor = `rgba(${Math.max(0, color.r - 30)}, ${Math.max(0, color.g - 30)}, ${Math.max(0, color.b - 30)}, ${alpha})`;
        
        ctx.fillStyle = isHovered ? hoverColor : baseColor;
        ctx.shadowColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.shadowBlur = 5 + (sim * 5) * pulse;
      }
      
      // 绘制词语背景圆圈
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // 绘制词语文字
      ctx.fillStyle = 'white';
      ctx.font = `bold ${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 1;
      ctx.fillText(word, x, y);
      ctx.shadowBlur = 0;
      
      // 如果有相似性信息，显示数值
      if (similarity !== undefined && !isCenter) {
        ctx.fillStyle = `rgba(55, 65, 81, ${alpha})`;
        ctx.font = `${Math.max(8, 10 * scale)}px Arial`;
        ctx.fillText((similarity * 100).toFixed(0) + '%', x, y + size + 15);
      }
    };

    const drawLegend = (ctx: CanvasRenderingContext2D) => {
      const legendX = 30;
      const legendY = canvas.height - 150;
      const legendWidth = 200;
      const legendHeight = 135;
      
      // 背景 - 透明效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      
      // 使用roundRect绘制圆角矩形
      ctx.beginPath();
      const radius = 12;
      ctx.moveTo(legendX - 15 + radius, legendY - 15);
      ctx.lineTo(legendX - 15 + legendWidth - radius, legendY - 15);
      ctx.quadraticCurveTo(legendX - 15 + legendWidth, legendY - 15, legendX - 15 + legendWidth, legendY - 15 + radius);
      ctx.lineTo(legendX - 15 + legendWidth, legendY - 15 + legendHeight - radius);
      ctx.quadraticCurveTo(legendX - 15 + legendWidth, legendY - 15 + legendHeight, legendX - 15 + legendWidth - radius, legendY - 15 + legendHeight);
      ctx.lineTo(legendX - 15 + radius, legendY - 15 + legendHeight);
      ctx.quadraticCurveTo(legendX - 15, legendY - 15 + legendHeight, legendX - 15, legendY - 15 + legendHeight - radius);
      ctx.lineTo(legendX - 15, legendY - 15 + radius);
      ctx.quadraticCurveTo(legendX - 15, legendY - 15, legendX - 15 + radius, legendY - 15);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // 边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 标题
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('🌈 相似度色彩映射', legendX, legendY + 10);
      
      // 中心词
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(legendX + 10, legendY + 35, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText('中心词 (金色)', legendX + 25, legendY + 40);
      
      // 彩虹色渐变条
      const gradientY = legendY + 55;
      const gradientWidth = 150;
      const gradientHeight = 8;
      
      // 绘制渐变条
      for (let i = 0; i < gradientWidth; i++) {
        const similarity = i / gradientWidth;
        const color = getSimilarityColor(similarity);
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(legendX + i, gradientY, 1, gradientHeight);
      }
      
      // 渐变条标签
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('低相似度', legendX, gradientY + gradientHeight + 15);
      ctx.textAlign = 'right';
      ctx.fillText('高相似度', legendX + gradientWidth, gradientY + gradientHeight + 15);
      
      // 说明文字
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('• 相似词语聚团显示，距离近', legendX, legendY + 90);
      ctx.fillText('• 无关词语分散显示，距离远', legendX, legendY + 105);
    };

    draw();
  }, [centerWord, selectedWords, rotation, zoom, hoveredWord, animationTime, wordsAppearProgress]);

  // 滚轮事件处理函数 - 使用React事件处理器
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false); // 拖拽时停止自动旋转
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }));
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else {
      // 检测鼠标悬停的词语
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      let hoveredWord = null;
      
      // 检查中心词
      if (centerWord) {
        const centerPos = project3DTo2D(0, 0, 0);
        const distance = Math.sqrt((mouseX - centerPos.x) ** 2 + (mouseY - centerPos.y) ** 2);
        if (distance < 20) hoveredWord = centerWord;
      }
      
      // 检查其他词语
      if (!hoveredWord) {
        for (const wordPos of wordPositions) {
          const pos = project3DTo2D(wordPos.x, wordPos.y, wordPos.z);
          const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
          if (distance < 20) {
            hoveredWord = wordPos.word;
            break;
          }
        }
      }
      
      setHoveredWord(hoveredWord);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!centerWord) {
    return (
      <div className="space-visualization-3d">
        <div className="empty-3d-state">
          <div className="empty-3d-icon">🌐</div>
          <h3>3D词语空间</h3>
          <p>选择一个中心词和相关词语，开始探索它们在三维空间中的位置关系！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-visualization-3d">
      <div className="visualization-3d-header">
        <h2>🌐 3D词语空间</h2>
        <div className="controls-3d">
          <button 
            className="control-btn"
            onClick={() => {
              setRotation({ x: 0, y: 0 });
              setAutoRotate(true);
            }}
          >
            🔄 重置视角
          </button>
          <button 
            className="control-btn"
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              background: autoRotate ? '#10b981' : 'white',
              color: autoRotate ? 'white' : '#475569'
            }}
          >
            {autoRotate ? '⏸️ 暂停旋转' : '▶️ 自动旋转'}
          </button>
          <div className="zoom-info">
            缩放: {(zoom * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      
      <div 
        className="canvas-container"
        onWheel={handleWheel}
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={960}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </div>
      
      <div className="interaction-hints">
        <p>💡 <strong>操作提示：</strong></p>
        <p>• 拖拽旋转视角 • 滚轮缩放 • 悬停查看词语详情</p>
      </div>
    </div>
  );
};

export default SpaceVisualization3D;
