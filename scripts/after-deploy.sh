#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo yarn

sudo npx prisma db pull
sudo npx prisma generate

sudo pm2 start dist