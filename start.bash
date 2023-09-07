#!/usr/bin/env bash

CWD=$(pwd)

echo "$CWD"

node "$CWD"/server/populate-initial-words.js

cd "$CWD"/server
npm install && npm start &

cd "$CWD"/word-wise/
npm install && npm run build && npm run preview &

wait
