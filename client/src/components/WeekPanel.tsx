import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { fetchSummary } from '../api/habits.ts';
import type { Summary, SummaryRow } from '../api/habits.ts';
import { longDay, weekdayName } from '../dates.ts';
import { useHabits } from '../useHabits.ts';

/** How often the open panel asks the server again: the same account may be open on a phone too. */
export const REFRESH_MS = 10_000;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.md};
  background: rgb(23 35 29 / 0.45);
  backdrop-filter: blur(2px);
`;

const Panel = styled.div`
  width: min(100%, 760px);
  max-height: calc(100vh - 2 * ${({ theme }) => theme.space.md});
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.card};
  box-shadow: ${({ theme }) => theme.shadow.lift};
  overflow: auto;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.5rem;
`;

const Close = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.color.card};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.sunken};
  }
`;

const Scroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
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
 * The last seven days of every habit, in a dialog over the page. Any of the days can be marked or
 * unmarked here. Close, Escape and a press around it close it; Tab stays inside it.
 */
export function WeekPanel({ onClose }: { onClose: () => void }) {
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

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The dialog takes the focus when it opens, on its Close button.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  function key(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const stops = [...(panelRef.current?.querySelectorAll<HTMLElement>('button') ?? [])];
    const first = stops[0];
    const last = stops.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  async function toggle(row: SummaryRow, day: string) {
    // A request that is on its way was asked before this change: its answer is out of date.
    newestRef.current += 1;
    setSummary((current) =>
      current ? { ...current, habits: current.habits.map((item) => (item.id === row.id ? withDay(item, day) : item)) } : current,
    );
    await toggleDay(row.id, day);
    await load();
  }

  return createPortal(
    <Backdrop
      onMouseDown={(event) => {
        // A press around the dialog closes it; without preventDefault the press would then move the focus to the page.
        if (event.target === event.currentTarget) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <Panel ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="week-title" onKeyDown={key}>
        <Head>
          <Title id="week-title">Last 7 days</Title>
          <Close ref={closeRef} type="button" aria-label="Close" title="Close" onClick={onClose}>
            ×
          </Close>
        </Head>
        <Scroll>
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
        </Scroll>
      </Panel>
    </Backdrop>,
    document.body,
  );
}
