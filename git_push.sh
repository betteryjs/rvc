#!/bin/bash

# 获取当前时间
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')

# Git 操作
git add .
git commit -m "Auto Update at $CURRENT_TIME"
git push origin master -f
