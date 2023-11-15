#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

yarn

npx prisma db pull
npx prisma generate

pm2 start dist