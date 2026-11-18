# Code review: HL-103, marcar um hábito marca só aquele hábito

Keys parecem um detalhe de que o React reclama, até uma lista mudar de ordem. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Com `key={index}`, "o primeiro cartão" é sempre a mesma instância de componente, seja qual for o hábito que ela mostra.
- O estado mora na instância. Quando a instância recebeu outro hábito, manteve o `done` do anterior.
- O bug precisa de uma lista que muda de ordem e de um componente com estado próprio. Qualquer um dos dois sozinho o esconde.

## Por que a correção de referência está certa

- O `habit.id` é estável e único: o mesmo hábito tem a mesma key em toda renderização.
- Nada mais muda. O cartão pode manter o próprio estado, porque agora o estado acompanha o hábito.
- A reordenação também fica mais barata: o React move nós do DOM em vez de reescrever cada cartão.

## Compare com a sua correção

- Você tirou o estado `done` do cartão e passou a ler só da lista? Também resolve o sintoma; a key por índice ainda morderia o próximo estado que alguém acrescentar, como o formulário aberto.
- Você impediu a lista de reordenar? A ordem é uma funcionalidade que o cliente pediu.
- Você usou `key={habit.name}`? Nomes podem se repetir e ser editados; ids não.

## Para a próxima vez

- Use o id do item como key sempre que a lista puder ser reordenada, filtrada ou receber itens no meio.
- Quando a tela e o servidor discordarem, confira o servidor primeiro: ele diz de que lado procurar.
