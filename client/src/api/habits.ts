import { request } from './http.ts';

export interface Habit {
  id: number;
  name: string;
  /** Days a week the user wants to do it, or null for a habit without a goal. */
  weeklyGoal: number | null;
  /** The marked days of the last 30 days, each day once. */
  days: string[];
}

export interface HabitInput {
  name: string;
  weeklyGoal: number | null;
}

export interface SummaryRow {
  id: number;
  name: string;
  weeklyGoal: number | null;
  days: string[];
  doneDays: number;
  /** The line the server wrote for the habit, for example "3 of 5 days". */
  progress: string;
}

export interface Summary {
  days: string[];
  habits: SummaryRow[];
}

export async function fetchToday(): Promise<string> {
  return (await request<{ today: string }>('/api/today')).today;
}

export function fetchHabits(): Promise<Habit[]> {
  return request<Habit[]>('/api/habits');
}

export function createHabit(input: HabitInput): Promise<Habit[]> {
  return request<Habit[]>('/api/habits', { method: 'POST', body: input });
}

export function updateHabit(id: number, input: HabitInput): Promise<Habit[]> {
  return request<Habit[]>(`/api/habits/${id}`, { method: 'PATCH', body: input });
}

export function archiveHabit(id: number): Promise<Habit[]> {
  return request<Habit[]>(`/api/habits/${id}/archive`, { method: 'POST' });
}

export function markDay(id: number, day: string): Promise<void> {
  return request<void>(`/api/habits/${id}/checkins`, { method: 'POST', body: { day } });
}

export function unmarkDay(id: number, day: string): Promise<void> {
  return request<void>(`/api/habits/${id}/checkins/${day}`, { method: 'DELETE' });
}

export function fetchSummary(): Promise<Summary> {
  return request<Summary>('/api/summary');
}
