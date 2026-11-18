# Solução: O limite de hábitos segue a configuração

**Causa.** A configuração era lida (`server/src/config.ts`) e repassada (o `createApp` entrega `maxHabits` ao `habitsRouter`), e a rota nunca a usava. O `server/src/routes/habits.ts` tinha a própria constante, `const MAX_HABITS = 20`, e comparava a contagem de hábitos com ela. A constante é igual ao padrão da configuração, então tudo parecia certo até alguém configurar outro número.

## Passo a passo

1. **Siga o valor.** Inicie o app com `MAX_HABITS=10` e imprima `options.maxHabits` no `habitsRouter`: é 10. A comparação logo abaixo usa outro nome.
2. **Use a opção e apague a constante.**

   ```ts
   if (countActiveHabits(db) >= options.maxHabits) {
     res.status(409).json({
       error: `You reached the limit of ${options.maxHabits} habits. Archive one to add another.`,
     });
     return;
   }
   ```

   Tire o `const MAX_HABITS = 20;` do topo do arquivo: o padrão mora só no `config.ts`.
3. **Adicione um teste de regressão.** A referência adiciona `server/src/habit-limit.test.ts`, que cria o app com limite 9 e com limite 30.

Depois rode `npm test`, inicie o app com `MAX_HABITS=10` para ver a mensagem e mova o card para **Em QA**.
