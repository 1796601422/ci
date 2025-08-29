#!/bin/bash

echo "正在准备部署到 GitHub..."

echo ""
echo "1. 初始化 Git 仓库..."
git init

echo ""
echo "2. 添加所有文件..."
git add .

echo ""
echo "3. 创建初始提交..."
git commit -m "初始提交: 词向量教学演示系统 - 准备部署到 Render"

echo ""
echo "4. 设置主分支..."
git branch -M main

echo ""
read -p "请输入你的 GitHub 仓库地址 (例如: https://github.com/username/repo.git): " REPO_URL

echo ""
echo "5. 添加远程仓库..."
git remote add origin "$REPO_URL"

echo ""
echo "6. 推送到 GitHub..."
git push -u origin main

echo ""
echo "✅ 部署完成！"
echo ""
echo "下一步："
echo "1. 访问 https://render.com"
echo "2. 创建新的 Static Site"
echo "3. 连接你的 GitHub 仓库"
echo "4. 使用以下配置："
echo "   - Build Command: npm ci && npm run build"
echo "   - Publish Directory: ./build"
echo ""
