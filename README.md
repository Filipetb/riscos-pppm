# riscos-pppm

**Levantamento de riscos de projeto com método PMBOK — sem instalar nada, sem que nenhum dado saia da sua máquina.**

Uma sessão guiada que leva você de "não sei quais são meus riscos" a um registro de riscos exportado, em cerca de 15 minutos. Feito para quem gerencia projetos, programas e portfólios — não para quem programa.

**➤ [Abrir a sessão de riscos](https://filipetb.github.io/riscos-pppm/)** — roda no navegador, offline, sem instalar nada.

> O método (`metodo/`) e a interface web (`docs/index.html`) estão prontos. A skill do Claude Code (`/riscos`) cobre o ciclo inteiro, Etapas 1–5 (Enquadrar, Identificar, Priorizar, Responder e Registrar), com exportação CSV/Markdown em paridade com o app.

---

## Por que existe

Ferramentas de risco assumem que você já tem a lista. Planilha não conduz ninguém, e suíte de PPPM é pesada demais para uma sessão de meia hora. Falta a parte difícil: **como descobrir os riscos que você ainda não enxergou.**

Este projeto empacota as técnicas de identificação do PMBOK em perguntas concretas que qualquer pessoa consegue responder, calcula a priorização de forma consistente, e obriga a definir quem decide antes de encerrar.

## Como usar

**Pelo navegador** — abra <https://filipetb.github.io/riscos-pppm/>. Para usar offline, baixe o arquivo por [este link direto](https://raw.githubusercontent.com/Filipetb/riscos-pppm/main/docs/index.html) (clique com o botão direito → *Salvar link como…*) e dê duplo clique nele. Um arquivo só: sem build, sem servidor, sem conta.

A sessão guiada vai de Enquadrar a Registrar em cinco etapas, bloqueia o encerramento de item sem dono, e exporta o registro em CSV e em Markdown. Na Etapa 2 há um **modo assistido** opcional, por copiar-e-colar: o app monta um prompt com o enquadramento, a pergunta de disparo literal da técnica escolhida e as regras do método (formato causa → evento → efeito, "não escorregar", nada de nota, estratégia ou dono), você leva ao modelo de IA da sua assinatura (ChatGPT, Claude, Gemini…), cola a resposta de volta, e cada candidato entra no registro **só quando você aceitar** — um a um, editável, com a origem marcada (`ia-aceito` / `ia-ajustado`) no cartão, no CSV e no Markdown. Na Etapa 3 o mesmo contrato vale para a **nota**: o prompt leva as escalas literais da Régua A e o modelo devolve P e Impacto por dimensão **com critério citado e âncora** (ou “?” onde não há base; P = 4/5 só com fato dito); você lê e clica *Usar estas notas* — ainda editável —, responde “de onde vem esse número?” (a base da avaliação fica no registro) e fixa a qualidade do dado, que o modelo nunca sugere. Severidade e faixa continuam calculadas pelo app. A página continua sem fazer nenhuma requisição: o que sai, sai pela sua mão. A sessão fica no `localStorage` do seu navegador — recarregar a página não perde o trabalho.

**No Claude Code** — clonar o repositório, abrir o Claude Code na pasta e rodar `/riscos`. Mesmo método, com elicitação conversacional em vez de formulário: a IA faz a pergunta de disparo da técnica, estrutura o que você responde no formato causa → evento → efeito e, se você quiser, propõe candidatos ancorados no seu contexto para você aceitar, ajustar ou descartar. Cada item sai marcado com a origem (`humano`, `ia-aceito`, `ia-ajustado`). Na priorização a IA sugere a nota citando o critério do kernel e o trecho da conversa que a sustenta ("P = 4 — aconteceu no projeto anterior"), você fixa, e ela pergunta *de onde vem esse número* — a resposta vira a qualidade do dado. Na resposta ela sugere estratégia pela pergunta de escolha do kernel e rascunha ação, gatilho e residual — mas nunca sugere dono (pessoa nomeada é assinatura) e nunca confirma gatilho de validação humana por você. No registro ela propõe a decisão da validação humana a partir das origens (algo `ia-ajustado` → ajuste; só `ia-aceito`/`humano` → aceite), você fixa, encerra o que passa nos mesmos bloqueios do app (o corte obrigatório incluído) e exporta CSV e Markdown com as mesmas colunas, as mesmas regras e o mesmo nome de arquivo do app — mais quatro colunas de origem que só a skill tem. A sessão fica em `sessoes/<slug>/` (gitignorado) e pode ser retomada em qualquer etapa.

Ambos produzem o mesmo registro, com os mesmos campos e as mesmas fórmulas, porque leem o mesmo kernel.

## Privacidade

**Nada sai da sua máquina.** Sem servidor, sem conta, sem telemetria, sem analytics, sem envio a modelo externo. A página não faz uma única requisição de rede depois de carregada — dá para desligar a internet e continuar trabalhando.

Isso não é um detalhe técnico: é o requisito de governança de quem lida com dados de projeto sob sigilo contratual ou LGPD.

## O método

O que a ferramenta faz, e onde cada parte se ancora no PMBOK:

| Etapa | Processo PMBOK | Documentação |
|---|---|---|
| Enquadrar o contexto | — | [`glossario.md`](metodo/glossario.md) |
| Identificar ameaças e oportunidades | Identificar os Riscos | [`tecnicas-identificacao.md`](metodo/tecnicas-identificacao.md) |
| Priorizar | Realizar a Análise Qualitativa | [`escalas-e-priorizacao.md`](metodo/escalas-e-priorizacao.md) |
| Responder | Planejar as Respostas | [`estrategias-de-resposta.md`](metodo/estrategias-de-resposta.md) |
| Validar e registrar | Governança / HITL | [`governanca-hitl.md`](metodo/governanca-hitl.md) |

### Um kernel, duas superfícies

```
metodo/          ← o método: markdown + CSV, sem código
   │
   ├──► docs/index.html      ← navegador, offline, zero instalação
   └──► .claude/skills/      ← Claude Code, para consultores
```

O método é a única fonte de verdade. As interfaces consomem e nunca redefinem. Isso significa que **você pode adaptar o método sem saber programar**: acrescentar uma técnica de identificação é acrescentar uma linha em [`metodo/tecnicas.csv`](metodo/tecnicas.csv).

### Duas réguas, não uma

| | Régua A · Probabilidade × Impacto | Régua B · fórmula da Aula 2 |
|---|---|---|
| Prioriza | Riscos | Iniciativas e respostas |
| Responde | "Qual risco olhar primeiro?" | "Qual ação implementar primeiro?" |

Confundir as duas é o erro conceitual mais comum em matriz de risco. A ferramenta as mantém separadas — nunca na mesma tela, nunca somadas.

### O autoteste no rodapé

A página roda a própria suíte de testes **a cada carregamento**, antes de desenhar qualquer coisa, e mostra o resultado no rodapé: `método verificado ✓` em verde, ou uma faixa vermelha no topo listando o que falhou.

Isso não é enfeite. A versão em PDF da Aula 2 diverge da própria fórmula em 9 de 9 casos, porque aritmética manual em matriz de priorização erra com facilidade — calcular de forma consistente é justamente o que a ferramenta automatiza. O selo demonstra esse argumento em vez de só afirmá-lo: ele reproduz os casos de verificação da aula (89 / 82 / 79), as fronteiras das duas réguas, o parser do catálogo, o corte obrigatório de dono e o formato do registro exportado.

O que o autoteste **não** faz é ler a pasta `metodo/` — os dois lados da comparação estão dentro do HTML. Quem atesta a paridade entre o método e o app é [`scripts/verificar-kernel.py`](scripts/verificar-kernel.py):

```bash
python3 scripts/verificar-kernel.py
```

### O corte obrigatório

> **Se não houver dono da decisão humana, o caso não está pronto.**

Item sem uma pessoa nomeada não pode ser encerrado. Aparece numa seção `Pendente de dono` do registro exportado, para que a lacuna fique visível em vez de silenciosa. A IA organiza evidência e calcula; a assinatura é humana.

## Roadmap

- [x] Interface web (`docs/index.html`) — sessão guiada em cinco etapas, corte obrigatório de HITL e exportação em CSV/Markdown
- [x] Skill Claude Code — Etapas 1–5 (Enquadrar, Identificar, Priorizar, Responder, Registrar) e exportação CSV/MD em paridade com o app
- [ ] Análise quantitativa — VME, reserva de contingência
- [ ] Monitoramento — reavaliação periódica, análise de reservas
- [ ] Planejar o Gerenciamento de Riscos — EAR customizável, apetite a risco
- [ ] Diagnóstico de maturidade em gestão de riscos

## Contribuindo

O método é editável por quem não programa. Para propor uma técnica de identificação, acrescente uma linha a [`metodo/tecnicas.csv`](metodo/tecnicas.csv) com a técnica, a origem no PMBOK e a pergunta de disparo. O esquema está documentado em [`tecnicas-identificacao.md`](metodo/tecnicas-identificacao.md).

**Há um segundo passo, e ele é obrigatório.** A página web não faz nenhuma requisição de rede — é isso que a deixa funcionar por duplo clique e offline. Como consequência, ela não lê `metodo/tecnicas.csv`: carrega uma **cópia embutida** do arquivo, dentro de um bloco `<script type="text/csv">` no `docs/index.html`. Editar só o kernel não muda o app.

Depois de editar o CSV, sincronize a cópia e confira:

```bash
# 1. substitua o bloco embutido pelo conteúdo atual do CSV
python3 - <<'EOF'
import io, re
csv = io.open('metodo/tecnicas.csv', encoding='utf-8').read()
html = io.open('docs/index.html', encoding='utf-8').read()
html = re.sub(r'(<script type="text/csv" id="tecnicas-csv">\n).*?(</script>)',
              lambda m: m.group(1) + csv + m.group(2), html, count=1, flags=re.S)
io.open('docs/index.html', 'w', encoding='utf-8').write(html)
EOF

# 2. confirme que kernel e app dizem a mesma coisa
python3 scripts/verificar-kernel.py
```

O script compara byte a byte a cópia embutida com o original, e também confere as faixas das duas réguas, os pesos, os nomes das dez estratégias e os seis gatilhos de validação humana. Ele sai com erro na primeira divergência — **o kernel é a fonte de verdade; o app se ajusta a ele, nunca o contrário.**

O mesmo vale para qualquer edição em `metodo/*.md`: rode o script antes de abrir o PR.

## Créditos

O vocabulário e o enquadramento executivo vêm da disciplina **Formação de Consultores em IA Aplicada ao PPPM**, do **Prof. Dr. José Bezerra** (BSBr) — em particular o mapa de contexto de cinco colunas, a fórmula de priorização executiva e o princípio do corte obrigatório de validação humana. Os slides originais não são redistribuídos aqui; o método nesta pasta é destilado e autoral.

Os padrões de saída de parte das técnicas de identificação são adaptados da categoria `risk` do catálogo de elicitação do [BMad Method](https://docs.bmad-method.org).

PMI®, PMBOK® e PMP® são marcas registradas do Project Management Institute, Inc. Este projeto não é afiliado ao PMI nem por ele endossado.

## Licença

[MIT](LICENSE).
