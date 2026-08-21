# Etapa 2 — Identificar

Objetivo: sair com uma lista de itens — ameaças e oportunidades — cada um no formato obrigatório do enunciado, ancorado no enquadramento, e com a origem marcada (quem gerou: o humano, ou a IA com aceite/ajuste humano).

Tudo que é *método* aqui vem de `metodo/tecnicas-identificacao.md` e `metodo/tecnicas.csv`. Este arquivo só diz **como a conversa anda**.

## 1. Postura (uma escolha, no início)

Pergunte, uma vez, em duas opções:

- **Parceira** *(padrão, se a pessoa não se importar)* — você faz a pergunta de disparo e **já toma a primeira iniciativa**: responde com 1 a 3 exemplos ancorados no contexto dela, para ela se inspirar ou entender o raciocínio da técnica. Ela responde a partir daí; depois você propõe mais candidatos. Ela aceita, ajusta ou descarta tudo.
- **Só perguntas** — você facilita e não propõe nada; toda ideia é dela. Útil em grupo ou quando a pessoa quer treinar o olho.

Guarde a escolha no arquivo de sessão (`postura`). Vale até o fim.

## 2. Técnicas (a segunda escolha)

Sugira **2 a 4 técnicas** usando a tabela "Seleção de técnicas" do kernel, escolhidas pela situação que o enquadramento revelou (projeto novo? go-live? sistema integrado? sessão curta?). Diga qual combinação e por quê, em duas linhas, e pergunte se serve ou se a pessoa prefere trocar. Se ela pedir "tempo curto", fique nas de `esforco = baixo`.

Rode as técnicas de **ameaça** primeiro (polaridade `ameaca` ou `ambas`). Oportunidades vêm depois, na seção 5.

## 3. Rodando uma técnica

Para cada técnica, na ordem:

1. **Anuncie a lente** em uma linha: nome da técnica e o que ela procura. Registre `tecnicaAtiva` na sessão.
2. **Faça a `pergunta_disparo` literalmente**, como está no CSV. Não parafraseie para soar profissional — ela é concreta de propósito. Uma pergunta, sem menu.
   - **Se postura = parceira, na mesma mensagem, responda você primeiro.** Logo abaixo da pergunta, dê **1 a 3 exemplos de resposta** — é a primeira iniciativa, o "é assim que se pensa com esta lente". Cada exemplo:
     - é uma resposta à pergunta *do jeito que a técnica pede* (no Pré-mortem é uma manchete de fracasso; na Auditoria de Premissas é uma suposição não verificada; na Cascata é "se X falha, cai Y"), e não um enunciado formal ainda;
     - é **ancorado em algo do enquadramento** ("vem de: 'consultor PJ único' na Dor"), ou vem com "supondo que…" explícito;
     - fecha com o convite: *"Esses são exemplos para destravar. O que **você** vê? Pode aproveitar um deles, mudar, ou jogar fora."*
   - Exemplo é exemplo: **não ganha ID, não entra no registro** até a pessoa o adotar. Se ela adotar um sem mudar, ao estruturar registre `origem: ia-aceito`; se mudar, `ia-ajustado`.
   - Se postura = só perguntas, pule isto: a pergunta vai sozinha.
3. **Deixe a pessoa responder.** O que ela disser em bruto, você estrutura:
   - Converta cada coisa dita no formato **Devido a `<causa>`, pode ocorrer `<evento>`, o que levaria a `<efeito>`**.
   - Passe pela tabela "como não escorregar" (`glossario.md`): se for problema já ocorrido, causa sem evento, ou só o efeito, diga em uma linha *o que falta* e ofereça a forma completa — não rejeite, complete.
   - Mostre o(s) item(ns) estruturado(s) e confirme: *"É isso? Ajusto algo antes de registrar?"* Ao confirmar, registre com `origem: humano`.
4. **Insista.** A primeira resposta é a óbvia. Pergunte "e mais?", "o que mais pode dar errado por aí?", "e se isso falhar, o que cai junto?" — até a pessoa parar de produzir, não até parecer suficiente.
5. **Quando ela secar, se postura = parceira, proponha mais candidatos.** Veja a seção 4. Os exemplos do passo 2 foram a *entrada*; os candidatos aqui são a *varredura* do que ficou de fora.
6. Quando a técnica secar, troque: anuncie a próxima lente.

Registre cada item **assim que for aceito** — não acumule para salvar no fim. Se a janela fechar, o que estava em disco é o que existe.

## 4. Propondo candidatos (postura parceira)

Depois que a pessoa produziu o que conseguia com a técnica ativa:

- Proponha **5 a 8 candidatos**, numerados, cada um já no formato completo `causa → evento → efeito`, **ancorados em algo que ela disse no enquadramento ou na conversa**. Abaixo de cada um, uma linha de ancoragem: *"(vem de: 'dependência do integrador' na Dor)"*.
- Candidato que depende de algo que ela não disse vem com **"supondo que …"** explícito. Se não dá para ancorar nem supor com honestidade, não proponha.
- Não repita o que ela já registrou com outras palavras — nem os exemplos do passo 2 que ela descartou. Traga ângulo novo: a técnica ativa é a lente — um candidato de Pré-mortem é um cenário de fracasso; um de Premissas é uma suposição não verificada; um de Cascata é um efeito em segunda ordem.
- Feche com **uma** pergunta: *"Quais entram? Diga os números, ou ajuste o texto de algum."*
- Para cada um que ela aceitar sem mudar, registre `origem: ia-aceito`; se ela alterar qualquer parte, `origem: ia-ajustado`; descartado não entra e não é registrado.
- Se ela aceitar tudo em bloco sem ler, ofereça revisar um a um — aceite em massa é o oposto de validação humana.

Nunca proponha aqui: nota de probabilidade/impacto (é da Etapa 3, com critério e âncora — não antecipe "esse parece alto"), nome de dono, estratégia de resposta (Etapa 4, ainda fora da skill). O kernel diz quem decide cada uma e quando.

## 5. Oportunidades

Terminadas as ameaças, pergunte se a pessoa quer caçar **oportunidades** (riscos positivos). Se sim:

- Use técnicas com `polaridade` = `oportunidade` ou `ambas`. T12 Caça à Oportunidade é a entrada natural; T01 vira **pré-mortem invertido** — a pergunta invertida está em `tecnicas-identificacao.md`, seção Oportunidades. Use-a literalmente.
- Mesmo formato de enunciado, `polaridade: oportunidade`.
- Atenção à última linha de "não escorregar": **oportunidade ≠ ideia boa**. Se depende só de decidir, é ação, não risco — diga isso e não registre.

## 6. Fechando a Etapa 2

Quando a pessoa disser que chega, ou as técnicas secarem:

1. Mostre a lista final em tabela curta: `ID · Polaridade · Enunciado · Técnica · Origem`.
2. Pergunte se falta algo. Uma pergunta.
3. Atualize `etapa: 2` no arquivo de sessão (já está; garanta que ficou), gere `registro.md` conforme `references/sessao.md`.
4. Diga os dois caminhos e anuncie a Etapa 3 — Priorizar — em uma frase: agora cada item ganha nota de probabilidade e impacto, e a pergunta passa a ser "qual olhar primeiro?". Carregue `references/etapa-3-priorizar.md`.
