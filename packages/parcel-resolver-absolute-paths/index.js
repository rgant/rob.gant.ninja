'use strict';
const path = require('path');

const { Resolver } = require('@parcel/plugin');

module.exports = new Resolver({
  async resolve({ dependency, options, specifier }) {
    if (!dependency.isEntry && specifier.startsWith('/')) {
      const relativePath = path.relative(options.projectRoot, dependency.sourcePath);
      const [srcDir] = relativePath.split(path.sep);
      return { filePath: path.join(options.projectRoot, srcDir, specifier) };
    }

    return null;
  },
});
