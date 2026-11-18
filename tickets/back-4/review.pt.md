# Code review: HL-204, o resumo conta dias, não marcações

A pergunta por trás de todo `COUNT` é "contagem de quê?". Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- A tabela guarda marcações, e a tela fala de dias. A consulta contou a unidade da tabela em vez da unidade da pergunta.
- Uma junção multiplica linhas: um hábito com três marcações são três linhas antes do `GROUP BY`.
- Com um aparelho por aluno, um dia tem uma marcação e as duas contagens são iguais. O bug precisava de dois aparelhos para aparecer.

## Por que a correção de referência está certa

- O `COUNT(DISTINCT c.day)` declara a regra na própria consulta: um dia conta uma vez.
- A contagem e a lista de dias agora partem da mesma ideia, então não têm como discordar.
- Os dados continuam como estão: toda marcação segue registrada, o que serve para saber quando e onde foi feita.

## Compare com a sua correção

- Você contou no JavaScript, pelo tamanho da lista de dias? Dá o número certo; a consulta continua calculando um errado que alguém vai usar depois.
- Você fez o servidor recusar a segunda marcação no mesmo dia? O cliente disse que marcar duas vezes é permitido, e as linhas que já existem continuariam contando em dobro.
- Você criou um índice único em hábito e dia? A mesma coisa: muda o que pode ser salvo, e as duplicatas existentes fariam a migração falhar.

## Para a próxima vez

- Quando um número parecer alto demais depois de uma junção, confira quantas linhas a junção produz por item.
- Antes de mudar uma consulta, rode-a à mão com os dados que mostram o problema.
