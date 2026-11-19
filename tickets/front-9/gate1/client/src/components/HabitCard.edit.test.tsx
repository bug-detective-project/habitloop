import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi, requestsOf } from '../test/mockApi.ts';
import { card, renderApp } from '../test/renderApp.tsx';

describe('the Edit button of a habit', () => {
  it('opens the form without marking the habit as done', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Stretch' }));

    expect(screen.getByRole('form', { name: 'Edit Stretch' })).toBeInTheDocument();
    expect(requestsOf(api).filter((request) => request.path.includes('/checkins'))).toEqual([]);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(within(card(4)).getByRole('button', { name: 'Stretch: done today' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not unmark a habit that was done', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Drink water' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(within(card(1)).getByRole('button', { name: 'Drink water: done today' })).toHaveAttribute('aria-pressed', 'true');
    expect(requestsOf(api).some((request) => request.method === 'DELETE')).toBe(false);
  });

  it('still marks the habit with a click anywhere else on the card', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(within(card(4)).getByRole('heading', { level: 3, name: 'Stretch' }));

    await waitFor(() => {
      expect(requestsOf(api).some((request) => request.method === 'POST' && request.path === '/api/habits/4/checkins')).toBe(true);
    });
  });
});
