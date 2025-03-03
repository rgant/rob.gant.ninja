/**
 * https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files
 * Requires jiti
 */
/* eslint-disable @typescript-eslint/naming-convention -- Eslint configs have different naming conventions */
/* eslint-disable import-x/max-dependencies -- 11 dependencies, configs often have many imports */
/* eslint-disable max-lines -- Configs have a lot of lines */
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { configs as eslintAstroConfigs } from 'eslint-plugin-astro';
import importx from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import { meta, rules } from 'eslint-plugin-prefer-arrow-functions';
import pluginPromise from 'eslint-plugin-promise';
import tsdoc from 'eslint-plugin-tsdoc';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const INDENT_SIZE = 2;

if (meta == undefined) {
  throw new Error('eslint-plugin-prefer-arrow-functions is weird');
}

// eslint-disable-next-line import-x/no-default-export -- Eslint configs use default exports
export default tseslint.config(
  eslint.configs.all,
  stylistic.configs.all,
  tseslint.configs.all,
  eslintAstroConfigs.all,
  importx.flatConfigs.recommended,
  perfectionist.configs['recommended-natural'],
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
     -- Package lacks TS definitions */
  pluginPromise.configs['flat/recommended'],
  eslintPluginUnicorn.configs.all,
  {
    ignores: [ 'generated/**/*' ], // Automatically generated files
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // Fixes: You have used a rule which requires type information, but don't have parserOptions
        // set to generate type information for this file. See https://typescript-eslint.io/getting-started/typed-linting
        // for enabling linting with type information.
        projectService: {
          allowDefaultProject: [ 'eslint.config.mjs' ],
          defaultProject: 'tsconfig.json',
        },
      },
    },
    plugins: {
      preferArrow: { meta, rules },
      tsdoc,
    },
    rules: {
      '@stylistic/array-bracket-newline': [
        'error',
        { multiline: true },
      ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/array-element-newline': [ 'error', 'consistent' ],
      '@stylistic/arrow-parens': [ 'error', 'always' ],
      '@stylistic/block-spacing': [ 'error', 'always' ],
      '@stylistic/brace-style': [
        'error',
        '1tbs',
        { allowSingleLine: true },
      ],
      '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
      '@stylistic/dot-location': [ 'error', 'property' ], // Put the dot at the start of the property
      '@stylistic/function-call-argument-newline': [ 'error', 'consistent' ],
      '@stylistic/function-paren-newline': [ 'error', 'multiline-arguments' ],
      '@stylistic/generator-star-spacing': [
        'error',
        { after: true, before: false },
      ],
      '@stylistic/implicit-arrow-linebreak': 'off',
      '@stylistic/indent': [
        'error',
        INDENT_SIZE,
        {
          ignoredNodes: [ 'ConditionalExpression' ],
          SwitchCase: 1,
        },
      ],
      '@stylistic/indent-binary-ops': [ 'error', INDENT_SIZE ],
      '@stylistic/lines-around-comment': 'off',
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      '@stylistic/max-len': [
        'error',
        {
          code: 140,
          ignorePattern: String.raw`^\s*(// |\* )?\S+$`,
        },
      ],
      '@stylistic/multiline-comment-style': 'off', // All comment styles are acceptable
      '@stylistic/multiline-ternary': [ 'error', 'always-multiline' ],
      '@stylistic/newline-per-chained-call': [
        'error',
        { ignoreChainWithDepth: 3 },
      ],
      '@stylistic/no-confusing-arrow': 'off', // I think TypeScript makes this unlikely
      '@stylistic/no-extra-parens': [
        'error',
        'all',
        { nestedBinaryExpressions: false },
      ],
      '@stylistic/no-floating-decimal': 'off', // Not configurable to allow .75, and what monster would write 75.?
      '@stylistic/no-multi-spaces': [
        'error',
        { ignoreEOLComments: true },
      ],
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 1,
        },
      ],
      '@stylistic/nonblock-statement-body-position': 'off', // Other rules make this moot
      '@stylistic/object-curly-newline': [
        'error',
        {
          ExportDeclaration: { consistent: true },
          ImportDeclaration: {
            minProperties: 4,
            multiline: true,
          },
          ObjectExpression: {
            consistent: true,
            minProperties: 4,
            multiline: true,
          },
          ObjectPattern: { consistent: true },
        },
      ],
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: true },
      ],
      '@stylistic/one-var-declaration-per-line': 'off',
      // https://github.com/airbnb/javascript/blob/d8cb404da74c302506f91e5928f30cc75109e74d/packages/eslint-config-airbnb-base/rules/style.js#L421
      '@stylistic/operator-linebreak': [
        'error',
        'before',
        { overrides: { '=': 'none' } },
      ],
      '@stylistic/padded-blocks': [ 'error', 'never' ],
      '@stylistic/padding-line-between-statements': 'off',
      '@stylistic/quote-props': [ 'error', 'as-needed' ],
      '@stylistic/quotes': [
        'error',
        'single',
        { avoidEscape: true },
      ],
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          asyncArrow: 'always',
          named: 'never',
        },
      ],
      '@stylistic/spaced-comment': [
        'error',
        'always',
        {
          block: {
            balanced: true,
            exceptions: [ '*' ],
            markers: [ '!' ],
          },
          line: {
            markers: [ '/' ],
          },
        },
      ],
      '@stylistic/wrap-iife': 'off',
      '@stylistic/wrap-regex': 'off',
      '@stylistic/yield-star-spacing': 'error',
      '@typescript-eslint/array-type': [
        'error',
        { default: 'array-simple' },
      ],
      // Sometimes it is clearer to use an index-signature interface, sometimes Record.
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
          allowDirectConstAssertionInArrowFunctions: true,
          allowExpressions: false,
          allowFunctionsWithoutTypeParameters: false,
          allowHigherOrderFunctions: true,
          allowIIFEs: false,
          // For some reason false means 'require function return type'
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { overrides: { constructors: 'no-public' } },
      ],
      // TSLint had a rule to prevent initalizing let/var to undefined, but eslint doesn't have that.
      // https://palantir.github.io/tslint/rules/no-unnecessary-initializer/
      '@typescript-eslint/init-declarations': 'off',
      // Implement https://palantir.github.io/tslint/rules/member-ordering/ with alphabetize
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            order: 'alphabetically-case-insensitive',
          },
          interfaces: 'never',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: [ 'camelCase' ],
          selector: 'default',
        },
        {
          format: [ 'camelCase', 'UPPER_CASE' ],
          selector: 'variable',
        },
        {
          format: [ 'camelCase' ],
          leadingUnderscore: 'require',
          modifiers: [ 'unused' ],
          selector: 'variable',
        },
        {
          format: [ 'camelCase' ],
          leadingUnderscore: 'allow',
          selector: 'parameter',
        },
        {
          format: [ 'camelCase' ],
          leadingUnderscore: 'allow',
          selector: 'memberLike',
        },
        {
          format: [ 'camelCase' ],
          leadingUnderscore: 'require',
          modifiers: [ 'private' ],
          selector: 'memberLike',
        },
        {
          format: [ 'camelCase' ],
          leadingUnderscore: 'forbid',
          modifiers: [ 'private' ],
          selector: 'parameterProperty',
        },
        {
          format: [ 'PascalCase' ],
          selector: 'typeLike',
        },
        {
          // Astro Dynamic Tags must be capitalized!
          // https://docs.astro.build/en/reference/astro-syntax/#dynamic-tags
          format: [ 'camelCase', 'PascalCase' ],
          selector: 'import',
        },
        {
          format: [ 'UPPER_CASE' ],
          selector: 'enum',
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/no-extraneous-class': [
        'error',
        { allowWithDecorator: true }, // Angular uses empty decorated classes (@NgModule) all the time
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          allowForKnownSafeCalls: [
            // Angular Router handles navigation failures.
            { from: 'package', name: 'navigate', package: '@angular/router' },
            { from: 'package', name: 'navigateByUrl', package: '@angular/router' },
          ],
        },
      ],
      '@typescript-eslint/no-implicit-any-catch': 'off', // Already covered by tsconfig strict
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          enforceConst: true,
          ignore: [ 0, 1 ],
          ignoreEnums: true,
        },
      ],
      // I think this was done to match https://palantir.github.io/tslint/rules/no-shadowed-variable/
      '@typescript-eslint/no-shadow': [
        'error',
        { hoist: 'all' },
      ],
      // Since we require a lot of typedefs having this rule would make things difficult
      '@typescript-eslint/no-type-alias': 'off',
      '@typescript-eslint/no-unnecessary-type-arguments': 'off', // I prefer explicit types.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off', // We are not using var so this is not needed
      '@typescript-eslint/non-nullable-type-assertion-style': 'off', // I think using `!` is bad
      '@typescript-eslint/parameter-properties': [
        'error',
        { prefer: 'parameter-property' },
      ],
      '@typescript-eslint/prefer-namespace-keyword': 'off', // conflicts with no-namespace
      // I cannot figure out a nice way of having this. `advisors: Readonly<AdvisorMap>` doesn't work well.
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/require-array-sort-compare': [
        'error',
        { ignoreStringArrays: true },
      ],
      // Sometimes conflicts with @typescript-eslint/promise-function-async and I prefer that one
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableBoolean: true,
          allowNullableString: true,
        },
      ],
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: false,
          arrowParameter: true,
          memberVariableDeclaration: true,
          objectDestructuring: false,
          parameter: true,
          propertyDeclaration: true,
          variableDeclarationIgnoreFunction: true,
        },
      ],
      '@typescript-eslint/unbound-method': [
        'error',
        { ignoreStatic: true },
      ],
      'accessor-pairs': 'off',
      'astro/sort-attributes': 'off', // Not configurable enough, using perfectionist/sort-jsx-props
      // Sometimes it is nicer to return complicate/longer returns from a block. Try to use the shortest method.
      'arrow-body-style': 'off',
      'block-scoped-var': 'off',
      camelcase: 'off', // Replaced with @typescript-eslint/naming-convention
      'capitalized-comments': 'off',
      'class-methods-use-this': 'off',
      complexity: 'off',
      'consistent-this': 'off',
      'default-case': 'off',
      eqeqeq: [ 'off', 'always', { null: 'ignore' } ], // eslint refuses to support undefined
      'func-name-matching': 'off',
      'func-style': [
        'error',
        'declaration',
        { allowArrowFunctions: true },
      ],
      'id-denylist': [
        'error', // This is the Rule Severity!
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
      'id-length': 'off', // Don't use short names that are confusing, but the rule is too inexact.
      'id-match': 'off',
      // eslint-plugin-import-x doesn't have an all config so this is just modifications to recommended
      'import-x/consistent-type-specifier-style': [ 'error', 'prefer-top-level' ],
      'import-x/exports-last': 'off', // conflicts with perfectionist/sort-modules
      'import-x/extensions': [ 'error', 'never', { json: 'always' } ],
      'import-x/first': 'error',
      'import-x/max-dependencies': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-absolute-path': 'error',
      'import-x/no-amd': 'error',
      'import-x/no-anonymous-default-export': 'error',
      'import-x/no-commonjs': 'error',
      'import-x/no-cycle': [ 'error', { ignoreExternal: true } ],
      'import-x/no-default-export': 'error',
      'import-x/no-deprecated': 'off', // Use @typescript-eslint/no-deprecated instead
      'import-x/no-duplicates': 'error', // Change from warning to error
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-empty-named-blocks': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            './eslint.config.ts',
            './src/**/*.spec.ts',
          ],
        },
      ],
      'import-x/no-import-module-exports': 'error',
      'import-x/no-mutable-exports': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-namespace': 'error',
      'import-x/no-nodejs-modules': 'error',
      'import-x/no-relative-parent-imports': 'off', // tsconfig.paths make this less necessary, and angular style is incompatible
      'import-x/no-rename-default': 'off', // Too many default exports have bad names
      'import-x/no-self-import': 'error',
      'import-x/no-unassigned-import': [
        'error',
        { allow: [ 'src/styles/**' ] },
      ],
      'import-x/no-unresolved': [
        'error',
        { ignore: [ '^astro:', '^virtual:' ] },
      ],
      // Might be deprecated https://github.com/un-ts/eslint-plugin-import-x/issues/90#issuecomment-2213222134
      'import-x/no-unused-modules': [
        'off', // Doesn't with or without src option: 'No ESLint configuration found in src.'
        {
          missingExports: true,
          src: [ './src' ],
          unusedExports: true,
        },
      ],
      'import-x/no-useless-path-segments': 'error',
      'import-x/order': 'off', // Use perfectionist/sort-imports instead
      'line-comment-position': 'off',
      'max-classes-per-file': [ 'error', 1 ],
      // Ideally we would consider this, but in practice it is just annoying, esp with spec files.
      'max-lines-per-function': 'off',
      'max-params': 'off', // Angular and Rob both use a lot of parameters
      // Could probably turn this on as a warning again, but not sure what number to give, default 10 is too few
      'max-statements': 'off',
      'new-cap': [
        'error',
        { capIsNew: false },
      ],
      'no-class-assign': 'off', // tsc already checks for this
      'no-console': [
        'error',
        {
          allow: [
            'error',
            'warn',
          ],
        },
      ],
      'no-duplicate-imports': 'off', // Doesn't understand the difference between import and import type
      'no-eq-null': 'off', // I don't want === null || === undefined
      'no-extend-native': 'off', // Code review will catch this and it seems unlikey I will accidentally do it.
      'no-extra-label': 'off', // I doubt I will actually use labels ever
      'no-global-assign': 'off', // Seems likely tsc will catch this, and rare to have happen.
      'no-implicit-coercion': [
        'error',
        { allow: [ '!!' ] },
      ],
      'no-implicit-globals': 'off', // TypeScript, NodeJS, and Angular all make this unnecessary I believe
      'no-inline-comments': 'off',
      'no-invalid-this': 'off', // Seems likely tsc will catch this, and rare to have happen.
      'no-iterator': 'off',
      'no-label-var': 'off',
      'no-labels': 'off',
      'no-lone-blocks': 'off',
      'no-loss-of-precision': 'off', // Match TS rule
      'no-magic-numbers': [ // Match TS rule
        'off', // replaced with TS version
        { enforceConst: true },
      ],
      'no-multi-str': 'off', // Unlikely we will do this
      'no-new': 'off',
      'no-new-func': 'off',
      'no-new-native-nonconstructor': 'off', // tsc already checks for this
      'no-new-object': 'off',
      'no-octal-escape': 'off',
      'no-plusplus': 'off', // Developers should know how to use this
      'no-promise-executor-return': 'off',
      'no-proto': 'off',
      'no-script-url': 'off',
      'no-self-compare': 'off',
      'no-sequences': 'off',
      'no-shadow': [ // Match TS rule
        'off',
        { hoist: 'all' },
      ],
      'no-ternary': 'off',
      'no-undef-init': 'error',
      'no-undefined': 'off', // TypeScript uses undefined
      'no-underscore-dangle': 'off',
      'no-unmodified-loop-condition': 'off',
      'no-unneeded-ternary': [
        'error',
        { defaultAssignment: false },
      ],
      'no-unreachable-loop': 'off',
      'no-unsafe-optional-chaining': 'off', // tsc already checks for this
      'no-unused-labels': 'off',
      'no-unused-private-class-members': 'off', // tsc already checks for this
      'no-unused-vars': [ // Match TS rule
        'off',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-useless-call': 'off',
      'no-useless-computed-key': 'off',
      'no-useless-concat': 'off',
      'no-useless-rename': 'off',
      'no-useless-return': 'off',
      'no-warning-comments': 'off',
      'one-var': 'off',
      'operator-assignment': 'off',
      // Modifications to the perfectionist/recommended-alphabetical config
      'perfectionist/sort-classes': 'off', // Use @typescript-eslint/member-ordering instead
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            [
              'builtin',
              'builtin-type',
            ],
            [
              'external',
              'external-type',
            ],
            [
              'internal',
              'internal-type',
            ],
            [
              'parent',
              'parent-type',
              'sibling',
              'sibling-type',
            ],
            [
              'index',
              'index-type',
            ],
            'object',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-interfaces': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^id$',
              groupName: 'top',
              selector: 'property',
            },
          ],
          groups: [
            'index-signature',
            'top',
            'unknown',
          ],
          ignoreCase: false,
          partitionByNewLine: true,
        },
      ],
      'perfectionist/sort-intersection-types': 'off', // use @typescript-eslint/sort-type-constituents instead
      'perfectionist/sort-jsx-props': [
        'error',
        {
          customGroups: {
            astro: ':',
            important1: '^(id|name|rel|src)$',
            important2: '^href$',
          },
          groups: [
            'astro',
            'important1',
            'important2',
            'unknown',
            'shorthand',
          ],
        },
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          customGroups: {
            id: '^id$',
            path: '^path(Match)?$', // Angular Routes
            children: '^children$', // Angular Routes
            deps: '^deps$', // Angular providers
          },
          groups: [ 'id', 'path', 'unknown', 'children', 'deps' ],
          partitionByComment: true,
        },
      ],
      'perfectionist/sort-union-types': 'off', // Use @typescript-eslint/sort-type-constituents instead
      'prefer-arrow-callback': 'off',
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
        { enforceForRenamedProperties: false },
      ],
      'prefer-exponentiation-operator': 'off',
      'prefer-numeric-literals': 'off',
      'prefer-regex-literals': [
        'error',
        { disallowRedundantWrapping: true },
      ],
      'preferArrow/prefer-arrow-functions': [
        'warn',
        {
          returnStyle: 'implicit',
        },
      ],
      // eslint-plugin-promise doesn't have an all so this is just modifications to recommended
      'promise/prefer-await-to-callbacks': 'error', // This can be triggered by rxjs catchError((err) => {}) :-(
      'promise/prefer-await-to-then': 'error',
      'require-await': 'off', // Match TS rule
      'sort-imports': 'off', // Using perfectionist/sort-imports instead
      'sort-keys': 'off', // Use perfectionist/sort-objects instead
      'sort-vars': 'off', // This doesn't sort multiple let or consts so it's not useful
      strict: [ 'error', 'never' ], // NodeJS and TypeScript are always strict
      'tsdoc/syntax': 'warn',
      'unicode-bom': 'off',
      'unicorn/catch-error-name': [
        'error',
        { name: 'err' },
      ],
      // Also applies to callbacks defined within the same file which make this rule silly IMPO
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-keyword-prefix': 'off', // Not actually all that confusing IMPO
      'unicorn/no-unused-properties': 'off', // tsconfig already covers this
      'unicorn/no-useless-undefined': [
        'error',
        { checkArguments: false }, // Sometimes manually passing undefined to a function makes typescript happier
      ],
      'unicorn/prefer-export-from': [
        'error',
        { ignoreUsedVariables: true },
      ],
      // This rule seems like a legacy thing and may actually be worse. TypeScript can import JSON files directly so we don't need it.
      'unicorn/prefer-json-parse-buffer': 'off',
      'unicorn/prefer-top-level-await': 'off', // The “module” option in “tsconfig.json” has to be set to esnext or system for this
      // I think some of these are silly. `e` is bad, but `err` and `exc` are decent. `user of users` is confusing, `usr of users` is safer.
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/string-content': 'off', // Doesn't actually work on HTML where this would be most useful.
      'vars-on-top': 'off',
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
  },
  {
    files: [ 'src/**/*.astro' ],
    rules: {
      'max-lines': 'off', // HTML files can be long
    },
  },
);
