#!/bin/sh

# 定义保存文件的路径
OUTPUT_FILE="/usr/share/nginx/html/exchange_rates.json"

# 打印开始日志
echo "$(date '+%Y/%m/%d %H:%M:%S GMT+8') - 开始下载汇率数据..."

# 使用 curl 下载汇率数据
curl -s https://gwwc.github.io/mjj/exchange_rates.json > /tmp/temp_rates.json
if [ $? -eq 0 ]; then
    echo "$(date '+%Y/%m/%d %H:%M:%S GMT+8') - 汇率数据下载成功。"
else
    echo "$(date '+%Y/%m/%d %H:%M:%S GMT+8') - 汇率数据下载失败！"
    exit 1
fi

# 获取当前时间（GMT+8）
CURRENT_TIME=$(TZ="GMT-8" date +"%Y/%m/%d %H:%M GMT+8")

# 使用 jq 处理 JSON 数据并保存为指定格式
jq --arg date "$CURRENT_TIME" '
{
    date: $date,
    rates: .rates
}' /tmp/temp_rates.json > $OUTPUT_FILE

if [ $? -eq 0 ]; then
    echo "$(date '+%Y/%m/%d %H:%M:%S GMT+8') - 汇率数据已成功保存到 $OUTPUT_FILE。"
else
    echo "$(date '+%Y/%m/%d %H:%M:%S GMT+8') - 汇率数据保存失败！"
    exit 1
fi

# 打印完成日志
echo "$(date '+%Y/%m/%d %H:%M:%S GMT+8') - 脚本执行完成。"