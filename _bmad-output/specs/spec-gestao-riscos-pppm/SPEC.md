---
id: SPEC-gestao-riscos-pppm
companions:
  - ../../../metodo/tecnicas-identificacao.md
  - ../../../metodo/escalas-e-priorizacao.md
  - ../../../metodo/estrategias-de-resposta.md
  - ../../../metodo/governanca-hitl.md
  - ../../../metodo/glossario.md
sources:
  - ../../../material-fonte/aula1.txt
  - ../../../material-fonte/aula2.txt
  - ../../../material-fonte/WhatsApp Image 2026-08-21 at 12.37.26.jpeg
---

> **Contrato canônico.** Este SPEC e os arquivos em `companions:` são o contrato completo, validado por preservação, do que construir, testar e validar. Os documentos de origem no frontmatter servem à rastreabilidade — consultá-los apenas se for preciso a narrativa que este contrato omite de propósito.

# Gestão de Riscos PPPM — método e ferramenta

## Why

**Oportunidade a capturar, com prazo.** A disciplina *Formação de Consultores em IA Aplicada ao PPPM* (Prof. Dr. José Bezerra, BSBr) leva duas aulas construindo a tese de que "IA sem método vira ferramenta; IA com método vira valor", e encerra a Aula 2 anunciando que a próxima etapa é *desenho da solução, prompts, fluxos e implantação prática*. Existe portanto um público definido — consultores e alunos de PPPM, em maioria não-técnicos — com vocabulário comum já estabelecido, um entregável na mão (a matriz de priorização da Aula 2) e nenhuma ferramenta que continue o raciocínio.

O que existe hoje se divide entre planilhas mudas, que não conduzem ninguém pelo método, e suítes de PPPM pesadas demais para uma sessão de 15 minutos. Nenhuma das duas ensina a levantar risco; ambas assumem que a lista já existe. É exatamente a lacuna que a Aula 2 nomeia: *"o erro não é testar IA, é testar sem problema, sem dados e sem governança"*.

A ferramenta ocupa essa lacuna: conduz uma sessão de levantamento de riscos com rigor PMBOK, falando o vocabulário literal da sala de aula, sem exigir instalação nem que dado nenhum saia da máquina de quem usa.

## Capabilities

- **CAP-1** — Enquadrar o contexto
  - **intent:** O usuário preenche o mapa de 5 colunas da Aula 1 (Contexto, Dor, Dados, Riscos, Valor) para ancorar a sessão antes de qualquer identificação.
  - **success:** As 5 colunas preenchidas aparecem como cabeçalho do registro exportado; sessão sem contexto não avança para identificação.

- **CAP-2** — Identificar ameaças
  - **intent:** O usuário escolhe técnicas do catálogo e cada uma o conduz por perguntas concretas até produzir riscos estruturados.
  - **success:** Uma sessão com ao menos uma técnica gera ao menos três riscos, cada um com causa, evento e efeito em campos separados, no formato "Devido a… pode ocorrer… o que levaria a…".

- **CAP-3** — Identificar oportunidades
  - **intent:** As mesmas técnicas, com polaridade invertida, produzem riscos positivos no mesmo registro.
  - **success:** Um item de oportunidade percorre o fluxo completo até receber uma das cinco estratégias positivas do PMBOK.

- **CAP-4** — Analisar qualitativamente
  - **intent:** Cada item recebe Probabilidade e Impacto, e o sistema calcula severidade e faixa; iniciativas concorrentes são pontuadas pela fórmula da Aula 2.
  - **success:** A Régua A classifica em 🔴/🟡/🟢 pelas faixas definidas; a Régua B reproduz exatamente **89 / 82 / 79** para as entradas do Exemplo 1 (ERP) da Aula 2.

- **CAP-5** — Planejar respostas
  - **intent:** Cada item priorizado recebe estratégia, ação, dono, gatilho e risco residual.
  - **success:** Nenhum item de faixa alta chega ao registro exportado sem os cinco campos preenchidos.

- **CAP-6** — Aplicar o gate HITL
  - **intent:** O sistema impede a conclusão de qualquer item sem dono da decisão humana nomeado, e exige confirmação explícita nos gatilhos definidos.
  - **success:** Item sem dono aparece na seção `Pendente de dono` do registro e não pode ser marcado como concluído; os seis gatilhos de validação disparam confirmação.

- **CAP-7** — Exportar o registro
  - **intent:** O usuário leva o registro de riscos completo para fora da ferramenta, com a cadeia de rastreabilidade.
  - **success:** A exportação abre em Excel ou Sheets sem retrabalho e inclui os cinco elos Entrada → Processamento → Saída → Validação → Registro.

- **CAP-8** — Rodar sem instalação
  - **intent:** Um aluno não-técnico executa a sessão inteira pelo navegador, sem instalar nada e sem criar conta.
  - **success:** Abrir `docs/index.html` por duplo clique e abrir a URL do GitHub Pages produzem sessão funcionalmente idêntica, ambas sem requisição de rede em runtime.

- **CAP-9** — Rodar como skill consultiva
  - **intent:** O consultor executa o mesmo método dentro do Claude Code, com elicitação conversacional em vez de formulário.
  - **success:** A skill produz um registro com os mesmos campos e as mesmas fórmulas do app, a partir do mesmo kernel em `metodo/`, e funciona num clone do repositório sem BMad instalado.

## Constraints

- A skill (CAP-9) é **autônoma**: não depende de `_bmad/` nem de BMad instalado. Descarta invocar scripts do BMad em runtime.

- O app publicado é **um único arquivo HTML self-contained** em `docs/index.html`, servido pelo GitHub Pages a partir da pasta `/docs`: sem etapa de build, sem backend, sem CDN, sem requisição de rede em runtime. Descarta qualquer framework que exija compilação e qualquer dependência externa.
- **Nenhum dado do usuário sai da máquina**: sem telemetria, sem analytics, sem conta, sem envio a modelo externo. Persistência local apenas.
- A fórmula da Régua B é literalmente `((Impacto×30)+(Viabilidade×20)+(Dados×20)+(Segurança×15)+(Valor×15))÷5`, escala 1 baixa / 3 média / 5 alta. Deve reproduzir 89/82/79 no caso de verificação.
- As duas réguas permanecem **separadas** na interface e no registro: Régua A pontua riscos, Régua B pontua iniciativas. Uma tela que as misture está errada.
- A interface usa o **vocabulário literal da aula com o equivalente PMBOK entre parênteses** — nunca o inverso.
- Todo texto de interface e artefato em **Português do Brasil**.
- O catálogo de técnicas vive em **CSV** (`metodo/tecnicas.csv`), não hardcoded: adicionar técnica é acrescentar uma linha.
- O kernel em `metodo/` é a única fonte do método; app e skill consomem e **nunca redefinem**.
- Os slides do Prof. José Bezerra são propriedade dele: ficam gitignorados em `material-fonte/` e nunca entram no repositório público.

## Non-goals

- **Análise quantitativa** — Monte Carlo, VME, reserva de contingência calculada. Roadmap, citado no README.
- **Integração** com MS Project, Jira, Planner ou qualquer suíte de PPPM.
- **Decisão autônoma da IA.** A ferramenta organiza evidência e calcula; a assinatura é humana. É o princípio HITL da Aula 2 elevado a não-objetivo.
- **Multiusuário** — colaboração em tempo real, conta, sincronização em servidor.
- Os processos **Planejar o Gerenciamento de Riscos**, **Implementar Respostas** e **Monitorar os Riscos**. Roadmap.

## Success signal

Na apresentação de **22/08/2026**, um aluno da turma que nunca abriu um terminal acessa o link do GitHub Pages, roda uma sessão sobre um projeto real dele e sai com um registro de riscos exportado — em menos de 15 minutos, sem instalar nada, sem criar conta, e sem que nenhum dado saia da máquina dele.

## Assumptions

- A versão corrigida do slide do Exemplo 1 (imagem, com a caixa da fórmula) supera a versão em PDF quanto aos valores de prioridade. O método segue a fórmula, não os números impressos no PDF.
- Uma sessão de demonstração dispõe de ~15 minutos, o que limita a seleção padrão de técnicas às de esforço `baixo`.
- O público da apresentação conhece o vocabulário das Aulas 1 e 2, mas não necessariamente PMBOK formal.

## Open Questions

- **Divergência aritmética nos slides.** O PDF da Aula 2 traz 88/84/74 no Exemplo 1, enquanto a fórmula produz 89/82/79 (o que a imagem corrigida confirma). Os Exemplos 2 e 3 do PDF também divergem da fórmula. Como tratar isso na apresentação — silenciosamente pela fórmula, ou como demonstração explícita do valor de calcular de forma consistente?
- O registro exportado precisa de formato adicional além de planilha — PDF para comitê, ou Markdown para repositório?
