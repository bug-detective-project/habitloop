# Solução: Resposta atrasada da atualização não desfaz mais uma marcação nova

**Causa.** Em `client/src/components/WeekPanel.tsx`, o `load` punha na tela toda resposta de `/api/summary`, na ordem em que as respostas chegavam. A atualização periódica pode ser pedida antes de o usuário marcar um dia e responder depois. Essa resposta descreve o passado, e substituía o estado mais novo: a marcação sumia até a atualização seguinte.

## Passo a passo

1. **Faça acontecer quando quiser.** Com "Slow 4G" na aba Network, marque um dia enquanto uma requisição do resumo está pendente.
2. **Numere as requisições e ignore as antigas.**

   ```ts
   // The number of the newest request. An answer is used only while its request is still the newest.
   const newestRef = useRef(0);

   const load = useCallback(async () => {
     const request = ++newestRef.current;
     try {
       const data = await fetchSummary();
       if (request === newestRef.current) {
         setSummary(data);
         setFailed(false);
       }
     } catch {
       if (request === newestRef.current) {
         setFailed(true);
       }
     }
   }, []);
   ```
3. **Uma mudança envelhece as requisições pendentes.** No `toggle`, antes de mudar a tela:

   ```ts
   // A request that is on its way was asked before this change: its answer is out of date.
   newestRef.current += 1;
   ```
4. **Adicione um teste de regressão.** A referência adiciona `client/src/components/WeekPanel.stale.test.tsx`, que segura uma resposta do resumo, marca um dia e depois deixa a resposta antiga chegar.

Depois rode `npm test`, tente de novo com a limitação ligada e mova o card para **Em QA**.
