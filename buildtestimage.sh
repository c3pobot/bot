#!/bin/bash
testRegistry=$(cat .env.build)
container="$testRegistry/$1"
echo building $container
