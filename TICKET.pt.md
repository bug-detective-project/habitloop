# HL-203: O limite de hábitos ignora a configuração

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Nora Lindqvist (Coach responsável) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (hábitos) |
| Rótulos | `hábitos`, `api`, `configuração` |
| Sprint | HL Sprint 4 |
| Criado em | 17/03/2026 09:20 |

## Descrição

Nossos coaches concordaram que ninguém dá conta de mais de 10 hábitos, então no mês passado configuramos `MAX_HABITS=10` no servidor. Não mudou nada: os alunos continuam criando o 11º, o 12º, até 20, e só então recebem a mensagem do limite. A própria mensagem diz "limit of 20 habits".

O README diz que o servidor lê `MAX_HABITS`.

## Passos para reproduzir

1. Pare o app e inicie com o limite configurado: `MAX_HABITS=10 npm run dev`.
2. Crie hábitos até ter 11 (o exemplo começa com 8).
3. Ou pela API: `curl -i -X POST http://localhost:3001/api/habits -H "Content-Type: application/json" -d '{"name":"One more"}'`.

## Resultado esperado

Com `MAX_HABITS=10`, o 11º hábito é recusado com status 409 e a mensagem "You reached the limit of 10 habits. Archive one to add another."

## Resultado atual

O 11º hábito é criado. O limite só vale em 20, diga o que disser `MAX_HABITS`.

## Critérios de aceitação

- [ ] É possível criar hábitos até o limite configurado.
- [ ] O hábito depois do limite é recusado com 409, e a mensagem cita o número configurado.
- [ ] O formulário mostra por que o hábito não foi criado.
- [ ] Alterar um hábito existente não é afetado pelo limite.

## Ambiente

- HabitLoop 1.0
- A QA roda o app com `MAX_HABITS=10`

## Atividade

**Nora Lindqvist** · 17/03/2026 09:44
> Sem `MAX_HABITS` o limite continua 20, que é o que queremos como padrão.
