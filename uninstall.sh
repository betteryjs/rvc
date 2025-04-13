#!/bin/bash


cd rvc
sudo docker-compose down
cd ..
sudo docker rmi reg.naloong.de/library/rvc
sudo rm -rf rvc












