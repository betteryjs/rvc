#!/bin/bash

# 目标 Registry 和镜像名称
REGISTRY="reg.naloong.de"
IMAGE_NAME="$REGISTRY/library/rvc"
IMAGE_VERSION="latest"


docker login $REGISTRY



# 初始化多架构构建环境
docker buildx create --use --name multiarch-builder >/dev/null 2>&1
docker buildx inspect --bootstrap >/dev/null 2>&1

# 构建并推送多架构镜像
echo "🚀 正在构建并推送多架构镜像: $IMAGE_NAME:$IMAGE_VERSION (amd64 + arm64)"
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "$IMAGE_NAME:$IMAGE_VERSION" \
  --push .  # 关键：--push 表示直接推送

echo "✅ 推送完成！"
echo "   镜像地址: $IMAGE_NAME:$IMAGE_VERSION"
