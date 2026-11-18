import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../App.tsx';
import { mockApi } from '../test/mockApi.ts';

describe('the Today list without habits', () => {
  it('invites the user to create the first habit', async () => {
    mockApi({ habits: [] });
    render(<App />);

    expect(await screen.findByText('No habits yet')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Wednesday, March 18' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Habits' })).not.toBeInTheDocument();
  });

  it('shows the first habit once it is created', async () => {
    mockApi({ habits: [] });
    render(<App />);
    await screen.findByText('No habits yet');

    await userEvent.click(screen.getByRole('button', { name: 'New habit' }));
    await userEvent.type(screen.getByLabelText('Name'), 'Floss');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { level: 3, name: 'Floss' })).toBeInTheDocument();
    expect(screen.queryByText('No habits yet')).not.toBeInTheDocument();
  });
});
