set -e
mkdir -p probe-out
ONLY=fda,auv node tools/dump-sources.js probe-out/dump > probe-out/dump.txt 2>&1 || echo "dump exit $?" >> probe-out/dump.txt
node lib/build.js > probe-out/build.txt 2>&1 || echo "build exit $?" >> probe-out/build.txt
mkdir -p probe-out/v2 && cp public/v2/index.json public/v2/us.json public/v2/xk.json probe-out/v2/ 2>/dev/null || true
git checkout -- public state
git clean -fdq public
