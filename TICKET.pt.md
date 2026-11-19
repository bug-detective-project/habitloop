# HL-201: Hábito sem meta aparece como "1 of null days"

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Samuel Adeyemi (Suporte aos membros) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (resumo) |
| Rótulos | `resumo`, `api` |
| Sprint | HL Sprint 4 |
| Criado em | 16/03/2026 10:12 |

## Descrição

A meta semanal de um hábito é opcional: muitos alunos só querem marcar o que fizeram. Na semana do **History**, a coluna **Done** desses hábitos mostra "1 of null days", "0 of null days" e assim por diante. Os hábitos com meta estão certos ("4 of 5 days").

Um aluno mandou uma captura de tela perguntando o que é um "null day".

## Passos para reproduzir

1. Abra o HabitLoop e clique em **History**: a aba **Week** abre primeiro.
2. Olhe a coluna **Done** de "Stretch", que não tem meta semanal.
3. Ou pergunte direto à API: `curl http://localhost:3001/api/summary`.

## Resultado esperado

Um hábito sem meta mostra só quantos dias foram feitos: "1 day", "0 days", "3 days".

## Resultado atual

Mostra "1 of null days".

## Critérios de aceitação

- [ ] Em `GET /api/summary`, o `progress` de um hábito sem meta diz só os dias feitos, com "day" para exatamente 1 e "days" nos outros casos.
- [ ] Nenhuma linha de `progress` contém `null`, `undefined` ou `NaN`.
- [ ] Os hábitos com meta continuam com "feitos of meta" (por exemplo "4 of 5 days", "1 of 1 day").
- [ ] A semana do **History** mostra a linha corrigida.

## Ambiente

- HabitLoop 1.0
- Aparece na semana do histórico e na resposta da API

## Atividade

**Samuel Adeyemi** · 16/03/2026 10:30
> Quem escreve essa linha é o servidor; a tela só mostra o que recebe.
