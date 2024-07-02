**This repository is archived as the current Terraform registry is better than it was before**

# tflookup - Terraform Documentation Lookup

## Introduction

This web app is a searchable index of the Terraform provider documentation and lets you quickly jump to the relevant page you're looking for.

## Missing documentation

Currently, some documentations have bugs and can not be indexed by the process. Check out the indexErrors.txt for a current list of invalid files.

## Building

To build this app, you'll have to build the static app and the server:

    cd static
    npm install
    npm run-script build
    cd ..
    grunt build

## Running

To run the server, that delivers the API and web app, run

    node index.js

## Providing an index

By default, the server will build up an index by indexing the terraform-website submodule. Cloning the submodules takes a **long** time, so there's a secondary option.

There's a pre-built index called documentationIndex.json which can be used by setting the environment variable TFLOOKUP_INDEXFILE:

    TFLOOKUP_INDEXFILE=documentationIndex.json node index.js

## Building the index file

The index file is built and commited periodically built by an external cronjob, that uses the "updateIndex.sh" script.

## Docker

You can also use a docker image to run the server by running

    docker build -t tflookup:latest .
    docker run --name tflookup --rm -d -P tflookup:latest
    docker port tflookup

This will start the server and show you the mapped port where you can access it locally.
