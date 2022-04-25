'use strict';
const fs = require('fs');
const path = require('path');

const { Reporter } = require('@parcel/plugin');

const copyWellKnown = (knownPath, distPath) => {
  if (fs.existsSync(knownPath)) {
    const fileName = path.basename(knownPath);
    const distName = `${distPath}/${fileName}`;
    const stats = fs.statSync(knownPath);
    if (stats.isDirectory()) {
      fs.cpSync(knownPath, distName, { recursive: true });
      process.stdout.write(`Copied ${path.basename(distPath)}/${fileName}\n`);
    } else {
      fs.copyFileSync(knownPath, distName);
      process.stdout.write(`Copied ${path.basename(distPath)}/${fileName}\n`);
    }
  }
};

const getFirstHtmlBundle = (bundleGraph) => {
  for (const b of bundleGraph.getBundles()) {
    if (b.type === 'html') {
      return b;
    }
  }
  throw new Error('No HTML Bundles found');
};

// const getRobotsAsset = (rootPath) => {
//   let ret;
//   // robots.txt
//   const robotsPath = path.join(rootPath, 'robots.txt');
//   if (fs.accessSync(robotsPath, fs.constants.R_OK)) {
//     const robotsCode = fs.readFileSync(robotsPath, 'utf8');
//     ret = {
//       code: robotsCode,
//       filePath: robotsPath,
//       isEntry: true,
//     };
//   }
//   return ret;
// };

module.exports = new Reporter({
  report({ event }) {
    if (event.type === 'buildSuccess') {
      const bundle = getFirstHtmlBundle(event.bundleGraph);
      const distPath = bundle.target.distDir;
      const [bundleGroup] = event.bundleGraph.getBundleGroupsContainingBundle(bundle);
      const srcPath = event.bundleGraph.getEntryRoot(bundleGroup.target);

      const wellKnowns = [ '.well-known', 'humans.txt', 'robots.txt' ];
      for (const knownPath of wellKnowns) {
        copyWellKnown(path.join(srcPath, knownPath), distPath);
      }
    }
  },
});
