rm -rf dist build
npx vite build
mkdir dist/images
cp images/* dist/images
mkdir dist/utils
cp utils/jquery.js dist/utils

mkdir -p build/carpathia/boardview
mv dist/* build/carpathia/boardview
