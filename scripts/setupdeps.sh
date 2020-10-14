#!/bin/bash

RMC_URL='https://ssd.mathworks.com/supportfiles/ci/run-matlab-command/v0/run-matlab-command.zip'
SCRIPTGEN_URL='https://ssd.mathworks.com/supportfiles/ci/matlab-script-generator/v0/matlab-script-generator.zip'

# Create dist directory if it doesn't already exist
DISTDIR="$(pwd)/dist"
mkdir -p $DISTDIR

# Download and extract in a temporary directory
WORKINGDIR=$(mktemp -d -t rmc_build)
cd $WORKINGDIR

# Download Run MATLAB Command helpers
wget -O bin.zip $RMC_URL 
unzip -qod bin bin.zip
mv -f bin $DISTDIR/

# Download Scriptgen helpers
wget -O scriptgen.zip $SCRIPTGEN_URL
unzip -qod scriptgen scriptgen.zip
mv -f scriptgen $DISTDIR

rm -rf $WORKINGDIR
