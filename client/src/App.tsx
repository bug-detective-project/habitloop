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
  max-width: 820px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
`;

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const BrandBlock = styled.div`
  display: flex;
  flex: 1;

  /* On a phone the name takes the first line, and the two buttons the second. */
  @media (max-width: 560px) {
    flex-basis: 100%;
  }
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const Mark = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: ${({ theme }) => theme.color.accent};
  color: ${({ theme }) => theme.color.accentText};
`;

const Brand = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.5rem;
  line-height: 1.1;
`;

const Studio = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.muted};
  font-size: 0.8125rem;
`;

const Box = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.card};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

const Problem = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  border-color: ${({ theme }) => theme.color.danger};
  background: ${({ theme }) => theme.color.dangerSoft};
  box-shadow: none;
  color: ${({ theme }) => theme.color.danger};
  font-weight: 600;
`;

const Summary = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => `${theme.space.sm} ${theme.space.lg}`};
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.accent};
  color: ${({ theme }) => theme.color.accentText};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

const SummaryCount = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.75rem;
  line-height: 1.1;
`;

const SummaryNote = styled.p`
  margin: 0;
  opacity: 0.85;
  font-size: ${({ theme }) => theme.font.small};
`;

const Meter = styled.div`
  flex: 1 1 220px;
  height: 10px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.round};
  background: rgb(255 255 255 / 0.25);
`;

const MeterFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.color.accentText};
  transition: width 0.3s ease;
`;

const Footer = styled.footer`
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.muted};
  font-size: ${({ theme }) => theme.font.small};
  text-align: center;
`;

/** How the day is going, above the list: how many habits are done and a bar that fills. */
function DaySummary() {
  const { today, habits } = useHabits();
  if (habits.length === 0) {
    return null;
  }
  const done = habits.filter((habit) => habit.days.includes(today)).length;
  const percent = Math.round((done / habits.length) * 100);

  return (
    <Summary data-testid="day-summary">
      <div>
        <SummaryCount>
          {done} of {habits.length} done
        </SummaryCount>
        <SummaryNote>{done === habits.length ? 'Everything for today is done.' : 'Tap a habit to mark it done for today.'}</SummaryNote>
      </div>
      <Meter role="progressbar" aria-label="Habits done today" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <MeterFill $percent={percent} />
      </Meter>
    </Summary>
  );
}

function Screen() {
  const { status, problem, dismissProblem } = useHabits();
  const [creating, setCreating] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);

  return (
    <Page>
      <Header>
        <BrandBlock>
          <Mark aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12a8 8 0 1 1-3-6.200" />
              <path d="m9 12 2.500 2.500L20 6" />
            </svg>
          </Mark>
          <div>
            <Brand>HabitLoop</Brand>
            <Studio>Evergreen Wellness</Studio>
          </div>
        </BrandBlock>
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

      {status === 'ready' && <DaySummary />}

      <main>
        {status === 'loading' && <p>Loading…</p>}
        {status === 'failed' && <p role="alert">HabitLoop could not load your habits. Is the API running?</p>}
        {status === 'ready' && <Today />}
      </main>

      {status === 'ready' && weekOpen && <WeekPanel />}

      <Footer>HabitLoop is your coaching companion from Evergreen Wellness.</Footer>
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
