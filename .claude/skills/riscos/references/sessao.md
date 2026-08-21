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
  "versaoApp": "skill-riscos 0.1.0",
  "criadoEm": "2026-08-21T18:00:00.000Z",
  "etapa": 2,
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
      "probabilidade": null, "impPrazo": null, "impCusto": null, "impEscopo": null,
      "qualidade": "",
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
- `etapa` é a última etapa concluída ou em curso (1 ou 2 nesta versão).
- Escreva o JSON inteiro a cada item aceito. Arquivo pequeno, escrita barata, e não há fila para perder.

## `registro.md`

Gerado ao fechar a Etapa 2 (e regerado se a pessoa voltar e acrescentar). Estrutura, espelhando o Markdown que o app exporta:

```markdown
# Registro de riscos — <contexto>

**Sessão iniciada em:** <dd/mm/aaaa hh:mm>
**Conduzida por:** <nome>
**Versão das regras:** skill-riscos 0.1.0 · kernel em metodo/
**Etapas concluídas:** 1 Enquadrar · 2 Identificar. Pendentes: 3 Priorizar · 4 Responder · 5 Registrar.

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

> Origem: `humano` = enunciado do participante · `ia-aceito` = proposto pela IA e aceito sem alteração · `ia-ajustado` = proposto pela IA e alterado pelo participante. Nenhum item está priorizado, respondido ou validado — isso é das Etapas 3–5.
```

Enunciado na tabela = `Devido a <causa>, pode ocorrer <evento>, o que levaria a <efeito>`. Escape `|` dentro de célula como `\|`.

## Retomar

Se na ativação houver `sessoes/*/sessao.json` com `etapa` ≤ 2, ofereça retomar. Ao retomar:

1. Leia o `sessao.json` inteiro. Não leia o `registro.md` — ele é derivado.
2. Recarregue a `postura` e mantenha-a.
3. Reflita em poucas linhas onde parou: contexto, quantos itens, quais técnicas já rodaram (`tecnicasRodadas`), qual estava ativa.
4. Continue da técnica ativa se ela não secou, ou ofereça a próxima da combinação. Se `etapa` = 2 e a pessoa já tinha fechado, pergunte se quer acrescentar itens ou só regenerar o `registro.md`.
