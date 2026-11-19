# Code review: HL-109, o mês pede os seus próprios dias

Datas escritas à mão são uma das fontes mais comuns de bugs que parecem outra coisa. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `Date` do JavaScript conta os meses a partir de 0, e uma data escrita como texto (`YYYY-MM-DD`) conta a partir de 1. Passar de um para o outro sem o `+ 1` volta todo mês um mês.
- O título da tela era feito a partir do próprio dia (`monthName(anchor)`), então estava certo, e a tela parecia mostrar março. Só a requisição estava errada.
- Na maioria dos meses o mês errado ainda é um mês válido, então nada quebra: os números só ficam errados em silêncio. Janeiro é o único mês em que o erro aparece de forma escandalosa.

## Por que a correção de referência está certa

- Um `+ 1` onde o mês é escrito, ou, melhor, uma função só (`monthStart`) que toda tela usa para achar o primeiro dia de um mês.
- O último dia é calculado a partir do primeiro, então consertar o primeiro conserta os dois.
- O teste de regressão confere os dias da tela com os dados, em mais de um mês e em janeiro, onde esse tipo de bug aparece mais.

## Compare com a sua correção

- Você usou `monthStart(anchor)`? Então o mês e o seletor de data acham os meses do mesmo jeito, que é a escolha mais robusta.
- Você montou a data com `new Date(year, month, 1)` e `toISOString()`? Isso lê o fuso local, e pode voltar o dia de novo para jogadores a oeste do UTC.
- Você somou um ao mês só na exibição? A requisição continuaria pedindo os dias errados.

## Para a próxima vez

- Quando uma data é escrita como texto, escreva em um lugar só.
- Teste código de datas nas bordas: janeiro, dezembro, o último dia do mês, ano bissexto.
