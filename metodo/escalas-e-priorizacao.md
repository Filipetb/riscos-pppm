# Escalas e Priorização

O método usa **duas réguas distintas**, em momentos distintos. Confundi-las é o erro conceitual mais comum, e a ferramenta as mantém separadas de propósito.

| | Régua A — Probabilidade × Impacto | Régua B — Fórmula da Aula 2 |
|---|---|---|
| **Prioriza** | Riscos | Iniciativas / respostas / casos de uso |
| **Responde** | "Qual risco olhar primeiro?" | "Qual ação vale implementar primeiro?" |
| **Origem** | PMBOK — Realizar a Análise Qualitativa | Aula 2, PPPM/BSBr |
| **Momento** | Depois de Identificar | Depois de gerar respostas candidatas |

---

## Régua A — Probabilidade × Impacto

Prioriza **riscos**. É o processo *Realizar a Análise Qualitativa dos Riscos* do PMBOK.

### Probabilidade

| Nota | Rótulo | Critério |
|---|---|---|
| 1 | Muito baixa | Não conheço caso de isso ter acontecido aqui |
| 2 | Baixa | Já ouvi falar, mas é raro |
| 3 | Média | Acontece de vez em quando; ninguém se surpreenderia |
| 4 | Alta | Aconteceu no projeto anterior |
| 5 | Muito alta | Está acontecendo, ou é praticamente certo |

### Impacto

| Nota | Rótulo | Prazo | Custo | Escopo/Qualidade |
|---|---|---|---|---|
| 1 | Muito baixo | Absorvido pela folga | Irrelevante | Imperceptível |
| 2 | Baixo | Atraso interno, marco preservado | Absorvido pelo orçamento | Ajuste menor |
| 3 | Médio | Marco desliza | Estouro visível, gerenciável | Entrega degradada |
| 4 | Alto | Marco crítico perdido | Precisa de aprovação extra | Requisito comprometido |
| 5 | Muito alto | Prazo contratual perdido | Inviabiliza o business case | Entrega não serve |

> Preencher impacto **por dimensão** e usar a maior nota. Um risco de prazo 2 mas custo 5 é um risco 5.

### Severidade e faixas

```
Severidade = Probabilidade × Impacto        (1 a 25)
```

| Faixa | Severidade | Tratamento |
|---|---|---|
| 🔴 **Alto** | 15 – 25 | Resposta obrigatória, com dono e gatilho antes do encerramento da sessão |
| 🟡 **Médio** | 5 – 12 | Resposta planejada; aceitável aceitar ativamente com justificativa |
| 🟢 **Baixo** | 1 – 4 | Lista de observação; sem ação, só revisão periódica |

Para **oportunidades**, a mesma escala. Severidade alta = perseguir com a mesma energia de uma ameaça alta. É onde a maioria das organizações deixa valor na mesa.

---

## Régua B — Fórmula da Aula 2

Prioriza **iniciativas**: casos de uso de IA, respostas candidatas, ações de mitigação concorrendo pelo mesmo orçamento.

```
Prioridade = ((Impacto × 30) + (Viabilidade × 20) + (Dados × 20) + (Segurança × 15) + (Valor × 15)) ÷ 5
```

**Escala: 1 baixa · 3 média · 5 alta.** Resultado vai de 20 a 100.

| Critério | Peso | Pergunta executiva |
|---|---|---|
| Impacto | 30% | Qual resultado muda se isso for implementado? |
| Viabilidade | 20% | Conseguimos começar sem colocar a operação em risco? |
| Dados | 20% | Os dados existem, são acessíveis e confiáveis? |
| Segurança | 15% | Qual o risco ético, legal, operacional ou reputacional? |
| Valor | 15% | Que benefício executivo dá para demonstrar e medir? |

| Faixa | Prioridade | Decisão |
|---|---|---|
| 80 – 100 | Fazer agora | Alto impacto, alta viabilidade, risco controlável |
| 60 – 79 | Preparar | Alto impacto, mas exige dados, governança ou integração |
| 20 – 59 | Não priorizar | Baixo impacto, baixa viabilidade ou risco desproporcional |

### Corte obrigatório

> **Se não houver dono da decisão humana, o caso não está pronto.**

Vale **antes** da pontuação, não depois. Um item sem dono não recebe nota — é devolvido. Ver [`governanca-hitl.md`](governanca-hitl.md).

### Casos de verificação

A implementação **deve** reproduzir estes valores. São o exemplo do projeto de implantação de ERP da Aula 2:

| Caso de uso | I | V | D | S | Val | Esperado |
|---|---|---|---|---|---|---|
| Previsão de atrasos críticos no cronograma | 5 | 4 | 4 | 4 | 5 | **89** |
| Análise de riscos do go-live do ERP | 5 | 4 | 3 | 3 | 5 | **82** |
| Geração automática de atas e pendências | 3 | 5 | 5 | 4 | 3 | **79** |

Conferência do primeiro: `((5×30)+(4×20)+(4×20)+(4×15)+(5×15)) ÷ 5 = (150+80+80+60+75) ÷ 5 = 445 ÷ 5 = 89`.

> **Nota de procedência.** A versão em PDF da Aula 2 traz, nestas mesmas linhas, os valores 88 / 84 / 74, e os Exemplos 2 e 3 têm divergências semelhantes. A versão corrigida do slide — que acrescenta a caixa da fórmula e detalha o cálculo — traz 89 / 82 / 79, que é o que a fórmula produz. **Este método segue a fórmula.** Aritmética manual em matriz de priorização diverge com facilidade; calcular de forma consistente é justamente o que a ferramenta automatiza.

---

## Qualidade dos dados do risco

Antes de confiar numa priorização, avaliar a base. Um risco pontuado por chute tem a mesma aparência de um risco pontuado por evidência — e a mesma cor na matriz.

| Nota | Base da avaliação |
|---|---|
| 🟢 Alta | Dado histórico, medição ou contrato |
| 🟡 Média | Experiência direta de quem viveu situação parecida |
| 🔴 Baixa | Estimativa sem referência |

Risco de severidade alta com qualidade de dado baixa não vira ação imediata: vira **investigação**. É o "Investigue" da matriz da Aula 2.
