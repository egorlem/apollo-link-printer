#!/bin/bash -e

# script from https://github.com/apollographql/apollo-link-rest

npm run build

# Make sure the ./npm directory is empty
rm -rf ./npm
mkdir ./npm

# Copy all files from ./lib to /npm
cd ./lib && cp -r ./ ../npm/

# Back to the root directory
cd ../

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
node -e "var package = require('./package.json'); \
  delete package.babel; \
  delete package[\"lint-staged\"]; \
  delete package.jest; \
  delete package.bundlesize; \
  delete package.scripts; \
  delete package.options; \
  package.main = 'bundle.umd.js'; \
  package.browser = 'bundle.umd.js'; \
  package.module = 'index.js'; \
  package['jsnext:main'] = 'index.js'; \
  package['react-native'] = 'index.js'; \
  package.typings = 'index.d.ts'; \
  var origVersion = 'local';
  var fs = require('fs'); \
  fs.writeFileSync('./npm/package.json', JSON.stringify(package, null, 2)); \
  "

# Copy few more files to ./npm
cp .ABOUT.md npm/README.md
cp LICENSE.md npm/

echo "deploying to npm…"
(cd npm && npm publish) || (>&2 echo "If this failed with ENEEDAUTH, remember that 'yarn deploy' won't work because yarn hot-patches npm's registry to yarn pkg.com")