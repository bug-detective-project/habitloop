import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi, requestsOf } from './test/mockApi.ts';
import { card, renderApp } from './test/renderApp.tsx';

async function openHistory() {
  await userEvent.click(screen.getByRole('button', { name: 'History' }));
  await screen.findByRole('heading', { level: 2, name: 'History' });
}

const tab = (name: string) => screen.getByRole('tab', { name });
const cell = (label: RegExp) => screen.findByLabelText(label);

describe('the history', () => {
  it('opens on the week that ends today, and marks an earlier day there', async () => {
    const api = mockApi();
    await renderApp();
    await openHistory();

    expect(screen.getByRole('button', { name: 'History' })).toHaveAttribute('aria-current', 'page');
    expect(tab('Week')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('period')).toHaveTextContent('Mar 12 – Mar 18');
    const row = await screen.findByTestId('week-2');
    expect(within(row).getByTestId('progress')).toHaveTextContent('3 of 5 days');

    const day = within(await screen.findByTestId('week-4')).getByRole('button', { name: 'Stretch, Tuesday, March 17' });
    await userEvent.click(day);

    await waitFor(() => expect(day).toHaveAttribute('aria-pressed', 'true'));
    expect(requestsOf(api)).toContainEqual({ method: 'POST', path: '/api/habits/4/checkins', body: { day: '2026-03-17' } });
  });

  it('goes back a week, never past today, and back to today', async () => {
    mockApi();
    await renderApp();
    await openHistory();
    expect(screen.getByRole('button', { name: 'Next week' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

    expect(screen.getByTestId('period')).toHaveTextContent('Mar 5 – Mar 11');
    await waitFor(() => expect(within(screen.getByTestId('week-4')).getByTestId('progress')).toHaveTextContent('1 day'));
    await userEvent.click(screen.getByRole('button', { name: 'Go to today' }));
    expect(screen.getByTestId('period')).toHaveTextContent('Mar 12 – Mar 18');
  });

  it('shows the month as a calendar, with how many habits were done each day', async () => {
    mockApi();
    await renderApp();
    await openHistory();

    await userEvent.click(tab('Month'));

    expect(screen.getByTestId('period')).toHaveTextContent('March 2026');
    // Morning walk started on the 16th, so on the 10th three habits existed.
    expect(await cell(/^Monday, March 16: /)).toHaveAccessibleName('Monday, March 16: 3 of 4 habits done');
    expect(await cell(/^Tuesday, March 10: /)).toHaveAccessibleName('Tuesday, March 10: 1 of 3 habits done');
    expect(await cell(/^Thursday, March 19: /)).toHaveAccessibleName('Thursday, March 19: still to come');

    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));

    expect(screen.getByTestId('period')).toHaveTextContent('February 2026');
    expect(await cell(/^Friday, February 27: /)).toHaveAccessibleName('Friday, February 27: 1 of 2 habits done');
  });

  it('follows one habit through a month: when it started, the days done, and how it went', async () => {
    mockApi();
    await renderApp();
    await openHistory();
    await userEvent.click(tab('Month'));

    await userEvent.selectOptions(screen.getByLabelText('Habit'), 'Morning walk');

    expect(await cell(/^Sunday, March 15: /)).toHaveAccessibleName('Sunday, March 15: not started yet');
    expect(await cell(/^Monday, March 16: /)).toHaveAccessibleName('Monday, March 16: done');
    expect(await cell(/^Wednesday, March 18: /)).toHaveAccessibleName('Wednesday, March 18: not done');
    const stats = await screen.findByLabelText('How it went');
    expect(stats).toHaveTextContent('March 16, 2026');
    expect(stats).toHaveTextContent('2 of 3');
    expect(stats).toHaveTextContent('67%');
  });

  it('shows one day: which habits were done, and which had not started yet', async () => {
    mockApi();
    await renderApp();
    await openHistory();
    await userEvent.click(tab('Day'));

    expect(screen.getByTestId('period')).toHaveTextContent('Wednesday, March 18');
    expect(await screen.findByTestId('day-3')).toHaveTextContent('Not done');

    await userEvent.click(screen.getByRole('button', { name: 'Previous day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous day' }));

    expect(screen.getByTestId('period')).toHaveTextContent('Sunday, March 15');
    await waitFor(() => expect(screen.getByTestId('day-3')).toHaveTextContent('Not started yet'));
    expect(screen.getByTestId('day-1')).toHaveTextContent('Done');
    expect(screen.getByTestId('day-1')).toHaveTextContent('Started February 2, 2026');
  });

  it('sums up any range of days for every habit', async () => {
    mockApi();
    await renderApp();
    await openHistory();
    await userEvent.click(tab('Range'));

    // The last 30 days by default: from February 17 to today.
    expect(screen.getByRole('button', { name: /^From, / })).toHaveAccessibleName('From, February 17, 2026');
    const water = await screen.findByTestId('summary-1');
    expect(water).toHaveTextContent('7 of 30');
    expect(water).toHaveTextContent('23%');

    await userEvent.click(screen.getByRole('button', { name: /^From, / }));
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sunday, March 1, 2026' }));

    await waitFor(() => expect(screen.getByTestId('summary-1')).toHaveTextContent('5 of 18'));
    expect(screen.getByTestId('summary-1')).toHaveTextContent('28%');
  });

  it('tells on each card since when the habit is followed', async () => {
    mockApi();
    await renderApp();

    expect(within(card(1)).getByTestId('started')).toHaveTextContent('Since Feb 2');
  });
});
