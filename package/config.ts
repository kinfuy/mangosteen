import type prompts from 'prompts';

// rule条件为and关系 Condition为或者关系
export interface Condition {
  rule: {
    key: string;
    value: any;
  }[];
}
export interface CustomQuestions extends prompts.PromptObject<string> {
  condition?: Condition[];
}
export type MoConfig = Array<CustomQuestions>;
export const defalutConfig: MoConfig = [
  {
    name: 'template',
    type: 'select',
    message: 'Please Choose a template',
    choices: [
      { title: 'node-cli', value: 'node-cli' },
      { title: 'chrome-extension', value: 'chrome-extension' },
      { title: 'svg-icon', value: 'svg-icon' },
    ],
    initial: 0,
  },
];
