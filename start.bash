#!/usr/bin/env bash

CWD=$(pwd)

echo "$CWD"

cd "$CWD"/server
npm install && npm start &

cd "$CWD"/word-wise/
npm install && npm run dev &
