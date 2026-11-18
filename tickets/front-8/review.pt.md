# Code review: HL-108, o anel de progresso do cartão do hábito

Um componente pequeno é um bom lugar para treinar as três perguntas de qualquer componente: o que ele recebe, o que ele mostra e o que ele diz a quem não enxerga. Aqui está a abordagem de referência, para você comparar com a sua.

## Do que este ticket tratava

- Os dados já estavam no cartão. Faltava uma peça que transformasse dois números em algo lido de relance.
- Um desenho sozinho não diz nada a um leitor de tela, por isso o ticket pediu papel, nome e valor.
- As bordas importam tanto quanto o meio: uma semana sem nenhum dia, uma meta atingida e mais dias que a meta.

## Por que a referência foi construída assim

- O componente recebe números simples e um rótulo. Ele não sabe nada de hábitos, então pode ser testado sozinho e reaproveitado.
- A porcentagem é calculada uma vez e usada no atributo, no texto e no desenho, então os três nunca discordam.
- O SVG e o texto são `aria-hidden`: a barra de progresso é anunciada uma vez, não três.
- Cores e tamanhos vêm do tema, como em todo outro componente.

## Compare com o que você construiu

- Você usou o elemento `<progress>`? Ele já tem o papel certo; é difícil de desenhar como anel, e por isso a referência usa um `div` com o papel.
- Você passou a porcentagem como prop em vez de `done` e `goal`? Aí todo chamador precisa arredondar e limitar.
- Você desenhou o anel com `conic-gradient`? Funciona e dispensa o SVG; confira se o texto do meio mantém contraste suficiente.
- Você renderizou o anel para um hábito sem meta, em 0%? O ticket pediu que não houvesse anel ali: 0% diria que o aluno está atrasado em uma meta que não existe.

## Para a próxima vez

- Escreva as props de um componente antes da marcação: elas são o contrato dele.
- Para qualquer coisa desenhada, pergunte o que um leitor de tela deve dizer, e teste o menor e o maior valor.
