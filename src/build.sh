#!/bin/bash -ex
sudo tsc -p tsconfig.json
cp package.json ../dist/package.json
cp -r node_modules/ ../dist/node_modules/
cp -r static/ ../dist/static/
