export interface WordFeatures {
  color: number;     // 颜色强度 (0-10)
  size: number;      // 大小 (0-10)
  emotion: number;   // 情感 (0-10, 0=负面, 10=正面)
  abstract: number;  // 抽象程度 (0-10, 0=具体, 10=抽象)
  frequency: number; // 使用频率 (0-10)
}

export interface FeatureConfig {
  key: keyof WordFeatures;
  label: string;
  description: string;
  color: string;
  icon: string;
}
