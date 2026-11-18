# Code review: HL-104, edit abre o formulário sem marcar o hábito

Eventos viajam: um clique pertence ao elemento e a todo elemento em volta dele. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Um clique em um filho também chega aos pais, em ordem, a não ser que alguém o pare.
- Deixar o cartão inteiro clicável foi uma boa ideia para marcar, e transformou todo botão dentro do cartão em uma segunda forma de marcar.
- O formulário substituía o cartão na tela, então a segunda ação ficava invisível até o formulário fechar.

## Por que a correção de referência está certa

- O `stopPropagation` no manipulador do Edit diz exatamente o que se quer: este clique é só do Edit.
- O cartão mantém a área grande de clique para marcar, que o cliente pediu para manter.
- O comentário explica por que a linha está ali, para ninguém tirá-la como ruído.

## Compare com a sua correção

- Você conferiu o `event.target` no manipulador do cartão? Funciona; precisa ser atualizado a cada botão novo que o cartão ganhar.
- Você moveu o `onClick` do cartão só para o botão de feito? Resolve o bug e tira a área grande de clique de que os alunos gostam.
- Você usou `preventDefault`? Ele cancela a ação padrão do elemento, não a propagação.

## Para a próxima vez

- Quando um clique faz duas coisas, procure outro manipulador nos pais do elemento.
- Quando puser um botão dentro de uma área clicável, decida para qual dos dois é o clique.
