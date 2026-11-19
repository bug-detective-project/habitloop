# Solução: O resumo conta dias, não marcações

**Causa.** A `checkins` tem uma linha a cada vez que um hábito é marcado, e o mesmo dia pode ter várias linhas. A consulta de `weekSummary` (`server/src/repository.ts`) juntava os hábitos com as marcações e usava `COUNT(c.id)`: contava marcações. A lista de dias do mesmo resumo usa `SELECT DISTINCT day`, então os quadrados estavam certos e o número ao lado, não.

## Passo a passo

1. **Pergunte ao banco.** `SELECT day, COUNT(*) FROM checkins WHERE habit_id = 5 GROUP BY day` (a primeira dica tem um comando que roda a consulta) mostra duas marcações para ontem.
2. **Conte cada dia uma vez.** Na consulta de `weekSummary`:

   ```sql
   SELECT h.id, h.name, h.weekly_goal, COUNT(DISTINCT c.day) AS done_days
   FROM habits h
   LEFT JOIN checkins c ON c.habit_id = h.id AND c.day BETWEEN ? AND ?
   WHERE h.archived_at IS NULL
   GROUP BY h.id
   ORDER BY h.id
   ```
3. **Adicione um teste de regressão.** A referência adiciona `server/src/summary-days.test.ts`: o hábito do exemplo que foi marcado duas vezes, e um hábito marcado de novo hoje.

Depois rode `npm test`, olhe a semana do histórico no navegador e mova o card para **Em QA**.
