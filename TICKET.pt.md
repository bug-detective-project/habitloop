# HL-205: Construir o endpoint de arquivar hábito

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Média |
| Relator | Nora Lindqvist (Coach responsável) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (hábitos) |
| Rótulos | `hábitos`, `api`, `endpoint` |
| Sprint | HL Sprint 4 |
| Criado em | 18/03/2026 10:30 |

## Descrição

Os alunos param hábitos o tempo todo: o curso acabou, o joelho melhorou. Hoje eles não conseguem tirar um hábito da lista, então ele fica lá sem marcar e estraga o humor toda manhã.

O formulário de um hábito já tem o botão **Archive**, e o cliente já chama a API para isso. O endpoint não existe: o botão responde "Not found".

Arquivar não é apagar. O histórico do hábito fica, porque queremos poder trazer um hábito de volta depois.

## O que já existe

- A tabela `habits` tem a coluna `archived_at` (`server/src/db.ts`), vazia em um hábito ativo. Toda consulta de `server/src/repository.ts` já lista só os hábitos em que ela está vazia.
- O cliente chama `POST /api/habits/:id/archive` (`archiveHabit` em `client/src/api/habits.ts`) e espera a lista de hábitos como fica depois da mudança, como nas outras rotas que alteram hábitos.
- O `server/src/routes/habits.ts` tem o auxiliar `habitId(req, res)`, que responde 404 para um hábito que não existe ou está arquivado.

## O que construir

- `POST /api/habits/:id/archive` marca o hábito como arquivado (`archived_at` recebe a data e a hora atuais, como texto ISO) e responde 200 com a lista de hábitos ativos, no mesmo formato de `GET /api/habits`.
- O hábito sai de `GET /api/habits` e de `GET /api/summary`. A linha dele e as marcações continuam no banco.
- Um hábito que não existe, ou que já está arquivado, recebe 404 e `{ "error": "Habit not found" }`.
- Um hábito arquivado não pode ser alterado nem marcado: essas rotas já respondem 404 pelo `habitId`.
- Um hábito arquivado deixa de contar para o limite de hábitos.

## Critérios de aceitação

- [ ] `POST /api/habits/:id/archive` responde 200 com a lista sem o hábito.
- [ ] O hábito arquivado some da lista e do resumo.
- [ ] Ele não pode ser alterado, marcado nem arquivado de novo (404).
- [ ] Um hábito que não existe recebe 404 e "Habit not found".
- [ ] O botão **Archive** tira o hábito da tela, e ele continua fora depois de recarregar.
- [ ] Arquivar libera uma vaga no limite de hábitos.

## Ambiente

- HabitLoop 1.0
- A QA roda o app com `MAX_HABITS=10`

## Atividade

**Nora Lindqvist** · 18/03/2026 10:52
> Sem diálogo de confirmação por enquanto. Vamos acrescentar o "trazer de volta" em outro ticket, então, por favor, não apaguem nada.
