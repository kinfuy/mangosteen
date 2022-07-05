import { red, reset } from 'kolorist';
import prompts from 'prompts';
import {
  canSafelyOverwrite,
  formatTargetDir,
  isValidPackageName,
  toValidPackageName,
} from '../utils/utils';
import type { CustomQuestions, MoConfig } from '../config';

interface UserConfigOptions {
  moConfig: MoConfig;
  targetDir?: string;
}

interface UserConfig extends Record<string, any> {
  targetDir?: string;
  projectName?: string;
  packageName?: string;
  overwrite?: boolean;
  description?: string;
  author?: string;
  template?: string;
  commitlint?: boolean;
  eslint?: boolean;
  stylelint?: boolean;
  readme?: boolean;
  packageManager?: 'pnpm' | 'yarn' | 'npm';
}

export const getUserConfig = async ({
  targetDir,
  moConfig,
}: UserConfigOptions) => {
  const answer: UserConfig = {
    targetDir,
  };
  const baseQuestions: Array<prompts.PromptObject<string>> = [
    {
      name: 'projectName',
      type: targetDir ? null : 'text',
      message: reset('Project name:'),
      onState: (state) => {
        answer.targetDir = formatTargetDir(state.value) || targetDir;
      },
    },
    {
      name: 'overwrite',
      type: (prev, options) => {
        if (options.projectName && canSafelyOverwrite(options.projectName)) {
          return null;
        }
        if (answer.targetDir && canSafelyOverwrite(answer.targetDir)) {
          return null;
        }
        return 'toggle';
      },
      message: () => `目录已经存在，是否覆盖改目录？`,
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      name: 'overwriteChecker',
      type: (prev, options) => {
        if (options.overwrite === false) {
          throw new Error(`${red('✖')} Operation cancelled`);
        }
        return null;
      },
    },
    {
      name: 'packageName',
      type: () =>
        answer.targetDir && isValidPackageName(answer.targetDir)
          ? null
          : 'text',
      message: 'Package name:',
      initial: () => toValidPackageName(answer.targetDir || 'mangosteen'),
      validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
    },
    {
      name: 'description',
      type: 'text',
      message: 'Project description',
      initial: 'mangosteen cli project',
    },
    {
      name: 'author',
      type: 'text',
      message: 'Author',
    },
  ];
  const customQuestions: Array<prompts.PromptObject<string>> =
    generaterQuestions(moConfig);
  const ruleQuestions: Array<prompts.PromptObject<string>> = [
    {
      name: 'commitlint',
      type: 'toggle',
      message: 'install commitlint ？',
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      name: 'stylelint',
      type: 'toggle',
      message: 'install stylelint?',
      initial: false,
      active: 'Yes',
      inactive: 'No',
    },
    {
      name: 'eslint',
      type: 'toggle',
      message: 'install eslint?',
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      name: 'readme',
      type: 'toggle',
      message: 'add README.md?',
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      name: 'packageManager',
      type: 'select',
      message: 'Please Choose packageManager',
      choices: [
        { title: 'pnpm', value: 'pnpm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'npm', value: 'npm' },
      ],
      initial: 0,
    },
  ];
  const questions: Array<prompts.PromptObject<string>> = [
    ...baseQuestions,
    ...customQuestions,
    ...ruleQuestions,
  ];
  try {
    const answers = (await prompts(questions, {
      onCancel: () => {
        throw new Error(`${red('✖')} Operation cancelled`);
      },
    })) as UserConfig;
    Object.assign(answer, answers);
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
  return answer;
};

/**
 * 验证条件
 * @param option
 * @returns
 */
const generaterCondition =
  (option: CustomQuestions) => (pre: any, config: UserConfig) => {
    const show = option.condition?.some((x) =>
      x.rule.every((rule) => config[rule.key] === rule.value)
    );
    if (show) return option.type;
    return null;
  };

/**
 * 生成用户配置问题
 * @param vixConfig
 * @returns
 */
export const generaterQuestions = (moConfig: MoConfig) =>
  moConfig.map((x) => {
    if (x.condition && x.condition.length > 0) {
      return {
        ...x,
        type: generaterCondition(x),
      } as CustomQuestions;
    }
    return x;
  });
