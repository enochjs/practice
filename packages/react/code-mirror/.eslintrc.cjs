module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
  ],
  // settings: {
  //   'import/resolver': {
  //     //   node: {
  //     //     extensions: ['.js', '.jsx', '.ts', '.tsx'],
  //     //   },
  //     alias: {
  //       map: [['@', './src']],
  //     },
  //   },
  // },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".d.ts", ".tsx"],
      },
      typescript: {
        project: "./tsconfig.json",
      },
      alias: {
        map: [["@", path.resolve(__dirname, "./src")]],
        extensions: [".js", ".jsx", ".ts", ".d.ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: { react: { version: "18.2" } },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "react/react-in-jsx-scope": "off",
    "import/order": [
      "error",
      {
        // 对导入模块进行分组
        groups: [
          "builtin",
          "external",
          ["internal", "parent", "sibling", "index", "object", "type"],
          "unknown",
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        // newlines-between 不同组之间是否进行换行
        // 'newlines-between': 'always',
        // alphabetize 根据字母顺序对每个组内的顺序进行排序
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
