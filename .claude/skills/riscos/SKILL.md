---
name: riscos
description: Conduz uma sessão de riscos de projeto (método PPPM/BSBr + PMBOK) em conversa, do enquadramento à exportação — enquadra o contexto, dispara técnicas de identificação, propõe candidatos de risco que o usuário aceita, ajusta ou descarta, prioriza pela Régua A (Probabilidade × Impacto) com nota sugerida e fixada pelo humano, planeja respostas (as dez estratégias, dono nomeado, gatilhos de validação humana confirmados) e registra (decisão da validação humana, encerramento com o corte obrigatório, exportação CSV/Markdown em paridade com o app). Use quando o usuário pedir /riscos, "levantar riscos", "sessão de riscos", "identificar riscos do projeto", "priorizar riscos", "responder aos riscos", "registro de riscos", "exportar riscos" ou "pré-mortem".
---

# /riscos — sessão de riscos em conversa

## O que esta skill é

A superfície conversacional do kernel em `metodo/`. O app `docs/index.html` é o mesmo método em formulário, sem IA embutida (nas Etapas 2, 3 e 4 ele tem um *modo assistido* por copiar-e-colar: gera o prompt, lê a resposta colada e deixa a pessoa aceitar candidato a candidato, nota a nota e resposta a resposta — mesmas regras de `origem`/`origemNota`/`origemResposta` desta skill, e os mesmos limites: dono nunca sugerido, gatilho HITL nunca confirmado pela IA); aqui a IA ocupa o passo 1 do fluxo de validação da Aula 2 — **IA gera recomendação → humano valida e decide**. O registro produzido tem os mesmos campos e os mesmos IDs do app, porque os dois leem o mesmo kernel.

**Esta versão cobre o ciclo inteiro: Etapas 1 (Enquadrar), 2 (Identificar), 3 (Priorizar), 4 (Responder) e 5 (Registrar).** A sessão fica salva em disco a cada passo e pode ser retomada em qualquer etapa — inclusive depois de exportada.

## Regras que valem a sessão inteira

1. **O kernel manda.** Perguntas de disparo, formato de enunciado, colunas do enquadramento e tabela "não escorregar" vêm dos arquivos de `metodo/` lidos na ativação — nunca de memória. Se o kernel e esta skill divergirem, o kernel está certo.
2. **Vocabulário da aula, PMBOK entre parênteses** — nunca o inverso. Ex.: "mapa inicial de oportunidades (registro de partes interessadas)", "dono da decisão humana (risk owner)". Tudo em português do Brasil.
3. **Sugestão não é item — nem nota.** Todo candidato que a IA propõe fica como *sugestão* até o usuário aceitar, ajustar ou descartar. Só então ganha ID e entra no registro, com a `origem` marcada: `humano` · `ia-aceito` · `ia-ajustado`. Na Etapa 3 vale o mesmo para a nota: a IA sugere citando o critério do kernel e a âncora na conversa, o humano fixa, e `origemNota` registra se aceitou, ajustou ou deu a nota sozinho. Na Etapa 4 vale para a resposta (`origemResposta`) — com duas exceções que nunca são sugeridas: **dono** (pessoa nomeada; a IA não sabe quem são as pessoas) e **confirmação de gatilho HITL** (só vale dita pela pessoa depois de ler o texto).
4. **A IA não sabe do projeto.** Candidato ancorado no enquadramento; quando depende de algo não dito, a IA diz "supondo que…" e pergunta. Nunca inventa fato, nome de pessoa, número ou contrato.
5. **Uma pergunta por mensagem** enquanto a pessoa está produzindo. Sem menus de múltipla escolha no meio da identificação — menu só nas duas escolhas de processo (postura e técnicas).
6. **Sem dependência de BMad nem de `uv`.** A skill roda num clone limpo do repositório. Estado de sessão é arquivo em `sessoes/`, escrito com as ferramentas de arquivo normais. A única execução é `node scripts/exportar.js` na Etapa 5 (Node já está onde o Claude Code roda; zero pacotes) — é ele que calcula bloqueios, status e exportação com as funções portadas do app, para que a paridade seja determinística.

## Na ativação

1. Leia, nesta ordem, do diretório do projeto:
   - `metodo/glossario.md` — as 5 colunas do enquadramento e a tabela "como não escorregar".
   - `metodo/tecnicas-identificacao.md` — como rodar uma técnica, formato obrigatório do enunciado, combinações recomendadas, pré-mortem invertido.
   - `metodo/tecnicas.csv` — o catálogo. Cada linha é uma técnica; `pergunta_disparo` é a pergunta literal.
   - `metodo/escalas-e-priorizacao.md` — Régua A (tabelas de probabilidade, impacto, faixas), qualidade do dado e "Investigue". Régua B está lá também, mas é da Etapa 4.
   - `metodo/governanca-hitl.md` — corte obrigatório (dono é pessoa nomeada), os 6 gatilhos de validação humana, fluxo de validação e rastreabilidade. Na Etapa 3 os gatilhos 1, 3 e 4 são *informados*; na Etapa 4 todos os que dispararem são *confirmados* explicitamente.
   - `metodo/estrategias-de-resposta.md` — as dez estratégias com pergunta de escolha, os cinco campos obrigatórios da resposta, as cinco regras de consistência.
   - `references/sessao.md` (desta skill) — formato e localização do arquivo de sessão.
2. Procure `sessoes/*/sessao.json`. Se houver alguma, ofereça **retomar** (veja `references/sessao.md`, seção Retomar — vale também para sessão já na Etapa 5, que pode ser reaberta para tratar pendências e reexportar) ou começar do zero. Se não houver, comece do zero.
3. Cumprimente em uma frase e vá direto à Etapa 1. Não explique o método inteiro — ele aparece quando é usado.

## Etapa 1 — Enquadrar

Carregue `references/etapa-1-enquadrar.md` e siga. Saída: as 5 colunas preenchidas e confirmadas pelo usuário, `conduzidaPor` preenchido, arquivo de sessão criado. Sem as 5 colunas a Etapa 2 não começa — o kernel é explícito: sem contexto, a técnica produz risco genérico.

## Etapa 2 — Identificar

Carregue `references/etapa-2-identificar.md` e siga. Saída: itens no arquivo de sessão, cada um com `id`, `polaridade`, `tecnica`, `causa`, `evento`, `efeito`, `origem`. Ao terminar, gere `registro.md` (veja `references/sessao.md`) e anuncie a Etapa 3 em uma frase.

## Etapa 3 — Priorizar

Carregue `references/etapa-3-priorizar.md` e siga. É a primeira etapa em que a IA sugere **número**: cada sugestão cita o critério literal da Régua A e o trecho da conversa que a sustenta ("P = 4 — 'aconteceu no projeto anterior': você disse que…"), e nada é gravado antes de a pessoa fixar. Depois de cada nota, **"De onde vem esse número?"** — a resposta fixa a qualidade do dado e fica em texto no item. Saída: `probabilidade`, `impPrazo`/`impCusto`/`impEscopo`, `qualidade`, `dadoSensivel`, `origemNota`, `baseAvaliacao` por item; severidade e faixa derivadas. Ao terminar, regenere `registro.md` e anuncie a Etapa 4 em uma frase.

## Etapa 4 — Responder

Carregue `references/etapa-4-responder.md` e siga. A IA sugere **estratégia** pela pergunta de escolha do kernel ("Dá para diminuir a chance ou o estrago?") e rascunha ação, gatilho e residual ancorados — mas **nunca sugere dono** (só pergunta "quem é a pessoa?" e aplica o corte: área, equipe e sigla não assinam) e **nunca marca gatilho HITL confirmado** sem a pessoa dizer que confirma depois de ler o texto. "E o que essa ação pode causar?" é obrigatória; risco secundário vira item novo. Régua B só se respostas concorrem pelo mesmo orçamento ou pessoa. Saída: `estrategia`, `acao`, `dono`, `gatilho`, `residual`, condicionais (`justificativa`/`destinatario`/`replanejamento`), `riscoSecundario*`, `promovidoPara`, `confirmacoes`, `origemResposta`, opcionalmente `b*`. Ao terminar, regenere `registro.md` e anuncie a Etapa 5 em uma frase.

## Etapa 5 — Registrar

Carregue `references/etapa-5-registrar.md` e siga. A IA **propõe a decisão da validação humana** a partir do que já está gravado — qualquer `ia-ajustado` em `origem`/`origemNota`/`origemResposta` → `ajuste`; só `ia-aceito`/`humano` → `aceite` — e a pessoa fixa. Bloqueios de encerramento, status e exportação vêm de `node .claude/skills/riscos/scripts/exportar.js status|exportar sessoes/<slug>/sessao.json`, porte literal das funções do app: nunca recalcule de cabeça, nunca escreva o CSV à mão. **Encerrar é ato da pessoa** (`encerrado`, `validadoEm`), só com zero bloqueios; item sem dono fica *Pendente de dono* e sai na seção própria do export. A exportação gera `registro-de-riscos-<slug>-AAAAMMDD-HHMM.csv` (51 colunas do app + 4 da skill; `;`, BOM, fórmulas neutralizadas) e `.md` (mesmas seções do app) na pasta da sessão, e o registro **diz** que a IA ocupou o passo 1 do fluxo de validação e que os passos 2–4 colapsaram em quem conduz. Saída: `decisao`, `encerrado`, `validadoEm` por item; dois arquivos exportados; `registro.md` regenerado; `etapa: 5`.

## Limites (diga se perguntarem; não recite sem motivo)

- A IA propõe; a assinatura é humana. Nenhum item é "validado" por ter sido gerado aqui.
- Tudo que o usuário digitar vai para o modelo que roda esta skill. Quem precisa de zero-rede usa `docs/index.html`.
- A IA não sabe do seu projeto: toda nota que ela sugere é leitura do que você disse, com o critério do kernel ao lado — e só vale quando você fixa. Nota sem âncora não é sugerida.
- Dono a IA não sugere, gatilho de validação humana ela não confirma, e item ela não encerra — os três são assinatura. Item sem pessoa nomeada fica registrado como *Pendente de dono* e não pode ser encerrado; a lacuna sai visível no export, não silenciosa.
- O registro exportado diz a verdade sobre a sessão: a IA ocupou o passo 1 do fluxo de validação, os passos 2–4 colapsaram em quem conduz, e tudo que foi digitado passou pelo modelo.
