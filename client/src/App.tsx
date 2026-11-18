import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Button, PrimaryButton } from './components/buttons.ts';
import { HabitForm } from './components/HabitForm.tsx';
import { Today } from './components/Today.tsx';
import { WeekPanel } from './components/WeekPanel.tsx';
import { HabitsProvider } from './HabitsContext.tsx';
import { useHabits } from './useHabits.ts';
import { GlobalStyle, theme } from './theme.ts';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  max-width: 760px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md};
`;

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const Brand = styled.h1`
  flex: 1;
  margin: 0;
  font-size: 1.5rem;
`;

const Box = styled.div`
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.card};
`;

const Problem = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  border-color: ${({ theme }) => theme.color.danger};
  background: ${({ theme }) => theme.color.dangerSoft};
  color: ${({ theme }) => theme.color.danger};
`;

function Screen() {
  const { status, problem, dismissProblem } = useHabits();
  const [creating, setCreating] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);

  return (
    <Page>
      <Header>
        <Brand>HabitLoop</Brand>
        <Button type="button" aria-expanded={weekOpen} onClick={() => setWeekOpen(!weekOpen)}>
          Last 7 days
        </Button>
        <PrimaryButton type="button" onClick={() => setCreating(true)}>
          New habit
        </PrimaryButton>
      </Header>

      {problem && (
        <Problem role="alert">
          {problem}
          <Button type="button" onClick={dismissProblem}>
            Dismiss
          </Button>
        </Problem>
      )}

      {creating && (
        <Box>
          <HabitForm onClose={() => setCreating(false)} />
        </Box>
      )}

      <main>
        {status === 'loading' && <p>Loading…</p>}
        {status === 'failed' && <p role="alert">HabitLoop could not load your habits. Is the API running?</p>}
        {status === 'ready' && <Today />}
      </main>

      {status === 'ready' && weekOpen && <WeekPanel />}
    </Page>
  );
}

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <HabitsProvider>
        <Screen />
      </HabitsProvider>
    </ThemeProvider>
  );
}
