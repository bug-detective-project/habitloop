# Solução: A sequência conta os dias, em qualquer ordem

**Causa.** A `currentStreak` (`client/src/streak.ts`) supunha que `days` estava ordenada, do mais antigo ao mais novo, e a percorria a partir do fim. Isso vale para o que o servidor manda, mas, quando o usuário marca um dia, o app o acrescenta ao fim da lista (`toggleDay` em `client/src/HabitsContext.tsx`). Depois de marcar ontem, a lista termina em ontem, a função espera hoje ali e devolve 0.

## Passo a passo

1. **Veja a ordem.** No React DevTools, marque ontem e olhe `days` no cartão: o dia novo é o último item, depois de hoje.
2. **Pergunte quais dias estão marcados, não onde estão.**

   ```ts
   export function currentStreak(days: string[], today: string): number {
     const marked = new Set(days);
     let day = marked.has(today) ? today : addDays(today, -1);
     let streak = 0;
     while (marked.has(day)) {
       streak += 1;
       day = addDays(day, -1);
     }
     return streak;
   }
   ```
3. **Adicione testes de regressão.** A referência adiciona `client/src/streak.order.test.ts` (dias em qualquer ordem, um dia repetido) e `client/src/components/WeekPanel.streak.test.tsx` (marcar ontem no painel).

Depois rode `npm test`, preencha um buraco em **Last 7 days** no navegador e mova o card para **Em QA**.
