# 🚀 部署指南

## 📋 部署前检查清单

- ✅ 项目构建成功 (`npm run build`)
- ✅ 代码推送到 GitHub 仓库
- ✅ 拥有 Render 账户
- ✅ GitHub 账户已连接到 Render

## 🔧 配置文件说明

### 1. render.yaml
```yaml
services:
  - type: web
    name: word-embeddings-demo
    env: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./build
```

**关键配置说明：**
- `type: web` - 定义为 Web 服务
- `env: static` - 静态站点环境
- `buildCommand` - 构建命令，使用 `npm ci` 确保依赖一致性
- `staticPublishPath` - 构建输出目录

### 2. package.json 更新
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "serve": "serve -s build -l 3000",
    "preview": "npm run build && npm run serve"
  }
}
```

### 3. 环境变量配置
```bash
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
CI=true
```

## 📤 上传到 GitHub

### 方法一：使用脚本 (推荐)

**Windows 用户：**
```bash
.\deploy-to-github.bat
```

**Linux/Mac 用户：**
```bash
./deploy-to-github.sh
```

### 方法二：手动操作

1. **初始化 Git 仓库**
```bash
git init
```

2. **添加所有文件**
```bash
git add .
```

3. **创建初始提交**
```bash
git commit -m "初始提交: 词向量教学演示系统 - 准备部署到 Render"
```

4. **设置主分支**
```bash
git branch -M main
```

5. **添加远程仓库**
```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

6. **推送到 GitHub**
```bash
git push -u origin main
```

## 🌐 在 Render 上部署

### 步骤 1: 创建新服务

1. 登录 [Render](https://render.com)
2. 点击 **"New +"**
3. 选择 **"Static Site"**

### 步骤 2: 连接 GitHub

1. 选择 **"Connect a repository"**
2. 授权 Render 访问你的 GitHub
3. 选择你的项目仓库

### 步骤 3: 配置部署设置

**基础设置：**
- **Name**: `word-embeddings-demo` (或自定义名称)
- **Branch**: `main`
- **Root Directory**: 留空
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `./build`

**高级设置：**
- **Auto Deploy**: ✅ 启用 (推荐)
- **Pull Request Previews**: ✅ 启用 (可选)

### 步骤 4: 环境变量 (可选)

在 **Environment** 标签页添加：

| 变量名 | 值 |
|--------|-----|
| `GENERATE_SOURCEMAP` | `false` |
| `INLINE_RUNTIME_CHUNK` | `false` |
| `CI` | `true` |

### 步骤 5: 部署

1. 点击 **"Create Static Site"**
2. 等待初始部署完成 (通常 2-5 分钟)
3. 获取你的 `.onrender.com` 域名

## 🔄 自动部署

配置完成后，每次推送代码到 `main` 分支时，Render 会自动：

1. 🔄 拉取最新代码
2. 📦 安装依赖 (`npm ci`)
3. 🏗️ 构建项目 (`npm run build`)
4. 🚀 部署到生产环境
5. ✅ 更新网站

## 🎯 自定义域名 (可选)

### 1. 在 Render 控制台
1. 进入你的服务页面
2. 点击 **"Settings"** 标签
3. 找到 **"Custom Domains"** 部分
4. 点击 **"Add Custom Domain"**
5. 输入你的域名

### 2. 配置 DNS
根据 Render 提供的说明配置你的 DNS 记录：

**A 记录：**
```
Type: A
Name: @
Value: [Render 提供的 IP 地址]
```

**CNAME 记录：**
```
Type: CNAME
Name: www
Value: [你的项目名].onrender.com
```

## 📊 监控和维护

### 部署日志
- 在 Render 控制台查看构建和部署日志
- 监控构建时间和错误信息

### 性能监控
- 使用 Render 内置的性能指标
- 监控网站加载速度和可用性

### 更新维护
- 定期更新依赖包
- 监控 GitHub Actions 构建状态
- 检查 Render 服务健康状态

## ❌ 故障排除

### 常见问题

#### 1. 构建失败
**症状：** 部署过程中构建失败
**解决方案：**
```bash
# 本地测试构建
npm run build

# 检查依赖版本
npm audit

# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 2. 页面空白
**症状：** 部署成功但页面显示空白
**解决方案：**
- 检查 `build` 目录是否正确生成
- 确认 `staticPublishPath` 设置为 `./build`
- 检查控制台错误信息

#### 3. 资源加载失败
**症状：** CSS/JS 文件 404 错误
**解决方案：**
- 确认 `package.json` 中没有设置错误的 `homepage`
- 检查构建输出的文件路径

#### 4. 路由问题
**症状：** 刷新页面显示 404
**解决方案：**
- 确认 `render.yaml` 中的路由重写配置：
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

### 联系支持

如果遇到问题无法解决：
1. 查看 [Render 文档](https://render.com/docs)
2. 联系 Render 技术支持
3. 在项目 GitHub 仓库提交 Issue

## ✅ 部署成功检查

部署完成后，请验证以下功能：

- [ ] 网站可以正常访问
- [ ] 所有模块功能正常
- [ ] 3D 可视化正常渲染
- [ ] 图表和动画正常显示
- [ ] 响应式布局适配正常
- [ ] 性能表现良好 (加载时间 < 3秒)

恭喜！🎉 你的词向量教学演示系统已成功部署到 Render！
