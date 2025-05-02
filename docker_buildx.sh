

docker rmi cdn-reg.naloong.de/library/rvc:arm64
docker rmi cdn-reg.naloong.de/library/rvc:amd64
docker rmi reg.11451400.xyz/library/rvc:arm64
docker rmi reg.11451400.xyz/library/rvc:amd64
docker rmi reg.naloong.de/library/rvc:arm64
docker rmi reg.naloong.de/library/rvc:amd64



docker login reg.naloong.de




#配置 Docker 多平台支持
#docker run --privileged --rm tonistiigi/binfmt --install all

# 构建并推送 amd64 镜像
docker build --platform linux/amd64 -t reg.naloong.de/library/rvc:amd64 .
docker push reg.naloong.de/library/rvc:amd64

# 构建并推送 arm64 镜像
docker build --platform linux/arm64 -t reg.naloong.de/library/rvc:arm64 .
docker push reg.naloong.de/library/rvc:arm64

docker manifest rm reg.naloong.de/library/rvc:latest

docker manifest create reg.naloong.de/library/rvc:latest reg.naloong.de/library/rvc:amd64 reg.naloong.de/library/rvc:arm64
# 推送 manifest 列表
docker manifest push reg.naloong.de/library/rvc:latest

#检查 latest 标签的 manifest
docker manifest inspect reg.naloong.de/library/rvc:latest






