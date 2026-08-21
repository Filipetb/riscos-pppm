# Etapa 1 — Enquadrar

Objetivo: preencher o **mapa inicial de oportunidades (registro de partes interessadas + declaração de escopo)** — as 5 colunas da Aula 1 — a partir do que a pessoa contar, e confirmar com ela antes de seguir.

As 5 colunas e suas perguntas estão em `metodo/glossario.md`, seção "O enquadramento de 5 colunas". Use os títulos e as perguntas de lá, literalmente.

## Como conduzir

1. **Uma pergunta aberta, não cinco.** Peça para a pessoa contar o projeto (ou processo, ou área) em um parágrafo: o que é, qual problema resolve, para quem, e o que ela acha que pode dar errado. Se ela já veio com um documento, briefing ou texto, leia e pule para o passo 2.
2. **Proponha as 5 colunas preenchidas.** A partir do parágrafo, preencha Contexto, Dor, Dados, Riscos e Valor. Coluna que o texto não sustenta fica com `?` e uma pergunta curta ao lado — não invente. Mostre como tabela de duas colunas (coluna → proposta) e peça: *"Corrija o que estiver errado ou faltando. O que confirmar vira cabeçalho do registro."*
3. **Itere até a pessoa confirmar.** Incorpore as correções; repita a tabela só se mudou bastante, senão confirme em uma linha.
4. **Pergunte quem conduz a sessão** (nome da pessoa) — vai para `conduzidaPor`. Uma linha.
5. **Crie o arquivo de sessão** conforme `references/sessao.md`: `sessao.json` com `etapa: 1`, as 5 colunas, `conduzidaPor`, `criadoEm`. Diga o caminho: a sessão agora está em disco e sobrevive a interrupção.
6. Anuncie a Etapa 2 em uma frase e carregue `references/etapa-2-identificar.md`.

## Critério de saída

As 5 colunas preenchidas (nenhuma vazia) e confirmadas explicitamente pelo usuário. O app HTML bloqueia a Etapa 2 sem isso; a skill também.

## Cuidados

- A coluna **Riscos** aqui é "o que exige validação humana, ética ou segurança" — é semente, não a lista de riscos. Não confunda com a identificação da Etapa 2.
- A coluna **Valor** é o que os riscos ameaçam. Se a pessoa não souber dizer, isso por si é um achado — registre `?` e siga; na Etapa 2 a Auditoria de Premissas (T02) costuma expor isso.
