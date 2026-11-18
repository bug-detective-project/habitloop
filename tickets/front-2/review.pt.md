# Code review: HL-102, a lista de Hoje abre para quem não tem hábitos

Uma página branca assusta, e o console do navegador costuma dizer a linha. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `reduce` sem valor inicial usa o primeiro item como início. Sem itens não há de onde começar, e ele lança um erro.
- Um erro lançado durante a renderização não é como uma requisição que falhou: o React não consegue desenhar uma árvore pela metade, então remove tudo.
- O estado vazio existia, mas abaixo da linha que quebrava. Ninguém do time tinha uma conta sem hábitos, então ninguém viu.

## Por que a correção de referência está certa

- A guarda vem primeiro: o componente responde "e se não houver nada?" antes de calcular qualquer coisa a partir da lista.
- O resto do componente pode então contar com pelo menos um hábito, o que mantém o `bestStreak` simples.
- O cabeçalho e o botão **New habit** ficam fora do `Today`, então continuam na página de qualquer jeito.

## Compare com a sua correção

- Você deu um valor inicial ao `reduce`? Isso para o erro; confira o que a linha "Longest streak" diz sem hábitos.
- Você envolveu o app em um error boundary? Ajuda o aluno a ver uma mensagem, mas a lista vazia não é um erro: precisa funcionar.
- Você conferiu `habits[0]` com `?.` em vários lugares? Uma guarda no começo é mais fácil de ler que várias pequenas.

## Para a próxima vez

- Teste toda tela de lista com zero itens, um item e muitos itens.
- Quando uma página ficar branca, leia o console antes de ler o código.
