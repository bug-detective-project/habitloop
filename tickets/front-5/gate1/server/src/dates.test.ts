import { describe, expect, it } from 'vitest';
import { addDays, getWeek, isDay } from './dates.ts';

describe('dates', () => {
  it('accepts real days only', () => {
    expect(isDay('2026-03-18')).toBe(true);
    expect(isDay('2026-02-30')).toBe(false);
    expect(isDay('18/03/2026')).toBe(false);
    expect(isDay(20260318)).toBe(false);
  });

  it('adds days across months and years', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('gives the seven days that end today', () => {
    expect(getWeek('2026-03-02')).toEqual([
      '2026-02-24',
      '2026-02-25',
      '2026-02-26',
      '2026-02-27',
      '2026-02-28',
      '2026-03-01',
      '2026-03-02',
    ]);
  });
});
