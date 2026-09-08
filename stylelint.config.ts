/* eslint-disable unicorn/no-null -- Stylelint's convention for disabling a rule is null */
import type { Config } from 'stylelint';

const PRECISION = 4;

const config: Config = {
  extends: [
    'stylelint-config-standard',
    '@stylistic/stylelint-config',
    'stylelint-config-clean-order/error',
    'stylelint-config-html',
    'stylelint-plugin-defensive-css/configs/strict',
    'stylelint-plugin-logical-css/configs/recommended',
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
    'stylelint-plugin-use-baseline',
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
    'defensive-css/no-fixed-sizes': true,
    // Not using cascade layers.
    'defensive-css/require-at-layer': null,
    // Custom properties are defined in this project's global stylesheet, not injected by JS, so a
    // fallback at each use adds noise.
    'defensive-css/require-custom-property-fallback': null,
    // This site styles bare HTML elements from one global stylesheet, so no class or ID scopes them.
    // Loose mode rejects each of those selectors. The rule suits a project that scopes every rule
    // with CSS Modules or a shadow root.
    'defensive-css/require-pure-selectors': null,
    // Code blocks hold content that is fixed at build time, so no scrollbar appears or disappears
    // while a visitor reads. A stable gutter adds empty space to every block that never
    // scrolls.
    'defensive-css/require-scrollbar-gutter': null,
    'function-disallowed-list': [ 'rgba', 'hsla', 'rgb', 'hsl' ],
    'gamut/color-no-out-gamut-range': true,
    'max-nesting-depth': 3,
    'no-unknown-animations': true,
    'number-max-precision': [
      PRECISION,
      { insideFunctions: { '/^(oklch|oklab|lch|lab)$/': 6 } },
    ],
    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/selector-tag-no-without-class': [ 'div', 'span' ],
    // Each entry below is a progressive enhancement. A browser without the feature still renders a
    // usable page, so the site adopts it before it reaches baseline.
    'plugin/use-baseline': [
      true,
      {
        available: 'newly',
        // A browser without view transitions navigates without the animation.
        ignoreAtRules: [ 'view-transition' ],
        ignoreProperties: {
          // The parallax background falls back to a scrolling background.
          'background-attachment': [ 'fixed' ],
          // Print control only. A browser without it breaks the page as it did before.
          'break-after': [ 'avoid' ],
          orphans: [],
          widows: [],
          // The code block stops a scroll from reaching the page. Without it the page scrolls on.
          'overscroll-behavior': [ 'contain' ],
          // The textarea stays fixed size without it.
          resize: [ 'block' ],
        },
        // A list marker and a selection highlight both fall back to the browser default.
        ignoreSelectors: [ 'marker', 'selection' ],
        severity: 'warning',
      },
    ],
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
