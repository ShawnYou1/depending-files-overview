#!/usr/bin/env bash

cd src

rm master.zip
wget https://github.com/facebook/react/archive/master.zip

rm -rf react-master
unzip master.zip

node main.js

