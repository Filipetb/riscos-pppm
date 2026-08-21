# Técnicas de Identificação de Riscos

Catálogo executável para o processo **Identificar os Riscos** (PMBOK). Os dados vivem em [`tecnicas.csv`](tecnicas.csv) — adicionar técnica é acrescentar uma linha, nunca editar código.

## Esquema do CSV

| Coluna | Conteúdo |
|---|---|
| `id` | Identificador estável (`T01`…). Nunca reutilizado. |
| `tecnica` | Nome exibido na interface. |
| `origem_pmbok` | Ferramenta/técnica correspondente no PMBOK. É o que dá lastro à ferramenta numa arguição. |
| `polaridade` | `ameaca`, `oportunidade` ou `ambas`. Governa em qual aba a técnica aparece. |
| `pergunta_disparo` | **A pergunta literal feita ao usuário.** É o que torna a técnica utilizável por quem nunca ouviu falar de PMBOK. |
| `padrao_saida` | Forma do resultado, no formato `entrada → transformação → saída`. Define os campos que a técnica preenche no registro. |
| `serve_para` | Situações em que a técnica rende. Lista separada por `\|`. Alimenta a recomendação. |
| `esforco` | `baixo`, `medio`, `alto`. Uma sessão de 15 minutos usa só `baixo`. |

## Como rodar uma técnica

1. **Enquadrar** — a técnica opera sobre o contexto definido em [`glossario.md`](glossario.md) (mapa de 5 colunas da Aula 1). Sem contexto, a técnica produz risco genérico.
2. **Disparar** — fazer a `pergunta_disparo` literalmente. Não parafrasear para "soar mais profissional": a pergunta é concreta de propósito.
3. **Insistir** — a primeira resposta é sempre a óbvia. Continuar até a pessoa parar de produzir, não até parecer suficiente.
4. **Estruturar** — converter cada resposta bruta no `padrao_saida` da técnica.
5. **Registrar** — cada item entra no registro com causa e efeito **separados**.

## Formato obrigatório do enunciado de risco

Um risco não é "atraso". Um risco tem causa, evento e efeito:

> **Devido a** `<causa — um fato conhecido>`, **pode ocorrer** `<evento incerto>`, **o que levaria a** `<efeito no objetivo>`.

Exemplo, do caso ERP dos slides:

> Devido à **dependência de um único integrador para a carga de dados legados**, pode ocorrer **estouro da janela de virada**, o que levaria a **adiamento do go-live e custo adicional de operação paralela**.

Este formato não é cosmético. Ele é o que permite as etapas seguintes: a **causa** é onde a resposta preventiva age, o **efeito** é o que alimenta o Impacto na [priorização](escalas-e-priorizacao.md).

## Seleção de técnicas

Combinar de 2 a 4 técnicas de ângulos diferentes. Uma só produz um ponto cego previsível.

| Situação | Combinação recomendada |
|---|---|
| Sessão curta (15 min, demo, aula) | T01 Pré-mortem + T02 Auditoria de Premissas |
| Projeto novo, começando do zero | T08 SWOT + T03 Categorias + T02 Premissas |
| Go-live / marco crítico | T01 Pré-mortem + T05 Falha em Cascata + T07 Ruptura |
| Sistema com integrações | T04 Modos de Falha + T05 Falha em Cascata |
| Grupo com hierarquia forte | T11 Delphi + T06 Advogado do Diabo |
| Caçar riscos positivos | T12 Caça à Oportunidade + T08 SWOT |

## Oportunidades

Riscos positivos usam as técnicas marcadas `oportunidade` ou `ambas`, com a polaridade da pergunta invertida. T01 Pré-mortem vira **pré-mortem invertido**:

> Estamos 6 meses à frente e o projeto foi um sucesso muito além do esperado. Escreva a manchete. O que deu certo?

A saída entra no mesmo registro, com marcação de polaridade, e recebe uma das estratégias positivas de [`estrategias-de-resposta.md`](estrategias-de-resposta.md).

---

**Procedência.** Os padrões de saída de T01, T02, T03, T04, T05, T06 e T07 são adaptados da categoria `risk` do catálogo de elicitação do [BMad Method](https://docs.bmad-method.org) (licença conforme o projeto). T08–T12 vêm das ferramentas e técnicas do processo Identificar os Riscos do PMBOK®. As perguntas de disparo e o mapeamento PMBOK são autorais.
