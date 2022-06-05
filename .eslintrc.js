module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["plugin:prettier/recommended", "prettier"],
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      plugins: ["prettier", "react", "react-hooks", "unused-imports"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2021,
      },
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [".*"],
                message: "please use absolute import path instead.",
              },
            ],
          },
        ],
      },
    },
  ],
  ignorePatterns: ["cypress/*"],
};
