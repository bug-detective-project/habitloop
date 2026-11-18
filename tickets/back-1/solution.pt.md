# Solução: A linha de progresso de um hábito sem meta

**Causa.** A `progressLine` em `server/src/repository.ts` monta o texto com uma template string: `${doneDays} of ${weeklyGoal} days`. O parâmetro é `number | null`, porque `weekly_goal` é uma coluna que aceita nulo, e a função o tratava como se fosse sempre número. Uma template string transforma `null` no texto "null".

## Passo a passo

1. **Olhe os dados.** `curl http://localhost:3001/api/summary`: a linha de "Stretch" tem `"weeklyGoal": null` e `"progress": "1 of null days"`.
2. **Escreva a linha para os dois casos.**

   ```ts
   function progressLine(doneDays: number, weeklyGoal: number | null): string {
     const unit = doneDays === 1 ? 'day' : 'days';
     return weeklyGoal === null ? `${doneDays} ${unit}` : `${doneDays} of ${weeklyGoal} ${weeklyGoal === 1 ? 'day' : 'days'}`;
   }
   ```
3. **Adicione um teste de regressão.** A referência adiciona `server/src/summary-no-goal.test.ts`: um hábito sem meta, um novo sem nenhum dia e hábitos com meta.

Depois rode `npm test`, olhe o painel no navegador e mova o card para **Em QA**.
