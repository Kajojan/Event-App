module.exports = {
  globals: {
    jest: 'readonly',
  },
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['node', 'jest'],
  rules: {
    'node/no-unpublished-require': 'off',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'max-len': [
      'error',
      150,
      {
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
      },
    ],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'spaced-comment': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'space-before-blocks': ['error', 'always'],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-infix-ops': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'node/no-unpublished-import': 'off',
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
  },
  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.node'],
      version: '>=14.0.0',
    },
  },
}
