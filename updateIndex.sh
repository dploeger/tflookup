#!/usr/bin/env bash

rm documentationIndex.json
rm indexErrors.txt
git submodule update --remote --merge
TFLOOKUP_INDEXFILE=documentationIndex.json TFLOOKUP_STORE_INDEX=true TFLOOKUP_START_SERVER=false node index.js 2>&1 | grep "Can't load" | awk '{ print $7 }' | sed -re "s/:$//gi" > indexErrors.txt
git commit -am "chore: Updated documentation index"
git push origin master
