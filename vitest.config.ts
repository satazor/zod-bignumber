/* eslint-disable n/file-extension-in-import */

/**
 * Module dependencies.
 */

import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

/**
 * Constants.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Export config.
 */

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
    },
  },
});
