# Solução: O endpoint de arquivar hábito

**O que faltava.** A tela e o banco estavam prontos para arquivar: o botão, a chamada do cliente e a coluna `archived_at` existiam, e toda consulta já pulava os hábitos arquivados. Faltavam a rota `POST /api/habits/:id/archive` e a função que define a coluna.

## Passo a passo

1. **Escreva a mudança no repositório.** Em `server/src/repository.ts`:

   ```ts
   /** Takes the habit out of the lists. Its history stays in the database. */
   export function archiveHabit(db: Db, id: number): void {
     db.prepare('UPDATE habits SET archived_at = ? WHERE id = ?').run(new Date().toISOString(), id);
   }
   ```
2. **Acrescente a rota.** Em `server/src/routes/habits.ts`, importe `archiveHabit` e acrescente:

   ```ts
   router.post('/:id/archive', (req, res) => {
     const id = habitId(req, res);
     if (id === undefined) {
       return;
     }
     archiveHabit(db, id);
     res.json(listHabits(db, options.today()));
   });
   ```
3. **Confira o que veio de graça.** O `habitId` responde 404 para um hábito que não existe ou está arquivado, e as listas, o resumo e a `countActiveHabits` já filtram por `archived_at IS NULL`.
4. **Adicione os testes.** A referência adiciona `server/src/archive.test.ts`: a resposta, as listas, o histórico mantido no banco e os 404.

Depois rode `npm test`, arquive um hábito no navegador e mova o card para **Em QA**.
