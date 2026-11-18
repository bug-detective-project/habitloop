# Code review: HL-106, o painel para a atualização quando é fechado

O que um efeito inicia, o efeito precisa parar. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Temporizadores, assinaturas e ouvintes vivem fora do React. Remover o componente não os remove.
- Nada na tela mostrava o problema; só a aba Network e a conta mostravam.
- Em desenvolvimento, o React roda cada efeito duas vezes de propósito para deixar visível uma limpeza que falta: o painel estava consultando duas vezes a cada 10 segundos mesmo aberto.

## Por que a correção de referência está certa

- A limpeza fica ao lado da criação, no mesmo efeito, então as duas não se separam.
- A atualização com o painel aberto não muda, como o cliente pediu.
- A mesma função também roda se o efeito rodar de novo, então nunca há mais de um intervalo.

## Compare com a sua correção

- Você manteve o painel montado e o escondeu com CSS? O intervalo seria um só, e continuaria rodando sem ninguém olhar.
- Você tirou a atualização de vez? O cliente depende dela para manter o celular e o computador em dia.
- Você protegeu o `load` com uma marca de "está montado"? Esconde a atualização de estado, e as requisições continuam saindo.

## Para a próxima vez

- Para cada `setInterval`, `setTimeout`, `addEventListener` ou assinatura em um efeito, escreva a limpeza junto.
- Abra a aba Network de vez em quando sem fazer nada: um app parado deve ficar quieto.
