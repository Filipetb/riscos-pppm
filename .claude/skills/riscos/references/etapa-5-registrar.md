# Etapa 5 — Registrar

Objetivo: fechar o ciclo. Cada item sai com a **decisão da validação humana** (aceite ou ajuste), os que passam nos bloqueios são **encerrados** pela pessoa, e o registro é **exportado em CSV e Markdown** com os mesmos campos, as mesmas regras e o mesmo nome de arquivo do app `docs/index.html`. É a etapa de *governança / HITL* — os cinco elos da rastreabilidade (Entrada → Processamento → Saída → Validação → Registro) ficam completos aqui, e "um risco exportado sem essa cadeia é uma opinião com formatação bonita".

Tudo que é *método* aqui vem de `metodo/governanca-hitl.md` (corte obrigatório, fluxo de validação, rastreabilidade, limites). Este arquivo diz **como a conversa anda** — e delega o cálculo a um script, para que bloqueio, status e exportação sejam **determinísticos e idênticos aos do app**, não reconstruídos de cabeça.

## O script: `scripts/exportar.js`

Node puro, zero dependências (o Claude Code já roda em Node). Porta literal das funções do app: `bloqueiosDe`, `statusDe`, `gatilhosHITL`, `regrasConsistencia`, `linhaExport`, `gerarCSV`, `gerarMarkdown`, `nomeArquivo`. Três modos, sempre com o caminho do `sessao.json`:

| Comando | Para quê |
|---|---|
| `node .claude/skills/riscos/scripts/exportar.js status sessoes/<slug>/sessao.json` | JSON por item: `status`, `bloqueios` (texto do app), `gatilhos` com confirmação, `decisaoSugerida` (+ motivo), `podeEncerrar`, `soFaltaDecisao`; e listas `prontosParaEncerrar`, `soFaltaDecisao`, `bloqueados`, `pendentesDeDono`, `encerrados`. |
| `node .claude/skills/riscos/scripts/exportar.js exportar sessoes/<slug>/sessao.json` | Grava `registro-de-riscos-<slug>-AAAAMMDD-HHMM.csv` e `.md` na pasta da sessão (`--dir` muda o destino). Devolve os caminhos. |
| `node .claude/skills/riscos/scripts/exportar.js linha sessoes/<slug>/sessao.json R001` | A linha de exportação de um item, para conferir um campo com a pessoa. |

**Regra:** toda vez que precisar saber se um item pode ser encerrado, rode `status` e leia — não recalcule os bloqueios de cabeça. Toda vez que gravar `decisao`, `dono`, `confirmacoes` ou `encerrado`, rode `status` de novo antes de afirmar qualquer coisa. Se o script falhar (Node ausente, JSON inválido), diga o erro à pessoa e pare — não improvise a exportação à mão.

## O guardrail desta etapa

Aqui a IA não sugere conteúdo novo. Ela **propõe a decisão da validação humana a partir do que já está gravado** e **executa o encerramento e a exportação quando a pessoa manda**. Três regras:

1. **A decisão é assinatura.** `decisao` (`aceite` · `ajuste`) é o elo *Validação* ("humano aprova ou ajusta"). A IA propõe a partir de `origem` / `origemNota` / `origemResposta` — se qualquer um é `ia-ajustado`, a pessoa mexeu na recomendação → **ajuste**; se só há `ia-aceito` e `humano`, nada do que a IA propôs foi alterado → **aceite**. A proposta cita os elos ("ajuste — você alterou o enunciado e a resposta; a nota ficou como sugerida"). A pessoa confirma ou inverte; **só então** o campo é gravado. Item sem nenhuma sugestão da IA (tudo `humano`) é `aceite` — a recomendação aprovada como está é a própria formulação da pessoa; diga isso.
2. **Encerrar é ato da pessoa.** A IA mostra quem está pronto e pergunta; nunca encerra por inferência, por lote implícito ou porque "está tudo verde". Encerramento grava `encerrado: true` e `validadoEm: <ISO agora>`. Item que a pessoa **não** quis encerrar fica *Aberto* — é legítimo.
3. **Bloqueio não se contorna.** O que `status` lista em `bloqueios` é o que o app lista; a saída é voltar à etapa que resolve (dono e gatilho → Etapa 4; nota e qualidade → Etapa 3; enunciado → Etapa 2), gravar, e rodar `status` de novo. Dono *genérico* (área, equipe, sigla) **não bloqueia** no app nem aqui — mas sai com aviso em `observacao_dono` e no elo de Validação; lembre a pessoa disso uma vez antes de encerrar.

## 1. Abrindo a etapa

Uma mensagem:

- Diga o que muda: a sessão vira **registro** — decisão da validação humana por item, encerramento do que está pronto, e exportação. Cite o corte obrigatório literalmente: *"Se não houver dono da decisão humana, o caso não está pronto."* O corte bloqueia o encerramento, não o registro.
- Diga o fluxo de validação da Aula 2 (1. IA gera recomendação → 2. Consultor verifica → 3. Especialista valida → 4. Gestor decide e registra) e que **nesta sessão o passo 1 foi ocupado pela IA e os passos 2–4 colapsaram em quem conduz** — o registro vai dizer isso, não fingir que três pessoas validaram.
- Confirme `conduzidaPor` (está no arquivo desde a Etapa 1; se vazio, pergunte agora — uma linha).
- Registre `etapa: 5`, rode `status` e mostre o **painel de fechamento** (seção 2).

## 2. Painel de fechamento

Tabela a partir do `status`: `ID · Faixa · Status · Dono · Decisão sugerida (motivo) · Bloqueios`. Agrupe em três blocos, nesta ordem:

1. **Só falta a decisão** (`soFaltaDecisao`): passam em tudo; ao fixar aceite/ajuste ficam prontos.
2. **Prontos para encerrar** (`prontosParaEncerrar`): já têm decisão e nenhum bloqueio.
3. **Bloqueados** (`bloqueados` + `pendentesDeDono`): cada um com a lista de bloqueios do app, literalmente, e a etapa que resolve.

Uma pergunta ao final: *"Começo pelas decisões — uma a uma ou em lote?"*

## 3. Decisão da validação humana

**Um a um** (padrão com até 5 itens): por item, mostre o enunciado curto, as três origens e a proposta:

> **R001** — enunciado `ia-ajustado` · nota `ia-aceito` · resposta `ia-ajustado`.
> Proposta: **ajuste** — você alterou a sugestão da IA no enunciado e na resposta; a nota ficou como sugerida.
> Fixa assim?

**Em lote** (6+ itens, ou se a pessoa pedir): tabela `ID · origens · decisão proposta · motivo`, uma linha por item, e uma pergunta: *"Corrija as linhas que quiser — ID e decisão. O resto fixa como está."* Aceite em bloco sem ler → ofereça um a um.

Ao fixar, grave `decisao` no `sessao.json` (escreva o arquivo inteiro, como sempre). Postura "só perguntas": pergunte *"aceite ou ajuste?"* mostrando as origens, sem propor.

Se a pessoa discorda da proposta (ex.: quer `ajuste` num item todo `ia-aceito` porque "mexi na conversa e a IA só formalizou"), aceite: a decisão é dela. Não discuta.

## 4. Encerramento

Rode `status`. Mostre `prontosParaEncerrar` e pergunte: *"Encerro estes? Diga quais — ou 'todos'."* Para cada ID que a pessoa disser:

- `encerrado: true`, `validadoEm: <ISO agora>`. Grave.
- Se o dono é genérico (`donoEstado: "generico"`), diga **uma vez** antes: *"‹dono› parece área, não pessoa — o app aceita, a governança não. Encerro mesmo assim ou você troca pelo nome?"*

Para os **bloqueados**, por bloqueio:

| Bloqueio (texto do app) | O que fazer |
|---|---|
| Corte obrigatório — sem dono | Pergunte *"quem é a pessoa?"* (regra da Etapa 4: área e sigla não assinam). Se der o nome, grave e rode `status`. Se não, o item fica **Pendente de dono** — sai na seção própria do export, não se encerra. |
| Validação humana pendente (gatilhos) | Liste os gatilhos sem confirmação com o texto do kernel (estão em `gatilhos` no `status`) e peça confirmação explícita, como na Etapa 4. `confirmacoes.gN = <ISO>` só se a pessoa disser que confirma. |
| Regras 1, 2, 4, 5 | Diga qual campo falta (ação/gatilho/dono; justificativa; risco secundário avaliado; destinatário) e preencha com a pessoa — fluxo da Etapa 4 para aquele campo. |
| Sem priorização / sem qualidade | Volte ao fluxo por item da Etapa 3 para aquele item. |
| Enunciado incompleto | Pergunte a parte que falta (causa / evento / efeito) — Etapa 2. |
| Sem decisão | Seção 3. |

Depois de cada correção, `status` de novo; se ficou pronto, ofereça encerrar. Item que a pessoa **não quer** tratar agora fica como está — diga que ele sai no registro com o status e os bloqueios visíveis.

**Reabrir:** se a pessoa mudar qualquer campo de um item encerrado e ele voltar a falhar um bloqueio, o encerramento cai (`encerrado: false`, `validadoEm: ""`) — é o `revalidarEncerramento` do app. Diga que caiu e por quê.

## 5. Exportação

Quando a pessoa disser que está bom (não precisa estar tudo encerrado — registro com pendências visíveis é o caso normal):

1. Rode `exportar`. Dois arquivos na pasta da sessão: `registro-de-riscos-<slug>-AAAAMMDD-HHMM.csv` e `.md` — mesmo nome que o botão "Baixar" do app geraria.
2. Diga os caminhos e o resumo: N itens · N encerrados · N pendentes de dono · N abertos/bloqueados.
3. Diga, em duas linhas, o que é cada um: o **CSV** (`;`, BOM UTF-8, abre no Excel em português e no Sheets; fórmulas neutralizadas; as 51 colunas do app + `origem_item`, `origem_nota`, `base_avaliacao`, `origem_resposta` no fim) é o artefato auditável, uma linha por item com os cinco elos; o **Markdown** é o registro legível — enquadramento, validação humana, tabela de riscos, *Pendente de dono*, Régua B, pendências de replanejamento, riscos secundários, rastreabilidade item a item, limites.
4. Regenere também o `registro.md` da skill (`references/sessao.md`) com a seção da Etapa 5.
5. Encerre a sessão em uma mensagem: `etapa: 5` no arquivo, o que ficou pendente (por ID, com o motivo), e que a sessão pode ser retomada com `/riscos` a qualquer momento para tratar pendências e exportar de novo — cada export é um arquivo novo com a hora no nome; o anterior não é sobrescrito.

Se a pessoa quiser **reexportar** depois de mexer em algo: `exportar` de novo, sem cerimônia.

## Nunca

- Gravar `decisao` sem a pessoa fixar, ou encerrar item sem a pessoa dizer qual.
- Recalcular bloqueio, status ou Régua B de cabeça quando o `status` está a um comando de distância.
- Escrever o CSV ou o Markdown de exportação à mão — é o script que garante paridade com o app.
- Encerrar item sem dono, ou tratar dono genérico como se fosse pessoa sem avisar.
- Fingir que o fluxo de validação teve quatro pessoas: o registro diz que colapsou, e que a IA ocupou o passo 1.
- Dizer que "nenhum dado saiu da máquina": nesta superfície tudo passou pelo modelo. Quem precisa de zero-rede usa `docs/index.html`.
