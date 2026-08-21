# Etapa 4 — Responder

Objetivo: cada item priorizado sair com uma **resposta** — os cinco campos obrigatórios (estratégia, ação, dono, gatilho, risco residual), os campos condicionais da estratégia, o risco secundário avaliado, e os gatilhos de validação humana **confirmados explicitamente**. É o processo *Planejar as Respostas aos Riscos* (PMBOK).

Tudo que é *método* aqui vem de `metodo/estrategias-de-resposta.md` (as dez estratégias, os cinco campos, as cinco regras), `metodo/governanca-hitl.md` (corte obrigatório, os seis gatilhos, dono como pessoa nomeada) e `metodo/escalas-e-priorizacao.md` (Régua B, só quando respostas concorrem). Este arquivo só diz **como a conversa anda**.

## O guardrail desta etapa

Na Etapa 3 a IA sugeria número. Aqui ela sugere **decisão** — estratégia, ação, gatilho — e isso é o ponto mais sensível do fluxo "IA recomenda → humano valida e decide". Quatro regras:

1. **Estratégia é sugerida pela pergunta de escolha do kernel, nunca por opinião.** Formato: `Mitigar — "Dá para diminuir a chance ou o estrago?": sim, porque a causa é "consultor PJ único" e um segundo integrador reduz P. Evitar não cabe: a causa não pode deixar de existir antes do go-live.` Cite o "quando usar" da tabela e a faixa do item. Sem âncora, não sugira — pergunte.
2. **Dono a IA nunca sugere.** Dono é uma pessoa nomeada que vai assinar; a IA não sabe quem são as pessoas. Ela só pergunta *"Quem é a pessoa?"* e aplica o corte: "PMO", "TI", "a equipe de dados", "a área", "a definir" não são pessoa — nenhuma delas assina nada. Diga isso uma vez, peça o nome; se a pessoa insistir, registre como está e avise que o item fica **Pendente de dono** e não poderá ser encerrado na Etapa 5. O corte bloqueia o *encerramento*, não o *registro*.
3. **Gatilho de validação humana só fecha com confirmação explícita.** A IA lista cada gatilho disparado, com o texto do kernel, e pergunta se a pessoa confirma. Nunca marca confirmado por inferência, por silêncio ou por "pode seguir". Cada confirmação recebe carimbo de data/hora em `confirmacoes[gN]`.
4. **Resposta cria risco.** "E o que essa ação pode causar?" é obrigatória em toda resposta. Se houver risco secundário, ele **entra no registro como item novo** (o kernel manda) — não fica só anotado.

`origemResposta` (`humano` · `ia-aceito` · `ia-ajustado`) registra se a pessoa montou a resposta sem sugestão, aceitou a sugestão como veio ou mudou algo. Postura "só perguntas" → a IA pergunta os cinco campos e não sugere nenhum.

## 1. Abrindo a etapa

Uma mensagem:

- Diga o que muda: a pergunta agora é **"o que fazer com cada risco, e quem assina?"**. Mostre a tabela das dez estratégias do kernel (ameaças e oportunidades, com a pergunta de escolha), **uma vez**; depois cite inline.
- Diga os cinco campos obrigatórios em uma linha: *uma resposta sem estratégia, ação, dono, gatilho e risco residual não é uma resposta — é uma intenção.*
- Diga a ordem: 🔴 primeiro (resposta obrigatória; os marcados **Investigue** antes de todos), depois 🟡, depois 🟢 (lista de observação, em lote). Itens não priorizados não recebem resposta — ficam fora e o registro diz.
- Registre `etapa: 4` e comece pelo primeiro 🔴.

## 2. Rodando um item 🔴 ou 🟡

Uma pergunta por mensagem. Mostre o enunciado, a faixa e a severidade ao abrir o item.

**Mensagem A — estratégia.**
- Parceira: sugira **uma** estratégia com a pergunta de escolha + âncora + por que as vizinhas não cabem (uma linha cada, no máximo duas vizinhas). Para item **Investigue**: a ação prioritária é *reduzir a incerteza do dado* — sugira Mitigar (ou Aceitar ativa) com ação de investigação ("obter o dado de carga do Tasy até …"), e diga por quê. Pergunta: *"É essa, ou outra das dez?"*
- Só perguntas: faça as cinco perguntas de escolha da polaridade, em uma linha cada, e pergunte qual.
- Aceite qualquer uma das dez. Se a escolha contradiz o "quando usar" do kernel (ex.: Aceitar num 🔴), aponte **uma vez** — e lembre que Aceitar em faixa alta é gatilho 6 — e fique com o que a pessoa decidir.

**Mensagem B — ação, gatilho, residual.**
- Parceira: proponha os três como rascunho ancorado, no formato do kernel: ação = *verbo no infinitivo, concreto, com prazo*; gatilho = *sinal observável*; residual = *o que sobra*. Prazo e número que a pessoa não deu vêm como `⟨até quando?⟩`, nunca inventados. Pergunta: *"Ajusta o que quiser — o que ficar é seu."*
- Só perguntas: pergunte os três, um por mensagem.
- Passe pelo crivo do kernel: "melhorar a gestão de fornecedores" não é ação (sem verbo concreto, sem prazo); "se as coisas piorarem" não é gatilho (não é observável). Diga o que falta e ofereça a forma completa — complete, não rejeite. Residual "nenhum" → pergunte *"o que sobra se a ação der certo?"*; se a pessoa sustentar, registre "nenhum identificado".

**Mensagem C — dono.** *"Quem é a pessoa que assina esta resposta (dono da decisão humana / risk owner)?"* Aplique a regra 2 do guardrail. Registre `dono` como a pessoa disse.

**Mensagem D — campos da estratégia** (só quando se aplicam; senão pule):
- **Aceitar** → *justificativa* obrigatória (Regra 2). "Porque sim" não é justificativa; cite o critério: custo do tratamento > impacto, ou faixa baixa.
- **Escalar** → *destinatário* obrigatório (Regra 5): quem recebe, nomeado — programa, portfólio, diretoria, com a pessoa. Sem destinatário é abandonar.
- **Evitar / Explorar** → *pendência de replanejamento* (Regra 3): o que do plano muda. Diga que sai no registro como pendência, não como anotação.

**Mensagem E — risco secundário.** Literalmente: **"E o que essa ação pode causar?"**
- Parceira: depois da pergunta, 1–2 candidatos ancorados na ação ("contratar segundo integrador até 15/09 → sobreposição de dois consultores no mesmo código, supondo que não há dono técnico interno").
- Se a pessoa diz que não há: confirme *"Avaliou e não cria? Registro assim."* → `riscoSecundarioAvaliado: true`.
- Se há: registre `riscoSecundario` (texto) e peça a **faixa estimada** (🔴 / 🟡 / 🟢) → `riscoSecundarioFaixa`. Faixa 🟡 ou 🔴 dispara o gatilho 5. Depois **promova como item novo** (seção 4).

**Mensagem F — fechar o item.** Mostre tudo o que vai para o arquivo e o resultado das cinco regras de consistência (✓ / ✗ / — quando não se aplica), assim:

> Regra 1 ✓ faixa alta com estratégia, ação, dono e gatilho · Regra 2 — · Regra 3 — · Regra 4 ✓ risco secundário descrito → R017 · Regra 5 —

Em seguida, os **gatilhos de validação humana** disparados neste item, cada um com o texto do kernel:

> A ferramenta não segue no automático aqui. Confirme cada ponto:
> · g1 — Severidade alta (🔴 20). Faixa alta nunca segue no automático.
> · g3 — Envolve dado pessoal, sensível ou sujeito a sigilo contratual.
> · g4 — Severidade alta com qualidade de dado baixa: decidir sobre chute é pior que não decidir. Item marcado Investigue.
> Confirma os três explicitamente?

Os seis gatilhos (kernel): g1 faixa 🔴 · g2 estratégia Evitar/Explorar · g3 dado sensível · g4 🔴 + qualidade 🔴 (Investigue) · g5 risco secundário 🟡/🔴 · g6 Aceitar em faixa 🔴. Só liste os que disparam. A pessoa precisa responder confirmando — "sim", "confirmo", "ok os três" valem; silêncio ou mudar de assunto não valem. Para cada confirmado, `confirmacoes.gN = <ISO agora>`. Se a pessoa recusa um, o item fica com validação pendente — diga e siga; isso bloqueia o encerramento na Etapa 5, não o registro. Se a estratégia mudar depois, as confirmações de gatilhos que deixaram de existir caem e as de gatilhos novos precisam ser feitas de novo.

Grave o item no `sessao.json` **ao fechar cada item** (e os campos parciais antes, se a conversa se alongar).

## 3. Itens 🟢 em lote

Faixa baixa = *lista de observação; sem ação, só revisão periódica*. Proponha numa tabela só: `ID · Enunciado curto · Aceitar (passiva) · ação: "Monitorar em ⟨revisão periódica — quando?⟩" · gatilho: "se subir de faixa na revisão" · residual: "o risco como está" · justificativa: "faixa baixa (sev N)" · dono: ?`. Uma pergunta: *"Confirma assim? Preencha o dono de cada linha e mude o que quiser — ou tire algum da lista para tratar um a um."* Depois, **uma** mensagem: *"Alguma dessas ações de monitorar pode causar algo?"* — normalmente não; marque `riscoSecundarioAvaliado: true` só para os que a pessoa confirmar. Aceite em bloco sem ler → ofereça um a um. Quem quiser Mitigar um 🟢 passa pelo fluxo da seção 2.

## 4. Risco secundário vira item novo

Quando há risco secundário:

1. Crie o item com o próximo ID, `polaridade` e `tecnica` do item de origem, `origem: humano` (ou `ia-aceito`/`ia-ajustado` se veio do candidato da IA), e `origemRiscoSecundario: <ID de origem>`; no item de origem, `promovidoPara: <ID novo>`. Enunciado: causa = *ter escolhido a resposta "⟨ação⟩" para ⟨ID⟩*, evento = o risco secundário dito, efeito = pergunte (*"e isso levaria a quê?"*). Uma pergunta.
2. **Não priorize nem responda agora** — anote na fila. Ao terminar os itens originais (seção 5), rode a fila: Etapa 3 para cada um (`references/etapa-3-priorizar.md`, fluxo por item) e, se ficar 🔴 ou 🟡, Etapa 4. Secundário de secundário: pergunte, mas se a pessoa disser "não há", aceite sem insistir — a cadeia precisa terminar.
3. A faixa estimada dada na Mensagem E é estimativa para o gatilho 5; a priorização real é a da Régua A quando a fila rodar. Se divergirem, a Régua A vale e `riscoSecundarioFaixa` é atualizada.

## 5. Régua B — só quando as respostas concorrem

Ao terminar todos os itens (inclusive a fila), pergunte **uma vez**: *"Alguma dessas ações disputa o mesmo orçamento ou a mesma pessoa? Se sim, quais?"*

- Se não: diga que a Régua B não se aplica e siga para o fechamento. Não pontue por pontuar.
- Se sim, só para as concorrentes:
  - Diga que é **outra régua**: prioriza iniciativas, não riscos; não se soma à Régua A; a severidade não entra. Fórmula literal do kernel e escala 1 baixa · 3 média · 5 alta.
  - **Corte antes da pontuação**: resposta sem dono nomeado é devolvida — não recebe nota. Diga qual e por quê.
  - Por resposta, os cinco critérios com a *pergunta executiva* do kernel. Parceira: sugira nota com âncora, como na Etapa 3 (critério + trecho); o humano fixa. Só perguntas: pergunte.
  - Calcule mostrando a conta: `((I×30)+(V×20)+(D×20)+(S×15)+(Val×15)) ÷ 5 = …`. Confira: resultado entre 20 e 100; os casos de verificação do kernel (5,4,4,4,5 → 89) valem como teste se houver dúvida na aritmética.
  - Mostre a ordem de implementação com a faixa (Fazer agora 80–100 · Preparar 60–79 · Não priorizar 20–59) e registre `bImpacto`…`bValor`.

## 6. Fechando a Etapa 4

1. Tabela final: `ID · Faixa · Estratégia · Ação · Dono · Gatilho · Residual · Secundário → ID · Regras (✓✗) · HITL (confirmados / pendentes) · Status`. Status: **Pendente de dono** (corte) · **Investigue** · **Rascunho** (enunciado incompleto) · **Aberto**. "Encerrado" não existe ainda — é da Etapa 5.
2. Listas curtas, se houver: itens **Pendente de dono** (com a frase do corte), **pendências de replanejamento** (Regra 3), gatilhos **não confirmados**, ranking da Régua B.
3. Diga quantas respostas ficaram `ia-aceito` sem ajuste — se forem muitas, pergunte se quer rever alguma. Uma pergunta.
4. Garanta `etapa: 4`, regenere `registro.md` conforme `references/sessao.md`.
5. Diga os dois caminhos e anuncie a Etapa 5 — Registrar — em uma frase: agora é fixar a decisão da validação humana por item (aceite ou ajuste — as origens já dizem quase tudo), encerrar o que passa nos bloqueios e exportar CSV/Markdown. Lembre: item sem dono não será encerrado. Carregue `references/etapa-5-registrar.md`.

## Nunca

- Sugerir dono, ou aceitar área/equipe/sigla como pessoa sem avisar do corte.
- Marcar gatilho confirmado sem a pessoa ter dito que confirma, depois de ler o texto.
- Deixar a pergunta "e o que essa ação pode causar?" de fora, ou anotar risco secundário sem promovê-lo a item.
- Somar Régua B com Régua A, ou pontuar Régua B quando nada concorre.
- Inventar prazo, número, nome ou contrato numa ação ou gatilho — `⟨até quando?⟩` até a pessoa dizer.
- Encerrar item, registrar `decisao` ou `validadoEm` aqui — são da Etapa 5, e lá também só com a pessoa mandando.
