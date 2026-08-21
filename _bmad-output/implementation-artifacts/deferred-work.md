- source_spec: none
  summary: Skill Claude Code autônoma (CAP-9) que roda o método de gestão de riscos PPPM com elicitação conversacional, produzindo registro com os mesmos campos e fórmulas do app.
  evidence: Separada do build do app HTML porque é um entregável independentemente shippável — PR próprio, sem tocar em docs/index.html e sem alterar o kernel em metodo/. Ordem escolhida: o app primeiro, porque é o que o sinal de sucesso de 22/08/2026 exige e porque ele fixa a forma canônica do registro que a skill depois espelha.
- source_spec: `_bmad-output/implementation-artifacts/spec-app-riscos-pppm.md`
  summary: Portabilidade de sessão — importar um registro de volta para a ferramenta, ou exportar/reimportar a sessão inteira, para que o trabalho sobreviva a troca de máquina, limpeza de dados do site e janela anônima.
  evidence: A revisão apontou que a sessão existe em exatamente um perfil de navegador e que a ferramenta pede ~15 minutos de trabalho antes do primeiro export ser possível; qualquer perda no meio é irrecuperável. Fora desta story porque a decisão de formato de exportação (CSV + Markdown, sem JSON) já foi tomada pelo usuário, e reimportação é capacidade nova, não formato adicional.
- source_spec: `_bmad-output/implementation-artifacts/spec-app-riscos-pppm.md`
  summary: Declarar uma versão do método dentro de `metodo/`, para que o elo de rastreabilidade do registro exportado possa afirmar a procedência do kernel em vez de carimbar uma data mantida do lado do app.
  evidence: Nada em `metodo/` declara versão hoje, mas o export estampa "Versão do método" em toda linha. Fora desta story porque `metodo/` é companion do SPEC pai (spec-gestao-riscos-pppm) e alterá-lo é decisão daquele contrato, não deste.
