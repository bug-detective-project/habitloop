# HL-107: Dia marcado em Last 7 days é desmarcado de novo um instante depois

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Bianca Rocha (Coach de bem-estar) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Últimos 7 dias |
| Rótulos | `últimos-7-dias`, `consulta-periódica`, `corrida` |
| Sprint | HL Sprint 4 |
| Criado em | 17/03/2026 16:10 |

## Descrição

Às vezes marco um dia em **Last 7 days**, o quadrado fica verde e, um segundo depois, volta a ficar vazio sozinho. Uns dez segundos depois fica verde de novo. Não acontece sempre, o que dificulta mostrar.

Alunos em conexões lentas (o wifi da academia) veem isso bem mais. Alguns marcam o dia de novo quando ele esvazia, e aí ele fica desmarcado de verdade.

## Passos para reproduzir

1. Abra o HabitLoop e abra **Last 7 days**.
2. No DevTools, ponha a limitação de rede em "Slow 4G".
3. Espere uma requisição para `/api/summary` estar a caminho (o painel consulta a cada 10 segundos) e, antes de ela responder, marque um dia.
4. Observe o quadrado que você marcou.

## Resultado esperado

Um dia que eu marco continua marcado.

## Resultado atual

O quadrado fica verde, esvazia quando a resposta lenta chega e fica verde de novo na atualização seguinte.

## Critérios de aceitação

- [ ] Um dia marcado enquanto uma atualização está a caminho continua marcado quando a resposta antiga chega.
- [ ] O mesmo para um dia que é desmarcado.
- [ ] O painel continua mostrando o que mudou no servidor na atualização seguinte.

## Ambiente

- HabitLoop 1.0, Chrome
- Bem mais frequente em conexões lentas

## Atividade

**Bianca Rocha** · 17/03/2026 16:38
> Com a limitação ligada eu reproduzo quase sempre. Sem ela, mais ou menos uma tentativa em vinte.
