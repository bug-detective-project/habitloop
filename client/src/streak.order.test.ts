import { describe, expect, it } from 'vitest';
import { currentStreak } from './streak.ts';

const TODAY = '2026-03-18';

describe('currentStreak with days in any order', () => {
  it('counts a day that was marked after the newer ones', () => {
    // Yesterday was marked last, so it comes after today in the list.
    expect(currentStreak(['2026-03-15', '2026-03-16', '2026-03-18', '2026-03-17'], TODAY)).toBe(4);
  });

  it('counts the same streak however the days are ordered', () => {
    expect(currentStreak(['2026-03-18', '2026-03-16', '2026-03-17'], TODAY)).toBe(3);
    expect(currentStreak(['2026-03-17', '2026-03-16', '2026-03-10'], TODAY)).toBe(2);
  });

  it('counts a day once when it appears twice', () => {
    expect(currentStreak(['2026-03-17', '2026-03-17', '2026-03-18'], TODAY)).toBe(2);
  });
});
