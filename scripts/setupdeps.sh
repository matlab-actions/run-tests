#!/bin/bash

# Temporarily using a snapshot build of scriptgen until the official release is available
# TODO: Before merging to main branch, Update to official release URL when available
# SCRIPTGEN_URL='https://ssd.mathworks.com/supportfiles/ci/matlab-script-generator/v0/matlab-script-generator.zip'
SCRIPTGEN_URL='https://mw-ci-static-dev.s3.us-east-1.amazonaws.com/matlab-script-generator/v0/matlab-script-generator-0.13.0-SNAPSHOT.zip'
RMC_BASE_URL='https://ssd.mathworks.com/supportfiles/ci/run-matlab-command/v2'
SUPPORTED_OS=('win64' 'maci64' 'maca64' 'glnxa64')

# Create dist directory if it doesn't already exist
DISTDIR="$(pwd)/dist"
mkdir -p $DISTDIR/bin

# Create plugins directory and copy plugin code
cp -R plugins $(pwd)/dist/

# Download and extract in a temporary directory
WORKINGDIR=$(mktemp -d -t rmc_build.XXXXXX)
cd $WORKINGDIR

wget -O  "$WORKINGDIR/license.txt" "$RMC_BASE_URL/license.txt"
wget -O  "$WORKINGDIR/thirdpartylicenses.txt" "$RMC_BASE_URL/thirdpartylicenses.txt"

for os in ${SUPPORTED_OS[@]}
do
    if [[ $os == 'win64' ]] ; then
        bin_ext='.exe'
    else
        bin_ext=''
    fi
    mkdir -p "$WORKINGDIR/$os"
    wget -O  "$WORKINGDIR/$os/run-matlab-command$bin_ext" "$RMC_BASE_URL/$os/run-matlab-command$bin_ext"
done

wget -O scriptgen.zip $SCRIPTGEN_URL
unzip -qod scriptgen scriptgen.zip
mv -f scriptgen $DISTDIR
rm scriptgen.zip

mv -f ./* "$DISTDIR/bin"
rm -rf $WORKINGDIR

