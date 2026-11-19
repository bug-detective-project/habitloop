import styled from 'styled-components';

const SIZE = 48;
const STROKE = 5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Ring = styled.div`
  position: relative;
  flex: none;
  width: ${SIZE}px;
  height: ${SIZE}px;
`;

const Track = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.color.border};
`;

const Bar = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.color.accent};
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.3s ease;
`;

const Value = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

interface ProgressRingProps {
  /** Days done in the week. */
  done: number;
  /** Days the habit asks for in a week. */
  goal: number;
  /** What the ring measures, for screen readers. */
  label: string;
}

/** A ring that fills as the week's goal is reached. More days than the goal still read 100%. */
export function ProgressRing({ done, goal, label }: ProgressRingProps) {
  const percent = Math.min(100, Math.round((done / goal) * 100));

  return (
    <Ring role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <Track cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} strokeWidth={STROKE} />
        <Bar
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
        />
      </svg>
      <Value aria-hidden="true">{percent}%</Value>
    </Ring>
  );
}
