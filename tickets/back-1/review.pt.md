# Code review: HL-201, a linha de progresso de um hábito sem meta

O tipo já contava a história: `number | null` são dois casos, e o código escreveu um. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Uma coluna que aceita nulo vira `null` no JavaScript, e `null` dentro de uma template string vira a palavra "null".
- O TypeScript aceita qualquer valor dentro de `${…}`, então o compilador não tinha o que dizer.
- Os dados de exemplo têm um hábito sem meta, e nenhum teste olhava a linha dele.

## Por que a correção de referência está certa

- O caso `null` é tratado onde o texto é escrito, então nenhum chamador precisa lembrar dele.
- Cada caso tem a própria redação: sem meta não há "of".
- Singular e plural são decididos pelo número que vem antes da palavra.

## Compare com a sua correção

- Você escreveu `weeklyGoal ?? 0`? "1 of 0 days" continua errado: não ter meta não é ter meta zero.
- Você corrigiu na tela, escondendo o texto quando ele contém "null"? A API continuaria mandando a linha errada para qualquer outro cliente.
- Você deu a todo hábito uma meta padrão no banco? A meta é opcional de propósito.

## Para a próxima vez

- Quando um tipo tem `| null`, escreva o ramo do `null` primeiro.
- Olhe respostas reais da API com `curl`: um texto errado é mais fácil de ver ali do que no código.
