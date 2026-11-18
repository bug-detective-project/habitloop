# Solução: O anel de progresso do cartão do hábito

**O que faltava.** O cartão tinha os números (`week` e `habit.weeklyGoal`) e nenhum componente para desenhá-los. O `ProgressRing` não existia, então o `HabitCard` mostrava a semana só como texto.

## Passo a passo

1. **Calcule o valor.** Em `client/src/components/ProgressRing.tsx`:

   ```ts
   const percent = Math.min(100, Math.round((done / goal) * 100));
   ```
2. **Diga o que ele é.** O elemento de fora é a barra de progresso; o desenho de dentro é decoração:

   ```tsx
   <Ring role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
     <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">…</svg>
     <Value aria-hidden="true">{percent}%</Value>
   </Ring>
   ```
3. **Desenhe.** Dois círculos de mesmo raio: um trilho na cor da borda e uma barra na cor de destaque, com `strokeDasharray={CIRCUMFERENCE}` e `strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}`, girada -90 graus. O `Ring` é `flex: none`, com largura e altura fixas.
4. **Use no cartão.** No `HabitCard`, entre o `Info` e o `EditButton`:

   ```tsx
   {habit.weeklyGoal !== null && (
     <ProgressRing done={week} goal={habit.weeklyGoal} label={`Weekly goal of ${habit.name}`} />
   )}
   ```
5. **Adicione os testes.** A referência adiciona `client/src/components/ProgressRing.test.tsx`: o papel e os valores do componente, e o anel nos cartões.

Depois rode `npm test`, olhe os cartões no navegador e mova o card para **Em QA**.
