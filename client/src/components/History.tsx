import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchHistory } from '../api/habits.ts';
import type { History as HistoryData, HistoryHabit } from '../api/habits.ts';
import { addDays, daysFrom, fullDay, longDay, monthEnd, monthName, monthStart, shortDay, weekdayColumn } from '../dates.ts';
import { periodStats } from '../stats.ts';
import { useHabits } from '../useHabits.ts';
import { Button } from './buttons.ts';
import { WeekPanel } from './WeekPanel.tsx';

type View = 'day' | 'week' | 'month' | 'range';

const VIEWS: [View, string][] = [
  ['day', 'Day'],
  ['week', 'Week'],
  ['month', 'Month'],
  ['range', 'Range'],
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Period {
  from: string;
  to: string;
}

/** The days a view shows: the day itself, the seven days that end on it, its month, or the range. */
function periodOf(view: View, anchor: string, range: Period): Period {
  switch (view) {
    case 'day':
      return { from: anchor, to: anchor };
    case 'week':
      return { from: addDays(anchor, -6), to: anchor };
    case 'month':
      return { from: monthStart(anchor), to: monthEnd(anchor) };
    case 'range':
      return range;
  }
}

/** The day the view moves to, one period back (-1) or forward (1), never past today. */
function moved(view: View, anchor: string, step: number, today: string): string {
  const next = view === 'month' ? monthStart(anchor, step) : addDays(anchor, step * (view === 'week' ? 7 : 1));
  return next > today ? today : next;
}

function periodLabel(view: View, anchor: string, period: Period): string {
  if (view === 'day') {
    return longDay(anchor);
  }
  if (view === 'month') {
    return monthName(anchor);
  }
  return `${shortDay(period.from)} – ${shortDay(period.to)}`;
}

/** The history of the period, asked again when the period, the habit or the habits change. */
function useHistory(period: Period, habitId: number | undefined) {
  const { habits } = useHabits();
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    fetchHistory(period.from, period.to, habitId)
      .then((data) => {
        if (!cancelled) {
          setHistory(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
    // `habits` changes when a day is marked anywhere, so the history follows it.
  }, [period.from, period.to, habitId, habits]);

  const current = history && history.from === period.from && history.to === period.to ? history : null;
  return { history: current, failed };
}

/** The history of every habit: a day, a week, a month or a range of days, with how it went. */
export function History() {
  const { today, habits } = useHabits();
  const [view, setView] = useState<View>('week');
  const [anchor, setAnchor] = useState(today);
  const [habitId, setHabitId] = useState<number | undefined>(undefined);
  const [range, setRange] = useState<Period>(() => ({ from: addDays(today, -29), to: today }));

  const period = periodOf(view, anchor, range);
  const { history, failed } = useHistory(period, habitId);
  const atToday = view === 'month' ? monthStart(anchor) >= monthStart(today) : anchor >= today;

  return (
    <section aria-labelledby="history-title">
      <Heading>
        <Title id="history-title">History</Title>
        <Lead>How every habit went, day by day, week by week and month by month.</Lead>
      </Heading>

      <Toolbar>
        <Tabs role="tablist" aria-label="History view">
          {VIEWS.map(([key, label]) => (
            <Tab
              key={key}
              id={`tab-${key}`}
              type="button"
              role="tab"
              aria-selected={view === key}
              aria-controls="history-panel"
              $selected={view === key}
              onClick={() => setView(key)}
            >
              {label}
            </Tab>
          ))}
        </Tabs>
        <Field>
          <FieldLabel htmlFor="history-habit">Habit</FieldLabel>
          <Select id="history-habit" value={habitId ?? ''} onChange={(event) => setHabitId(event.target.value === '' ? undefined : Number(event.target.value))}>
            <option value="">All habits</option>
            {habits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
              </option>
            ))}
          </Select>
        </Field>
      </Toolbar>

      <Panel id="history-panel" role="tabpanel" aria-labelledby={`tab-${view}`}>
        {view === 'range' ? (
          <RangeFields>
            <Field>
              <FieldLabel htmlFor="history-from">From</FieldLabel>
              <DateInput id="history-from" type="date" value={range.from} max={range.to} onChange={(event) => event.target.value && setRange({ ...range, from: event.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor="history-to">To</FieldLabel>
              <DateInput id="history-to" type="date" value={range.to} min={range.from} max={today} onChange={(event) => event.target.value && setRange({ ...range, to: event.target.value })} />
            </Field>
          </RangeFields>
        ) : (
          <Navigator>
            <Button type="button" aria-label={`Previous ${view}`} onClick={() => setAnchor(moved(view, anchor, -1, today))}>
              ‹
            </Button>
            <PeriodName data-testid="period">{periodLabel(view, anchor, period)}</PeriodName>
            <Button type="button" aria-label={`Next ${view}`} disabled={atToday} onClick={() => setAnchor(moved(view, anchor, 1, today))}>
              ›
            </Button>
            <Button type="button" aria-label="Go to today" disabled={anchor === today} onClick={() => setAnchor(today)}>
              Today
            </Button>
          </Navigator>
        )}

        {view === 'week' && <WeekPanel end={anchor} habitId={habitId} />}
        {history === null ? (
          view !== 'week' && <Note>{failed ? 'The history could not be loaded.' : 'Loading…'}</Note>
        ) : (
          <>
            {view === 'day' && <DayList history={history} day={anchor} />}
            {view === 'month' && <MonthCalendar history={history} month={anchor} today={today} single={habitId !== undefined} />}
            {/* One day needs no summary: the list already says it. */}
            {view !== 'day' && <PeriodSummary history={history} period={period} today={today} />}
          </>
        )}
      </Panel>
    </section>
  );
}

function DayList({ history, day }: { history: HistoryData; day: string }) {
  return (
    <List aria-label={`Habits on ${fullDay(day)}`}>
      {history.habits.map((habit) => {
        const status = day < habit.startedOn ? 'not-started' : habit.days.includes(day) ? 'done' : 'missed';
        return (
          <Row key={habit.id} data-testid={`day-${habit.id}`}>
            <div>
              <RowName>{habit.name}</RowName>
              <RowNote>Started {fullDay(habit.startedOn)}</RowNote>
            </div>
            <Status $status={status}>{status === 'done' ? 'Done' : status === 'missed' ? 'Not done' : 'Not started yet'}</Status>
          </Row>
        );
      })}
    </List>
  );
}

/** How many of the habits that existed on `day` were done on it. */
function dayCount(habits: HistoryHabit[], day: string): { done: number; active: number } {
  const active = habits.filter((habit) => habit.startedOn <= day);
  return { done: active.filter((habit) => habit.days.includes(day)).length, active: active.length };
}

function MonthCalendar({ history, month, today, single }: { history: HistoryData; month: string; today: string; single: boolean }) {
  const days = daysFrom(monthStart(month), monthEnd(month));
  const blanks = weekdayColumn(days[0]!);
  const cells: (string | null)[] = [...Array<null>(blanks).fill(null), ...days];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) => cells.slice(index * 7, index * 7 + 7));

  return (
    <Calendar>
      <caption className="visually-hidden">{monthName(month)}</caption>
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
          // Every week of the month has at least one day of it, and the first one names the row.
          <tr key={week.find((day) => day !== null)}>
            {Array.from({ length: 7 }, (_, column) => {
              const day = week[column] ?? null;
              if (day === null) {
                return <td key={column} />;
              }
              const number = Number(day.slice(8));
              if (day > today) {
                return (
                  <td key={day} aria-label={`${longDay(day)}: still to come`}>
                    <Cell $share={null} aria-hidden="true">
                      <CellDay>{number}</CellDay>
                    </Cell>
                  </td>
                );
              }
              if (single) {
                const habit = history.habits[0];
                const started = habit !== undefined && day >= habit.startedOn;
                const done = started && habit.days.includes(day);
                return (
                  <td key={day} data-testid={`cell-${day}`} aria-label={`${longDay(day)}: ${started ? (done ? 'done' : 'not done') : 'not started yet'}`}>
                    <Cell $share={started ? (done ? 1 : 0) : null} aria-hidden="true">
                      <CellDay>{number}</CellDay>
                      <CellCount>{done ? '✓' : ''}</CellCount>
                    </Cell>
                  </td>
                );
              }
              const { done, active } = dayCount(history.habits, day);
              return (
                <td key={day} data-testid={`cell-${day}`} aria-label={`${longDay(day)}: ${done} of ${active} habits done`}>
                  <Cell $share={active === 0 ? null : done / active} aria-hidden="true">
                    <CellDay>{number}</CellDay>
                    <CellCount>{active === 0 ? '' : `${done}/${active}`}</CellCount>
                  </Cell>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Calendar>
  );
}

function PeriodSummary({ history, period, today }: { history: HistoryData; period: Period; today: string }) {
  const rows = history.habits.map((habit) => ({ habit, stats: periodStats(habit, period.from, period.to, today) }));
  const only = rows.length === 1 ? rows[0] : undefined;

  if (only) {
    return (
      <Stats aria-label="How it went">
        <Stat>
          <StatValue>{fullDay(only.habit.startedOn)}</StatValue>
          <StatLabel>Started</StatLabel>
        </Stat>
        <Stat>
          <StatValue>
            {only.stats.done} of {only.stats.possible}
          </StatValue>
          <StatLabel>Days done</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{only.stats.rate === null ? '–' : `${only.stats.rate}%`}</StatValue>
          <StatLabel>Of the days</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{only.stats.longestStreak}</StatValue>
          <StatLabel>Longest streak</StatLabel>
        </Stat>
      </Stats>
    );
  }

  return (
    <SummaryScroll>
      <SummaryTable aria-label="How it went">
        <thead>
          <tr>
            <th scope="col">Habit</th>
            <th scope="col">Started</th>
            <th scope="col">Done</th>
            <th scope="col">Of the days</th>
            <th scope="col">Longest streak</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ habit, stats }) => (
            <tr key={habit.id} data-testid={`summary-${habit.id}`}>
              <th scope="row" title={habit.name}>
                {habit.name}
              </th>
              <td>{shortDay(habit.startedOn)}</td>
              <td>
                {stats.done} of {stats.possible}
              </td>
              <td>{stats.rate === null ? '–' : `${stats.rate}%`}</td>
              <td>{stats.longestStreak}</td>
            </tr>
          ))}
        </tbody>
      </SummaryTable>
      {/* Below 768px the table becomes one short line per habit: a bar, the numbers, the start. */}
      <Compact aria-label="How it went">
        {rows.map(({ habit, stats }) => (
          <CompactItem key={habit.id} data-testid={`compact-${habit.id}`}>
            <CompactName>{habit.name}</CompactName>
            <CompactLine>
              <Bar aria-hidden="true">
                <BarFill $percent={stats.rate ?? 0} />
              </Bar>
              <CompactNumbers>
                {stats.done} of {stats.possible} · {stats.rate === null ? '–' : `${stats.rate}%`}
              </CompactNumbers>
            </CompactLine>
            <CompactNote>
              Since {shortDay(habit.startedOn)} · Best streak {stats.longestStreak}
            </CompactNote>
          </CompactItem>
        ))}
      </Compact>
    </SummaryScroll>
  );
}

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 2rem;
`;

const Lead = styled.p`
  margin: ${({ theme }) => theme.space.xs} 0 0;
  color: ${({ theme }) => theme.color.muted};
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Tabs = styled.div`
  display: inline-flex;
  padding: ${({ theme }) => theme.space.xs};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.color.sunken};
`;

const Tab = styled.button<{ $selected: boolean }>`
  padding: 6px 16px;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme, $selected }) => ($selected ? theme.color.card : 'transparent')};
  box-shadow: ${({ theme, $selected }) => ($selected ? theme.shadow.card : 'none')};
  color: ${({ theme, $selected }) => ($selected ? theme.color.text : theme.color.muted)};
  font-weight: 700;
  cursor: pointer;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  min-width: 0;
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.color.muted};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Select = styled.select`
  max-width: 280px;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.card};
  font-size: 1rem;
`;

const DateInput = styled.input`
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.card};
  font-size: 1rem;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.card};
  box-shadow: ${({ theme }) => theme.shadow.card};

  @media (max-width: 560px) {
    padding: ${({ theme }) => theme.space.md};
  }
`;

const Navigator = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const PeriodName = styled.p`
  flex: 1;
  min-width: 10rem;
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: ${({ theme }) => theme.font.large};
  font-weight: 700;
  text-align: center;
`;

const RangeFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.md};
`;

const Note = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.muted};
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.sm} 0;
  border-top: 1px solid ${({ theme }) => theme.color.border};

  &:first-child {
    border-top: 0;
  }
`;

const RowName = styled.p`
  margin: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const RowNote = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: ${({ theme }) => theme.font.small};
`;

const Status = styled.span<{ $status: 'done' | 'missed' | 'not-started' }>`
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme, $status }) => ($status === 'done' ? theme.color.accentSoft : theme.color.sunken)};
  color: ${({ theme, $status }) => ($status === 'done' ? theme.color.accentStrong : theme.color.muted)};
  font-size: ${({ theme }) => theme.font.small};
  font-weight: 700;
  white-space: nowrap;
`;

const Calendar = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px;
  table-layout: fixed;

  th {
    color: ${({ theme }) => theme.color.muted};
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  td {
    padding: 0;
  }
`;

/** A day of the calendar; the more of its habits were done, the stronger the green. */
const Cell = styled.div<{ $share: number | null }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 56px;
  padding: 6px;
  border: 1px solid ${({ theme, $share }) => ($share === null ? 'transparent' : theme.color.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $share }) =>
    $share === null ? theme.color.page : `color-mix(in srgb, ${theme.color.accent} ${Math.round($share * 85)}%, ${theme.color.card})`};
  color: ${({ theme, $share }) => ($share !== null && $share >= 0.5 ? theme.color.accentText : theme.color.text)};

  @media (max-width: 560px) {
    min-height: 44px;
    padding: 4px;
  }
`;

const CellDay = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
`;

const CellCount = styled.span`
  align-self: flex-end;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
`;

const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.space.md};
  margin: 0;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.sunken};
`;

const StatValue = styled.dd`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.25rem;
  font-weight: 700;
`;

const StatLabel = styled.dt`
  color: ${({ theme }) => theme.color.muted};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const SummaryScroll = styled.div`
  overflow-x: auto;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.small};

  th,
  td {
    padding: 8px ${({ theme }) => theme.space.sm};
    text-align: right;
    white-space: nowrap;
  }

  thead th {
    color: ${({ theme }) => theme.color.muted};
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  th[scope='row'],
  thead th:first-child {
    max-width: 260px;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
  }

  tbody tr {
    border-top: 1px solid ${({ theme }) => theme.color.border};
  }

  td {
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const Compact = styled.ul`
  display: none;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 767px) {
    display: block;
  }
`;

const CompactItem = styled.li`
  padding: ${({ theme }) => theme.space.sm} 0;
  border-top: 1px solid ${({ theme }) => theme.color.border};

  &:first-child {
    border-top: 0;
  }
`;

const CompactName = styled.p`
  margin: 0 0 ${({ theme }) => theme.space.xs};
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const CompactLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const Bar = styled.div`
  flex: 1;
  height: 8px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.color.sunken};
`;

const BarFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.color.accent};
`;

const CompactNumbers = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.font.small};
  font-variant-numeric: tabular-nums;
  font-weight: 700;
`;

const CompactNote = styled.p`
  margin: ${({ theme }) => theme.space.xs} 0 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: 0.8125rem;
`;
