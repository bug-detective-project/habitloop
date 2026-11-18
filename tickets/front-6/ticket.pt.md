# HL-106: O painel Last 7 days continua consultando o servidor depois de fechado

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Samuel Adeyemi (Suporte aos membros) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Últimos 7 dias |
| Rótulos | `últimos-7-dias`, `consulta-periódica` |
| Sprint | HL Sprint 4 |
| Criado em | 17/03/2026 13:40 |

## Descrição

A conta da hospedagem mostra muito mais requisições para `/api/summary` do que temos alunos olhando o painel. Observei a aba Network no meu computador: o painel pede o resumo a cada 10 segundos enquanto está aberto, o que é esperado. Mas, depois que fecho, as requisições continuam. Se abro e fecho algumas vezes, saem várias requisições a cada 10 segundos.

Um aluno que deixa a aba aberta o dia inteiro manda milhares de requisições para um painel que nem está na tela.

## Passos para reproduzir

1. Abra o HabitLoop com a aba Network do DevTools aberta.
2. Clique em **Last 7 days** para abrir o painel e clique de novo para fechar.
3. Observe a aba Network por 30 segundos.
4. Abra e feche o painel mais três vezes e observe de novo.

## Resultado esperado

Com o painel aberto, uma requisição para `/api/summary` a cada 10 segundos. Depois de fechado, nenhuma.

## Resultado atual

As requisições continuam depois que o painel é fechado, e cada vez que o painel foi aberto acrescenta mais uma requisição a cada 10 segundos.

## Critérios de aceitação

- [ ] Enquanto o painel está aberto, ele continua se atualizando a cada 10 segundos.
- [ ] Depois que o painel é fechado, nenhuma requisição do resumo é feita.
- [ ] Abrir o painel de novo inicia uma atualização, não mais uma em cima das antigas.

## Ambiente

- HabitLoop 1.0, Chrome
- Visível na aba Network

## Atividade

**Samuel Adeyemi** · 17/03/2026 14:02
> Por favor, mantenham a atualização enquanto o painel está aberto. Os alunos usam o app no celular e no computador ao mesmo tempo, e é assim que os dois ficam em dia.
