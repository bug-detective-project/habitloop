# HL-108: Construir o anel de progresso do cartão do hábito

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Média |
| Relator | Nora Lindqvist (Coach responsável) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Hoje (cartão do hábito) |
| Rótulos | `hoje`, `componente` |
| Sprint | HL Sprint 4 |
| Criado em | 18/03/2026 09:00 |

## Descrição

Cada cartão da lista de Hoje diz como vai a semana em palavras: "4 of 5 this week". Os alunos leem a lista de relance, e uma linha de texto pequeno não diz "quase lá" como uma figura diz.

Queremos um anel pequeno em cada cartão, que se enche conforme a meta semanal é atingida. O desenho está aprovado; o componente ainda não existe.

## O que já existe

- `client/src/components/HabitCard.tsx` já calcula `week`, os dias feitos nos últimos 7 dias, e tem `habit.weeklyGoal`.
- As cores e os tamanhos do app estão em `client/src/theme.ts`; os componentes os leem pelo tema (veja o `Check` no mesmo arquivo).
- O cartão é uma linha flex: botão de feito, nome e depois o botão **Edit**. O anel fica entre o nome e o **Edit**.

## O que construir

- Um componente `ProgressRing` em `client/src/components/ProgressRing.tsx`, exportado pelo nome, com as props `done` (dias feitos), `goal` (dias que o hábito pede) e `label` (o que o anel mede).
- Ele é uma barra de progresso para tecnologia assistiva: `role="progressbar"`, `aria-label` com o `label`, `aria-valuemin="0"`, `aria-valuemax="100"` e `aria-valuenow` com a porcentagem.
- A porcentagem é `done / goal`, arredondada para um número inteiro e nunca acima de 100. O anel também a mostra como texto, por exemplo `60%`.
- Ele é desenhado como um círculo que se enche no sentido horário (um círculo SVG com `stroke-dasharray` é o jeito usual), com cerca de 44 pixels de largura, altura igual à largura e cores do tema.
- O cartão o mostra para todo hábito que tem meta semanal, com o rótulo `Weekly goal of <nome do hábito>`. Um hábito sem meta não tem anel.

## Critérios de aceitação

- [ ] Cada hábito com meta mostra um anel cujo valor é a parte da meta feita nos últimos 7 dias (4 de 5 é 80, 2 de 3 é 67).
- [ ] O anel é um `progressbar` com o nome `Weekly goal of <nome do hábito>`, de 0 a 100, visível no cartão e com largura igual à altura.
- [ ] Um hábito sem meta não tem anel.
- [ ] O anel acompanha o hábito quando ele é marcado e desmarcado.
- [ ] Mais dias que a meta continuam valendo 100%.

## Ambiente

- HabitLoop 1.0, Chrome

## Atividade

**Nora Lindqvist** · 18/03/2026 09:20
> Mantenham o texto "4 of 5 this week" no cartão como está. O anel vem além dele.
