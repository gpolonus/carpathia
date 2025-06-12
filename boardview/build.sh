rm -rf dist
npx vite build
mkdir dist/images
cp images/* dist/images
mkdir dist/assets/utils
cp utils/jquery.js dist/assets/utils
