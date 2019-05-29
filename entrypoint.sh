#!/usr/bin/env bash

cd /usr/src/app

curl -s https://raw.githubusercontent.com/dploeger/tflookup/master/documentationIndex.json > documentationIndex.json

TFLOOKUP_INDEXFILE=documentationIndex.json node index.js
