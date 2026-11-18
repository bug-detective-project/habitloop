# HL-102: Tela em branco para quem não tem nenhum hábito

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Samuel Adeyemi (Suporte aos membros) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Hoje |
| Rótulos | `hoje`, `erro` |
| Sprint | HL Sprint 4 |
| Criado em | 16/03/2026 11:02 |

## Descrição

Três alunos novos escreveram para o suporte esta semana: abrem o HabitLoop pela primeira vez e recebem uma página totalmente branca. Sem cabeçalho, sem botão, nada. Não conseguem nem criar o primeiro hábito.

Quem já tem hábitos não vê o problema. Eu reproduzo na minha conta de teste arquivando todos os hábitos.

## Passos para reproduzir

1. Abra o HabitLoop.
2. Arquive todos os hábitos (**Edit** e depois **Archive**), um por um.
3. Quando o último for arquivado, olhe a página. Recarregue.

## Resultado esperado

A página continua de pé, com o cabeçalho e o botão **New habit**, e a lista de Hoje diz que ainda não há hábitos e convida a criar o primeiro.

## Resultado atual

A página inteira fica branca, e continua branca depois de recarregar.

## Critérios de aceitação

- [ ] Sem hábitos, a página mostra o cabeçalho, o botão **New habit** e o texto "No habits yet".
- [ ] A página não lança nenhum erro no console do navegador.
- [ ] O primeiro hábito criado a partir da página vazia aparece na lista.

## Ambiente

- HabitLoop 1.0, Chrome
- Só em contas sem hábitos

## Atividade

**Samuel Adeyemi** · 16/03/2026 11:30
> É a primeira coisa que um aluno novo vê, então está nos custando cadastros. Por favor, tratem como urgente.
