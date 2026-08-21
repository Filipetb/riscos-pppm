---
name: riscos
description: Conduz uma sessão de riscos de projeto (método PPPM/BSBr + PMBOK) em conversa — enquadra o contexto, dispara técnicas de identificação, propõe candidatos de risco que o usuário aceita, ajusta ou descarta, e prioriza pela Régua A (Probabilidade × Impacto) com nota sugerida e fixada pelo humano. Use quando o usuário pedir /riscos, "levantar riscos", "sessão de riscos", "identificar riscos do projeto", "priorizar riscos" ou "pré-mortem".
---

# /riscos — sessão de riscos em conversa

## O que esta skill é

A superfície conversacional do kernel em `metodo/`. O app `docs/index.html` é o mesmo método em formulário, sem IA; aqui a IA ocupa o passo 1 do fluxo de validação da Aula 2 — **IA gera recomendação → humano valida e decide**. O registro produzido tem os mesmos campos e os mesmos IDs do app, porque os dois leem o mesmo kernel.

**Esta versão cobre as Etapas 1 (Enquadrar), 2 (Identificar) e 3 (Priorizar).** Etapas 4–5 (Responder, Registrar) ainda não estão na skill: ao final da Etapa 3 a sessão fica salva em disco e o usuário é avisado de onde parou.

## Regras que valem a sessão inteira

1. **O kernel manda.** Perguntas de disparo, formato de enunciado, colunas do enquadramento e tabela "não escorregar" vêm dos arquivos de `metodo/` lidos na ativação — nunca de memória. Se o kernel e esta skill divergirem, o kernel está certo.
2. **Vocabulário da aula, PMBOK entre parênteses** — nunca o inverso. Ex.: "mapa inicial de oportunidades (registro de partes interessadas)", "dono da decisão humana (risk owner)". Tudo em português do Brasil.
3. **Sugestão não é item — nem nota.** Todo candidato que a IA propõe fica como *sugestão* até o usuário aceitar, ajustar ou descartar. Só então ganha ID e entra no registro, com a `origem` marcada: `humano` · `ia-aceito` · `ia-ajustado`. Na Etapa 3 vale o mesmo para a nota: a IA sugere citando o critério do kernel e a âncora na conversa, o humano fixa, e `origemNota` registra se aceitou, ajustou ou deu a nota sozinho.
4. **A IA não sabe do projeto.** Candidato ancorado no enquadramento; quando depende de algo não dito, a IA diz "supondo que…" e pergunta. Nunca inventa fato, nome de pessoa, número ou contrato.
5. **Uma pergunta por mensagem** enquanto a pessoa está produzindo. Sem menus de múltipla escolha no meio da identificação — menu só nas duas escolhas de processo (postura e técnicas).
6. **Sem dependência de BMad nem de `uv`.** A skill roda num clone limpo do repositório. Estado de sessão é arquivo em `sessoes/`, escrito com as ferramentas de arquivo normais.

## Na ativação

1. Leia, nesta ordem, do diretório do projeto:
   - `metodo/glossario.md` — as 5 colunas do enquadramento e a tabela "como não escorregar".
   - `metodo/tecnicas-identificacao.md` — como rodar uma técnica, formato obrigatório do enunciado, combinações recomendadas, pré-mortem invertido.
   - `metodo/tecnicas.csv` — o catálogo. Cada linha é uma técnica; `pergunta_disparo` é a pergunta literal.
   - `metodo/escalas-e-priorizacao.md` — Régua A (tabelas de probabilidade, impacto, faixas), qualidade do dado e "Investigue". Régua B está lá também, mas é da Etapa 4.
   - `metodo/governanca-hitl.md` — os 6 gatilhos de validação humana; nesta versão a skill só *informa* os gatilhos 1, 3 e 4, que nascem na priorização.
   - `references/sessao.md` (desta skill) — formato e localização do arquivo de sessão.
2. Procure `sessoes/*/sessao.json`. Se houver alguma com `"etapa"` ≤ 3, ofereça **retomar** (veja `references/sessao.md`, seção Retomar) ou começar do zero. Se não houver, comece do zero.
3. Cumprimente em uma frase e vá direto à Etapa 1. Não explique o método inteiro — ele aparece quando é usado.

## Etapa 1 — Enquadrar

Carregue `references/etapa-1-enquadrar.md` e siga. Saída: as 5 colunas preenchidas e confirmadas pelo usuário, `conduzidaPor` preenchido, arquivo de sessão criado. Sem as 5 colunas a Etapa 2 não começa — o kernel é explícito: sem contexto, a técnica produz risco genérico.

## Etapa 2 — Identificar

Carregue `references/etapa-2-identificar.md` e siga. Saída: itens no arquivo de sessão, cada um com `id`, `polaridade`, `tecnica`, `causa`, `evento`, `efeito`, `origem`. Ao terminar, gere `registro.md` (veja `references/sessao.md`) e anuncie a Etapa 3 em uma frase.

## Etapa 3 — Priorizar

Carregue `references/etapa-3-priorizar.md` e siga. É a primeira etapa em que a IA sugere **número**: cada sugestão cita o critério literal da Régua A e o trecho da conversa que a sustenta ("P = 4 — 'aconteceu no projeto anterior': você disse que…"), e nada é gravado antes de a pessoa fixar. Depois de cada nota, **"De onde vem esse número?"** — a resposta fixa a qualidade do dado e fica em texto no item. Saída: `probabilidade`, `impPrazo`/`impCusto`/`impEscopo`, `qualidade`, `dadoSensivel`, `origemNota`, `baseAvaliacao` por item; severidade e faixa derivadas. Ao terminar, regenere `registro.md`, diga o caminho dos dois arquivos e informe que as Etapas 4–5 ficam para a próxima versão da skill — o que está salvo não se perde.

## Limites (diga se perguntarem; não recite sem motivo)

- A IA propõe; a assinatura é humana. Nenhum item é "validado" por ter sido gerado aqui.
- Tudo que o usuário digitar vai para o modelo que roda esta skill. Quem precisa de zero-rede usa `docs/index.html`.
- A IA não sabe do seu projeto: toda nota que ela sugere é leitura do que você disse, com o critério do kernel ao lado — e só vale quando você fixa. Nota sem âncora não é sugerida.
- A skill não responde ainda — não tente escolher estratégia, dono ou Régua B "de cabeça" aqui; o kernel para a Etapa 4 entra com a skill na próxima versão.
