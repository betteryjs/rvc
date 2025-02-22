#!/bin/bash

# install docker docker-compose


# 检查是否安装了 Docker
if ! command -v docker &> /dev/null; then
    echo "Docker 未安装，正在安装 Docker..."
    # 安装 Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    echo "Docker 安装完成。"
else
    echo "Docker 已安装，跳过安装步骤。"
fi

# 检查是否安装了 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose 未安装，正在安装 Docker Compose..."
    # 安装 Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose 安装完成。"
else
    echo "Docker Compose 已安装，跳过安装步骤。"
fi

# 验证安装
echo "验证安装结果："
docker --version
docker-compose --version


mkdir rvc
cd rvc
wget











