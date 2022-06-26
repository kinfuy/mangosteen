import { resolve } from 'path';
import { bgGreen, bgYellow } from 'kolorist';
import { emptyDir } from '../utils/utils';
import { run } from './shell';

export const downloadRepo = async () => {
  console.log(`${bgYellow('mangosteen')}: 正在更新模板仓库请稍后...`);
  const templateRoot = resolve(__dirname);
  emptyDir(resolve(templateRoot, 'mo-templates'));
  await run(
    'git clone https://gitee.com/Y_onghu/mo-templates.git',
    templateRoot
  );
  emptyDir(resolve(templateRoot, 'mo-templates'), [
    'package.json',
    'templates',
  ]);
  console.log(`${bgGreen('mangosteen')}: 模板更新成功`);
};
