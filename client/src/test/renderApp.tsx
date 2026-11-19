import { render, screen } from '@testing-library/react';
import { App } from '../App.tsx';

/** Renders the whole app and waits until the habits are on the screen. */
export async function renderApp() {
  const view = render(<App />);
  await screen.findByRole('heading', { level: 2, name: 'Wednesday, March 18' });
  return view;
}

/** The card of a habit in the Today list. */
export function card(id: number): HTMLElement {
  return screen.getByTestId(`habit-${id}`);
}
