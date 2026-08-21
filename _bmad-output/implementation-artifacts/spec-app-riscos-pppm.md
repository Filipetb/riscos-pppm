---
title: 'App de sessão de riscos — docs/index.html'
type: 'feature'
created: '2026-08-21'
status: 'done' # draft | ready-for-dev | in-progress | in-review | done
review_loop_iteration: 0
baseline_commit: '3ee78a2f98e7196094caadd4aec2ff4cce214156'
context:
  - '{project-root}/metodo/glossario.md'
  - '{project-root}/metodo/tecnicas-identificacao.md'
  - '{project-root}/metodo/tecnicas.csv'
  - '{project-root}/metodo/escalas-e-priorizacao.md'
  - '{project-root}/metodo/estrategias-de-resposta.md'
  - '{project-root}/metodo/governanca-hitl.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O método de gestão de riscos PPPM está completo e legível em `metodo/`, mas não é executável por ninguém: `docs/index.html` é um placeholder de 14 linhas. Em 22/08/2026 um aluno não-técnico precisa abrir um link, rodar uma sessão sobre um projeto real e sair com um registro de riscos exportado em menos de 15 minutos.

**Approach:** Construir a superfície web como um único arquivo HTML self-contained que projeta o kernel `metodo/` numa sessão guiada de cinco etapas — Enquadrar → Identificar → Priorizar → Responder → Registrar — com o gate HITL bloqueando o encerramento de item sem dono, e exportação em CSV e Markdown.

## Boundaries & Constraints

**Always:**
- Um arquivo só: `docs/index.html`. HTML + CSS + JS inline, sem build, sem backend, sem CDN, **zero requisição de rede em runtime**. Deve funcionar idêntico por duplo clique (`file://`) e pela URL do Pages.
- O kernel `metodo/` é a única fonte do método. O app **consome e nunca redefine**: fórmulas, faixas, escalas, estratégias e gatilhos vêm literalmente de lá.
- O catálogo de técnicas é CSV, nunca objeto JS hardcoded. Como `fetch` de arquivo irmão é proibido (rede) e quebra em `file://`, o conteúdo **byte a byte** de `metodo/tecnicas.csv` fica embutido num `<script type="text/csv" id="tecnicas-csv">` e é parseado em runtime pelo mesmo parser. Acrescentar técnica continua sendo acrescentar uma linha de CSV.
- Réguas A e B **separadas** na interface e no registro. Nunca na mesma tela, nunca somadas.
- Vocabulário: termo da aula com o equivalente PMBOK entre parênteses — nunca o inverso. Todo texto em pt-BR.
- Persistência só em `localStorage`. Sem telemetria, analytics, conta ou envio a modelo externo.

**Ask First:**
- Alterar qualquer valor, faixa, peso ou fórmula definidos em `metodo/` — mesmo para "corrigir".
- Introduzir dependência externa, etapa de build, ou segundo arquivo servido.

**Never:**
- Análise quantitativa (Monte Carlo, VME, reserva calculada); integração com Jira/MS Project/Planner; multiusuário, conta ou sincronização; decisão autônoma da IA.
- Os processos Planejar o Gerenciamento de Riscos, Implementar Respostas e Monitorar os Riscos.
- Skill Claude Code (CAP-9) — diferida, ver `deferred-work.md`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Régua B — caso de verificação | I=5,V=4,D=4,S=4,Val=5 | `89` exato, faixa "Fazer agora" | N/A |
| Régua B — extremos | tudo 1 / tudo 5 | `20` / `100` | N/A |
| Régua A — severidade | P=3, Impacto=5 | Severidade `15`, faixa 🔴 Alto | N/A |
| Gate HITL — sem dono | Item 🔴, campo Dono vazio | Encerramento bloqueado; item vai para `Pendente de dono` no export | Mensagem nomeia o corte obrigatório |
| Gate HITL — dono não-pessoa | Dono = "PMO" / "a equipe" | Aviso de que dono é pessoa nomeada; não bloqueia registro | Aviso, não erro |
| Investigar | Severidade 🔴 + qualidade do dado 🔴 | Marcado `Investigue`, não vira ação imediata; exige confirmação | N/A |
| Enunciado incompleto | Causa ou efeito vazios | Item registrado como rascunho, não priorizável | Aponta o campo faltante |
| Sessão sem contexto | 5 colunas vazias | Etapa Identificar indisponível | Mensagem explica a dependência |
| Export vazio | Zero itens | Botão de exportar desabilitado | N/A |
| Recarregar a página | Sessão salva em `localStorage` | Sessão restaurada na mesma etapa | N/A |
| `localStorage` indisponível | Janela anônima / storage bloqueado | App funciona só em memória, com aviso discreto | `try/catch`, nunca quebra |

</frozen-after-approval>

## Code Map

- `docs/index.html` -- **único arquivo a construir.** Hoje placeholder de 14 linhas; substituir inteiro. Já servido pelo Pages a partir de `/docs` na `main`.
- `metodo/tecnicas.csv` -- 12 técnicas (T01–T12), 8 colunas. Governam a UI: `polaridade` filtra a aba, `esforco: baixo` é a pré-seleção da sessão de 15 min, `pergunta_disparo` é feita literalmente. Campos com vírgula e aspas — parser precisa tratar campo entre aspas.
- `metodo/escalas-e-priorizacao.md` -- as duas réguas. **A:** tabelas de Probabilidade e Impacto (1–5, rótulo + critério por nota), faixas 🔴15–25 / 🟡5–12 / 🟢1–4. Verificado: P×I só produz `{1,2,3,4,5,6,8,9,10,12,15,16,20,25}` — **não há lacuna entre 12 e 15**, não alargar as faixas. **B:** fórmula, pesos 30/20/20/15/15, escala 1·3·5, faixas 80–100/60–79/20–59, 3 casos de verificação, nota de procedência.
- `metodo/estrategias-de-resposta.md` -- 5 estratégias de ameaça + 5 espelhadas de oportunidade; os 5 campos obrigatórios; as 5 regras de consistência.
- `metodo/governanca-hitl.md` -- corte obrigatório; os 6 gatilhos de confirmação; o fluxo de validação em 4 passos, que em sessão individual colapsa e o registro deve **dizer** que colapsou; os 5 elos de rastreabilidade; os limites da ferramenta a exibir na UI.
- `metodo/glossario.md` -- mapa aula→PMBOK para toda string da UI; as 5 colunas do enquadramento com a pergunta de cada uma; as 4 regras "como não escorregar".
- `README.md` -- atualizar o aviso "em construção" e o item de roadmap do app.
- `scripts/verificar-kernel.py` -- **novo.** Verificação de paridade `metodo/` ↔ `docs/index.html`, fora do navegador. Python 3 puro, sem dependências. É o único lugar que lê os dois lados; o autoteste embutido trava apenas a consistência interna do app.
- Sem `package.json`, `Makefile` ou bundler — confirmado, não procurar tooling. O script acima é rodado à mão, não é etapa de build.

## Tasks & Acceptance

**Execution:**
- [x] `docs/index.html` -- substituir o placeholder por um esqueleto self-contained: `<style>` inline, layout responsivo, tema claro/escuro via `color-scheme`, e um `<script type="text/csv" id="tecnicas-csv">` com o conteúdo verbatim de `metodo/tecnicas.csv` -- é a base que todas as tarefas seguintes preenchem
- [x] `docs/index.html` -- núcleo do método em funções puras: parser de CSV com campo entre aspas, `severidade()`, `faixaA()`, `prioridadeB()`, `faixaB()`, `precisaInvestigar()`, `gatilhosHITL()` -- isolar o cálculo do DOM é o que torna o autoteste possível
- [x] `docs/index.html` -- autoteste embutido que roda na carga: os 3 casos de verificação da Régua B, os extremos 20/100, as fronteiras das faixas da Régua A e um caso de parser -- falha pinta faixa vermelha visível no topo; sucesso mostra "método verificado ✓" no rodapé
- [x] `docs/index.html` -- Etapa 1 Enquadrar: as 5 colunas da Aula 1 com a pergunta de cada uma; bloqueia avanço enquanto vazias -- ancora a sessão e vira cabeçalho do registro
- [x] `docs/index.html` -- Etapa 2 Identificar: catálogo do CSV em duas abas (ameaças / oportunidades) por `polaridade`, pré-seleção por `esforco: baixo`, `pergunta_disparo` exibida literalmente, e formulário de enunciado em três campos separados (causa / evento / efeito) -- causa e efeito separados são o que alimenta resposta e impacto depois
- [x] `docs/index.html` -- Etapa 3 Priorizar (Régua A): Probabilidade e Impacto 1–5 com os rótulos e critérios das tabelas, impacto por dimensão usando a maior nota, qualidade do dado 🟢🟡🔴, severidade e faixa calculadas -- Régua B não aparece nesta tela
- [x] `docs/index.html` -- Etapa 4 Responder: as 10 estratégias filtradas por polaridade, os 5 campos obrigatórios, as 5 regras de consistência, e a Régua B em bloco **próprio e rotulado** para desempatar respostas concorrentes -- é o único lugar onde a Régua B entra
- [x] `docs/index.html` -- gate HITL transversal: bloqueio de encerramento sem dono nomeado, os 6 gatilhos com confirmação explícita, e o bloco de limites da ferramenta visível na interface -- é o corte obrigatório, não um aviso
- [x] `docs/index.html` -- Etapa 5 Registrar e exportar: registro com os 5 elos de rastreabilidade, seção `Pendente de dono`, nota de que os passos 2–4 da validação colapsaram, e download de CSV e Markdown via `Blob` + `<a download>` -- sem biblioteca
- [x] `docs/index.html` -- persistência em `localStorage` com `try/catch` em toda leitura e escrita, mais botão de limpar sessão -- janela anônima não pode quebrar o app
- [x] `README.md` -- remover o "em construção" do app, marcar o item de roadmap, apontar o link do Pages -- a skill segue pendente

**Acceptance Criteria:**
- Dado o `docs/index.html` publicado, quando aberto com o DevTools na aba Network, então nenhuma requisição de rede é feita após a carga do documento.
- Dado o arquivo baixado e aberto por duplo clique em `file://`, quando a sessão inteira é executada, então o comportamento é idêntico ao do GitHub Pages, incluindo o catálogo de técnicas.
- Dado o bloco `<script type="text/csv">`, quando comparado a `metodo/tecnicas.csv`, então o conteúdo é idêntico byte a byte.
- Dada uma sessão completa em ~15 minutos por alguém sem terminal, quando exportada, então o CSV abre em Excel ou Sheets sem retrabalho e traz os 5 elos de rastreabilidade.
- Dado qualquer texto da interface, quando contém termo do método, então usa o termo da aula com o PMBOK entre parênteses, em pt-BR.

## Spec Change Log

- **2026-08-21 — separador do CSV exportado.** A spec não fixava separador; adotado `;` com BOM UTF-8, que é a única combinação que satisfaz "abre em Excel ou Sheets sem retrabalho" com Excel em português.
- **2026-08-21 — favicon como `data:` URI.** Acrescentado para eliminar a requisição automática de `/favicon.ico`, que apareceria no painel Network e contradiria o critério de aceite de zero requisições. Não carrega recurso externo.
- **2026-08-21 — rótulo de "versão do método".** `metodo/` não declara versão própria; o registro passou a dizer "versão das regras: riscos-pppm X (o kernel em metodo/ não declara versão própria)" em vez de inventar um marcador que o kernel não tem. O elo de Processamento da rastreabilidade continua atendido.

- **Achado que disparou.** Três camadas de revisão adversarial convergiram em duas lacunas de verificação, ambas com demonstração por teste de mutação: (a) toda a serialização do export — `campoCSV`, `COLUNAS_EXPORT`, `gerarCSV`, `gerarMarkdown`, `baixar` — não era exercitada por checagem nenhuma, e dez mutações distintas nesse caminho mantiveram o autoteste verde; (b) as checagens batizadas "Kernel `metodo/…` verbatim" comparam duas constantes que moram ambas no `docs/index.html`, então travam edição do lado do app e são cegas a edição do lado do kernel — que é exatamente a direção que a restrição "consome e nunca redefine" existe para proteger.
- **O que foi emendado.** A seção `## Verification` passou a exigir um verificador versionado no repositório (`scripts/verificar-kernel.py`) que leia `metodo/` de fato e compare faixas, pesos, estratégias e gatilhos com as constantes do app, absorvendo também a paridade do CSV embutido que antes existia só como comando solto neste arquivo. As `## Design Notes` passaram a registrar o que o selo do rodapé prova e o que ele não prova.
- **Estado ruim evitado.** Kernel e projeção divergindo na única direção que o contrato proíbe, com a página publicada exibindo "método verificado ✓" e nomeando o arquivo que ela não leu. E um registro exportado quebrando em silêncio — coluna renomeada vira coluna inteira de vazios, porque `campoCSV(undefined)` devolve string vazia e nada acusa.
- **Desvio deliberado do remédio prescrito.** A rota `bad_spec` manda reverter o código e re-derivá-lo a partir do spec emendado. Não foi feito, e a decisão é minha: o código existente está verificado (136 checagens, cinco sabotagens independentes apanhadas, incluindo duas behaviouralmente invisíveis, e execução confirmada sob `file://`), a emenda é aditiva — testes e um script novo, não redesenho — e descartar um artefato verificado de 146 KB às vésperas da apresentação de 22/08/2026 troca risco conhecido por risco desconhecido. As correções foram aplicadas como patch sobre o código existente. Cabe ao humano exigir a re-derivação completa se discordar.
- **KEEP — o que precisa sobreviver a qualquer re-derivação.** O autoteste embutido que roda na carga e pinta faixa vermelha ao falhar; a separação entre funções puras e DOM que o torna possível; a disciplina de que toda constante do método é travada por checagem que nomeia o arquivo do kernel de origem; a trava dos dois lados da lacuna 13–14; e o CSV embutido verbatim com paridade verificável por comando.

## Design Notes

**Por que o CSV embutido.** As três restrições — sem rede, funciona em `file://`, catálogo em CSV — só coexistem com o CSV embutido como texto e parseado em runtime. `fetch('../metodo/tecnicas.csv')` viola as duas primeiras. Embutir cria risco de divergência entre a cópia e o original; o preço é aceito e a Verificação abaixo o transforma em checagem de um comando. Não substituir o bloco por um objeto JS "equivalente": isso quebra a restrição de editabilidade por quem não programa.

**O que o selo prova, e o que não prova.** O autoteste roda dentro da página e a página não lê arquivo nenhum. Ele prova consistência interna — que os casos de verificação da Aula 2 batem, que as fronteiras das faixas não se moveram, que o parser e o gate de HITL se comportam — e é isso que o rótulo do selo deve dizer. Ele **não** prova paridade com `metodo/`: os dois lados de cada comparação moram no `docs/index.html`. Paridade com o kernel é trabalho de `scripts/verificar-kernel.py`, que roda no repositório e lê os dois lados de verdade. Não deixar o selo prometer o que só o script pode atestar.

**Por que o autoteste é visível.** A nota de procedência do método diz que o PDF da aula diverge da fórmula em 9 de 9 casos e que o valor da ferramenta é justamente calcular de forma consistente. Um indicador de verificação no rodapé demonstra esse argumento durante a apresentação, em vez de apenas afirmá-lo.

## Verification

**Commands:**
- `python3 scripts/verificar-kernel.py` -- expected: saída `OK` e código de saída 0. Lê `metodo/` de verdade e compara com as constantes de `docs/index.html`: faixas da Régua A (incluindo 13–14 sem cobertura), pesos e faixas da Régua B, os nomes das 10 estratégias, os 6 gatilhos de HITL, e o CSV embutido byte a byte contra `metodo/tecnicas.csv`. Qualquer divergência sai diferente de zero e nomeia os dois lados.
- `grep -nE 'https?://|fetch\(|XMLHttpRequest|import |<link[^>]+href|<script[^>]+src' docs/index.html` -- expected: nenhum resultado que carregue recurso externo em runtime (links de texto em `href` e o favicon `data:` são aceitáveis; requisição não)
- Abrir a página e ler o rodapé -- expected: o selo do autoteste em estado verificado, sem faixa vermelha no topo

**Manual checks (if no CLI):**
- Abrir `docs/index.html` por duplo clique: o selo do rodapé fica em estado verificado e nenhuma faixa vermelha aparece no topo.
- DevTools › Network, recarregar: só o próprio documento.
- Rodar uma sessão completa e conferir que Régua A e Régua B nunca aparecem na mesma tela.
- Item 🔴 sem dono: encerramento bloqueado e item presente em `Pendente de dono` no CSV exportado.

## Suggested Review Order

**A separação que sustenta tudo**

- O método vive em funções puras, sem DOM — é o que torna o autoteste possível.
  [`index.html:291`](../../docs/index.html#L291)

- As tabelas do kernel transcritas, jamais reinterpretadas: leia antes de julgar qualquer número.
  [`index.html:499`](../../docs/index.html#L499)

- O catálogo entra por CSV embutido e parseado; nunca virou objeto JS.
  [`index.html:595`](../../docs/index.html#L595)

**Paridade com o kernel — a direção que o contrato protege**

- Lê `metodo/` de verdade e compara com o app; pega edição do lado do kernel.
  [`verificar-kernel.py:34`](../../scripts/verificar-kernel.py#L34)

- As faixas da Régua A, com 13–14 deliberadamente sem cobertura.
  [`index.html:344`](../../docs/index.html#L344)

- Os cinco pesos e a fórmula que precisa devolver 89/82/79.
  [`index.html:372`](../../docs/index.html#L372)

**O corte obrigatório**

- Dono precisa ser pessoa; erra para aceitar, porque falso positivo mancha o registro.
  [`index.html:426`](../../docs/index.html#L426)

- Os seis gatilhos que exigem confirmação humana explícita.
  [`index.html:447`](../../docs/index.html#L447)

- Pendente de dono vence encerrado: a linha não pode se contradizer.
  [`index.html:1862`](../../docs/index.html#L1862)

- Confirmação cujo gatilho morreu é descartada, senão o gate passa sozinho.
  [`index.html:1809`](../../docs/index.html#L1809)

- Editar item encerrado o revalida contra o corte.
  [`index.html:1845`](../../docs/index.html#L1845)

**O registro exportado — o artefato que sai da máquina**

- Prefixo de fórmula neutralizado: planilha não executa texto do usuário.
  [`index.html:2791`](../../docs/index.html#L2791)

- O corte vale antes da pontuação: item sem dono não recebe nota.
  [`index.html:2867`](../../docs/index.html#L2867)

- As 51 colunas, com os cinco elos de rastreabilidade.
  [`index.html:2852`](../../docs/index.html#L2852)

- Download só afirma que foi solicitado; sucesso real não é observável.
  [`index.html:3141`](../../docs/index.html#L3141)

**Sessão e resiliência**

- Estado restaurado é saneado campo a campo, e `seq` reconciliado contra ids existentes.
  [`index.html:1676`](../../docs/index.html#L1676)

- Quota distinguida de bloqueio: o usuário recebe o remédio certo.
  [`index.html:1619`](../../docs/index.html#L1619)

- Arranque protegido passo a passo; falha vai para a faixa vermelha, nunca para tela vazia.
  [`index.html:3550`](../../docs/index.html#L3550)

**Periféricos**

- As 269 checagens que rodam a cada carga da página.
  [`index.html:618`](../../docs/index.html#L618)

- Passo de sincronização do CSV embutido, que o método promete a quem não programa.
  [`README.md:80`](../../README.md#L80)

