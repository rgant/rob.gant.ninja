// @ts-check

const PRECISION = 4;

/** @type { import('stylelint').Config } */
const config = {
  extends: [
    'stylelint-config-standard',
    '@stylistic/stylelint-config',
    'stylelint-config-clean-order/error',
    'stylelint-config-html',
  ],
  ignoreFiles: [
    '**/*.json',
    '**/*.md',
    '**/*.svg',
    '**/*.png',
    '**/*.jpg',
    '**/*.ts',
  ],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-declaration-strict-value',
    'stylelint-gamut',
    'stylelint-no-unsupported-browser-features',
    'stylelint-plugin-defensive-css',
    'stylelint-plugin-logical-css',
    'stylelint-selector-tag-no-without-class',
    'stylelint-use-nesting',
  ],
  reportNeedlessDisables: true,
  rules: {
    '@stylistic/at-rule-semicolon-space-before': 'never',
    '@stylistic/block-closing-brace-newline-before': 'always',
    '@stylistic/block-closing-brace-space-after': 'always-single-line',
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/declaration-block-semicolon-newline-before': 'never-multi-line',
    '@stylistic/function-comma-newline-before': 'never-multi-line',
    '@stylistic/linebreaks': 'unix',
    '@stylistic/max-line-length': 140,
    '@stylistic/media-query-list-comma-newline-before': 'never-multi-line',
    '@stylistic/named-grid-areas-alignment': true,
    '@stylistic/number-leading-zero': 'never',
    '@stylistic/selector-list-comma-newline-before': 'never-multi-line',
    '@stylistic/selector-list-comma-space-after': 'always-single-line',
    '@stylistic/string-quotes': 'single',
    '@stylistic/unicode-bom': 'never',
    '@stylistic/value-list-comma-newline-before': 'never-multi-line',
    'color-function-notation': 'modern',
    'color-named': 'never',
    'color-no-hex': true,
    'csstools/use-nesting': 'always',
    'declaration-no-important': true,
    'function-disallowed-list': [ 'rgba', 'hsla', 'rgb', 'hsl' ],
    'gamut/color-no-out-gamut-range': true,
    'max-nesting-depth': 3,
    'no-unknown-animations': true,
    'number-max-precision': [
      PRECISION,
      { insideFunctions: { '/^(oklch|oklab|lch|lab)$/': 6 } },
    ],
    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/no-unsupported-browser-features': [
      true,
      { severity: 'warning' },
    ],
    'plugin/selector-tag-no-without-class': [ 'div', 'span' ],
    'plugin/use-defensive-css': true,
    'plugin/use-logical-properties-and-values': true,
    'plugin/use-logical-units': true,
    'scale-unlimited/declaration-strict-value': [
      [ '/color$/', 'z-index' ],
      {
        disableFix: true,
        ignoreValues: [ 'currentColor', 'inherit', 'transparent' ],
      },
    ],
    'selector-max-attribute': 1,
    'selector-max-class': 2,
    'selector-max-combinators': 2,
    'selector-max-compound-selectors': 3,
    'selector-max-type': 1,
    'selector-max-universal': 0,
    'selector-no-qualifying-type': [
      true,
      { ignore: [ 'attribute' ] },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: [ '/^ng-/' ] },
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: [
          '/^app-/',
          '/^ng-/',
        ],
      },
    ],
    'time-min-milliseconds': 100,
    'unit-disallowed-list': [ 'ch', 'cm', 'ex', 'in', 'mm', 'pc', 'pt' ],
    'value-keyword-case': [
      'lower',
      { camelCaseSvgKeywords: true },
    ],
  },
};

// eslint-disable-next-line import-x/no-default-export -- Stylelint configs use default exports
export default config;
