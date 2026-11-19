# HL-109: O mês do histórico mostra as marcações do mês anterior

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Samuel Adeyemi (Suporte aos membros) |
| Trilha | Front-end |
| Versão afetada | 1.1 |
| Componente | Histórico (mês) |
| Rótulos | `historico`, `mes`, `datas` |
| Sprint | HL Sprint 4 |
| Criado em | 18/03/2026 10:40 |

## Descrição

Os membros adoraram o histórico novo, mas a aba **Month** está confundindo todo mundo. Uma membra que marca os hábitos todo dia abriu **History → Month**: o título diz **March 2026**, e o calendário mostra quase nada feito no mês, enquanto a **Week** mostra uma semana cheia de verde.

Comparei com o que a membra contou: os números embaixo do calendário parecem de fevereiro, não de março. A coluna **Done** diz "… of 28" para hábitos que começaram faz tempo, e março até agora tem 18 dias. E quando voltei para **January**, o mês nem carregou: "The history could not be loaded."

## Passos para reproduzir

1. Abra o HabitLoop e clique em **History**, depois em **Month**.
2. Compare os dias do calendário com os mesmos dias na **Week**.
3. Olhe a coluna **Done** do resumo embaixo do calendário.
4. Clique duas vezes no mês anterior, até **January 2026**.

## Resultado esperado

Cada dia do calendário conta os hábitos feitos naquele dia do mês na tela. O resumo conta os dias desse mês (18 até agora em março, 28 em fevereiro), e todo mês carrega, janeiro inclusive.

## Resultado atual

O calendário de março conta quase nada, o resumo conta 28 dias possíveis, e janeiro mostra "The history could not be loaded."

## Critérios de aceitação

- [ ] Cada dia do calendário mostra quantos hábitos foram feitos naquele mesmo dia ("3 of 8 habits done"), no mês que está na tela.
- [ ] O resumo embaixo do calendário conta os dias do mês na tela, até hoje.
- [ ] Voltar um mês mostra os dias daquele mês, e janeiro carrega.
- [ ] Com um hábito escolhido, o calendário mostra os dias em que esse hábito foi feito no mês na tela.

## Ambiente

- HabitLoop 1.1, qualquer navegador
- A API responde os dias certos: `GET /api/history?from=2026-03-01&to=2026-03-31` traz as marcações de março

## Atividade

**Samuel Adeyemi** · 18/03/2026 10:52
> Não é o fuso da membra: eu vejo a mesma coisa no meu computador. O dia de onde a tela parte deve estar errado em algum lugar.
