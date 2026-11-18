# Solução: A lista de Hoje abre para quem não tem hábitos

**Causa.** O `Today` (`client/src/components/Today.tsx`) calcula a linha "Longest streak" com `bestStreak`, que termina em um `reduce` sem valor inicial. Em um array vazio esse `reduce` lança `TypeError: Reduce of empty array with no initial value`. O erro acontece durante a renderização do React, nada o captura, e o React remove o app inteiro da página. O bloco "No habits yet" fica mais abaixo no mesmo componente, então nunca é alcançado.

## Passo a passo

1. **Leia o erro.** Reproduza com o Console aberto: a mensagem cita `reduce` e a pilha aponta para `bestStreak` em `Today.tsx`.
2. **Trate a lista vazia primeiro.** No começo do `Today`, devolva o estado vazio antes de qualquer coisa que precise de um hábito:

   ```tsx
   if (habits.length === 0) {
     return (
       <Section aria-labelledby="today-heading">
         <Heading id="today-heading">{longDay(today)}</Heading>
         <Empty>
           <strong>No habits yet</strong>
           <Lead>Create your first habit with the New habit button.</Lead>
         </Empty>
       </Section>
     );
   }
   ```
3. **Simplifique o que vem depois.** Com a guarda no lugar, a lista abaixo não precisa mais do seu próprio `habits.length === 0 ? … : …`.
4. **Adicione um teste de regressão.** A referência adiciona `client/src/components/Today.empty.test.tsx`: o app sem hábitos mostra o convite, e o primeiro hábito aparece depois de criado.

Depois rode `npm test`, arquive todos os hábitos no navegador para ver a página vazia e mova o card para **Em QA**.
