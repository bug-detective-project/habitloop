# Solução: O painel para a atualização quando é fechado

**Causa.** Em `client/src/components/WeekPanel.tsx`, o efeito que inicia a atualização chama `setInterval` e não devolve nada. Quando o painel é fechado, o React remove o componente, e o intervalo, que pertence ao navegador e não ao React, continua disparando e chamando `load()`. Cada vez que o painel é aberto, um intervalo novo se soma aos que já estão rodando.

## Passo a passo

1. **Conte as requisições.** Com a aba Network aberta, abra e feche o painel algumas vezes e observe `/api/summary`.
2. **Devolva uma limpeza no efeito.**

   ```ts
   useEffect(() => {
     void load();
     const timer = setInterval(() => void load(), REFRESH_MS);
     return () => clearInterval(timer);
   }, [load]);
   ```

   O React roda a função devolvida quando o painel sai da página.
3. **Adicione um teste de regressão.** A referência adiciona `client/src/components/WeekPanel.polling.test.tsx`: com o relógio do teste, o painel consulta a cada 10 segundos enquanto aberto e para depois de fechado.

Depois rode `npm test`, observe a aba Network com o painel fechado e mova o card para **Em QA**.
