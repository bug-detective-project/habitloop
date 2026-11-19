import { describe, expect, it } from 'vitest';
import { currentStreak, doneThisWeek } from './streak.ts';

const TODAY = '2026-03-18';

describe('currentStreak', () => {
  it('counts the days in a row that end today', () => {
    expect(currentStreak(['2026-03-16', '2026-03-17', '2026-03-18'], TODAY)).toBe(3);
  });

  it('does not break when today is not marked yet', () => {
    expect(currentStreak(['2026-03-16', '2026-03-17'], TODAY)).toBe(2);
  });

  it('is zero when neither today nor yesterday is marked', () => {
    expect(currentStreak(['2026-03-14', '2026-03-15'], TODAY)).toBe(0);
    expect(currentStreak([], TODAY)).toBe(0);
  });

  it('stops at the first day that was skipped', () => {
    expect(currentStreak(['2026-03-10', '2026-03-11', '2026-03-17', '2026-03-18'], TODAY)).toBe(2);
  });

  it('crosses the turn of a month', () => {
    expect(currentStreak(['2026-02-27', '2026-02-28', '2026-03-01'], '2026-03-01')).toBe(3);
  });
});

describe('doneThisWeek', () => {
  it('counts the marked days among the seven that end today', () => {
    expect(doneThisWeek(['2026-03-11', '2026-03-12', '2026-03-18'], TODAY)).toBe(2);
  });
});
