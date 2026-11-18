# Solução: Hábito que não pode ser salvo é recusado com 400

**Causa.** Em `server/src/routes/habits.ts`, o manipulador de `POST /api/habits` tinha um `try`/`catch` em volta de todo o trabalho, e o `catch` respondia `res.json([])`. A `parseHabit` lança um `ValidationError` quando o corpo é ruim; o `catch` o engolia e mandava status 200 com uma lista vazia. O cliente trata 200 como sucesso e troca os hábitos pela lista da resposta: uma lista vazia.

## Passo a passo

1. **Veja sem o navegador.** `curl -i -X POST … -d '{"name":""}'` responde `200 OK` e `[]`.
2. **Tire o catch que esconde o erro.**

   ```ts
   router.post('/', (req, res) => {
     const input = parseHabit(req.body);
     if (countActiveHabits(db) >= options.maxHabits) {
       res.status(409).json({
         error: `You reached the limit of ${options.maxHabits} habits. Archive one to add another.`,
       });
       return;
     }
     createHabit(db, input);
     res.status(201).json(listHabits(db, options.today()));
   });
   ```

   O `ValidationError` agora chega ao `handleErrors` em `server/src/app.ts`, que responde 400 com a mensagem e os campos. Qualquer coisa inesperada vira um 500 e uma linha no log.
3. **Adicione um teste de regressão.** A referência adiciona `server/src/create-errors.test.ts`: nome vazio, nome longo e meta fora do intervalo são recusados, e nada é salvo.

Depois rode `npm test`, tente um nome longo no formulário e mova o card para **Em QA**.
