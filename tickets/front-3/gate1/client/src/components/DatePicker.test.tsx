import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '../theme.ts';
import { DatePicker } from './DatePicker.tsx';

function Holder({ start = '2026-03-10', min, max = '2026-03-18' }: { start?: string; min?: string; max?: string }) {
  const [value, setValue] = useState(start);
  return (
    <ThemeProvider theme={theme}>
      <DatePicker label="From" value={value} onChange={setValue} min={min} max={max} />
      <output data-testid="held">{value}</output>
    </ThemeProvider>
  );
}

const trigger = () => screen.getByRole('button', { name: /^From, / });
const day = (name: string) => screen.getByRole('button', { name });

describe('the date picker', () => {
  it('shows the date, and opens a calendar of its month on the chosen day', async () => {
    render(<Holder />);
    expect(trigger()).toHaveAccessibleName('From, March 10, 2026');
    expect(trigger()).toHaveTextContent('Mar 10, 2026');

    await userEvent.click(trigger());

    expect(screen.getByRole('dialog', { name: 'Choose the date for From' })).toBeInTheDocument();
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(day('Tuesday, March 10, 2026')).toHaveFocus();
    expect(day('Tuesday, March 10, 2026')).toHaveAttribute('aria-pressed', 'true');
  });

  it('picks a day, closes, and gives the focus back to its button', async () => {
    render(<Holder />);
    await userEvent.click(trigger());

    await userEvent.click(day('Monday, March 2, 2026'));

    expect(screen.getByTestId('held')).toHaveTextContent('2026-03-02');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it('cannot pick a day outside its limits', async () => {
    render(<Holder min="2026-03-05" />);
    await userEvent.click(trigger());

    expect(day('Thursday, March 19, 2026')).toBeDisabled();
    expect(day('Wednesday, March 4, 2026')).toBeDisabled();
    expect(day('Wednesday, March 18, 2026')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
  });

  it('moves with the keyboard: arrows by day and week, PageUp by month, Enter picks', async () => {
    render(<Holder max="2026-12-31" />);
    await userEvent.click(trigger());

    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    expect(day('Wednesday, March 18, 2026')).toHaveFocus();
    await userEvent.keyboard('{PageUp}');
    expect(screen.getByText('February 2026')).toBeInTheDocument();
    expect(day('Wednesday, February 18, 2026')).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    expect(screen.getByTestId('held')).toHaveTextContent('2026-02-18');
  });

  it('goes to another month with its buttons', async () => {
    render(<Holder />);
    await userEvent.click(trigger());

    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));

    expect(screen.getByText('February 2026')).toBeInTheDocument();
    await userEvent.click(day('Friday, February 27, 2026'));
    expect(screen.getByTestId('held')).toHaveTextContent('2026-02-27');
  });

  it('closes with Escape or a click outside, keeping the date', async () => {
    render(<Holder />);
    await userEvent.click(trigger());
    await userEvent.keyboard('{ArrowRight}{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
    expect(screen.getByTestId('held')).toHaveTextContent('2026-03-10');

    await userEvent.click(trigger());
    await userEvent.click(screen.getByTestId('held'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
