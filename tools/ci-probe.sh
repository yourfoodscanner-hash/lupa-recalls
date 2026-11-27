set -e
ONLY=fvst,pranyr,efet,rasff node tools/dump-sources.js probe-out
node lib/build.js --check > probe-out/build.txt 2>&1 || echo "build exit $?" >> probe-out/build.txt
