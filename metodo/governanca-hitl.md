# Governança e HITL

*Human in the Loop* — a IA recomenda, o humano valida e decide. Na Aula 2 isto ocupa um bloco inteiro; aqui vira regra executável, não intenção.

## O corte obrigatório

> **Se não houver dono da decisão humana, o caso não está pronto.**

Implementação:

- Todo item do registro tem campo **Dono** obrigatório.
- Dono é uma **pessoa nomeada**. "PMO", "equipe de dados", "a área" não passam — nenhum deles assina nada.
- Item sem dono é marcado **não-pronto** e **não pode ser concluído**. Aparece no registro exportado numa seção própria, `Pendente de dono`, para que a lacuna seja visível em vez de silenciosa.
- O bloqueio é do *encerramento*, não do *registro*. Registrar risco sem dono é permitido e desejável — encerrá-lo não.

## Os quatro elementos do HITL

Sem os quatro, a governança fica invisível — e o risco também.

| Elemento | Pergunta | Onde aparece |
|---|---|---|
| **Gatilhos** | Quando a IA não pode seguir sozinha? | Regras abaixo |
| **Escalonamento** | Quem decide em caso crítico? | Campo `Dono` + destinatário do Escalar |
| **Papéis** | Quem valida e quem aprova? | Fluxo de validação abaixo |
| **Feedback** | Como o fluxo é refinado? | Revisão ao encerrar a sessão |

## Gatilhos de validação humana obrigatória

A ferramenta exige confirmação explícita — nunca segue no automático — quando:

1. Um item recebe severidade **alta** (🔴 15–25).
2. A estratégia escolhida é **Evitar** ou **Explorar** (ambas mudam o plano do projeto).
3. Um item envolve **dado pessoal, sensível ou sujeito a sigilo contratual**.
4. Um item tem severidade alta e **qualidade de dado baixa** — decidir sobre chute é pior que não decidir.
5. Uma resposta gera **risco secundário** de severidade média ou superior.
6. Um item é marcado **Aceitar** estando em faixa alta.

## Fluxo de validação

Da Aula 2, em quatro passos:

```
1. IA gera        →  2. Consultor      →  3. Especialista   →  4. Gestor decide
   recomendação       verifica dados       valida riscos        e registra
                      e contexto           e regras
```

Quanto mais crítica a decisão, mais explícito precisa ser o ponto de validação. Em sessão individual (o caso do app), os passos 2–4 colapsam num único ponto de confirmação — mas o registro deve **dizer** que colapsaram, não fingir que os três ocorreram.

## Rastreabilidade

> Se a recomendação não pode ser explicada, auditada ou contestada, ela não está pronta para decisões críticas.

Cada item do registro carrega a cadeia completa:

| Elo | Conteúdo | Campo no registro |
|---|---|---|
| **Entrada** | Dados usados | Contexto + técnica aplicada |
| **Processamento** | Prompt, modelo e regra | Técnica + fórmula + versão do método |
| **Saída** | Recomendação gerada | Enunciado + severidade + resposta proposta |
| **Validação** | Humano aprova ou ajusta | Dono + data + aceite/ajuste |
| **Registro** | Decisão e evidência | Linha exportada, imutável |

Um risco exportado sem essa cadeia é uma opinião com formatação bonita.

## Limites da ferramenta

Explicitar isto na interface, não só na documentação:

- A ferramenta **não decide**. Organiza evidência e calcula de forma consistente. A assinatura é humana.
- A ferramenta **não sabe do seu projeto**. Toda nota vem de quem preenche; ela não valida se a nota é honesta.
- A ferramenta **não substitui** o plano de gerenciamento de riscos, nem a análise quantitativa, nem o monitoramento contínuo.
- Nenhum dado sai da máquina. Não há servidor, conta, telemetria ou envio a modelo externo na superfície web.
