# Arquivo de sessão

A sessão vive em disco desde a Etapa 1. É a única memória da skill: o que não está aqui não existe. Dois arquivos, na pasta `sessoes/<slug>/` do projeto (`<slug>` = kebab-case derivado do Contexto, ex.: `sessoes/erp-go-live-2026/`):

| Arquivo | Papel |
|---|---|
| `sessao.json` | **Estado.** Mesmo esquema do `estado` do app `docs/index.html`, para que uma futura importação seja trivial. É o que a skill lê ao retomar. |
| `registro.md` | **Leitura humana.** Gerado a partir do JSON ao fechar cada etapa. Nunca é fonte — se divergir do JSON, o JSON vale. |

A pasta `sessoes/` é ignorada pelo git: contém dados de projeto do usuário, não do repositório.

## `sessao.json`

Campos e valores espelham `sessaoNova()` e `novoItemCru()` do app. Todos os campos existem desde a criação, com o valor vazio do app até a etapa que os preenche (não omita — o esquema é o contrato).

```json
{
  "versaoApp": "skill-riscos 0.4.0",
  "criadoEm": "2026-08-21T18:00:00.000Z",
  "etapa": 5,
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
      "estrategia": "Mitigar", "acao": "Contratar segundo integrador Tasy até 15/09", "dono": "Ana Lima", "gatilho": "Se a carga de teste não fechar até 01/09", "residual": "Dependência de pessoa única no conhecimento legado até o segundo integrador subir",
      "justificativa": "", "destinatario": "", "replanejamento": "",
      "riscoSecundario": "Sobreposição de dois consultores no mesmo código", "riscoSecundarioFaixa": "medio", "riscoSecundarioAvaliado": false,
      "promovidoPara": "R017", "origemRiscoSecundario": "",
      "origemResposta": "ia-ajustado",
      "dadoSensivel": true,
      "bImpacto": null, "bViabilidade": null, "bDados": null, "bSeguranca": null, "bValor": null,
      "confirmacoes": { "g1": "2026-08-21T19:10:00.000Z", "g3": "2026-08-21T19:10:00.000Z", "g5": "2026-08-21T19:12:00.000Z" },
      "decisao": "ajuste", "validadoEm": "2026-08-21T20:05:00.000Z", "encerrado": true
    }
  ],
  "seq": 1
}
```

Regras:

- **IDs** são `R` + número com três dígitos, sequenciais a partir de `seq` (`R001`, `R002`…). Nunca reutilize nem renumere; item descartado pelo usuário não consome ID porque não chegou a entrar.
- `origem` ∈ `humano` · `ia-aceito` · `ia-ajustado`. Campo compartilhado com o app desde a versão 1.1.0 (o modo assistido da Etapa 2 grava os mesmos valores; itens digitados no formulário nascem `humano`); fica no item para que o `elo_validacao` do registro final possa dizer se o humano aceitou ou ajustou a sugestão.
- `polaridade` ∈ `ameaca` · `oportunidade`. `tecnica` é o `id` do CSV (`T01`…), não o nome.
- `postura` ∈ `parceira` · `perguntas`.
- `etapa` é a última etapa concluída ou em curso (1 a 5).
- **Campos da Etapa 3** (preenchidos só quando a pessoa fixa): `probabilidade` e `impPrazo`/`impCusto`/`impEscopo` são inteiros 1–5 ou `null` (dimensão que não se aplica, ou item não priorizado); `qualidade` ∈ `""` · `alta` · `media` · `baixa`; `dadoSensivel` booleano. **Severidade e faixa não são gravadas** — são derivadas (P × maior I) na hora de ler, como no app.
- `origemNota` ∈ `humano` · `ia-aceito` · `ia-ajustado` · `""` (ainda sem nota). Compartilhado com o app desde a 1.2.0 (modo assistido da Etapa 3), irmão de `origem`: diz se a nota foi dada sem sugestão, aceita como sugerida ou ajustada.
- `baseAvaliacao` é texto livre: a resposta a "De onde vem esse número?", ou o motivo de o item não ter sido priorizado. Compartilhado com o app desde a 1.2.0 (campo do cartão da Etapa 3); é o que sustenta `qualidade` e o elo *Entrada* da rastreabilidade. Sessões gravadas pela versão 0.1.0 não têm `origemNota`/`baseAvaliacao`; ao retomar, trate como `""`.
- **Campos da Etapa 4**: `estrategia` é um dos dez nomes do kernel, grafado exatamente (`Escalar` · `Evitar` · `Transferir` · `Mitigar` · `Aceitar` · `Explorar` · `Compartilhar` · `Melhorar`), ou `""`; `acao`, `dono`, `gatilho`, `residual` texto; `justificativa` só com Aceitar, `destinatario` só com Escalar, `replanejamento` só com Evitar/Explorar — ao trocar a estratégia, o campo da antiga é esvaziado. `riscoSecundario` texto e `riscoSecundarioFaixa` ∈ `""` · `alto` · `medio` · `baixo`; `riscoSecundarioAvaliado: true` significa "avaliei e não cria" e é exclusivo com texto no `riscoSecundario`. `promovidoPara` (no item de origem) e `origemRiscoSecundario` (no item novo) ligam o risco secundário ao item que o gerou, nos dois sentidos. `confirmacoes` é objeto `{ gN: "<ISO da confirmação>" }` só com os gatilhos que a pessoa confirmou; gatilho que deixou de disparar perde a confirmação. `bImpacto`…`bValor` inteiros 1–5 ou `null` — só para respostas que concorrem, e nunca para item sem dono. **Prioridade B não é gravada** — derivada da fórmula na leitura.
- `origemResposta` ∈ `humano` · `ia-aceito` · `ia-ajustado` · `""`. Compartilhado com o app desde a 1.3.0 (modo assistido da Etapa 4), irmão de `origem` e `origemNota`, para a resposta (estratégia + ação + gatilho + residual). Dono nunca entra nessa conta: não é sugerido.
- **Campos da Etapa 5**: `decisao` ∈ `""` · `aceite` · `ajuste` — a decisão da validação humana, fixada pela pessoa (a IA propõe a partir de `origem`/`origemNota`/`origemResposta`: qualquer `ia-ajustado` → `ajuste`; só `ia-aceito`/`humano` → `aceite`). `encerrado` booleano e `validadoEm` ISO do encerramento — gravados **só** quando a pessoa manda encerrar um item que `scripts/exportar.js status` diz `podeEncerrar: true`; se um campo mudar depois e o item voltar a falhar um bloqueio, os dois caem (`false` / `""`), como no app. Nunca preencha `validadoEm` sem `encerrado: true`.
- Escreva o JSON inteiro a cada item aceito. Arquivo pequeno, escrita barata, e não há fila para perder.

## `registro.md`

Gerado ao fechar cada etapa (e regerado se a pessoa voltar e mudar algo). É a **leitura de acompanhamento** da skill, com as colunas de origem que o app não tem; o registro **exportado** (CSV + Markdown em paridade com o app) é outro arquivo, gerado por `scripts/exportar.js` na Etapa 5 — veja o fim desta seção. Estrutura — a seção de priorização só aparece a partir da Etapa 3, as de resposta a partir da Etapa 4, e a de registro a partir da Etapa 5:

```markdown
# Registro de riscos — <contexto>

**Sessão iniciada em:** <dd/mm/aaaa hh:mm>
**Conduzida por:** <nome>
**Versão das regras:** skill-riscos 0.4.0 · kernel em metodo/
**Etapas concluídas:** 1 Enquadrar · 2 Identificar · 3 Priorizar · 4 Responder · 5 Registrar.

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

> Origem da nota: `humano` = nota dada sem sugestão da IA · `ia-aceito` = sugestão da IA fixada sem alteração · `ia-ajustado` = sugestão da IA alterada pelo participante. Item com origem `ia-aceito` e origem da nota `ia-aceito` é item em que o humano só confirmou — está dito aqui para que o elo de validação não finja mais do que houve. Em sessão conversacional individual, os passos 2–4 do fluxo de validação da Aula 2 colapsam num único ponto: quem conduz.

## Respostas (Planejar as Respostas aos Riscos)

> **Corte obrigatório (critério de saída):** se não houver dono da decisão humana, o caso não está pronto. O corte bloqueia o encerramento (Etapa 5), não o registro — itens sem dono estão na seção *Pendente de dono* abaixo.

| ID | Faixa | Estratégia | Ação | Dono | Gatilho | Risco residual | Risco secundário | Regras 1–5 | Validação humana | Origem da resposta | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R001 | 🔴 Alto | Mitigar | Contratar segundo integrador Tasy até 15/09 | Ana Lima | Se a carga de teste não fechar até 01/09 | Dependência de pessoa única até o segundo subir | → R017 (🟡) | ✓ — — ✓ — | g1 ✓ g3 ✓ g5 ✓ | ia-ajustado | Encerrado |
| R004 | 🟡 Médio | Aceitar | Monitorar… | — | … | … | avaliado: não cria | — ✓ — ✓ — | — | humano | Pendente de dono |

Regras: 1 faixa alta exige resposta · 2 Aceitar exige justificativa · 3 Evitar/Explorar mudam o plano · 4 resposta cria risco · 5 Escalar exige destinatário. ✓ cumprida · ✗ pendente · — não se aplica. Validação humana: gatilhos disparados (g1 🔴 · g2 Evitar/Explorar · g3 dado sensível · g4 Investigue · g5 secundário 🟡/🔴 · g6 Aceitar em 🔴), ✓ confirmado em <data> · ✗ **NÃO CONFIRMADO**. Status: Pendente de dono · Encerrado · Rascunho · Investigue · Aberto (nesta ordem de precedência, como no app).

### Pendente de dono

> Se não houver dono da decisão humana, o caso não está pronto. Os itens abaixo estão registrados mas **não poderão ser encerrados**: R004. *(nenhum, se não houver)*

### Justificativas, destinatários e pendências de replanejamento

- **R004** (Aceitar) — justificativa: …
- **R009** (Escalar) — destinatário: …
- **R002** (Evitar) — **pendência de replanejamento:** … *(Regra 3: muda o plano do projeto; não é anotação no registro de riscos)*

### Desempate de respostas (Régua B — fórmula da Aula 2)

Prioriza **iniciativas e respostas**, não riscos. Régua separada da Régua A; as duas nunca são somadas. `Prioridade = ((Impacto × 30) + (Viabilidade × 20) + (Dados × 20) + (Segurança × 15) + (Valor × 15)) ÷ 5` · Fazer agora 80–100 · Preparar 60–79 · Não priorizar 20–59.

| # | ID | Ação | Dono | I | V | D | S | Val | Prioridade | Decisão |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | R001 | … | Ana Lima | 5 | 4 | 4 | 4 | 5 | 89 | Fazer agora |

*(ou: "Régua B não aplicada — nenhuma resposta concorre pelo mesmo orçamento ou pessoa.")*

> Origem da resposta: `humano` · `ia-aceito` · `ia-ajustado`, como nos demais elos. Dono nunca é sugerido pela IA.

## Registro — validação humana e encerramento (governança / HITL)

> **Corte obrigatório (critério de saída):** Se não houver dono da decisão humana, o caso não está pronto.
> Fluxo de validação da Aula 2: 1. IA gera recomendação → 2. Consultor verifica → 3. Especialista valida → 4. Gestor decide e registra. **Nesta sessão o passo 1 foi ocupado pela IA (origens por item) e os passos 2–4 colapsaram num único ponto de confirmação humana.**

| ID | Faixa | Dono | Decisão da validação humana | Origens (enunciado / nota / resposta) | Encerrado em | Status | Bloqueios |
|---|---|---|---|---|---|---|---|
| R001 | 🔴 Alto | Ana Lima | ajuste | ia-ajustado / ia-aceito / ia-ajustado | 21/08/2026 20:05 | Encerrado | — |
| R004 | 🟡 Médio | — | — | humano / humano / humano | — | Pendente de dono | Corte obrigatório: sem dono · sem decisão |

Encerrados: n · Abertos: n · Pendentes de dono: n · Bloqueados por outro motivo: n.

**Exportado em** <dd/mm/aaaa hh:mm>: `registro-de-riscos-<slug>-AAAAMMDD-HHMM.csv` · `registro-de-riscos-<slug>-AAAAMMDD-HHMM.md` *(ou: "ainda não exportado")*

> Decisão: `aceite` = a recomendação foi aprovada como está · `ajuste` = a recomendação foi alterada pelo humano. Proposta pela IA a partir das origens, fixada pela pessoa. Encerramento só por ordem explícita da pessoa e só com zero bloqueios (`scripts/exportar.js status`).
```

### Arquivos de exportação (Etapa 5)

Gerados por `scripts/exportar.js exportar` na pasta da sessão, com o mesmo nome que o app dá ao download (`registro-de-riscos-<slug>-AAAAMMDD-HHMM.csv` / `.md`). Cada export é um arquivo novo — o anterior não é sobrescrito. O CSV tem as 51 colunas do app, na mesma ordem, mais quatro da skill no fim (`origem_item`, `origem_nota`, `base_avaliacao`, `origem_resposta`); separador `;`, BOM UTF-8, CRLF, fórmulas neutralizadas. O Markdown tem as mesmas seções do app. Diferenças deliberadas e documentadas no script: a versão das regras (`skill-riscos`), a nota de colapso do fluxo (diz que a IA ocupou o passo 1), o elo *Processamento* (diz que houve modelo e cita as origens), o elo *Entrada* (inclui a base da avaliação) e o último limite ("tudo que foi digitado passou pelo modelo", no lugar de "nenhum dado sai da máquina").

Na tabela de respostas, só itens priorizados (com faixa); itens não priorizados ficam listados em uma linha abaixo dela como "sem resposta: não priorizado". Ordene por faixa (🔴, 🟡, 🟢).

Ordene a tabela de priorização por severidade decrescente; não priorizados por último. Severidade e faixa são calculadas na geração, nunca copiadas de campo gravado.

Enunciado na tabela = `Devido a <causa>, pode ocorrer <evento>, o que levaria a <efeito>`. Escape `|` dentro de célula como `\|`.

## Retomar

Se na ativação houver `sessoes/*/sessao.json`, ofereça retomar (inclusive com `etapa` = 5: sessão encerrada pode ser reaberta para tratar pendências e reexportar). Ao retomar:

1. Leia o `sessao.json` inteiro. Não leia o `registro.md` — ele é derivado.
2. Recarregue a `postura` e mantenha-a.
3. Reflita em poucas linhas onde parou: contexto, quantos itens, quais técnicas já rodaram (`tecnicasRodadas`), qual estava ativa.
4. Se `etapa` ≤ 2: continue da técnica ativa se ela não secou, ou ofereça a próxima da combinação. Se a Etapa 2 estava fechada, pergunte se quer acrescentar itens ou seguir para a Etapa 3.
5. Se `etapa` = 3: diga quantos itens já têm nota e quantos faltam (`probabilidade === null` e `baseAvaliacao` vazio = ainda não passou); continue do primeiro que falta. Se todos passaram, pergunte se quer rever alguma nota ou só regenerar o `registro.md`. Itens acrescentados na Etapa 2 depois de a 3 ter começado entram na fila da priorização.
6. Se `etapa` = 4: diga quantos itens priorizados já têm resposta (`estrategia` preenchida) e quantos faltam; continue do primeiro 🔴 sem resposta, depois 🟡, depois 🟢. Itens com `origemRiscoSecundario` sem nota entram na fila (Etapa 3 → 4). Gatilhos disparados sem `confirmacoes` são listados como pendentes. Se tudo está respondido, pergunte se quer rever algo ou seguir para a Etapa 5.
7. Se `etapa` = 5: rode `scripts/exportar.js status` e mostre o painel de fechamento (encerrados, só falta decisão, prontos, bloqueados). Pergunte se quer tratar pendências, reabrir algo ou só reexportar.
