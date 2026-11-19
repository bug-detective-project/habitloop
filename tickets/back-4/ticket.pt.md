# HL-204: O resumo semanal conta o mesmo dia duas vezes

| Campo | Valor |
| --- | --- |
| Projeto | HabitLoop (HL) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Samuel Adeyemi (Suporte aos membros) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (resumo) |
| Rótulos | `resumo`, `api`, `sql` |
| Sprint | HL Sprint 4 |
| Criado em | 17/03/2026 11:48 |

## Descrição

Uma aluna nos mostrou a semana dela no **History**: "Practice guitar" tem dois quadrados verdes, ontem e hoje, e a coluna **Done** diz "3 of 4 days". Outro aluno tem "8 of 7 days" em um hábito, numa semana de sete dias.

Acontece com quem usa o app no celular e no computador: quando os dois marcam o mesmo hábito no mesmo dia, o dia parece contar duas vezes.

## Passos para reproduzir

1. Abra o HabitLoop e clique em **History**: a aba **Week** abre primeiro.
2. Conte os quadrados verdes de "Practice guitar" e compare com a coluna **Done**.
3. Ou pergunte à API: `curl http://localhost:3001/api/summary` e compare `days` com `doneDays` nesse hábito.

## Resultado esperado

O número de dias feitos é o número de dias marcados: 2 quadrados, "2 of 4 days". Um dia conta uma vez, não importa quantas vezes foi marcado.

## Resultado atual

"Practice guitar" mostra 2 quadrados e "3 of 4 days".

## Critérios de aceitação

- [ ] Um dia marcado duas vezes conta como um dia em `doneDays` e em `progress`.
- [ ] Para todo hábito, `doneDays` é igual ao número de dias em `days`, e nunca passa de 7.
- [ ] Marcar hoje de novo por outro aparelho não acrescenta um dia.
- [ ] A semana do **History** mostra a contagem corrigida.

## Ambiente

- HabitLoop 1.0
- Hábitos marcados mais de uma vez no mesmo dia

## Atividade

**Samuel Adeyemi** · 17/03/2026 12:10
> Marcar duas vezes é normal e permitido. Os dois aparelhos não sabem um do outro.
