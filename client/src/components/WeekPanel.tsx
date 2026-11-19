import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { fetchSummary } from '../api/habits.ts';
import type { Summary, SummaryRow } from '../api/habits.ts';
import { longDay, weekdayName } from '../dates.ts';
import { useHabits } from '../useHabits.ts';

/** How often the open panel asks the server again: the same account may be open on a phone too. */
export const REFRESH_MS = 10_000;

const Panel = styled.div`
  overflow-x: auto;
`;

/** The name of the one habit shown, above the table: only below 768px, where the table leaves it out. */
const SingleName = styled.h3`
  display: none;
  margin: 0 0 ${({ theme }) => theme.space.sm};
  font-size: 1rem;
  overflow-wrap: anywhere;

  @media (max-width: 767px) {
    display: block;
  }
`;

const Table = styled.table<{ $single: boolean }>`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.small};

  th,
  td {
    padding: 6px ${({ theme }) => theme.space.xs};
    text-align: center;
  }

  thead th {
    color: ${({ theme }) => theme.color.muted};
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  tbody tr {
    border-top: 1px solid ${({ theme }) => theme.color.border};
  }

  th[scope='row'] {
    max-width: 220px;
    overflow: hidden;
    font-weight: 600;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td[data-testid='progress'] {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  /* Below 768px the Done column gives its room to the days; the summary under the table has it. */
  @media (max-width: 767px) {
    thead th:last-child,
    td[data-testid='progress'] {
      display: none;
    }
  }

  /* One habit below 768px: its name is the title above the table, which keeps only the days. */
  @media (max-width: 767px) {
    ${({ $single }) =>
      $single
      && `
      thead tr,
      tbody tr {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
      }

      thead th:first-child {
        display: none;
      }

      tbody th[scope='row'] {
        display: none;
      }

      td {
        display: flex;
        justify-content: center;
      }

      td button {
        width: 34px;
        height: 34px;
      }
    `}
  }

  /* On a phone the name wraps to two lines in a narrow column, so the days fit beside it. */
  @media (max-width: 560px) {
    th,
    td {
      padding: 4px 2px;
    }

    th[scope='row'] {
      display: -webkit-box;
      max-width: 104px;
      white-space: normal;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    button {
      width: 26px;
      height: 26px;
    }
  }
`;

const Day = styled.button<{ $done: boolean }>`
  width: 30px;
  height: 30px;
  border: 2px solid ${({ theme, $done }) => ($done ? theme.color.accent : theme.color.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme, $done }) => ($done ? theme.color.accent : 'transparent')};
  color: ${({ theme }) => theme.color.accentText};
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const Note = styled.p`
  margin: ${({ theme }) => theme.space.sm} 0 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: ${({ theme }) => theme.font.small};
`;

function withDay(row: SummaryRow, day: string): SummaryRow {
  const days = row.days.includes(day) ? row.days.filter((item) => item !== day) : [...row.days, day];
  return { ...row, days };
}

/**
 * The seven days that end on `end`, for every habit (or only `habitId`). Any of the days can be
 * marked or unmarked here.
 */
export function WeekPanel({ end, habitId }: { end: string; habitId?: number }) {
  const { toggleDay } = useHabits();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);
  // The number of the newest request. An answer is used only while its request is still the newest.
  const newestRef = useRef(0);

  const load = useCallback(async () => {
    const request = ++newestRef.current;
    try {
      const data = await fetchSummary(end);
      if (request === newestRef.current) {
        setSummary(data);
        setFailed(false);
      }
    } catch {
      if (request === newestRef.current) {
        setFailed(true);
      }
    }
  }, [end]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  async function toggle(row: SummaryRow, day: string) {
    // A request that is on its way was asked before this change: its answer is out of date.
    newestRef.current += 1;
    setSummary((current) =>
      current ? { ...current, habits: current.habits.map((item) => (item.id === row.id ? withDay(item, day) : item)) } : current,
    );
    await toggleDay(row.id, day);
    await load();
  }

  return (
    <Panel data-testid="week-table">
      {summary === null ? (
        <Note>{failed ? 'The summary could not be loaded.' : 'Loading…'}</Note>
      ) : (
        <>
          {habitId !== undefined && <SingleName>{summary.habits.find((row) => row.id === habitId)?.name}</SingleName>}
          <Table $single={habitId !== undefined}>
            <thead>
              <tr>
                <th scope="col">Habit</th>
                {summary.days.map((day) => (
                  <th key={day} scope="col" title={longDay(day)}>
                    {weekdayName(day)}
                  </th>
                ))}
                <th scope="col">Done</th>
              </tr>
            </thead>
            <tbody>
              {summary.habits
                .filter((row) => habitId === undefined || row.id === habitId)
                .map((row) => (
                  <tr key={row.id} data-testid={`week-${row.id}`}>
                    <th scope="row" title={row.name}>
                      {row.name}
                    </th>
                    {summary.days.map((day) => {
                      const done = row.days.includes(day);
                      return (
                        <td key={day}>
                          <Day
                            type="button"
                            $done={done}
                            aria-pressed={done}
                            aria-label={`${row.name}, ${longDay(day)}`}
                            onClick={() => void toggle(row, day)}
                          >
                            {done ? '✓' : ''}
                          </Day>
                        </td>
                      );
                    })}
                    <td data-testid="progress">{row.progress}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
      {summary !== null && failed && <Note>The summary could not be refreshed.</Note>}
    </Panel>
  );
}
