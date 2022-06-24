import { resolve } from 'path';
import { buildTypescriptLib } from '@alqmc/build-ts';
import { enterPath, outputPath, rootPath } from './utils/path';
import type { DefineTsConfig } from '@alqmc/build-ts';

const buildConfig: DefineTsConfig = {
  baseOptions: {
    input: resolve(enterPath, 'index.ts'),
    outPutPath: outputPath,
    enterPath,
    pkgPath: resolve(enterPath, 'package.json'),
    tsConfigPath: resolve(rootPath, 'tsconfig.json'),
    preserveModules: false,
    extraOptions: {
      banner: '#!/usr/bin/env node',
    },
  },
  buildProduct: ['lib'],
  pureOutput: true,
};

export const buildBundle = async () => {
  return buildTypescriptLib(buildConfig);
};
