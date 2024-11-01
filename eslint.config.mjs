import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import preferArrow from 'eslint-plugin-prefer-arrow';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [ './src/jsvendor/', '**/*.min.*', '**/*.html' ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
  ),
  {
    plugins: {
      'prefer-arrow': preferArrow,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
      },

      ecmaVersion: 2017,
      sourceType: 'script',
    },

    rules: {
      'no-await-in-loop': 'error',

      'no-console': [ 'error', {
        allow: [ 'warn', 'error' ],
      } ],

      'no-extra-parens': 'error',
      'no-loss-of-precision': 'warn',
      'no-promise-executor-return': 'error',
      'no-template-curly-in-string': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-useless-backreference': 'error',
      'require-atomic-updates': 'error',
      'array-callback-return': 'error',
      'block-scoped-var': 'off',
      'consistent-return': 'error',
      curly: 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-location': [ 'error', 'property' ],
      'dot-notation': 'error',

      eqeqeq: [ 'error', 'always', {
        null: 'ignore',
      } ],

      'no-alert': 'error',
      'no-caller': 'error',
      'no-constructor-return': 'error',
      'no-div-regex': 'error',
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'no-eq-null': 'off',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-floating-decimal': 'off',

      'no-implicit-coercion': [ 'warn', {
        allow: [ '!!' ],
      } ],

      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-iterator': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': 'error',
      'no-multi-spaces': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      radix: 'error',
      'require-await': 'off',
      'require-unicode-regexp': 'error',
      'vars-on-top': 'off',
      'wrap-iife': [ 'error', 'inside' ],
      yoda: 'error',
      strict: [ 'error', 'safe' ],
      'no-label-var': 'error',
      'no-shadow': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'error',
      'no-use-before-define': 'error',

      'array-bracket-newline': [ 'error', {
        multiline: true,
      } ],

      'array-bracket-spacing': [ 'error', 'always', {
        singleValue: false,
      } ],

      'array-element-newline': [ 'error', 'consistent' ],
      'block-spacing': 'error',

      'brace-style': [ 'error', '1tbs', {
        allowSingleLine: true,
      } ],

      camelcase: 'error',
      'capitalized-comments': 'off',
      'comma-dangle': [ 'error', 'always-multiline' ],
      'comma-spacing': 'error',
      'comma-style': 'error',
      'computed-property-spacing': 'error',
      'eol-last': 'error',
      'func-call-spacing': 'error',

      'func-style': [ 'error', 'declaration', {
        allowArrowFunctions: true,
      } ],

      'function-call-argument-newline': [ 'error', 'consistent' ],
      'function-paren-newline': [ 'error', 'consistent' ],

      'id-denylist': [
        'error',
        'any',
        'Number',
        'number',
        'String',
        'string',
        'Boolean',
        'boolean',
        'Undefined',
        'undefined',
      ],

      'implicit-arrow-linebreak': 'off',

      indent: [ 'error', 4, {
        ArrayExpression: 'first',

        CallExpression: {
          arguments: 'first',
        },

        FunctionDeclaration: {
          parameters: 'first',
        },

        FunctionExpression: {
          parameters: 'first',
        },

        ObjectExpression: 'first',
        SwitchCase: 1,
      } ],

      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'lines-between-class-members': 'error',
      'max-depth': [ 'error', 2 ],

      'max-len': [ 'error', {
        ignorePattern: '^\\s*(// |\\* )?\\S+$',
        code: 140,
      } ],

      'max-nested-callbacks': [ 'error', 2 ],
      'max-statements-per-line': 'error',
      'new-cap': 'error',
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-continue': 'error',
      'no-lonely-if': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multi-assign': 'error',

      'no-multiple-empty-lines': [ 'error', {
        max: 1,
        maxBOF: 0,
        maxEOF: 1,
      } ],

      'no-negated-condition': 'error',
      'no-new-object': 'error',
      'no-plusplus': 'off',
      'no-tabs': 'error',
      'no-trailing-spaces': 'error',
      'no-underscore-dangle': 'error',

      'no-unneeded-ternary': [ 'error', {
        defaultAssignment: false,
      } ],

      'no-whitespace-before-property': 'error',

      'object-curly-newline': [ 'error', {
        ExportDeclaration: {
          consistent: true,
        },

        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
        },

        ObjectExpression: {
          minProperties: 4,
          multiline: true,
        },

        ObjectPattern: {
          consistent: true,
        },
      } ],

      'object-curly-spacing': [ 'error', 'always' ],

      'object-property-newline': [ 'error', {
        allowAllPropertiesOnSameLine: true,
      } ],

      'one-var': [ 'error', 'never' ],
      'operator-linebreak': 'error',
      'padded-blocks': [ 'error', 'never' ],
      'prefer-object-spread': 'error',
      'quote-props': [ 'error', 'as-needed' ],
      quotes: [ 'error', 'single' ],
      semi: [ 'error', 'always' ],
      'semi-spacing': 'error',
      'semi-style': 'error',

      'sort-keys': [ 'error', 'asc', {
        caseSensitive: false,
      } ],

      'sort-vars': [ 'error', {
        ignoreCase: true,
      } ],

      'space-before-blocks': 'error',

      'space-before-function-paren': [ 'error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      } ],

      'space-in-parens': [ 'error', 'never' ],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': 'error',
      'switch-colon-spacing': 'error',
      'template-tag-spacing': 'error',
      'arrow-parens': 'error',
      'arrow-spacing': 'error',
      'generator-star-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'rest-spread-spacing': 'error',

      'sort-imports': [ 'error', {
        allowSeparatedGroups: true,
      } ],

      'template-curly-spacing': 'error',
      'yield-star-spacing': 'error',

      'prefer-arrow/prefer-arrow-functions': [ 'error', {
        allowStandaloneDeclarations: true,
      } ],

      'unicorn/catch-error-name': [ 'error', {
        name: 'err',
      } ],

      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-includes': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-string-starts-ends-with': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
];
