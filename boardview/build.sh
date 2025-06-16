rm -rf dist
npx vite build --base=/carpathia/boardview
mkdir dist/images
cp images/* dist/images
mkdir dist/utils
cp utils/jquery.js dist/utils

mkdir -p carpathia/boardview
mv dist/* carpathia/boardview
mv carpathia dist
