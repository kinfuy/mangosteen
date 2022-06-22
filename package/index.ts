import { join, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import minimist from 'minimist';
import { bgGreen, bgYellow, green } from 'kolorist';
import { getUserConfig } from './generator/question';
import { emptyDir, formatTargetDir } from './utils/utils';
import { render } from './generator/render';
import { run } from './generator/shell';

const argv = minimist(process.argv.slice(2), { string: ['_'] });

const cwd = process.cwd();
const def = {
  defaultTargetDir: 'mangosteen-project',
};

const init = async () => {
  const config = await getUserConfig({ targetDir: formatTargetDir(argv._[0]) });
  const {
    targetDir,
    overwrite,
    projectName,
    packageName = projectName ?? def.defaultTargetDir,
    description,
    author,
    eslint,
    template,
    commitlint,
    stylelint,
    packageManager = 'pnpm',
  } = config;

  const root = join(cwd, targetDir ?? def.defaultTargetDir);

  if (existsSync(root) && overwrite) {
    emptyDir(root);
  } else if (!existsSync(root)) {
    mkdirSync(root);
  }

  const pkg = {
    name: packageName,
    description: description ?? '',
    author: author ?? '',
  };
  writeFileSync(resolve(root, 'package.json'), JSON.stringify(pkg, null, 2));

  const templateRoot = resolve(__dirname, 'template');
  if (template) {
    render(root, templateRoot, `template-${template}`);
  }
  if (eslint) {
    render(root, templateRoot, 'eslint');
  }
  if (stylelint) {
    render(root, templateRoot, 'stylelint');
  }
  if (commitlint) {
    render(root, templateRoot, 'commitlint');
  }
  console.log(`${bgGreen('mangosteen')}: 模板渲染成功`);
  console.log(`${bgYellow('mangosteen')}: git初始化...`);
  await run('git init', root);
  console.log(`${bgGreen('mangosteen')}: git初始化成功`);
  console.log(`${bgYellow('mangosteen')}: 依赖安装中...`);

  if (packageManager === 'yarn') {
    await run(`${packageManager}`, root);
  } else {
    await run(`${packageManager} install`, root);
  }
  console.log(`${bgGreen('mangosteen')}: 依赖安装成功`);
  console.log(`\n\t${green(`cd ${targetDir}`)}`);
  console.log(`\t${green(`${packageManager} run serve`)}\n`);
};

init().catch((e) => {
  console.error(e);
});
