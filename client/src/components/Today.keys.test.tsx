import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { card, renderApp } from '../test/renderApp.tsx';

function check(id: number, name: string): HTMLElement {
  return within(card(id)).getByRole('button', { name: `${name}: done today` });
}

describe('marking a habit in the Today list', () => {
  it('marks that habit only, also after the list moves it down', async () => {
    mockApi();
    await renderApp();

    // "Read 10 pages" is the first of the list; marking it sends it below the habits still to do.
    await userEvent.click(check(2, 'Read 10 pages'));

    expect(check(2, 'Read 10 pages')).toHaveAttribute('aria-pressed', 'true');
    expect(check(3, 'Morning walk')).toHaveAttribute('aria-pressed', 'false');
    expect(check(4, 'Stretch')).toHaveAttribute('aria-pressed', 'false');
    expect(check(1, 'Drink water')).toHaveAttribute('aria-pressed', 'true');
  });

  it('unmarks that habit only, also after the list moves it up', async () => {
    mockApi();
    await renderApp();

    await userEvent.click(check(1, 'Drink water'));

    expect(check(1, 'Drink water')).toHaveAttribute('aria-pressed', 'false');
    expect(check(2, 'Read 10 pages')).toHaveAttribute('aria-pressed', 'false');
    expect(check(3, 'Morning walk')).toHaveAttribute('aria-pressed', 'false');
    expect(check(4, 'Stretch')).toHaveAttribute('aria-pressed', 'false');
  });
});
