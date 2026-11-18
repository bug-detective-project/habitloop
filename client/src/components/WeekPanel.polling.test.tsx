import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockApi, requestsOf } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

function summaryRequests(api: ReturnType<typeof mockApi>): number {
  return requestsOf(api).filter((request) => request.path === '/api/summary').length;
}

describe('the refresh of the last 7 days', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks the server again every 10 seconds while the panel is open', async () => {
    const api = mockApi();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Last 7 days' }));
    await screen.findByRole('table');
    const opened = summaryRequests(api);

    await vi.advanceTimersByTimeAsync(30_000);

    expect(summaryRequests(api)).toBeGreaterThanOrEqual(opened + 3);
  });

  it('stops asking once the panel is closed', async () => {
    const api = mockApi();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderApp();

    const toggle = screen.getByRole('button', { name: 'Last 7 days' });
    await user.click(toggle);
    await screen.findByRole('table');
    await user.click(toggle);
    const closed = summaryRequests(api);

    await vi.advanceTimersByTimeAsync(60_000);

    expect(summaryRequests(api)).toBe(closed);
  });
});
