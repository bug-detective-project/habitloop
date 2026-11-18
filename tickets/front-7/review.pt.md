# Code review: HL-107, resposta atrasada da atualização não desfaz mais uma marcação nova

As requisições são respondidas na ordem que a rede quer, não na ordem em que foram enviadas. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Duas fontes mudam o mesmo estado: a atualização e o usuário. Nada dizia qual era a mais nova.
- O código estava certo para uma requisição de cada vez. Com duas a caminho, ganhava a última resposta a chegar, fosse qual fosse a idade dela.
- Em conexão rápida a janela é de poucos milissegundos, por isso parecia aleatório.

## Por que a correção de referência está certa

- Um contador dá a cada requisição uma idade que não depende de tempo.
- A mudança do usuário também avança o contador, então uma resposta pedida antes da mudança nunca entra depois dela.
- A atualização em si não muda: a seguinte traz o que mudou de verdade no servidor.

## Compare com a sua correção

- Você cancelou a requisição pendente com um `AbortController` quando o usuário marca um dia? Também é uma correção válida, e ainda economiza o download.
- Você parou a atualização por alguns segundos depois de uma mudança? Diminui a janela sem fechá-la.
- Você comparou a resposta com o estado atual e ficou com "a que tem mais dias"? Quebra quando um dia é desmarcado.

## Para a próxima vez

- Sempre que duas requisições puderem estar pendentes para o mesmo estado, decida qual resposta ganha antes de escrever o `setState`.
- Teste telas assíncronas com a rede limitada: conexões lentas mostram os problemas de ordem.
