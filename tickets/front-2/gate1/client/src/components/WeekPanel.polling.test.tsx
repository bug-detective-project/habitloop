import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockApi, requestsOf } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

function summaryRequests(api: ReturnType<typeof mockApi>): number {
  return requestsOf(api).filter((request) => request.path === '/api/summary').length;
}

describe('the refresh of the week', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks the server again every 10 seconds while the week is on the screen', async () => {
    const api = mockApi();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'History' }));
    await screen.findByTestId('week-table');
    const opened = summaryRequests(api);

    await vi.advanceTimersByTimeAsync(30_000);

    expect(summaryRequests(api)).toBeGreaterThanOrEqual(opened + 3);
  });

  it('stops asking once the week leaves the screen', async () => {
    const api = mockApi();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'History' }));
    await screen.findByTestId('week-table');
    await user.click(screen.getByRole('button', { name: 'Today' }));
    const closed = summaryRequests(api);

    await vi.advanceTimersByTimeAsync(60_000);

    expect(summaryRequests(api)).toBe(closed);
  });
});
