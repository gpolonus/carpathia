rm -rf dist
npx vite build
mkdir dist/images
cp images/* dist/images
mkdir dist/utils
cp utils/jquery.js dist/utils
