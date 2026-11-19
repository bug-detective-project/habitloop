# HL-103: Marcar um hábito mostra também o seguinte como feito

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Nora Lindqvist (Coach responsável) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Hoje (lista) |
| Rótulos | `hoje`, `lista` |
| Sprint | HL Sprint 4 |
| Criado em | 16/03/2026 14:20 |

## Descrição

Quando marco um hábito como feito, ele vai para o fim da lista, como deve. Mas o hábito que toma o lugar dele no topo também fica verde, com o visto, sem que eu tenha tocado nele. Depois de recarregar, o segundo volta a aparecer como não feito.

Os alunos acham que fizeram coisas que não fizeram, e os coaches veem números diferentes dos deles.

## Passos para reproduzir

1. Abra o HabitLoop com pelo menos dois hábitos ainda não feitos hoje.
2. Clique no primeiro cartão da lista para marcar.
3. Olhe o cartão que agora é o primeiro.

## Resultado esperado

Só o hábito em que cliquei fica marcado. Os outros continuam como estavam.

## Resultado atual

O hábito em que cliquei é marcado e desce, e o cartão que toma o lugar dele também aparece como feito. Recarregar a página mostra que só o primeiro foi salvo.

## Critérios de aceitação

- [ ] Marcar um hábito muda só aquele cartão; todos os outros mantêm o estado.
- [ ] Marcar dois hábitos em seguida marca exatamente os dois.
- [ ] O que a lista mostra é igual antes e depois de recarregar.

## Ambiente

- HabitLoop 1.0, Chrome
- Só quando a lista muda de ordem depois de um clique

## Atividade

**Nora Lindqvist** · 16/03/2026 14:41
> Acontece também no sentido contrário: desmarcar um hábito feito mostra o cartão errado como não feito.
