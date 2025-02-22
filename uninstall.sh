#!/bin/bash


cd rvc
sudo docker-compose down
sudo docker rmi reg.naloong.de/library/rvcs:amd64
rm -rf rvc











