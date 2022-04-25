'use strict';
const path = require('path');

const { Namer } = require('@parcel/plugin');
const defaultNamer = require('@parcel/namer-default').default;

const CONFIG = Symbol.for('parcel-plugin-config');
const configDefaultNamer = defaultNamer[CONFIG];

module.exports = new Namer({
  name(params) {
    const [bundleGroup] = params.bundleGraph.getBundleGroupsContainingBundle(params.bundle);
    // rootPath -> /Users/rgant/Programming/rob.gant.ninja/src
    const rootPath = params.bundleGraph.getEntryRoot(bundleGroup.target);
    // mainEntry -> /Users/rgant/Programming/rob.gant.ninja/src/assets/favicon16.png
    const mainEntry = params.bundle.getMainEntry();
    // relativePath -> assets/favicon16.png
    const relativePath = path.relative(rootPath, mainEntry.filePath);
    // dirName -> assets
    const dirName = path.dirname(relativePath);

    const fileName = path.basename(mainEntry.filePath);
    let defaultName = fileName === 'favicon.ico' ? fileName : configDefaultNamer.name(params);

    // Not bundling JS, so the defaultNamer mangling the name to index is not desired.
    if (params.bundle.type === 'js') {
      const firstDot = defaultName.indexOf('.');
      defaultName = `${path.basename(mainEntry.filePath, '.js')}${defaultName.slice(firstDot)}`;
    }

    if (dirName !== '.') {
      return path.join(dirName, defaultName);
    }

    return defaultName;
  },
});
