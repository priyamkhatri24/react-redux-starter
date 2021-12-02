const fs = require('fs');
const path = require('path');
const glob = require('glob');

const assets = glob.sync(`${__dirname}/build/static/media/*.woff*`).map((assetPath) => {
  return path.relative(`${__dirname}/build`, assetPath);
});

const pathToEntry = './build/index.html';
const splitBy = '</title>';

const builtHTMLContent = fs.readFileSync(pathToEntry).toString();

const parts = builtHTMLContent.split(splitBy);

const fileWithPreload = [parts[0], splitBy];

for (const link of assets) {
  fileWithPreload.push(
    `<link rel="preload" href="./${link}" as="font" type="font/woff" crossorigin>`,
  );
}

fileWithPreload.push(parts[1]);

fs.writeFileSync(pathToEntry, fileWithPreload.join(''));
