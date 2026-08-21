# riscos-pppm

**Levantamento de riscos de projeto com método PMBOK — sem instalar nada, sem que nenhum dado saia da sua máquina.**

Uma sessão guiada que leva você de "não sei quais são meus riscos" a um registro de riscos exportado, em cerca de 15 minutos. Feito para quem gerencia projetos, programas e portfólios — não para quem programa.

> ⚠️ **Em construção.** O método (`metodo/`) está completo. As duas interfaces estão sendo implementadas.

---

## Por que existe

Ferramentas de risco assumem que você já tem a lista. Planilha não conduz ninguém, e suíte de PPPM é pesada demais para uma sessão de meia hora. Falta a parte difícil: **como descobrir os riscos que você ainda não enxergou.**

Este projeto empacota as técnicas de identificação do PMBOK em perguntas concretas que qualquer pessoa consegue responder, calcula a priorização de forma consistente, e obriga a definir quem decide antes de encerrar.

## Como usar

**Pelo navegador** — abra a página publicada, ou baixe `docs/index.html` e dê duplo clique. Funciona offline, sem instalação, sem conta.

**No Claude Code** — clone o repositório e rode a skill `/riscos`. Mesmo método, com elicitação conversacional em vez de formulário.

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

| | Régua A · Probabilidade × Impacto | Régua B · fórmula executiva |
|---|---|---|
| Prioriza | Riscos | Iniciativas e respostas |
| Responde | "Qual risco olhar primeiro?" | "Qual ação implementar primeiro?" |

Confundir as duas é o erro conceitual mais comum em matriz de risco. A ferramenta as mantém separadas.

### O corte obrigatório

> **Se não houver dono da decisão humana, o caso não está pronto.**

Item sem uma pessoa nomeada não pode ser encerrado. Aparece numa seção `Pendente de dono` do registro exportado, para que a lacuna fique visível em vez de silenciosa. A IA organiza evidência e calcula; a assinatura é humana.

## Roadmap

- [ ] Interface web (`docs/index.html`)
- [ ] Skill Claude Code
- [ ] Análise quantitativa — VME, reserva de contingência
- [ ] Monitoramento — reavaliação periódica, análise de reservas
- [ ] Planejar o Gerenciamento de Riscos — EAR customizável, apetite a risco
- [ ] Diagnóstico de maturidade em gestão de riscos

## Contribuindo

O método é editável por quem não programa. Para propor uma técnica de identificação, abra um PR acrescentando uma linha a `metodo/tecnicas.csv` com a técnica, a origem no PMBOK e a pergunta de disparo. O esquema está documentado em [`tecnicas-identificacao.md`](metodo/tecnicas-identificacao.md).

## Créditos

O vocabulário e o enquadramento executivo vêm da disciplina **Formação de Consultores em IA Aplicada ao PPPM**, do **Prof. Dr. José Bezerra** (BSBr) — em particular o mapa de contexto de cinco colunas, a fórmula de priorização executiva e o princípio do corte obrigatório de validação humana. Os slides originais não são redistribuídos aqui; o método nesta pasta é destilado e autoral.

Os padrões de saída de parte das técnicas de identificação são adaptados da categoria `risk` do catálogo de elicitação do [BMad Method](https://docs.bmad-method.org).

PMI®, PMBOK® e PMP® são marcas registradas do Project Management Institute, Inc. Este projeto não é afiliado ao PMI nem por ele endossado.

## Licença

[MIT](LICENSE).
