# Code review: HL-105, a sequência conta os dias, em qualquer ordem

A função estava certa para os dados contra os quais foi escrita, e errada para os dados que o app tem de verdade. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- A função dependia de uma ordem que nada garantia. O servidor ordena; a tela acrescenta no fim.
- Todos os testes da função usavam dias ordenados, então a suposição nunca foi conferida.
- Recarregar escondia: dados novos do servidor chegam ordenados de novo.

## Por que a correção de referência está certa

- Um `Set` deixa a função independente da ordem e de dias repetidos.
- Ela começa em hoje, ou em ontem quando hoje ainda não foi marcado, e volta um dia de cada vez: o código se lê como a regra.
- A função continua pura: recebe os dias e hoje, e devolve um número.

## Compare com a sua correção

- Você ordenou os dias dentro da `currentStreak` antes de percorrer? Funciona; lembre que um dia repetido ainda pararia a contagem.
- Você manteve a lista ordenada no `toggleDay`? Resolve este caminho, e a função continua quebrando para o próximo que passar dias fora de ordem.
- Você recarregou os hábitos do servidor depois de cada mudança? Esconde o bug atrás de uma requisição e deixa a tela mais lenta.

## Para a próxima vez

- Quando uma função precisa da entrada em certa ordem, ordene dentro dela ou não dependa da ordem.
- Teste com os dados que o app produz, não só com os que são fáceis de escrever.
