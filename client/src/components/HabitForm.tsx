import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import type { Habit } from '../api/habits.ts';
import { useHabits } from '../useHabits.ts';
import { Button, DangerButton, PrimaryButton } from './buttons.ts';

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: ${({ theme }) => theme.space.md};
  width: 100%;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.font.small};
  color: ${({ theme }) => theme.color.muted};
`;

const NameField = styled(Field)`
  flex: 1 1 220px;
  min-width: 0;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.card};
  color: ${({ theme }) => theme.color.text};
`;

const Select = styled(Input).attrs({ as: 'select' })``;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
`;

const Problem = styled.p`
  flex-basis: 100%;
  margin: 0;
  padding: ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.dangerSoft};
  color: ${({ theme }) => theme.color.danger};
`;

interface HabitFormProps {
  /** The habit being changed; without it the form creates one. */
  habit?: Habit;
  onClose: () => void;
}

const GOALS = [1, 2, 3, 4, 5, 6, 7];

/** The form that creates a habit or changes one. A habit being changed can also be archived. */
export function HabitForm({ habit, onClose }: HabitFormProps) {
  const { saveHabit, archiveHabit } = useHabits();
  const [name, setName] = useState(habit?.name ?? '');
  const [goal, setGoal] = useState(habit?.weeklyGoal ? String(habit.weeklyGoal) : '');
  const [problem, setProblem] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const problemId = useId();

  async function run(change: () => Promise<void>) {
    setSaving(true);
    setProblem(null);
    try {
      await change();
      onClose();
    } catch (error) {
      setProblem(error instanceof Error ? error.message : 'The habit was not saved');
      setSaving(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void run(() => saveHabit({ name, weeklyGoal: goal === '' ? null : Number(goal) }, habit?.id));
  }

  return (
    <Form onSubmit={submit} aria-label={habit ? `Edit ${habit.name}` : 'New habit'} noValidate>
      <NameField>
        Name
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-describedby={problem ? problemId : undefined}
          autoFocus
        />
      </NameField>
      <Field>
        Weekly goal
        <Select value={goal} onChange={(event) => setGoal(event.target.value)}>
          <option value="">No goal</option>
          {GOALS.map((days) => (
            <option key={days} value={days}>
              {days === 1 ? '1 day' : `${days} days`}
            </option>
          ))}
        </Select>
      </Field>
      <Actions>
        <PrimaryButton type="submit" disabled={saving}>
          Save
        </PrimaryButton>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        {habit && (
          <DangerButton type="button" disabled={saving} onClick={() => void run(() => archiveHabit(habit.id))}>
            Archive
          </DangerButton>
        )}
      </Actions>
      {problem && (
        <Problem id={problemId} role="alert">
          {problem}
        </Problem>
      )}
    </Form>
  );
}
