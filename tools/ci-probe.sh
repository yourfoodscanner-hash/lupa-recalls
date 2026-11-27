set -e
node lib/build.js > probe-out/build.txt 2>&1 || echo "build exit $?" >> probe-out/build.txt
cp public/v1/recalls.json probe-out/recalls-preview.json
git checkout -- public state
