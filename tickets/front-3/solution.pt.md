# Solução: Marcar um hábito marca só aquele hábito

**Causa.** O `Today` (`client/src/components/Today.tsx`) renderiza os cartões com `key={index}`. A key diz ao React qual instância de componente pertence a qual item. Com a posição como key, quando um hábito marcado desce, o React mantém a instância da posição 0 e entrega a ela o hábito seguinte como props. O `HabitCard` guarda `done` no próprio estado, e esse estado fica com a instância: o hábito seguinte herda o "feito".

## Passo a passo

1. **Confirme que os dados estão certos.** Depois de marcar um hábito, o `GET /api/habits` mostra um dia novo. O problema é só na tela.
2. **Use uma key que identifique o hábito.** No `map` do `Today`:

   ```tsx
   {[...pending, ...done].map((habit) => (
     <HabitCard key={habit.id} habit={habit} />
   ))}
   ```

   Agora o React move o cartão junto com o hábito, e o estado vai junto.
3. **Adicione um teste de regressão.** A referência adiciona `client/src/components/Today.keys.test.tsx`: depois de marcar o primeiro hábito, os outros mantêm o estado.

Depois rode `npm test`, marque e desmarque alguns hábitos no navegador e mova o card para **Em QA**.
