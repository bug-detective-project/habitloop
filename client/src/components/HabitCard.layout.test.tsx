import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

const LONG_NAME = 'Write three things I am grateful for in the paper journal before going to bed';

describe('a habit with a long name', () => {
  it('lets the block of the name shrink, so the name is cut instead of pushing the buttons out', async () => {
    mockApi({ habits: [{ id: 6, name: LONG_NAME, weeklyGoal: 7, days: [] }] });
    await renderApp();

    const name = screen.getByRole('heading', { level: 3, name: LONG_NAME });
    const block = name.parentElement!;
    const style = getComputedStyle(block);

    // A flex item never becomes narrower than its content unless something lets it.
    const mayShrink = ['0', '0px'].includes(style.minWidth) || ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflow);
    expect(mayShrink, `min-width: ${style.minWidth || 'auto'}; overflow: ${style.overflow || 'visible'}`).toBe(true);
    expect(name).toHaveAttribute('title', LONG_NAME);
  });
});
