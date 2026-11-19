# Solução: O mês pede os seus próprios dias

**Causa.** Em `client/src/components/History.tsx`, `periodOf` transforma o mês da tela nos dias que ele pede à API. Ele escreve o primeiro dia como texto, a partir das partes de um `Date`: `${date.getUTCFullYear()}-${String(date.getUTCMonth()).padStart(2, '0')}-01`. O `getUTCMonth()` conta a partir de 0, então março (2) vira `2026-02-01`: a tela pede fevereiro enquanto o título (feito a partir do próprio dia) diz março, e nenhum dia do calendário de março encontra marcação. Em janeiro o mês é 0, e `2026-00-01` não é uma data: a API responde 400 e o histórico não carrega.

## Passo a passo

1. **Veja o que a tela pede.** Na aba Network, o Month de março pede `/api/history?from=2026-02-01&to=2026-02-28`; janeiro pede `from=2026-00-01`, que a API recusa.
2. **Ache onde o dia é escrito.** Em `periodOf`, no caso `'month'`, o primeiro dia é montado com `getUTCFullYear()` e `getUTCMonth()`.
3. **Conte o mês a partir de 1.** Escreva `String(date.getUTCMonth() + 1).padStart(2, '0')`, ou use `monthStart(anchor)` de `client/src/dates.ts`, que já faz isso. O último dia (`monthEnd`) sai do primeiro.
4. **Adicione um teste de regressão.** A referência adiciona `client/src/History.month.test.tsx`: as contagens dos dias de março e fevereiro, o resumo de março, janeiro e o mês de um hábito.

Depois rode `npm test`, abra History → Month em alguns meses e mova o card para **Em QA**.
