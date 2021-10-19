module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'es6': true
  },
  'extends': [
    'airbnb-typescript/base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
    project: './tsconfig.json',
  },
  'plugins': [
    '@typescript-eslint',
    'import',
  ],
  'rules': {
  }
};
