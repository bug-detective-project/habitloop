# HL-101: Nome longo de hábito empurra o botão Edit para fora do cartão

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
| Rótulos | `hoje`, `css` |
| Sprint | HL Sprint 4 |
| Criado em | 16/03/2026 09:10 |

## Descrição

Uma das minhas alunas deu a um hábito o nome "Write three things I am grateful for in the paper journal before going to bed". Na lista de Hoje dela esse cartão está quebrado: o nome ocupa a linha inteira, e o anel e o botão **Edit** ficam pendurados fora do cartão, passando da borda da página. No celular dela a página inteira rola para o lado por causa disso.

Todos os outros cartões estão certos.

## Passos para reproduzir

1. Abra o HabitLoop.
2. Ache o hábito de nome longo na lista de Hoje.
3. Olhe o lado direito do cartão e depois deixe a janela mais estreita.

## Resultado esperado

O nome é cortado com "…" (o nome inteiro continua na dica do mouse), e o anel e o botão **Edit** ficam dentro do cartão, em qualquer largura de janela.

## Resultado atual

O nome aparece inteiro em uma linha, e o anel e o botão **Edit** são empurrados para fora do cartão.

## Critérios de aceitação

- [ ] No celular, no tablet e no desktop, o botão de feito, o nome e o botão **Edit** do hábito de nome longo ficam dentro do cartão.
- [ ] A página não rola para o lado no celular.
- [ ] Todos os cartões têm a mesma largura, e os nomes curtos continuam como estavam.

## Ambiente

- HabitLoop 1.0, Chrome
- Acontece em qualquer largura de janela; pior no celular

## Atividade

**Bianca Rocha** · 16/03/2026 09:25
> Por favor, não limitem o tamanho do nome. Os alunos escrevem os hábitos do jeito que falam.
