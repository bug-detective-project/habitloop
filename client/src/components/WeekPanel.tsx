import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { fetchSummary } from '../api/habits.ts';
import type { Summary, SummaryRow } from '../api/habits.ts';
import { longDay, weekdayName } from '../dates.ts';
import { useHabits } from '../useHabits.ts';

/** How often the open panel asks the server again: the same account may be open on a phone too. */
export const REFRESH_MS = 10_000;

const Panel = styled.aside`
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.card};
  overflow-x: auto;
`;

const Title = styled.h2`
  margin: 0 0 ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.font.large};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.small};

  th,
  td {
    padding: ${({ theme }) => theme.space.xs};
    text-align: center;
  }

  th[scope='row'] {
    max-width: 220px;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Day = styled.button<{ $done: boolean }>`
  width: 28px;
  height: 28px;
  border: 2px solid ${({ theme }) => theme.color.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $done }) => ($done ? theme.color.accent : 'transparent')};
  color: ${({ theme }) => theme.color.accentText};
  cursor: pointer;
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

/** The last seven days of every habit. Any of the days can be marked or unmarked here. */
export function WeekPanel() {
  const { toggleDay } = useHabits();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);
  // The number of the newest request. An answer is used only while its request is still the newest.
  const newestRef = useRef(0);

  const load = useCallback(async () => {
    const request = ++newestRef.current;
    try {
      const data = await fetchSummary();
      if (request === newestRef.current) {
        setSummary(data);
        setFailed(false);
      }
    } catch {
      if (request === newestRef.current) {
        setFailed(true);
      }
    }
  }, []);

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
    <Panel aria-label="Last 7 days">
      <Title>Last 7 days</Title>
      {summary === null ? (
        <Note>{failed ? 'The summary could not be loaded.' : 'Loading…'}</Note>
      ) : (
        <Table>
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
            {summary.habits.map((row) => (
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
      )}
      {summary !== null && failed && <Note>The summary could not be refreshed.</Note>}
    </Panel>
  );
}
