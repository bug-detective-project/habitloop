# Solução: A semana para a atualização quando sai da tela

**Causa.** Em `client/src/components/WeekPanel.tsx`, o efeito que inicia a atualização chama `setInterval` e não devolve nada. Quando a semana sai da tela, o React remove o componente, e o intervalo, que pertence ao navegador e não ao React, continua disparando e chamando `load()`. Cada vez que a semana é aberta, um intervalo novo se soma aos que já estão rodando.

## Passo a passo

1. **Conte as requisições.** Com a aba Network aberta, abra a semana do histórico e saia dela algumas vezes, e observe `/api/summary`.
2. **Devolva uma limpeza no efeito.**

   ```ts
   useEffect(() => {
     void load();
     const timer = setInterval(() => void load(), REFRESH_MS);
     return () => clearInterval(timer);
   }, [load]);
   ```

   O React roda a função devolvida quando a semana sai da página.
3. **Adicione um teste de regressão.** A referência adiciona `client/src/components/WeekPanel.polling.test.tsx`: com o relógio do teste, a semana consulta a cada 10 segundos enquanto está na tela e para depois que saio.

Depois rode `npm test`, observe a aba Network depois de sair da semana e mova o card para **Em QA**.
