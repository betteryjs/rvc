# 使用官方的 Nginx 镜像作为基础镜像
FROM --platform=linux/amd64 nginx:alpine

# 安装依赖：curl 和 jq
RUN apk add --no-cache curl jq

# 将本地的文件复制到容器中的指定目录
COPY . /usr/share/nginx/html

# 复制 Bash 脚本到容器
COPY fetch_exchange_rates.sh /usr/local/bin/fetch_exchange_rates.sh

# 赋予脚本执行权限
RUN chmod +x /usr/local/bin/fetch_exchange_rates.sh

# 复制 cron 任务文件到容器
COPY cronjob /etc/cron.d/fetch-exchange-rates-cron

# 赋予 cron 任务文件执行权限
RUN chmod 0644 /etc/cron.d/fetch-exchange-rates-cron

# 安装 cron
RUN apk add --no-cache busybox-suid dcron

# 创建日志文件目录
RUN mkdir -p /var/log/cron

# 启动 cron 和 Nginx
CMD (crond -f &) && nginx -g "daemon off;"


