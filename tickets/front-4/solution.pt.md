# Solução: Edit abre o formulário sem marcar o hábito

**Causa.** Em `client/src/components/HabitCard.tsx`, o cartão inteiro é clicável: `<Card onClick={toggle}>` marca o hábito. O botão **Edit** é filho desse cartão. Um clique no botão roda o manipulador do botão e depois sobe até o cartão, que roda o `toggle`. Um clique, duas ações.

## Passo a passo

1. **Veja os dois manipuladores rodarem.** Com a aba Network aberta, clique em **Edit**: o formulário abre e uma requisição para `/api/habits/:id/checkins` é enviada.
2. **Pare o clique no botão.**

   ```tsx
   <EditButton
     type="button"
     aria-label={`Edit ${habit.name}`}
     onClick={(event) => {
       // The whole card marks the habit; a click on Edit must not reach it.
       event.stopPropagation();
       setEditing(true);
     }}
   >
   ```
3. **Adicione um teste de regressão.** A referência adiciona `client/src/components/HabitCard.edit.test.tsx`: o Edit não envia requisição de dia, e um clique em outro ponto do cartão continua marcando o hábito.

Depois rode `npm test`, teste o Edit em um hábito feito e em um não feito e mova o card para **Em QA**.
