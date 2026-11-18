# Code review: HL-205, o endpoint de arquivar hábito

A maior parte de um endpoint é decidir o que ele responde em cada caso; o código que vem depois é curto. Aqui está a abordagem de referência, para você comparar com a sua.

## Do que este ticket tratava

- Arquivar estava construído pela metade: a coluna e os filtros existiam, a porta até eles não.
- O ticket pediu uma exclusão lógica. A linha fica, e uma coluna diz que ela saiu de uso.
- Os casos de 404 (desconhecido, já arquivado) fazem parte do endpoint, não são extras.

## Por que a referência foi construída assim

- A rota faz o que as vizinhas fazem: acha o hábito com `habitId`, altera no repositório, responde a lista. Quem lê uma rota lê todas.
- `POST /:id/archive` dá nome a uma ação sobre o hábito. `DELETE /:id` prometeria que o hábito sumiu, e ele não sumiu.
- Nada mais precisou mudar, porque toda consulta já pedia `archived_at IS NULL`. É o prêmio de ter a regra em um lugar por consulta.
- Um segundo arquivamento responde 404: para a API, um hábito arquivado não está lá.

## Compare com o que você construiu

- Você usou `DELETE FROM habits`? O histórico vai junto (as marcações são apagadas em cascata), e o cliente pediu para manter.
- Você respondeu 204 sem corpo? O cliente espera a lista e precisaria de uma segunda requisição.
- Você respondeu 200 quando o hábito já estava arquivado? Dá para defender (o resultado é o mesmo); o ticket pediu 404, e as outras rotas tratam um hábito arquivado como ausente.
- Você escreveu o SQL dentro da rota? Funciona; o resto do arquivo mantém o SQL no repositório, e o próximo leitor vai procurar lá.

## Para a próxima vez

- Antes de escrever um endpoint, liste as respostas dele: o sucesso e cada forma de ser recusado.
- Leia os vizinhos primeiro. Uma rota nova parecida com as outras não custa nada para entender.
