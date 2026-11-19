import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { addDays, daysFrom, fullDay, mediumDay, monthEnd, monthName, monthStart, spokenDay, weekdayColumn } from '../dates.ts';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** How far each key moves the focused day. */
const STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

interface DatePickerProps {
  /** What the date is for, shown above the button and read with the date ("From, March 2, 2026"). */
  label: string;
  /** The chosen day, as YYYY-MM-DD. */
  value: string;
  onChange: (day: string) => void;
  /** The first and the last day that can be picked; the others are shown but disabled. */
  min?: string;
  max?: string;
  /** Which edge of the button the calendar lines up with: the end for a picker on the right. */
  align?: 'start' | 'end';
}

/**
 * A button that shows a date and opens a calendar under it. The calendar opens on the chosen day;
 * arrows move by a day or a week, PageUp and PageDown by a month, Enter picks, and Escape or a click
 * outside close it, giving the focus back to the button.
 */
export function DatePicker({ label, value, onChange, min, max, align = 'start' }: DatePickerProps) {
  const labelId = useId();
  const [open, setOpen] = useState(false);
  // The day that has the focus in the calendar; its month is the month on show.
  const [focused, setFocused] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);

  const allowed = (day: string) => (min === undefined || day >= min) && (max === undefined || day <= max);
  const clamp = (day: string) => (min !== undefined && day < min ? min : max !== undefined && day > max ? max : day);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function pick(day: string) {
    onChange(day);
    close();
  }

  // The focus follows the focused day, in whatever month it is.
  useEffect(() => {
    if (open) {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focused}"]`)?.focus();
    }
  }, [open, focused]);

  // A press anywhere outside closes the calendar.
  useEffect(() => {
    if (!open) {
      return;
    }
    const outside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);

  function key(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const step = STEPS[event.key];
    const target
      = step !== undefined
        ? addDays(focused, step)
        : event.key === 'PageUp' || event.key === 'PageDown'
          ? sameDayIn(monthStart(focused, event.key === 'PageUp' ? -1 : 1), focused)
          : undefined;
    if (target !== undefined && (event.target as HTMLElement).dataset.day !== undefined) {
      event.preventDefault();
      setFocused(clamp(target));
    }
  }

  const month = monthStart(focused);
  const days = daysFrom(month, monthEnd(month));
  const cells: (string | null)[] = [...Array<null>(weekdayColumn(month)).fill(null), ...days];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  const previousMonth = monthEnd(monthStart(month, -1));
  const nextMonth = monthStart(month, 1);

  return (
    <Root ref={rootRef}>
      <Label id={labelId}>{label}</Label>
      <Trigger
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}, ${fullDay(value)}`}
        onClick={() => {
          setFocused(value);
          setOpen(!open);
        }}
      >
        <span>{mediumDay(value)}</span>
        <CalendarIcon />
      </Trigger>
      {open && (
        <Popover role="dialog" aria-label={`Choose the date for ${label}`} $align={align} onKeyDown={key}>
          <Head>
            <MonthButton
              type="button"
              aria-label="Previous month"
              disabled={min !== undefined && previousMonth < min}
              onClick={() => setFocused(clamp(sameDayIn(monthStart(month, -1), focused)))}
            >
              ‹
            </MonthButton>
            <MonthTitle aria-live="polite">{monthName(month)}</MonthTitle>
            <MonthButton
              type="button"
              aria-label="Next month"
              disabled={max !== undefined && nextMonth > max}
              onClick={() => setFocused(clamp(sameDayIn(nextMonth, focused)))}
            >
              ›
            </MonthButton>
          </Head>
          <Grid ref={gridRef} role="grid" aria-labelledby={labelId}>
            <thead>
              <tr>
                {WEEKDAYS.map((name) => (
                  <th key={name} scope="col">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week.find((day) => day !== null)}>
                  {Array.from({ length: 7 }, (_, column) => {
                    const day = week[column] ?? null;
                    if (day === null) {
                      return <td key={column} />;
                    }
                    return (
                      <td key={day}>
                        <Day
                          type="button"
                          data-day={day}
                          tabIndex={day === focused ? 0 : -1}
                          aria-label={spokenDay(day)}
                          aria-pressed={day === value}
                          disabled={!allowed(day)}
                          $chosen={day === value}
                          onClick={() => pick(day)}
                        >
                          {Number(day.slice(8))}
                        </Day>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Grid>
        </Popover>
      )}
    </Root>
  );
}

/** The same day of the month as `day` in the month that starts on `first`, or that month's last day. */
function sameDayIn(first: string, day: string): string {
  const last = monthEnd(first);
  const wanted = `${first.slice(0, 8)}${day.slice(8)}`;
  return wanted > last ? last : wanted;
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  min-width: 0;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.color.muted};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.card};
  font-size: 1rem;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.color.muted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
  }

  &[aria-expanded='true'] {
    border-color: ${({ theme }) => theme.color.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.accentSoft};
  }

  @media (max-width: 560px) {
    padding: ${({ theme }) => theme.space.sm};
    font-size: 0.9375rem;
  }
`;

const Popover = styled.div<{ $align: 'start' | 'end' }>`
  position: absolute;
  top: calc(100% + 6px);
  ${({ $align }) => ($align === 'end' ? 'right: 0;' : 'left: 0;')}
  z-index: 30;
  width: 288px;
  max-width: calc(100vw - 2 * ${({ theme }) => theme.space.md});
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.card};
  box-shadow: ${({ theme }) => theme.shadow.lift};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const MonthTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 700;
`;

const MonthButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.color.card};
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.sunken};
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const Grid = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    padding-bottom: ${({ theme }) => theme.space.xs};
    color: ${({ theme }) => theme.color.muted};
    font-size: 0.75rem;
    font-weight: 700;
  }

  td {
    padding: 2px;
    text-align: center;
  }
`;

const Day = styled.button<{ $chosen: boolean }>`
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme, $chosen }) => ($chosen ? theme.color.accent : 'transparent')};
  color: ${({ theme, $chosen }) => ($chosen ? theme.color.accentText : theme.color.text)};
  font-size: ${({ theme }) => theme.font.small};
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $chosen }) => ($chosen ? 700 : 500)};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme, $chosen }) => ($chosen ? theme.color.accentStrong : theme.color.accentSoft)};
  }

  &:disabled {
    color: ${({ theme }) => theme.color.borderStrong};
    cursor: default;
  }
`;
