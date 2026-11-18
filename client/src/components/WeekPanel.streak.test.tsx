import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { card, renderApp } from '../test/renderApp.tsx';

describe('marking an earlier day', () => {
  it('makes the streak longer when the day fills the gap before today', async () => {
    mockApi({
      habits: [{ id: 2, name: 'Read 10 pages', weeklyGoal: 5, days: ['2026-03-14', '2026-03-15', '2026-03-16', '2026-03-18'] }],
    });
    await renderApp();
    expect(within(card(2)).getByTestId('streak')).toHaveTextContent('1 day in a row');

    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    const panel = await screen.findByRole('complementary', { name: 'Last 7 days' });
    await userEvent.click(await within(panel).findByRole('button', { name: 'Read 10 pages, Tuesday, March 17' }));

    await waitFor(() => {
      expect(within(card(2)).getByTestId('streak')).toHaveTextContent('5 days in a row');
    });
  });
});
