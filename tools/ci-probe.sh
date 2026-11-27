set -e
mkdir -p probe-out
ONLY=nvwa node tools/dump-sources.js probe-out/dump > probe-out/dump.txt 2>&1 || echo "dump exit $?" >> probe-out/dump.txt
node lib/build.js > probe-out/build.txt 2>&1 || echo "build exit $?" >> probe-out/build.txt
cp public/v1/recalls.json probe-out/recalls-preview.json
git checkout -- public state
