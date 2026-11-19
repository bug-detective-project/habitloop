import { createGlobalStyle } from 'styled-components';

/**
 * The look of the app in one place. Components read these values through the theme
 * (`${({ theme }) => theme.color.accent}`), never a color or a size of their own.
 */
export const theme = {
  color: {
    page: '#f1f4ef',
    card: '#ffffff',
    sunken: '#e6ebe3',
    text: '#17231d',
    muted: '#526058',
    border: '#d5dccf',
    borderStrong: '#b7c3b1',
    accent: '#0b6e4f',
    accentStrong: '#085840',
    accentText: '#ffffff',
    accentSoft: '#dff3ea',
    warm: '#b3541e',
    warmSoft: '#fbe9dc',
    danger: '#a61b1b',
    dangerSoft: '#fde8e8',
  },
  shadow: {
    card: '0 1px 2px rgb(23 35 29 / 0.06), 0 8px 22px -14px rgb(23 35 29 / 0.28)',
    lift: '0 2px 4px rgb(23 35 29 / 0.08), 0 18px 36px -16px rgb(23 35 29 / 0.36)',
  },
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
  radius: { sm: '10px', md: '16px', lg: '22px', round: '999px' },
  font: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    display: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
    small: '0.875rem',
    large: '1.25rem',
  },
} as const;

export type Theme = typeof theme;

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.color.page};
    color: ${({ theme }) => theme.color.text};
    font-family: ${({ theme }) => theme.font.body};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  button, input, select {
    font: inherit;
    color: inherit;
  }

  /* Read by screen readers, not shown. */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accent};
    outline-offset: 2px;
  }
`;
