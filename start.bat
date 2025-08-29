@echo off
echo 正在启动词向量教学演示系统...
echo.
echo 首次运行可能需要安装依赖，请稍等...
echo.

if not exist node_modules (
    echo 正在安装依赖...
    call npm install
    echo.
)

echo 启动开发服务器...
call npm start

pause
