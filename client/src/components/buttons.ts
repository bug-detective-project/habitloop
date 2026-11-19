import styled from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.card};
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.sunken};
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const PrimaryButton = styled(Button)`
  border-color: ${({ theme }) => theme.color.accent};
  background: ${({ theme }) => theme.color.accent};
  color: ${({ theme }) => theme.color.accentText};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.accentStrong};
    background: ${({ theme }) => theme.color.accentStrong};
  }
`;

export const DangerButton = styled(Button)`
  border-color: ${({ theme }) => theme.color.danger};
  color: ${({ theme }) => theme.color.danger};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.dangerSoft};
  }
`;
