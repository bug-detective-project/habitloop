# HL-104: Clicar em Edit abre o formulário e marca o hábito como feito ao mesmo tempo

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Bianca Rocha (Coach de bem-estar) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Hoje (cartão do hábito) |
| Rótulos | `hoje`, `eventos` |
| Sprint | HL Sprint 4 |
| Criado em | 17/03/2026 08:15 |

## Descrição

Toda vez que um aluno clica em **Edit** para corrigir um erro de digitação em um hábito, o hábito também é marcado como feito hoje. Se já estava feito, é desmarcado. Eles só percebem depois, quando a sequência está errada.

Eu conferi: o formulário abre normalmente, e quando cancelo o cartão mostra o outro estado.

## Passos para reproduzir

1. Abra o HabitLoop e escolha um hábito ainda não feito hoje.
2. Clique no botão **Edit** dele.
3. Clique em **Cancel** e olhe o cartão.

## Resultado esperado

**Edit** só abre o formulário. O hábito continua como estava.

## Resultado atual

O formulário abre, e o hábito é marcado como feito (ou desmarcado, quando estava feito).

## Critérios de aceitação

- [ ] Clicar em **Edit** em um hábito não feito o deixa não feito, na tela e na API.
- [ ] Clicar em **Edit** em um hábito feito o deixa feito.
- [ ] Salvar um nome novo muda só o nome.
- [ ] Um clique em qualquer outro ponto do cartão continua marcando o hábito.

## Ambiente

- HabitLoop 1.0, Chrome

## Atividade

**Bianca Rocha** · 17/03/2026 08:33
> Clicar no cartão para marcar o hábito está certo e os alunos gostam. Por favor, mantenham.
