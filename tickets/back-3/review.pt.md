# Code review: HL-203, o limite de hábitos segue a configuração

Uma configuração lida e não usada é um dos bugs mais silenciosos que existem. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O mesmo número morava em dois lugares: o padrão da configuração e uma constante na rota.
- Enquanto os dois eram iguais, todo teste e toda conferência manual passavam.
- O bug só existe em um ambiente que define a variável, e esse nunca é a máquina de quem desenvolve.

## Por que a correção de referência está certa

- O limite tem uma fonte só: as configurações. A rota apenas o recebe.
- A mensagem usa o mesmo valor da checagem, então não tem como dizer outro número.
- A rota recebe o valor como opção, então um teste pode criar o app com qualquer limite sem mexer no ambiente.

## Compare com a sua correção

- Você leu `process.env.MAX_HABITS` direto na rota? Funciona com o servidor rodando; os testes, que passam as configurações ao `createApp`, não o enxergariam.
- Você mudou a constante para 10? Resolve o cliente de hoje e quebra o padrão para todos os outros.
- Você manteve a constante como reserva (`options.maxHabits ?? MAX_HABITS`)? O padrão já existe no `config.ts`; um segundo vai divergir de novo.

## Para a próxima vez

- Quando acrescentar uma configuração, teste com um valor diferente do padrão.
- Procure no código o valor padrão escrito como literal: um número repetido costuma ser uma regra repetida.
