module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["plugin:prettier/recommended", "prettier", "plugin:react-hooks/recommended", "eslint:recommended", "plugin:react/recommended"],
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
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};
