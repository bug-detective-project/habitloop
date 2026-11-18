# HL-202: Salvar um hábito recusado esvazia a lista inteira

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Bianca Rocha (Coach de bem-estar) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (hábitos) |
| Rótulos | `hábitos`, `api`, `erros` |
| Sprint | HL Sprint 4 |
| Criado em | 16/03/2026 15:30 |

## Descrição

Uma aluna colou uma frase longa como nome de um hábito novo e clicou em **Save**. O formulário fechou como se tivesse funcionado, e a lista de Hoje dela sumiu inteira: a página dizia "No habits yet". Depois de recarregar, os hábitos antigos voltaram, e o novo não estava lá.

Ela achou que tinha perdido meses de sequências. Nada na tela diz que o nome era longo demais.

## Passos para reproduzir

1. Abra o HabitLoop e clique em **New habit**.
2. Digite um nome com mais de 80 caracteres e clique em **Save**.
3. Olhe a lista. Depois recarregue a página.
4. Ou pergunte à API: `curl -i -X POST http://localhost:3001/api/habits -H "Content-Type: application/json" -d '{"name":""}'`.

## Resultado esperado

A API recusa o hábito com status 400 e uma mensagem que diz o que está errado; o formulário continua aberto e mostra a mensagem; a lista não muda.

## Resultado atual

A API responde 200 com uma lista vazia. O formulário fecha e a tela fica sem hábitos até a página ser recarregada.

## Critérios de aceitação

- [ ] `POST /api/habits` com nome vazio responde 400 com a mensagem "Give the habit a name" e cita o campo.
- [ ] Um nome longo demais e uma meta fora do intervalo também recebem 400, e nada é salvo.
- [ ] O formulário mostra a mensagem do servidor, e os hábitos continuam na tela.
- [ ] Um hábito válido continua sendo criado com 201.

## Ambiente

- HabitLoop 1.0
- Qualquer requisição de criar hábito que o servidor não pode aceitar

## Atividade

**Bianca Rocha** · 16/03/2026 15:52
> Mudar um hábito existente para um nome longo mostra a mensagem certinho. É só ao criar.
