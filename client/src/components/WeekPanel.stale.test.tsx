import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestHabits, json, mockApi, summaryOf } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

describe('an answer of the refresh that arrives late', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not undo a day that was marked after the refresh was asked', async () => {
    // The second request for the summary is held: it answers only when the test says so, with
    // the days as they were when it was asked.
    let summaries = 0;
    let release: (response: Response) => void = () => {};
    const held = new Promise<Response>((resolve) => {
      release = resolve;
    });
    mockApi({
      respond: (request) => {
        if (request.path === '/api/summary') {
          summaries += 1;
          return summaries === 2 ? held : undefined;
        }
        return undefined;
      },
    });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderApp();

    await user.click(screen.getByRole('button', { name: 'Last 7 days' }));
    const panel = await screen.findByRole('complementary', { name: 'Last 7 days' });
    const day = await within(panel).findByRole('button', { name: 'Stretch, Tuesday, March 17' });

    // The refresh starts and waits for its answer.
    await vi.advanceTimersByTimeAsync(10_000);
    expect(summaries).toBe(2);

    // The user marks the day; the panel saves it and reads the summary again.
    await user.click(day);
    await waitFor(() => {
      expect(summaries).toBe(3);
    });
    await waitFor(() => {
      expect(day).toHaveAttribute('aria-pressed', 'true');
    });

    // Only now the old answer arrives, without the new day.
    release(json(summaryOf(createTestHabits())));
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));

    expect(day).toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByTestId('week-4')).getByTestId('progress')).toHaveTextContent('1 day');
  });
});
