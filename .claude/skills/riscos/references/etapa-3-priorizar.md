# Etapa 3 — Priorizar (Régua A)

Objetivo: cada item sair com **Probabilidade**, **Impacto por dimensão** (prazo, custo, escopo/qualidade), **qualidade do dado** e a marca de **dado sensível** — tudo fixado pela pessoa, com a **origem da nota** e a **base da avaliação** registradas. Severidade e faixa são derivadas, nunca digitadas.

Tudo que é *método* aqui vem de `metodo/escalas-e-priorizacao.md` (Régua A, faixas, qualidade do dado, "Investigue") e `metodo/governanca-hitl.md` (gatilhos 1, 3 e 4). Este arquivo só diz **como a conversa anda**. **Régua B não entra nesta etapa** — ela prioriza respostas, não riscos, e é da Etapa 4.

## O guardrail novo desta etapa

Na Etapa 2 a IA propunha enunciado. Aqui ela propõe **nota** — e nota parece mais objetiva do que é. Por isso:

1. **Toda sugestão de nota cita o critério literal do kernel e o trecho da conversa que a sustenta.** Formato: `P = 4 — "Aconteceu no projeto anterior": você disse no Enquadramento que o portal de 2014 atrasou a virada.` Sem trecho para citar, não há sugestão: vem `P = ?` e a pergunta.
2. **A IA sugere; o humano fixa.** Nada entra no arquivo de sessão antes de a pessoa dizer a nota final — mesmo que seja "é isso".
3. **"De onde vem esse número?"** é a pergunta que fixa a qualidade do dado. Faça-a **sempre**, depois de cada nota fixada, literalmente. A resposta é classificada pela tabela "Qualidade dos dados do risco" do kernel e fica gravada em texto (`baseAvaliacao`) — é o elo *Entrada* da rastreabilidade.
4. **Origem da nota** (`origemNota`): `humano` se a pessoa deu a nota sem sugestão (postura "só perguntas", ou a IA não tinha âncora); `ia-aceito` se fixou a sugestão sem mudar; `ia-ajustado` se mudou qualquer nota. Um item `origem: ia-aceito` + `origemNota: ia-aceito` é um item em que o humano só confirmou — o registro diz isso, e é por isso que a origem passa a importar de verdade.

A postura da Etapa 2 vale aqui: **parceira** sugere; **só perguntas** pergunta e não sugere.

## 1. Abrindo a etapa

Uma mensagem:

- Diga o que muda: a lista está feita, agora é decidir **qual risco olhar primeiro** — Régua A, Probabilidade × Impacto (Realizar a Análise Qualitativa dos Riscos).
- Mostre **uma vez** as três tabelas do kernel, compactas: Probabilidade (1–5 com critério), Impacto (1–5 × prazo / custo / escopo-qualidade) e faixas de severidade. Depois disso, cite critérios inline; não repita tabela.
- Diga a regra do impacto: *preenche por dimensão e vale a maior nota* — prazo 2 com custo 5 é um risco 5.
- Anuncie o primeiro item (menor ID) e já faça a rodada dele (seção 2). Registre `etapa: 3` e `tecnicaAtiva` zerada.

## 2. Rodando um item

Para cada item, na ordem dos IDs (a pessoa pode pedir outra ordem). Uma pergunta por mensagem.

**Mensagem A — a nota.** Mostre o enunciado do item e:

- **Postura parceira:** proponha `P` e `I` por dimensão, cada um com critério literal + âncora, assim:

  > **P = 4** — "Aconteceu no projeto anterior": vem de *"migração do portal de 2014 estourou a janela"* (Dados).
  > **I prazo = 5** — "Prazo contratual perdido": go-live 1º/dez é a janela que justifica o projeto (Contexto).
  > **I custo = ?** — não tenho âncora para custo; o que uma virada estourada custa aqui?
  > **I escopo/qualidade = 2** — "Ajuste menor", *supondo que* o escopo não muda, só desliza.
  >
  > Fixa assim, ou ajusta?

  Regras da sugestão: só cite critério **do kernel**, literalmente; âncora é trecho do enquadramento ou da conversa, entre aspas; `?` onde não dá para ancorar; `supondo que…` explícito quando é inferência. **Nunca sugira P = 4 ou P = 5 sem a pessoa ter dito que aconteceu antes ou está acontecendo** — esses dois critérios são factuais, não opinativos. Se sobrar `?`, a pergunta da mensagem é sobre o `?`, não "fixa?".
- **Postura só perguntas:** pergunte a Probabilidade citando os 5 critérios em uma linha; na mensagem seguinte, o Impacto nas três dimensões. Não sugira.

A pessoa responde. Se ajustou, não discuta a nota — ela é dela. Se a nota contradiz o critério que ela mesma deu (ex.: "já aconteceu duas vezes" e P = 2), aponte **uma vez**, em uma linha, e fique com o que ela fixar.

**Mensagem B — a base.** Com as notas fixadas, pergunte literalmente: **"De onde vem esse número?"** Se a pessoa já disse de onde vem ao fixar (ex.: "P 4 porque o relatório do call center mostra isso todo janeiro"), não pergunte de novo: classifique e siga para C.

**Mensagem C — fechar o item.** Classifique a base pela tabela do kernel e mostre tudo o que vai para o arquivo:

> Qualidade do dado: 🟢 **Alta** — "dado histórico, medição ou contrato" (relatório do call center).
> Severidade **4 × 5 = 20 → 🔴 Alto** (15–25): resposta obrigatória, com dono e gatilho antes do encerramento.
> Dado sensível: **sim** — envolve cadastro sob LGPD (coluna Riscos). *(gatilho 3)*
> Registro assim?

- **Qualidade**: 🟢 Alta = dado histórico, medição ou contrato · 🟡 Média = experiência direta de quem viveu situação parecida · 🔴 Baixa = estimativa sem referência. "Acho que sim", "sensação", "chute" → Baixa, sem constrangimento: baixa é um dado honesto, não uma nota ruim. Cite o critério.
- **Severidade** = P × maior I. Calcule e confira na tabela da seção 4 — 13 e 14 não existem; se der isso, a conta está errada.
- **Dado sensível** (`dadoSensivel`): proponha `sim` quando a coluna Riscos do enquadramento ou o próprio enunciado fala de dado pessoal, de saúde, sigilo contratual etc.; senão `não`. A pessoa confirma. É o gatilho 3.
- **Investigue**: se faixa 🔴 e qualidade 🔴, diga: *"Severidade alta com dado de qualidade baixa: este item não vira ação imediata — a próxima ação é reduzir a incerteza do dado. Fica marcado Investigue e vai pedir confirmação explícita na Etapa 4."* Não é punição, é o gatilho 4. Não peça a confirmação agora — ela é da Etapa 4.
- Se faixa 🔴, diga em uma linha que o item vai pedir confirmação humana explícita na Etapa 4 (gatilho 1). Só informe.

Ao "sim", grave no `sessao.json`: `probabilidade`, `impPrazo`, `impCusto`, `impEscopo` (null onde a pessoa disse que não se aplica), `qualidade`, `dadoSensivel`, `origemNota`, `baseAvaliacao`. **Escreva o arquivo a cada item**, não no fim.

Se a pessoa quiser **pular** um item ("isso eu não sei avaliar"), deixe as notas `null` e registre em `baseAvaliacao` o motivo ("não avaliado: falta dado de carga"). Ele aparece como *não priorizado* no registro. Não force nota.

## 3. Em lote (quando a lista é longa)

Com **6 ou mais itens**, depois de rodar os **dois primeiros** item a item (a pessoa aprende o ritmo e você calibra as âncoras), ofereça:

> Faltam N. Posso propor P e I dos restantes numa tabela só, cada linha com critério e âncora, e você corrige o que quiser de uma vez. A pergunta "de onde vem esse número?" continua valendo por item. Quer assim, ou seguimos um a um?

Se aceitar: tabela `ID · P (critério · âncora) · I prazo · I custo · I escopo · ?` com uma linha por item, âncoras curtas, `?` onde não há. Uma pergunta: *"Corrija as linhas que quiser — ID e nota nova. O resto fixa como está."* Depois, **uma** mensagem pedindo a base de cada um: *"De onde vem cada número? Pode responder por ID, uma linha cada."* Classifique todas, mostre a tabela fechada (com severidade, faixa, qualidade, dado sensível, Investigue) e peça um único "registro assim?". Aceite em bloco sem ler → ofereça rever um a um, como na Etapa 2.

Em postura "só perguntas" não há lote com sugestão; pode haver lote de perguntas (a tabela vai vazia para a pessoa preencher).

## 4. Severidade — conferência

P × I só produz estes valores. Se a conta der outro número, refaça.

| P×I | Severidade | Faixa |
|---|---|---|
| 1×1 · 1×2 · 2×1 · 1×3 · 3×1 · 2×2 · 1×4 · 4×1 | 1–4 | 🟢 Baixo |
| 1×5 · 5×1 · 2×3 · 3×2 · 2×4 · 4×2 · 3×3 · 2×5 · 5×2 · 3×4 · 4×3 | 5–12 | 🟡 Médio |
| 3×5 · 5×3 · 4×4 · 4×5 · 5×4 · 5×5 | 15–25 | 🔴 Alto |

Oportunidades: **mesma escala**. Severidade alta = perseguir com a mesma energia de uma ameaça alta.

## 5. Fechando a Etapa 3

Quando todos os itens passaram (ou foram explicitamente pulados):

1. Mostre a **matriz de prioridade** como tabela ordenada por severidade decrescente: `ID · Polaridade · Enunciado (curto) · P · I · Sev · Faixa · Qualidade · Origem da nota`. Abaixo, uma linha de contagem (🔴 n · 🟡 n · 🟢 n · não priorizados n) e a lista dos itens **Investigue**, se houver.
2. Diga, em uma linha, quantos itens ficaram com nota `ia-aceito` sem ajuste — se forem muitos, pergunte se a pessoa quer rever algum antes de seguir. Uma pergunta.
3. Garanta `etapa: 3` no arquivo, gere `registro.md` conforme `references/sessao.md` (agora com a seção de priorização).
4. Diga os dois caminhos e anuncie a Etapa 4 — Responder — em uma frase: agora a pergunta é "o que fazer com cada risco, e quem assina?"; item 🔴 vai exigir resposta com dono e gatilho; item Investigue, reduzir a incerteza antes. Carregue `references/etapa-4-responder.md`.

## Nunca

- Sugerir nota sem critério do kernel e sem âncora citada.
- Gravar nota que a pessoa não fixou.
- Pular "de onde vem esse número?".
- Usar Régua B, propor dono, estratégia ou ação — são da Etapa 4.
- Somar, ponderar ou "ajustar" severidade: é P × maior I, e só.
