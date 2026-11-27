set -e
mkdir -p probe-out
ONLY=fda node tools/dump-sources.js probe-out/dump > probe-out/dump.txt 2>&1 || echo "dump exit $?" >> probe-out/dump.txt
node lib/build.js > probe-out/build.txt 2>&1 || echo "build exit $?" >> probe-out/build.txt
cp public/v1/recalls.json probe-out/recalls-preview.json
mkdir -p probe-out/v2 && cp public/v2/*.json probe-out/v2/ 2>/dev/null || true
git checkout -- public state
git clean -fdq public
