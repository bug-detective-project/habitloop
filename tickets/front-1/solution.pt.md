# Solução: Nome longo de hábito fica dentro do cartão

**Causa.** Em `client/src/components/HabitCard.tsx`, o cartão é uma linha flex e o `Info` (o bloco do nome) é um dos itens. Um item flex tem `min-width: auto`: ele se recusa a ficar mais estreito que o seu conteúdo. O nome é `white-space: nowrap`, então o conteúdo é o nome inteiro em uma linha; o `Info` cresce até essa largura e empurra o anel e o botão **Edit** para fora do cartão.

## Passo a passo

1. **Veja no DevTools.** Com a janela estreita, selecione o bloco do nome no cartão longo: ele é mais largo que o próprio cartão.
2. **Deixe o bloco encolher.** Adicione `min-width: 0;` ao `Info`:

   ```ts
   const Info = styled.div`
     flex: 1;
     min-width: 0;
   `;
   ```

   Agora o bloco pode ficar mais estreito que o nome, e o `overflow: hidden` e o `text-overflow: ellipsis` do `Name` mostram o "…".
3. **Adicione um teste de regressão.** A referência adiciona `client/src/components/HabitCard.layout.test.tsx`, que confere que o bloco do nome pode encolher.

Depois rode `npm test`, olhe o cartão em algumas larguras de janela e mova o card para **Em QA**.
