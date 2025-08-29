# 词向量教学演示系统

一个专为初中生设计的交互式词向量学习平台，通过可视化和直观的操作帮助学生理解词向量的基本概念。

## 🎯 项目特色

- **初中生友好设计**：简化的界面和易懂的交互方式
- **16:9 响应式布局**：适配各种屏幕尺寸，支持教室投影
- **直观的可视化**：柱状图和雷达图双重展示方式
- **实时交互**：滑块调整特征值，实时看到向量变化

## 📚 模块介绍

### 模块一：词语转向量
学生可以：
1. 🎯 输入或选择词语
2. 🔧 手动调整5个特征维度：
   - 🎨 颜色鲜艳度
   - 📏 大小
   - 😊 情感倾向
   - 💭 抽象程度
   - 📊 使用频率
3. 📈 实时查看柱状图和雷达图
4. 💡 理解词向量的数学表示

## 🚀 快速开始

### 本地开发

#### 安装依赖
```bash
npm install
```

#### 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3000 打开

#### 构建生产版本
```bash
npm run build
```

#### 本地预览构建版本
```bash
npm run preview
```

### 部署到 Render

#### 1. 准备工作
- 确保代码已推送到 GitHub 仓库
- 登录到 [Render](https://render.com)

#### 2. 创建新的静态站点
1. 在 Render 控制台点击 "New +"
2. 选择 "Static Site"
3. 连接你的 GitHub 仓库
4. 选择这个项目仓库

#### 3. 配置部署设置
- **Name**: `word-embeddings-demo` (或你喜欢的名称)
- **Branch**: `main` (或 `master`)
- **Root Directory**: 留空
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `./build`

#### 4. 环境变量 (可选)
在 Render 的环境变量设置中添加：
```
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
CI=true
```

#### 5. 自动部署
- 每次推送到主分支时，Render 会自动重新部署
- 部署过程大约需要 2-5 分钟
- 部署完成后会获得一个 `.onrender.com` 域名

#### 6. 自定义域名 (可选)
- 在 Render 控制台的 "Settings" -> "Custom Domains" 中添加
- 按照说明配置 DNS 记录

## 🛠️ 技术栈

- **React 18** - 现代化的用户界面框架
- **TypeScript** - 类型安全的JavaScript
- **CSS3** - 现代化样式和动画
- **SVG** - 高质量的图表渲染

## 🎨 设计理念

1. **教育优先**：专为教学场景设计，注重学习体验
2. **视觉直观**：通过图表让抽象概念变得具体
3. **互动性强**：实时反馈，增强学习参与度
4. **界面友好**：清晰的布局，适合课堂演示

## 📱 响应式设计

- **桌面端**：16:9 比例，适合教室投影
- **平板端**：自适应布局，保持功能完整性
- **手机端**：垂直布局，优化触摸操作

## 🔮 未来规划

- **模块二**：向量空间位置关系可视化
- **模块三**：向量运算与语义关系演示
- **多语言支持**：扩展到其他语言学习
- **学习进度追踪**：记录学生学习轨迹

## 📁 项目结构

```
词向量/
├── public/                 # 静态资源
├── src/                   # 源代码
│   ├── components/        # React 组件
│   │   ├── Module2/      # 模块二：3D空间关系
│   │   ├── Module3/      # 模块三：向量运算魔法
│   │   └── Module4/      # 模块四：智能商品推荐
│   ├── App.tsx           # 主应用组件
│   └── types.ts          # TypeScript 类型定义
├── render.yaml           # Render 部署配置
├── .github/workflows/    # GitHub Actions 工作流
└── package.json          # 项目依赖配置
```

## 🚀 部署状态

### Render 部署配置
- ✅ `render.yaml` - 自动部署配置
- ✅ 静态站点优化设置
- ✅ 缓存策略配置
- ✅ SPA 路由支持

### GitHub Actions
- ✅ 自动构建测试
- ✅ 多 Node.js 版本支持 (18.x, 20.x)
- ✅ TypeScript 类型检查
- ✅ 构建产物上传

## 🔧 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 2. 类型错误
```bash
# 运行类型检查
npx tsc --noEmit
```

#### 3. 本地预览问题
```bash
# 确保安装了 serve
npm install -g serve
# 或使用项目内的 serve
npm run preview
```

### 性能优化

#### 构建优化
- ✅ 禁用 source maps (`GENERATE_SOURCEMAP=false`)
- ✅ 内联运行时优化 (`INLINE_RUNTIME_CHUNK=false`)
- ✅ 静态资源缓存策略
- ✅ 代码分割和懒加载

#### 运行时优化
- 🎯 固定分辨率 1600x900 (16:9)
- 🚀 Canvas 渲染优化
- 📱 响应式设计适配
- ⚡ 60 FPS 动画性能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个教学工具！

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 LICENSE 文件
