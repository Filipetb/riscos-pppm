# Arquivo de sessão

A sessão vive em disco desde a Etapa 1. É a única memória da skill: o que não está aqui não existe. Dois arquivos, na pasta `sessoes/<slug>/` do projeto (`<slug>` = kebab-case derivado do Contexto, ex.: `sessoes/erp-go-live-2026/`):

| Arquivo | Papel |
|---|---|
| `sessao.json` | **Estado.** Mesmo esquema do `estado` do app `docs/index.html`, para que uma futura importação seja trivial. É o que a skill lê ao retomar. |
| `registro.md` | **Leitura humana.** Gerado a partir do JSON ao fechar cada etapa. Nunca é fonte — se divergir do JSON, o JSON vale. |

A pasta `sessoes/` é ignorada pelo git: contém dados de projeto do usuário, não do repositório.

## `sessao.json`

Campos e valores espelham `sessaoNova()` e `novoItemCru()` do app. Campos que a skill ainda não preenche ficam com o valor vazio do app (não omita — o esquema é o contrato).

```json
{
  "versaoApp": "skill-riscos 0.2.0",
  "criadoEm": "2026-08-21T18:00:00.000Z",
  "etapa": 3,
  "enquadramento": { "contexto": "", "dor": "", "dados": "", "riscos": "", "valor": "" },
  "conduzidaPor": "",
  "postura": "parceira",
  "tecnicaAtiva": { "ameaca": "", "oportunidade": "" },
  "tecnicasRodadas": ["T01", "T02"],
  "itens": [
    {
      "id": "R001",
      "polaridade": "ameaca",
      "tecnica": "T01",
      "causa": "", "evento": "", "efeito": "",
      "origem": "humano",
      "probabilidade": 4, "impPrazo": 5, "impCusto": null, "impEscopo": 2,
      "qualidade": "alta",
      "origemNota": "ia-ajustado",
      "baseAvaliacao": "relatório mensal do call center: pico em todo janeiro desde 2022",
      "estrategia": "", "acao": "", "dono": "", "gatilho": "", "residual": "",
      "justificativa": "", "destinatario": "", "replanejamento": "",
      "riscoSecundario": "", "riscoSecundarioFaixa": "", "riscoSecundarioAvaliado": false,
      "dadoSensivel": false,
      "bImpacto": null, "bViabilidade": null, "bDados": null, "bSeguranca": null, "bValor": null,
      "confirmacoes": {}, "decisao": "", "validadoEm": "", "encerrado": false
    }
  ],
  "seq": 1
}
```

Regras:

- **IDs** são `R` + número com três dígitos, sequenciais a partir de `seq` (`R001`, `R002`…). Nunca reutilize nem renumere; item descartado pelo usuário não consome ID porque não chegou a entrar.
- `origem` ∈ `humano` · `ia-aceito` · `ia-ajustado`. É campo da skill (o app não o tem); fica no item para que o `elo_validacao` do registro final possa dizer se o humano aceitou ou ajustou a sugestão.
- `polaridade` ∈ `ameaca` · `oportunidade`. `tecnica` é o `id` do CSV (`T01`…), não o nome.
- `postura` ∈ `parceira` · `perguntas`.
- `etapa` é a última etapa concluída ou em curso (1, 2 ou 3 nesta versão).
- **Campos da Etapa 3** (preenchidos só quando a pessoa fixa): `probabilidade` e `impPrazo`/`impCusto`/`impEscopo` são inteiros 1–5 ou `null` (dimensão que não se aplica, ou item não priorizado); `qualidade` ∈ `""` · `alta` · `media` · `baixa`; `dadoSensivel` booleano. **Severidade e faixa não são gravadas** — são derivadas (P × maior I) na hora de ler, como no app.
- `origemNota` ∈ `humano` · `ia-aceito` · `ia-ajustado` · `""` (ainda sem nota). Campo da skill, irmão de `origem`: diz se a nota foi dada sem sugestão, aceita como sugerida ou ajustada.
- `baseAvaliacao` é texto livre: a resposta a "De onde vem esse número?", ou o motivo de o item não ter sido priorizado. Campo da skill; é o que sustenta `qualidade` e o elo *Entrada* da rastreabilidade. Sessões gravadas pela versão 0.1.0 não têm `origemNota`/`baseAvaliacao`; ao retomar, trate como `""`.
- Escreva o JSON inteiro a cada item aceito. Arquivo pequeno, escrita barata, e não há fila para perder.

## `registro.md`

Gerado ao fechar cada etapa (e regerado se a pessoa voltar e mudar algo). Estrutura, espelhando o Markdown que o app exporta — a seção de priorização só aparece a partir da Etapa 3:

```markdown
# Registro de riscos — <contexto>

**Sessão iniciada em:** <dd/mm/aaaa hh:mm>
**Conduzida por:** <nome>
**Versão das regras:** skill-riscos 0.2.0 · kernel em metodo/
**Etapas concluídas:** 1 Enquadrar · 2 Identificar · 3 Priorizar. Pendentes: 4 Responder · 5 Registrar.

## Enquadramento — mapa inicial de oportunidades (registro de partes interessadas + declaração de escopo)

| Coluna | Pergunta | Resposta |
|---|---|---|
| 1. Contexto | Qual projeto, processo ou área será analisado? | … |
| 2. Dor (problema / necessidade de negócio) | Qual problema real precisa ser resolvido? | … |
| 3. Dados | Que informações existem para apoiar a decisão? | … |
| 4. Riscos | O que exige validação humana, ética ou segurança? | … |
| 5. Valor | Que benefício executivo pode ser gerado? | … |

## Itens identificados

Técnicas aplicadas: T01 Pré-mortem (Premortem / retrospectiva prospectiva) · T02 …

| ID | Polaridade | Enunciado | Técnica | Origem |
|---|---|---|---|---|
| R001 | Ameaça | Devido a …, pode ocorrer …, o que levaria a … | T01 Pré-mortem | humano |

> Origem: `humano` = enunciado do participante · `ia-aceito` = proposto pela IA e aceito sem alteração · `ia-ajustado` = proposto pela IA e alterado pelo participante.

## Priorização — Régua A (Realizar a Análise Qualitativa dos Riscos)

Severidade = Probabilidade × Impacto (1–25); Impacto = maior nota entre prazo, custo e escopo/qualidade. Faixas: 🔴 Alto 15–25 · 🟡 Médio 5–12 · 🟢 Baixo 1–4.

| ID | Polaridade | Enunciado | P | I (prazo/custo/escopo) | Severidade | Faixa | Qualidade do dado | Base da avaliação | Dado sensível | Origem da nota |
|---|---|---|---|---|---|---|---|---|---|---|
| R001 | Ameaça | Devido a …, pode ocorrer …, o que levaria a … | 4 | 5 (5/—/2) | 20 | 🔴 Alto | 🟢 Alta | relatório mensal do call center… | sim | ia-ajustado |
| R007 | Ameaça | … | — | — | — | não priorizado | — | não avaliado: falta dado de carga | não | — |

🔴 Alto: n · 🟡 Médio: n · 🟢 Baixo: n · não priorizados: n

**Investigue** (severidade alta com qualidade de dado baixa — não vira ação imediata, vira investigação): R00x, R00y. *(nenhum, se não houver)*

**Gatilhos de validação humana obrigatória já acionados** (confirmação explícita na Etapa 4): gatilho 1 (severidade alta): R…; gatilho 3 (dado sensível): R…; gatilho 4 (alta + dado baixo): R….

> Origem da nota: `humano` = nota dada sem sugestão da IA · `ia-aceito` = sugestão da IA fixada sem alteração · `ia-ajustado` = sugestão da IA alterada pelo participante. Item com origem `ia-aceito` e origem da nota `ia-aceito` é item em que o humano só confirmou — está dito aqui para que o elo de validação não finja mais do que houve. Em sessão conversacional individual, os passos 2–4 do fluxo de validação da Aula 2 colapsam num único ponto: quem conduz. Nenhum item está respondido ou validado — isso é das Etapas 4–5.
```

Ordene a tabela de priorização por severidade decrescente; não priorizados por último. Severidade e faixa são calculadas na geração, nunca copiadas de campo gravado.

Enunciado na tabela = `Devido a <causa>, pode ocorrer <evento>, o que levaria a <efeito>`. Escape `|` dentro de célula como `\|`.

## Retomar

Se na ativação houver `sessoes/*/sessao.json` com `etapa` ≤ 3, ofereça retomar. Ao retomar:

1. Leia o `sessao.json` inteiro. Não leia o `registro.md` — ele é derivado.
2. Recarregue a `postura` e mantenha-a.
3. Reflita em poucas linhas onde parou: contexto, quantos itens, quais técnicas já rodaram (`tecnicasRodadas`), qual estava ativa.
4. Se `etapa` ≤ 2: continue da técnica ativa se ela não secou, ou ofereça a próxima da combinação. Se a Etapa 2 estava fechada, pergunte se quer acrescentar itens ou seguir para a Etapa 3.
5. Se `etapa` = 3: diga quantos itens já têm nota e quantos faltam (`probabilidade === null` e `baseAvaliacao` vazio = ainda não passou); continue do primeiro que falta. Se todos passaram, pergunte se quer rever alguma nota ou só regenerar o `registro.md`. Itens acrescentados na Etapa 2 depois de a 3 ter começado entram na fila da priorização.
