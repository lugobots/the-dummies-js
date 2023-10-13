#!/bin/bash

if [ -z "$(ls -A .)" ]; then
   if ! git clone -q https://github.com/lugobots/the-dummies-js.git  &>/dev/null
   then
     echo "fail to clone the repo :-("
     exit
   fi
   cd the-dummies-py
   LATEST_VERSION=$(git describe --tags $(git rev-list --tags --max-count=1))
   echo "Latest version: "$LATEST_VERSION
   if [ -z "$VERSION" ]
   then
         INSTALL_VERSION=$LATEST_VERSION
   else
         INSTALL_VERSION=$VERSION
   fi
   git fetch --all --tags -q  &>/dev/null
   git checkout -q tags/$INSTALL_VERSION || { echo 'could not checkout that tag, does it actually exist?' ; exit 1; }
   echo "Installing The Dummies JS Version "$INSTALL_VERSION
   cd ..
   mv the-dummies-py/* .
   rm -rf the-dummies-py
   echo "All done!"
   echo ""
   echo "On Linux or Mac, Please fix the file permissions running:"
   echo "chown \$USER -R ."
else
   echo "The output directory must be empty"
fi
