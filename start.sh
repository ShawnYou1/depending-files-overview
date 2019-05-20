#!/usr/bin/env bash

cd src;

# check if file exist
if [ -d "react-master" ]; then
    node main.js
else
    if [ -f master.zip ]; then
        unzip master.zip
    else
        wget https://github.com/facebook/react/archive/master.zip
        unzip master.zip
    fi
    node main.js
fi



