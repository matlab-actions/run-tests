#!/bin/bash

source ./node_modules/common-utils/scripts/setupdeps.sh

# Copy action specific plugins to dist
cp -R ./plugins $(pwd)/dist/

SCRIPTGEN_URL='https://ssd.mathworks.com/supportfiles/ci/matlab-script-generator/v0/matlab-script-generator.zip'

wget -O scriptgen.zip $SCRIPTGEN_URL
unzip -qod scriptgen scriptgen.zip
mv -f scriptgen $DISTDIR
rm scriptgen.zip

mv -f ./* "$DISTDIR/bin"
rm -rf $WORKINGDIR
