import { createGlobalStyle } from 'styled-components';

/**
 * The look of the app in one place. Components read these values through the theme
 * (`${({ theme }) => theme.color.accent}`), never a color or a size of their own.
 */
export const theme = {
  color: {
    page: '#f6f5f1',
    card: '#ffffff',
    text: '#1f2933',
    muted: '#52606d',
    border: '#d9d6cd',
    accent: '#0b6e4f',
    accentText: '#ffffff',
    accentSoft: '#dff3ea',
    danger: '#a61b1b',
    dangerSoft: '#fde8e8',
  },
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
  radius: { sm: '6px', md: '12px', round: '999px' },
  font: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
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
  }

  button, input, select {
    font: inherit;
    color: inherit;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accent};
    outline-offset: 2px;
  }
`;
