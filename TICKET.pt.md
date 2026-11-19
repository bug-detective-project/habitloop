# HL-105: A sequência de dias zera ao marcar o dia de ontem

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Nora Lindqvist (Coach responsável) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Hoje (sequência) |
| Rótulos | `sequência`, `últimos-7-dias` |
| Sprint | HL Sprint 4 |
| Criado em | 17/03/2026 10:05 |

## Descrição

Quem esquece de marcar um hábito pode preencher o dia depois, na semana do **History**. Quando faz isso, a sequência no cartão vira "No streak yet" em vez de crescer. Depois de recarregar, a sequência fica certa.

Exemplo da minha conta: "Read 10 pages" foi feito nos dias 14, 15, 16 e hoje, dia 18. O cartão diz "1 day in a row". Marco o dia 17 na semana do histórico, volto para **Today** e espero 5 dias. O cartão diz "No streak yet".

## Passos para reproduzir

1. Abra o HabitLoop e ache um hábito feito hoje e não feito ontem.
2. Abra o **History** (a aba **Week**), marque o dia de ontem para esse hábito e volte para **Today**.
3. Olhe a sequência no cartão do hábito.

## Resultado esperado

A sequência conta ontem também: hoje, ontem e todos os dias seguidos antes deles.

## Resultado atual

A sequência vira "No streak yet". Recarregar a página mostra o número certo.

## Critérios de aceitação

- [ ] Marcar ontem em um hábito feito hoje junta a sequência com os dias anteriores.
- [ ] A sequência na tela é a mesma antes e depois de recarregar.
- [ ] Um dia anterior também estende uma sequência que termina ontem.
- [ ] Desmarcar um dia do meio continua cortando a sequência.

## Ambiente

- HabitLoop 1.0, Chrome
- Só até a página ser recarregada

## Atividade

**Nora Lindqvist** · 17/03/2026 10:26
> A sequência é o número com que os alunos mais se importam. Vê-la sumir faz pensarem que a perderam.
