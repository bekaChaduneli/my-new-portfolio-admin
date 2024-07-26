// eslint-disable-next-line no-undef
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: {
    react: { version: "18.2" },
    "import/resolver": {
      node: { extensions: [".js", ".cjs", ".mjs", "jsx"] },
    },
  },
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": 0,
    "import/no-named-as-default-member": 0,
    "react-hooks/exhaustive-deps": "off",
    "linebreak-style": ["error", "unix"],
    "object-curly-spacing": ["error", "always"],
    "@next/next/no-img-element": 0,
    indent: ["error", 2, { SwitchCase: 1 }],
    "space-infix-ops": 2,
    "eol-last": 2,
    quotes: ["error", "single"],
    curly: ["error", "multi-line"],
    semi: ["error", "always"],
    eqeqeq: ["error", "always"],
    "no-var": 2,
    "dot-notation": 2,
    "no-unused-vars": ["error", { vars: "all" }],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
      },
    ],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 2,
        maxEOF: 0,
      },
    ],
    "import/no-unresolved": 0,
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
      },
    ],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    "spaced-comment": ["error", "always"],
    "no-param-reassign": "off",
    "no-alert": 2,
    "no-console": 2,
  },
};
