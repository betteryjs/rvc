#!/bin/bash


cd rvc
sudo docker-compose down
cd ..
sudo docker rmi cdn-reg.naloong.de/library/rvcs
sudo rm -rf rvc












