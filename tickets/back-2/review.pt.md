# Code review: HL-202, hábito que não pode ser salvo é recusado com 400

Um `catch` que responde "tudo certo" é pior que nenhum `catch`. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `catch` foi escrito para a tela "nunca quebrar". Ele transformou toda falha em um sucesso com dados errados.
- O código de status é como o cliente sabe o que aconteceu. Com 200, o cliente fez exatamente o que devia fazer com um sucesso.
- O app já tinha um lugar que transforma erros em respostas. A rota deu a volta nele.

## Por que a correção de referência está certa

- Os erros seguem até o `handleErrors`, então toda rota responde a uma requisição ruim do mesmo jeito.
- A mensagem vem da validação, onde a regra mora, e o formulário a mostra como ela é.
- Um erro inesperado deixa de ser silencioso: vira um 500 e é escrito no log.

## Compare com a sua correção

- Você manteve o `try` e respondeu 400 dentro do `catch`? Confira o que uma falha de verdade (o banco, um bug) responde agora: não deveria ser um 400 que culpa o usuário.
- Você corrigiu o cliente para ignorar uma lista vazia? Outro cliente da API ainda receberia 200 para um hábito que não foi salvo.
- Você pôs o limite de tamanho no formulário? Ajuda o aluno, e não substitui a resposta do servidor.

## Para a próxima vez

- Um `catch` precisa tratar o erro de verdade ou passá-lo adiante. Se ele só faz o erro sumir, tire.
- Teste uma API com `curl -i`: a linha de status diz no que o cliente vai acreditar.
