import styled from 'styled-components';

export const Button = styled.button`
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.card};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const PrimaryButton = styled(Button)`
  border-color: ${({ theme }) => theme.color.accent};
  background: ${({ theme }) => theme.color.accent};
  color: ${({ theme }) => theme.color.accentText};
`;

export const DangerButton = styled(Button)`
  border-color: ${({ theme }) => theme.color.danger};
  color: ${({ theme }) => theme.color.danger};
`;
