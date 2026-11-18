# Code review: HL-101, nome longo de hábito fica dentro do cartão

Esta é a armadilha de flexbox que quase todo mundo encontra uma vez. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- `text-overflow: ellipsis` precisa de uma caixa mais estreita que o texto. Na linha flex, a caixa em volta do nome podia ter a largura do nome, então não havia o que cortar.
- O `min-width` padrão de um item flex é `auto`, não `0`. Esse padrão protege o conteúdo de ser espremido, e é exatamente o que quebra as reticências dentro de uma linha flex.
- Só um hábito tinha nome longo o bastante para mostrar o problema, então o bug ficou escondido atrás de dados comuns.

## Por que a correção de referência está certa

- O `min-width: 0` vai no item flex (`Info`), não no texto: é o item que se recusa a encolher.
- O anel e o botão **Edit** são `flex: none`, então, quando falta espaço, só o nome cede.
- O nome inteiro continua no atributo `title`, então nada se perde quando ele é cortado.

## Compare com a sua correção

- Você usou `overflow: hidden` no `Info`? Também deixa o item encolher, e é uma correção válida.
- Você deixou o nome quebrar em mais linhas? Também vale; confira se o cartão continua bom no celular.
- Você pôs um `max-width` em pixels no nome? Funciona em uma largura de janela e quebra na seguinte.

## Para a próxima vez

- Quando as reticências não aparecem dentro de um layout flex ou grid, procure um `min-width: 0` faltando no item.
- Teste listas com o maior e o menor valor real, não só com os típicos.
