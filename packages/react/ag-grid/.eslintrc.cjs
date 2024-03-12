module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react/react-in-jsx-scope': 'off',
    'import/order': [
      'error',
      {
        // 对导入模块进行分组
        groups: [
          'builtin',
          'external',
          ['internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'unknown',
        ],
        // // 通过路径自定义分组
        // pathGroups: [
        //   {
        //     // pattern：当前组中模块的最短路径匹配
        //     pattern: '@app/**', // 在规定的组中选其一，index、sibling、parent、internal、external、builtin、object、type、unknown
        //     group: 'external',
        //     // 定义组的位置，after、before
        //     position: 'after',
        //   },
        // ],
        pathGroupsExcludedImportTypes: ['builtin'],
        // newlines-between 不同组之间是否进行换行
        'newlines-between': 'always',
        // alphabetize 根据字母顺序对每个组内的顺序进行排序
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
