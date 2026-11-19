# HL-106: A semana do histórico continua consultando o servidor depois de sair da tela

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Samuel Adeyemi (Suporte aos membros) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Histórico (semana) |
| Rótulos | `histórico-semana`, `consulta-periódica` |
| Sprint | HL Sprint 4 |
| Criado em | 17/03/2026 13:40 |

## Descrição

A conta da hospedagem mostra muito mais requisições para `/api/summary` do que temos alunos olhando a semana do histórico. Observei a aba Network no meu computador: a semana pede o resumo a cada 10 segundos enquanto está na tela, o que é esperado. Mas, depois que saio dela (outra aba do histórico, ou **Today**), as requisições continuam. Se volto para ela e saio algumas vezes, saem várias requisições a cada 10 segundos.

Um aluno que deixa a aba aberta o dia inteiro manda milhares de requisições para uma semana que nem está na tela.

## Passos para reproduzir

1. Abra o HabitLoop com a aba Network do DevTools aberta.
2. Clique em **History** (a aba **Week** abre primeiro) e depois em **Today** para sair dela.
3. Observe a aba Network por 30 segundos.
4. Abra a semana e saia dela mais três vezes, e observe de novo.

## Resultado esperado

Com a semana na tela, uma requisição para `/api/summary` a cada 10 segundos. Depois que ela sai da tela, nenhuma.

## Resultado atual

As requisições continuam depois que a semana sai da tela, e cada vez que a semana foi aberta acrescenta mais uma requisição a cada 10 segundos.

## Critérios de aceitação

- [ ] Enquanto a semana está na tela, ela continua se atualizando a cada 10 segundos.
- [ ] Depois que a semana sai da tela, nenhuma requisição do resumo é feita.
- [ ] Voltar para a semana inicia uma atualização, não mais uma em cima das antigas.

## Ambiente

- HabitLoop 1.0, Chrome
- Visível na aba Network

## Atividade

**Samuel Adeyemi** · 17/03/2026 14:02
> Por favor, mantenham a atualização enquanto a semana está na tela. Os alunos usam o app no celular e no computador ao mesmo tempo, e é assim que os dois ficam em dia.
