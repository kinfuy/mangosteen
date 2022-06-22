import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { basename, resolve } from 'path';
import deepMerge from '../utils/deepMerge';
import { sortDependencies } from '../utils/utils';

export const render = (
  root: string,
  templateRoot: string,
  templateName: string
) => {
  const templateDir = resolve(templateRoot, templateName);
  renderTemplate(root, templateDir);
};

export const renderTemplate = (root: string, templateDir: string) => {
  const stats = statSync(templateDir);

  if (stats.isDirectory()) {
    if (basename(templateDir) === 'node_modules') return;
    mkdirSync(root, { recursive: true });
    for (const file of readdirSync(templateDir)) {
      renderTemplate(resolve(root, file), resolve(templateDir, file));
    }
    return;
  }

  const filename = basename(templateDir);

  if (filename === 'package.json' && existsSync(root)) {
    const existing = JSON.parse(readFileSync(root, 'utf8'));
    const newPackage = JSON.parse(readFileSync(templateDir, 'utf8'));
    const pkg = sortDependencies(deepMerge(existing, newPackage));
    writeFileSync(root, `${JSON.stringify(pkg, null, 2)}\n`);
    return;
  }
  if (filename === '.eslintrc.js' && existsSync(root)) {
    renderEslint(root, templateDir);
    return;
  }
  copyFileSync(templateDir, root);
};

export const renderEslint = async (root: string, templateDir: string) => {
  const rootEslint = await require(root);
  const templateEslit = await require(templateDir);
  const eslint = sortDependencies(deepMerge(rootEslint, templateEslit));
  writeFileSync(root, `module.exports = ${JSON.stringify(eslint, null, 2)}\n`);
};
