import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { card, renderApp } from '../test/renderApp.tsx';
import { theme } from '../theme.ts';
import { ProgressRing } from './ProgressRing.tsx';

function renderRing(ring: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ring}</ThemeProvider>);
}

describe('ProgressRing', () => {
  it('is a progress bar named after what it measures', () => {
    renderRing(<ProgressRing done={3} goal={5} label="Weekly goal of Read 10 pages" />);

    const ring = screen.getByRole('progressbar', { name: 'Weekly goal of Read 10 pages' });
    expect(ring).toHaveAttribute('aria-valuemin', '0');
    expect(ring).toHaveAttribute('aria-valuemax', '100');
    expect(ring).toHaveAttribute('aria-valuenow', '60');
    expect(ring).toHaveTextContent('60%');
  });

  it('rounds the percentage', () => {
    renderRing(<ProgressRing done={2} goal={3} label="Goal" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '67');
  });

  it('reads 0% for a week without a day and 100% for a goal that was reached', () => {
    const { rerender } = renderRing(<ProgressRing done={0} goal={6} label="Goal" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

    rerender(
      <ThemeProvider theme={theme}>
        <ProgressRing done={4} goal={4} label="Goal" />
      </ThemeProvider>,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('never goes over 100%', () => {
    renderRing(<ProgressRing done={7} goal={3} label="Goal" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByRole('progressbar')).toHaveTextContent('100%');
  });
});

describe('the ring on the cards of the Today list', () => {
  it('shows the week of each habit that has a goal', async () => {
    mockApi();
    await renderApp();

    expect(within(card(1)).getByRole('progressbar', { name: 'Weekly goal of Drink water' })).toHaveAttribute('aria-valuenow', '57');
    expect(within(card(2)).getByRole('progressbar', { name: 'Weekly goal of Read 10 pages' })).toHaveAttribute('aria-valuenow', '60');
  });

  it('is not there for a habit without a goal', async () => {
    mockApi();
    await renderApp();

    expect(within(card(4)).queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('follows the habit when it is marked', async () => {
    mockApi();
    await renderApp();

    await userEvent.click(within(card(3)).getByRole('button', { name: 'Morning walk: done today' }));

    expect(within(card(3)).getByRole('progressbar', { name: 'Weekly goal of Morning walk' })).toHaveAttribute('aria-valuenow', '100');
  });
});
