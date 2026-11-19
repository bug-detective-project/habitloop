import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Habit } from '../api/habits.ts';
import { useHabits } from '../useHabits.ts';
import { shortDay } from '../dates.ts';
import { currentStreak, doneThisWeek } from '../streak.ts';
import { Button } from './buttons.ts';
import { HabitForm } from './HabitForm.tsx';
import { ProgressRing } from './ProgressRing.tsx';

const Card = styled.li<{ $done: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
  border: 1px solid ${({ theme, $done }) => ($done ? 'transparent' : theme.color.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $done }) => ($done ? theme.color.accentSoft : theme.color.card)};
  box-shadow: ${({ theme, $done }) => ($done ? 'none' : theme.shadow.card)};
  list-style: none;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    background-color 0.15s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.lift};
  }

  /* On a phone the card has two lines: the habit with its ring, and Edit under the text. */
  @media (max-width: 560px) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: ${({ theme }) => `${theme.space.xs} 12px`};
    padding: ${({ theme }) => theme.space.md};

    > [role='progressbar'] {
      grid-area: 1 / 3;
    }
  }
`;

const EditingCard = styled(Card)`
  cursor: default;
`;

const Check = styled.button<{ $done: boolean }>`
  flex: none;
  width: 40px;
  height: 40px;
  border: 2px solid ${({ theme, $done }) => ($done ? theme.color.accent : theme.color.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme, $done }) => ($done ? theme.color.accent : theme.color.card)};
  color: ${({ theme }) => theme.color.accentText};
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 560px) {
    grid-area: 1 / 2;
  }
`;

const Name = styled.h3`
  margin: 0;
  overflow: hidden;
  font-size: 1.0625rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* A phone is narrow: the name may take two lines before it is cut. */
  @media (max-width: 560px) {
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin: 4px 0 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: ${({ theme }) => theme.font.small};

  /* Each piece stays whole: when the line is short, a piece moves down instead of breaking. */
  > span {
    white-space: nowrap;
  }

  /* The streak reads as a small tag in front of the count of the week. */
  [data-testid='streak'] {
    padding: 1px 9px;
    border-radius: ${({ theme }) => theme.radius.round};
    background: ${({ theme }) => theme.color.warmSoft};
    color: ${({ theme }) => theme.color.warm};
    font-weight: 700;
  }
`;

const EditButton = styled(Button)`
  flex: none;
  border-color: transparent;
  background: transparent;
  color: ${({ theme }) => theme.color.muted};

  @media (max-width: 560px) {
    grid-area: 2 / 2;
    justify-self: start;
    margin-left: -10px;
    padding: 4px 10px;
    font-size: ${({ theme }) => theme.font.small};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

function streakText(streak: number): string {
  if (streak === 0) {
    return 'No streak yet';
  }
  return streak === 1 ? '1 day in a row' : `${streak} days in a row`;
}

/** One habit of the Today list: click the card to mark it done today, or open it to change it. */
export function HabitCard({ habit }: { habit: Habit }) {
  const { today, toggleDay } = useHabits();
  const [editing, setEditing] = useState(false);
  const doneToday = habit.days.includes(today);
  // The card answers the click at once; it follows the list again when the list changes.
  const [done, setDone] = useState(doneToday);
  useEffect(() => {
    setDone(doneToday);
  }, [doneToday]);

  if (editing) {
    return (
      <EditingCard $done={false} data-testid={`habit-${habit.id}`}>
        <HabitForm habit={habit} onClose={() => setEditing(false)} />
      </EditingCard>
    );
  }

  const week = doneThisWeek(habit.days, today);

  function toggle() {
    setDone(!done);
    void toggleDay(habit.id, today);
  }

  return (
    <Card $done={done} onClick={toggle} data-testid={`habit-${habit.id}`}>
      <Check type="button" $done={done} aria-pressed={done} aria-label={`${habit.name}: done today`}>
        {done ? '✓' : ''}
      </Check>
      <Info>
        <Name title={habit.name}>{habit.name}</Name>
        <Meta>
          <span data-testid="streak">{streakText(currentStreak(habit.days, today))}</span>
          <span data-testid="week-count">{habit.weeklyGoal === null ? `${week} this week` : `${week} of ${habit.weeklyGoal} this week`}</span>
          <span data-testid="started">Since {shortDay(habit.startedOn)}</span>
        </Meta>
      </Info>
      {habit.weeklyGoal !== null && (
        <ProgressRing done={week} goal={habit.weeklyGoal} label={`Weekly goal of ${habit.name}`} />
      )}
      <EditButton
        type="button"
        aria-label={`Edit ${habit.name}`}
        onClick={(event) => {
          // The whole card marks the habit; a click on Edit must not reach it.
          event.stopPropagation();
          setEditing(true);
        }}
      >
        Edit
      </EditButton>
    </Card>
  );
}
