#!/bin/bash


cd rvc
sudo docker-compose down
cd ..
sudo docker rmi reg.naloong.de/library/rvcs
sudo rm -rf rvc












