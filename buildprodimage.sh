#!/bin/bash
file1=$(head -n 1 .testregistry)
tag=$1
if [[ "$file1" ]]
then
  echo 'personal registry set'
  registry="${file1%%[[:cntrl:]]}"
else
  registry="ghcr.io"
  echo "using ghcr.io for test build"
fi
docker build -t "ghcr.io/${tag}:latest" .
docker push "ghcr.io/${tag}:latest"
