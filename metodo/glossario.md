# Glossário

Mapeamento entre o vocabulário da disciplina e o do PMBOK. **Regra de nomeação: a interface usa o termo da aula, com o equivalente PMBOK entre parênteses — nunca o inverso.**

## Vocabulário da aula → PMBOK

| Termo da aula | Equivalente PMBOK | Observação |
|---|---|---|
| Mapa inicial de oportunidades | Registro de partes interessadas + declaração de escopo | O enquadramento de 5 colunas da Aula 1 |
| Dor | Problema / necessidade de negócio | Origem da maioria dos riscos identificados |
| Caso de uso | Hipótese de valor | Unidade priorizada pela Régua B |
| Régua de priorização | Análise qualitativa (adaptada) | Prioriza iniciativas, não riscos — ver [`escalas-e-priorizacao.md`](escalas-e-priorizacao.md) |
| HITL / validação humana | Risk owner + governança | O corte obrigatório |
| Dono da decisão humana | Risk owner / response owner | Pessoa nomeada, nunca uma área |
| Rastreabilidade | Auditabilidade / trilha de decisão | Entrada → Processamento → Saída → Validação → Registro |
| Radar de riscos | Monitoramento de riscos | Fora do MVP; roadmap |
| Corte obrigatório | Critério de saída | Bloqueia encerramento, não registro |
| Governança | Plano de gerenciamento de riscos (parcial) | O MVP cobre HITL e rastreabilidade |

## O enquadramento de 5 colunas

Da Aula 1, é a entrada de toda sessão:

| Coluna | Pergunta | Uso no método |
|---|---|---|
| **1. Contexto** | Qual projeto, processo ou área será analisado? | Cabeçalho do registro; delimita o que conta como risco |
| **2. Dor** | Qual problema real precisa ser resolvido? | Aponta onde as técnicas de identificação rendem mais |
| **3. Dados** | Que informações existem para apoiar a decisão? | Alimenta a qualidade do dado do risco |
| **4. Riscos** | O que exige validação humana, ética ou segurança? | Semente da identificação; dispara gatilhos de HITL |
| **5. Valor** | Que benefício executivo pode ser gerado? | Referência de impacto: risco é o que ameaça *isto* |

## Termos PMBOK usados sem tradução

| Termo | Definição operacional |
|---|---|
| **Risco** | Evento incerto que, se ocorrer, afeta um objetivo — negativa (ameaça) ou positivamente (oportunidade) |
| **Ameaça** | Risco de efeito negativo |
| **Oportunidade** | Risco de efeito positivo |
| **Probabilidade** | Chance de o evento ocorrer (1–5) |
| **Impacto** | Tamanho do efeito no objetivo, se ocorrer (1–5) |
| **Severidade** | Probabilidade × Impacto (1–25) |
| **Risco residual** | O que sobra depois da resposta implementada |
| **Risco secundário** | Risco novo, criado pela própria resposta |
| **Gatilho** | Sinal observável de que o risco está se materializando |
| **Reserva de contingência** | Recurso separado para riscos conhecidos e aceitos ativamente |
| **EAR** | Estrutura Analítica dos Riscos — a taxonomia de categorias |

## Como não escorregar

- **Risco ≠ problema.** Problema já aconteceu; risco ainda não. Se já aconteceu, é questão — outro registro.
- **Risco ≠ causa.** "Fornecedor único" é causa. O risco é o que pode ocorrer por causa dela.
- **Risco ≠ impacto.** "Atraso de 3 semanas" é efeito. O risco é o evento que produziria o atraso.
- **Oportunidade ≠ ideia boa.** Oportunidade é *incerta*. Se depende só de decidir, é ação — vai para o plano, não para o registro.

---

**Fonte do vocabulário da aula:** Formação de Consultores em IA Aplicada ao PPPM, Aulas 1 e 2, Prof. Dr. José Bezerra (BSBr), 2026. PMI®, PMBOK® e PMP® são marcas de seus respectivos titulares.
