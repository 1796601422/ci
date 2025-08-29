#!/bin/bash

echo "正在启动词向量教学演示系统..."
echo

if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    echo
fi

echo "启动开发服务器..."
npm start
