import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  themes: ['github-light', 'github-dark-dimmed'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (t) => `[data-theme="${t.type}"]`,
  emitExternalStylesheet: true,
  defaultProps: {
    frame: 'none',
    showLineNumbers: false,
    overridesByLang: {
      'bash,sh,shellscript': { frame: 'terminal' },
    },
  },
  plugins: [pluginLineNumbers()],
  styleOverrides: {
    codeFontFamily: 'var(--font-mono)',
    codeFontSize: 'var(--size-code)',
    codeLineHeight: 'var(--lh-code)',
    borderRadius: 'var(--radius-code)',
    borderColor: 'transparent',
    codeBackground: 'var(--bg-code-block)',
    frames: {
      shadowColor: 'transparent',
      editorActiveTabBackground: 'transparent',
      editorTabsMarginBlockStart: '0',
    },
  },
  minSyntaxHighlightingColorContrast: 5.5,
});
