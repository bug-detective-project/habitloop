import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App.tsx';
import { json, mockApi, requestsOf, TODAY } from './test/mockApi.ts';
import { card, renderApp } from './test/renderApp.tsx';

describe('the Today list', () => {
  it('shows what is still to do before what is done', async () => {
    mockApi();
    await renderApp();

    const names = within(screen.getByRole('list', { name: 'Habits' }))
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);
    expect(names).toEqual(['Read 10 pages', 'Morning walk', 'Stretch', 'Drink water']);
  });

  it('shows the streak and the week of each habit', async () => {
    mockApi();
    await renderApp();

    expect(within(card(1)).getByTestId('streak')).toHaveTextContent('4 days in a row');
    expect(card(1)).toHaveTextContent('4 of 7 this week');
    expect(within(card(4)).getByTestId('streak')).toHaveTextContent('No streak yet');
    expect(card(4)).toHaveTextContent('0 this week');
  });

  it('marks a habit as done today with a click on its card', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(within(card(3)).getByRole('button', { name: 'Morning walk: done today' }));

    expect(within(card(3)).getByRole('button', { name: 'Morning walk: done today' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(within(card(3)).getByTestId('streak')).toHaveTextContent('3 days in a row');
    await waitFor(() => {
      expect(requestsOf(api)).toContainEqual({ method: 'POST', path: '/api/habits/3/checkins', body: { day: TODAY } });
    });
  });

  it('unmarks a habit that was done', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(within(card(1)).getByRole('button', { name: 'Drink water: done today' }));

    await waitFor(() => {
      expect(requestsOf(api)).toContainEqual({
        method: 'DELETE',
        path: `/api/habits/1/checkins/${TODAY}`,
        body: undefined,
      });
    });
  });

  it('puts the day back and says why when the change is refused', async () => {
    mockApi({
      respond: (request) => (request.method === 'POST' ? json({ error: 'The database is locked' }, 500) : undefined),
    });
    await renderApp();

    await userEvent.click(within(card(3)).getByRole('button', { name: 'Morning walk: done today' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The database is locked');
    expect(within(card(3)).getByRole('button', { name: 'Morning walk: done today' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('says so when the habits cannot be loaded', async () => {
    mockApi({ respond: () => json({ error: 'down' }, 500) });
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('could not load your habits');
  });
});

describe('creating and changing habits', () => {
  it('creates a habit', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'New habit' }));
    const form = screen.getByRole('form', { name: 'New habit' });
    await userEvent.type(within(form).getByLabelText('Name'), 'Floss');
    await userEvent.selectOptions(within(form).getByLabelText('Weekly goal'), '7 days');
    await userEvent.click(within(form).getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { level: 3, name: 'Floss' })).toBeInTheDocument();
    expect(requestsOf(api)).toContainEqual({ method: 'POST', path: '/api/habits', body: { name: 'Floss', weeklyGoal: 7 } });
    expect(screen.queryByRole('form', { name: 'New habit' })).not.toBeInTheDocument();
  });

  it('changes the name and the goal of a habit', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Stretch' }));
    const form = screen.getByRole('form', { name: 'Edit Stretch' });
    const name = within(form).getByLabelText('Name');
    await userEvent.clear(name);
    await userEvent.type(name, 'Stretch for 5 minutes');
    await userEvent.selectOptions(within(form).getByLabelText('Weekly goal'), '3 days');
    await userEvent.click(within(form).getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { level: 3, name: 'Stretch for 5 minutes' })).toBeInTheDocument();
    expect(requestsOf(api)).toContainEqual({
      method: 'PATCH',
      path: '/api/habits/4',
      body: { name: 'Stretch for 5 minutes', weeklyGoal: 3 },
    });
  });

  it('shows what the server refused and keeps the form open', async () => {
    mockApi({
      respond: (request) =>
        request.method === 'PATCH' ? json({ error: 'Give the habit a name', fields: { name: 'x' } }, 400) : undefined,
    });
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Stretch' }));
    const form = screen.getByRole('form', { name: 'Edit Stretch' });
    await userEvent.clear(within(form).getByLabelText('Name'));
    await userEvent.click(within(form).getByRole('button', { name: 'Save' }));

    expect(await within(form).findByRole('alert')).toHaveTextContent('Give the habit a name');
  });

  it('closes the form without saving on Cancel', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Stretch' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(requestsOf(api).some((request) => request.method === 'PATCH')).toBe(false);
  });
});

describe('the last 7 days', () => {
  it('opens with the days and the progress of each habit', async () => {
    mockApi();
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    const panel = await screen.findByRole('complementary', { name: 'Last 7 days' });

    const row = await within(panel).findByTestId('week-2');
    expect(within(row).getByTestId('progress')).toHaveTextContent('3 of 5 days');
    expect(within(row).getByRole('button', { name: 'Read 10 pages, Monday, March 16' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(within(row).getByRole('button', { name: 'Read 10 pages, Tuesday, March 17' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('marks an earlier day', async () => {
    const api = mockApi();
    await renderApp();

    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    const panel = await screen.findByRole('complementary', { name: 'Last 7 days' });
    const day = await within(panel).findByRole('button', { name: 'Stretch, Tuesday, March 17' });
    await userEvent.click(day);

    await waitFor(() => {
      expect(day).toHaveAttribute('aria-pressed', 'true');
    });
    expect(requestsOf(api)).toContainEqual({
      method: 'POST',
      path: '/api/habits/4/checkins',
      body: { day: '2026-03-17' },
    });
    await waitFor(() => {
      expect(within(screen.getByTestId('week-4')).getByTestId('progress')).toHaveTextContent('1 day');
    });
  });

  it('closes with a second click on its button', async () => {
    mockApi();
    await renderApp();

    const toggle = screen.getByRole('button', { name: 'Last 7 days' });
    await userEvent.click(toggle);
    await screen.findByRole('complementary', { name: 'Last 7 days' });
    await userEvent.click(toggle);

    expect(screen.queryByRole('complementary', { name: 'Last 7 days' })).not.toBeInTheDocument();
  });
});
