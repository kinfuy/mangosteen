import { resolve } from 'path';
import { buildTypescriptLib, DefineLibConfig } from '@alqmc/build-ts';
import { enterPath, outputPath, rootPath } from './utils/path';

const buildConfig: DefineLibConfig = {
  baseOptions: {
    input: resolve(enterPath, 'index.ts'),
    outPutPath: outputPath,
    enterPath: enterPath,
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
