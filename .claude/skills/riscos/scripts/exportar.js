#!/usr/bin/env node
/* exportar.js — Etapa 5 da skill /riscos.
 *
 * Lê `sessoes/<slug>/sessao.json` e produz o que o app `docs/index.html`
 * produz na Etapa 5, com as mesmas regras: bloqueios de encerramento, status,
 * gatilhos HITL, linha de exportação (51 colunas do app + 4 da skill), CSV
 * (separador `;`, BOM UTF-8, CRLF, neutralização de fórmula) e Markdown.
 *
 * Só Node (já presente onde o Claude Code roda); zero dependências. As funções
 * são portes literais das do app — se o app mudar uma regra, mude aqui também.
 *
 * Uso:
 *   node exportar.js status   <sessao.json>            → JSON por item: status, bloqueios, gatilhos, decisão sugerida
 *   node exportar.js exportar <sessao.json> [--dir D]   → grava registro-de-riscos-<slug>-<data>.csv e .md (padrão: pasta da sessão)
 *   node exportar.js linha    <sessao.json> <ID>        → a linha de exportação de um item, como objeto (para conferir)
 */
'use strict';
var fs = require('fs');
var path = require('path');

var VERSAO_SKILL = 'skill-riscos 0.4.0';
var VERSAO_DAS_REGRAS = VERSAO_SKILL + ' · kernel em metodo/ (o kernel não declara versão própria)';

/* ---------------------------------------------------------------------
   1. Tabelas do método — idênticas às do app (transcritas do kernel)
   --------------------------------------------------------------------- */
var FAIXAS_A = [
  { chave: 'alto',  min: 15, max: 25, emoji: '🔴', rotulo: 'Alto' },
  { chave: 'medio', min: 5,  max: 12, emoji: '🟡', rotulo: 'Médio' },
  { chave: 'baixo', min: 1,  max: 4,  emoji: '🟢', rotulo: 'Baixo' }
];
var FAIXAS_B = [
  { chave: 'agora',    min: 80, max: 100, rotulo: 'Fazer agora' },
  { chave: 'preparar', min: 60, max: 79,  rotulo: 'Preparar' },
  { chave: 'nao',      min: 20, max: 59,  rotulo: 'Não priorizar' }
];
var PESOS_B = { impacto: 30, viabilidade: 20, dados: 20, seguranca: 15, valor: 15 };
var QUALIDADE_DADO = [
  { chave: 'alta',  emoji: '🟢', rotulo: 'Alta' },
  { chave: 'media', emoji: '🟡', rotulo: 'Média' },
  { chave: 'baixa', emoji: '🔴', rotulo: 'Baixa' }
];
var COLUNAS_ENQUADRAMENTO = [
  { chave: 'contexto', titulo: '1. Contexto', pergunta: 'Qual projeto, processo ou área será analisado?' },
  { chave: 'dor', titulo: '2. Dor (problema / necessidade de negócio)', pergunta: 'Qual problema real precisa ser resolvido?' },
  { chave: 'dados', titulo: '3. Dados', pergunta: 'Que informações existem para apoiar a decisão?' },
  { chave: 'riscos', titulo: '4. Riscos', pergunta: 'O que exige validação humana, ética ou segurança?' },
  { chave: 'valor', titulo: '5. Valor', pergunta: 'Que benefício executivo pode ser gerado?' }
];
var DONOS_GENERICOS_EXATOS = ['pmo','ti','rh','na','n/a','tbd','a definir','a combinar','a designar',
  'equipe','time','área','area','setor','departamento','diretoria','gerência','gerencia','coordenação',
  'coordenacao','comitê','comite','conselho','squad','célula','celula','board','staff','todos','ninguém',
  'ninguem','jurídico','juridico','financeiro','compras','operações','operacoes','fornecedor','cliente',
  'empresa','organização','organizacao','projeto','escritório','escritorio','definir','a definir depois'];
var DONOS_COLETIVOS_INICIAIS = ['equipe','time','área','area','setor','departamento','diretoria',
  'gerência','gerencia','coordenação','coordenacao','comitê','comite','conselho','comissão','comissao',
  'squad','célula','celula','board','staff','escritório','escritorio','grupo','núcleo','nucleo'];

var FLUXO_VALIDACAO =
  '1. IA gera recomendação → 2. Consultor verifica dados e contexto → 3. Especialista valida riscos e regras → 4. Gestor decide e registra';
/* No app o passo 1 não existe (não há IA). Aqui ele existe e é dito: a IA ocupou
   o passo 1 e cada item carrega a origem do que ela propôs. */
var NOTA_COLAPSO =
  'Sessão conversacional individual: o passo 1 (IA gera recomendação) foi ocupado pelo modelo que roda a skill /riscos, ' +
  'e cada item carrega a origem (humano / ia-aceito / ia-ajustado) do enunciado, da nota e da resposta; ' +
  'os passos 2, 3 e 4 do fluxo de validação da Aula 2 COLAPSARAM num único ponto de confirmação humana. ' +
  'Este registro diz que colapsaram em vez de fingir que os três ocorreram.';
var CORTE_OBRIGATORIO = 'Se não houver dono da decisão humana, o caso não está pronto.';
var FORMULA_A = 'Severidade = Probabilidade × Impacto (1–25); faixas 🔴 15–25 · 🟡 5–12 · 🟢 1–4';
var FORMULA_B = 'Prioridade = ((I×30)+(V×20)+(D×20)+(S×15)+(Val×15)) ÷ 5; escala 1·3·5; faixas 80–100 · 60–79 · 20–59';

/* ---------------------------------------------------------------------
   2. Catálogo de técnicas — parseado de metodo/tecnicas.csv (RFC 4180)
   --------------------------------------------------------------------- */
function parseCSV(texto) {
  var linhas = [], linha = [], campo = '', i, c, emAspas = false;
  texto = String(texto == null ? '' : texto).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  for (i = 0; i < texto.length; i++) {
    c = texto.charAt(i);
    if (emAspas) {
      if (c === '"') {
        if (texto.charAt(i + 1) === '"') { campo += '"'; i++; } else { emAspas = false; }
      } else { campo += c; }
    } else if (c === '"') { emAspas = true; }
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; }
    else { campo += c; }
  }
  if (campo.length || linha.length) { linha.push(campo); linhas.push(linha); }
  linhas = linhas.filter(function (l) { return l.length > 1 || (l.length === 1 && l[0].trim()); });
  var colunas = linhas.shift() || [];
  return { colunas: colunas, linhas: linhas.map(function (l) {
    var o = {}; colunas.forEach(function (k, j) { o[k] = l[j] == null ? '' : l[j]; }); return o;
  }) };
}
var CATALOGO = { colunas: [], linhas: [] };
function tecnicaPorId(id) {
  for (var i = 0; i < CATALOGO.linhas.length; i++) { if (CATALOGO.linhas[i].id === id) return CATALOGO.linhas[i]; }
  return null;
}

/* ---------------------------------------------------------------------
   3. Derivados — portes literais do app
   --------------------------------------------------------------------- */
function txt(v) { return String(v == null ? '' : v).trim(); }
function ehNota(n) { return typeof n === 'number' && isFinite(n) && n === Math.round(n) && n >= 1 && n <= 5; }
function faixaA(sev) {
  if (typeof sev !== 'number' || !isFinite(sev)) return null;
  for (var i = 0; i < FAIXAS_A.length; i++) { if (sev >= FAIXAS_A[i].min && sev <= FAIXAS_A[i].max) return FAIXAS_A[i]; }
  return null;
}
function faixaB(p) {
  if (typeof p !== 'number' || !isFinite(p)) return null;
  for (var i = 0; i < FAIXAS_B.length; i++) { if (p >= FAIXAS_B[i].min && p <= FAIXAS_B[i].max) return FAIXAS_B[i]; }
  return null;
}
function impactoAgregado(dims) {
  var maior = null;
  dims.forEach(function (n) { if (ehNota(n) && (maior === null || n > maior)) maior = n; });
  return maior;
}
function severidade(p, i) { return (ehNota(p) && ehNota(i)) ? p * i : null; }
function severidadeDoItem(it) { return severidade(it.probabilidade, impactoAgregado([it.impPrazo, it.impCusto, it.impEscopo])); }
function impactoDoItem(it) { return impactoAgregado([it.impPrazo, it.impCusto, it.impEscopo]); }
function prioridadeB(i, v, d, s, val) {
  var n = [i, v, d, s, val];
  for (var k = 0; k < n.length; k++) { if (!ehNota(n[k])) return null; }
  return ((i * PESOS_B.impacto) + (v * PESOS_B.viabilidade) + (d * PESOS_B.dados) + (s * PESOS_B.seguranca) + (val * PESOS_B.valor)) / 5;
}
function prioridadeBDoItem(it) { return prioridadeB(it.bImpacto, it.bViabilidade, it.bDados, it.bSeguranca, it.bValor); }
function precisaInvestigar(sev, q) { var f = faixaA(sev); return !!(f && f.chave === 'alto' && q === 'baixa'); }
function ehRascunho(it) { return !txt(it.causa) || !txt(it.efeito) || !txt(it.evento); }
function faltasDoEnunciado(it) {
  var f = [];
  if (!txt(it.causa)) f.push('causa');
  if (!txt(it.evento)) f.push('evento incerto');
  if (!txt(it.efeito)) f.push('efeito no objetivo');
  return f;
}
function enunciadoDe(it) {
  return 'Devido a ' + (txt(it.causa) || '⟨causa⟩') + ', pode ocorrer ' + (txt(it.evento) || '⟨evento incerto⟩') +
         ', o que levaria a ' + (txt(it.efeito) || '⟨efeito no objetivo⟩') + '.';
}
function analisarDono(dono) {
  var d = txt(dono);
  if (!d) return { estado: 'vazio', mensagem: 'Corte obrigatório (critério de saída): se não houver dono da decisão humana (risk owner), o caso não está pronto.' };
  var norm = d.toLowerCase().replace(/\s+/g, ' ');
  var semArtigo = norm.replace(/^(a|o|as|os)\s+/, '');
  var primeiro = semArtigo.split(/[\s,;()\/]+/)[0] || '';
  var generico = DONOS_GENERICOS_EXATOS.indexOf(norm) !== -1 || DONOS_GENERICOS_EXATOS.indexOf(semArtigo) !== -1 ||
                 (primeiro.length >= 4 && DONOS_COLETIVOS_INICIAIS.indexOf(primeiro) !== -1);
  if (generico) return { estado: 'generico', mensagem: 'Dono da decisão humana (risk owner) é uma pessoa nomeada, não uma área. “' + d + '” parece um time ou uma área — nenhum deles assina nada. O registro aceita, mas a governança não.' };
  return { estado: 'ok', mensagem: '' };
}
function pendenteDeDono(it) { return analisarDono(it.dono).estado === 'vazio'; }
function gatilhosHITL(item) {
  var g = [], sev = severidadeDoItem(item), f = faixaA(sev), alto = !!(f && f.chave === 'alto');
  if (alto) g.push({ id: 'g1', texto: 'Severidade alta (🔴 15–25): severidade ' + sev + '. Faixa alta nunca segue no automático.' });
  if (item.estrategia === 'Evitar' || item.estrategia === 'Explorar') g.push({ id: 'g2', texto: 'Estratégia ' + item.estrategia + ' muda o plano do projeto — exige confirmação e gera pendência de replanejamento.' });
  if (item.dadoSensivel) g.push({ id: 'g3', texto: 'Envolve dado pessoal, sensível ou sujeito a sigilo contratual.' });
  if (alto && item.qualidade === 'baixa') g.push({ id: 'g4', texto: 'Severidade alta com qualidade de dado baixa (🔴 estimativa sem referência): decidir sobre chute é pior que não decidir. O item está marcado Investigue.' });
  if (item.riscoSecundarioFaixa === 'medio' || item.riscoSecundarioFaixa === 'alto') g.push({ id: 'g5', texto: 'A resposta gera risco secundário de severidade ' + (item.riscoSecundarioFaixa === 'alto' ? 'alta' : 'média') + ' ou superior.' });
  if (item.estrategia === 'Aceitar' && alto) g.push({ id: 'g6', texto: 'Item marcado Aceitar estando em faixa alta.' });
  return g;
}
function regrasConsistencia(item) {
  var sev = severidadeDoItem(item), f = faixaA(sev), alto = !!(f && f.chave === 'alto');
  return [
    { n: 1, bloqueia: true, aplica: alto, ok: !alto || !!(item.estrategia && txt(item.acao) && txt(item.dono) && txt(item.gatilho)),
      mensagem: 'Regra 1 — Faixa alta exige resposta: nenhum item 🔴 fecha a sessão sem estratégia, ação, dono e gatilho.' },
    { n: 2, bloqueia: true, aplica: item.estrategia === 'Aceitar', ok: item.estrategia !== 'Aceitar' || !!txt(item.justificativa),
      mensagem: 'Regra 2 — Aceitar exige justificativa: é a única estratégia que precisa de motivo escrito, porque é a mais usada por omissão.' },
    { n: 3, bloqueia: false, aplica: item.estrategia === 'Evitar' || item.estrategia === 'Explorar', ok: true,
      mensagem: 'Regra 3 — Evitar e Explorar mudam o plano: gera uma pendência de replanejamento, não uma anotação no registro de riscos.' },
    { n: 4, bloqueia: true, aplica: !!item.estrategia, ok: !item.estrategia || item.riscoSecundarioAvaliado === true || !!txt(item.riscoSecundario),
      mensagem: 'Regra 4 — Resposta cria risco: responda “e o que essa ação pode causar?”. Descreva o risco secundário ou marque que avaliou e não há.' },
    { n: 5, bloqueia: true, aplica: item.estrategia === 'Escalar', ok: item.estrategia !== 'Escalar' || !!txt(item.destinatario),
      mensagem: 'Regra 5 — Escalar exige destinatário: escalar sem nomear quem recebe é abandonar, não escalar.' }
  ];
}
function bloqueiosDe(it) {
  var b = [], dono = analisarDono(it.dono);
  if (dono.estado === 'vazio') b.push(dono.mensagem);
  if (ehRascunho(it)) b.push('Enunciado incompleto: falta ' + faltasDoEnunciado(it).join(' e ') + '. O item fica como rascunho e não é priorizável.');
  if (!faixaA(severidadeDoItem(it))) b.push('Sem priorização (Régua A): informe Probabilidade e ao menos uma dimensão de Impacto na Etapa 3.');
  if (!it.qualidade) b.push('Sem qualidade do dado: informe 🟢 alta, 🟡 média ou 🔴 baixa na Etapa 3.');
  regrasConsistencia(it).forEach(function (r) { if (r.bloqueia && !r.ok) b.push(r.mensagem); });
  var pendentes = gatilhosHITL(it).filter(function (g) { return !(it.confirmacoes || {})[g.id]; });
  if (pendentes.length) b.push('Validação humana pendente: ' + pendentes.length + ' gatilho(s) de confirmação obrigatória sem confirmação explícita (Etapa 4).');
  if (!it.decisao) b.push('Registre a decisão da validação humana: aceite ou ajuste (Etapa 5).');
  return b;
}
function podeEncerrar(it) { return bloqueiosDe(it).length === 0; }
function statusDe(it) {
  if (pendenteDeDono(it)) return 'Pendente de dono';
  if (it.encerrado) return 'Encerrado';
  if (ehRascunho(it)) return 'Rascunho';
  if (precisaInvestigar(severidadeDoItem(it), it.qualidade)) return 'Investigue';
  return 'Aberto';
}
function dataBR(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

/* Decisão da validação humana "quase pronta": as origens já dizem se o humano
   ajustou algo que a IA propôs. A IA só SUGERE — a pessoa fixa. */
function decisaoSugerida(it) {
  var elos = [['enunciado', it.origem], ['nota', it.origemNota], ['resposta', it.origemResposta]]
    .filter(function (e) { return !!e[1]; });
  var ajustados = elos.filter(function (e) { return e[1] === 'ia-ajustado'; }).map(function (e) { return e[0]; });
  var aceitos = elos.filter(function (e) { return e[1] === 'ia-aceito'; }).map(function (e) { return e[0]; });
  var humanos = elos.filter(function (e) { return e[1] === 'humano'; }).map(function (e) { return e[0]; });
  if (ajustados.length) return { decisao: 'ajuste', motivo: 'a pessoa alterou a sugestão da IA em: ' + ajustados.join(', ') + (aceitos.length ? ' (aceitou como veio: ' + aceitos.join(', ') + ')' : '') };
  if (aceitos.length) return { decisao: 'aceite', motivo: 'a pessoa fixou a sugestão da IA sem alteração em: ' + aceitos.join(', ') + (humanos.length ? ' (sem sugestão em: ' + humanos.join(', ') + ')' : '') };
  if (humanos.length) return { decisao: 'aceite', motivo: 'não houve sugestão da IA neste item (' + humanos.join(', ') + ' vieram da pessoa); a recomendação aprovada como está é a própria formulação humana' };
  return { decisao: '', motivo: 'sem origem registrada — pergunte' };
}

/* ---------------------------------------------------------------------
   4. Exportação — CSV e Markdown, mesmas regras do app
   --------------------------------------------------------------------- */
var SEP = ';';
var PREFIXOS_DE_FORMULA = ['=', '+', '-', '@', '\t', '\r'];
function neutralizarFormula(v) {
  var s = String(v == null ? '' : v);
  if (s.length && PREFIXOS_DE_FORMULA.indexOf(s.charAt(0)) !== -1) return "'" + s;
  return s;
}
function campoCSV(v) {
  var s = neutralizarFormula(v);
  if (s.indexOf(SEP) !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function origemLegivel(o) { return o || 'não registrada'; }

function eloEntrada(estado, it) {
  var tec = tecnicaPorId(it.tecnica);
  return 'Contexto: ' + txt(estado.enquadramento.contexto) + ' | Dor: ' + txt(estado.enquadramento.dor) +
    ' | Dados: ' + txt(estado.enquadramento.dados) + ' | Riscos declarados: ' + txt(estado.enquadramento.riscos) +
    ' | Valor: ' + txt(estado.enquadramento.valor) +
    ' | Técnica aplicada: ' + (tec ? tec.id + ' ' + tec.tecnica + ' (' + tec.origem_pmbok + ')' : 'não registrada') +
    ' | Base da avaliação (de onde vem o número): ' + (txt(it.baseAvaliacao) || 'não registrada');
}
function eloProcessamento(estado, it) {
  var tec = tecnicaPorId(it.tecnica), p = prioridadeBDoItem(it);
  return 'Técnica: ' + (tec ? tec.id + ' ' + tec.tecnica : 'não registrada') +
    ' | Pergunta de disparo: ' + (tec ? tec.pergunta_disparo : '—') +
    ' | Régua A: ' + FORMULA_A + (p === null ? '' : ' | Régua B: ' + FORMULA_B) +
    ' | Versão das regras: ' + VERSAO_DAS_REGRAS +
    ' | Modelo: sessão em conversa com IA (Claude Code, skill /riscos) — a IA sugere, o humano fixa; tudo que foi digitado passou pelo modelo' +
    ' | Origem do enunciado: ' + origemLegivel(it.origem) + ' | Origem da nota: ' + origemLegivel(it.origemNota) +
    ' | Origem da resposta: ' + origemLegivel(it.origemResposta);
}
function eloSaida(it) {
  var sev = severidadeDoItem(it), f = faixaA(sev);
  return 'Enunciado: ' + enunciadoDe(it) + ' | Severidade: ' + (sev === null ? 'não priorizado' : sev + ' (' + (f ? f.rotulo : '—') + ')') +
    ' | Resposta proposta: ' + (it.estrategia ? it.estrategia + ' — ' + (txt(it.acao) || 'ação não descrita') : 'nenhuma');
}
function eloValidacao(it) {
  var dono = analisarDono(it.dono), gats = gatilhosHITL(it), conf = it.confirmacoes || {};
  return 'Dono: ' + (txt(it.dono) || 'PENDENTE — ' + CORTE_OBRIGATORIO) + (dono.estado === 'generico' ? ' (aviso: parece área, não pessoa)' : '') +
    ' | Data: ' + (it.validadoEm ? dataBR(it.validadoEm) : 'não encerrado') + ' | Decisão: ' + (it.decisao || 'não registrada') +
    ' | Gatilhos HITL: ' + (gats.length ? gats.map(function (g) { return g.id + (conf[g.id] ? ' confirmado ' + dataBR(conf[g.id]) : ' NÃO CONFIRMADO'); }).join(' / ') : 'nenhum') +
    ' | Fluxo: ' + NOTA_COLAPSO;
}
function eloRegistro(estado, it, agoraISO) {
  return 'Linha exportada em ' + dataBR(agoraISO) + ' | Sessão criada em ' + dataBR(estado.criadoEm) +
    ' | Conduzida por: ' + (txt(estado.conduzidaPor) || 'não informado') + ' | Status: ' + statusDe(it) +
    ' | Item ' + it.id + ' do registro de riscos de “' + txt(estado.enquadramento.contexto) + '”';
}

/* As 51 colunas do app, na mesma ordem, + 4 da skill no fim (quem lê por nome
   não se perde; quem compara com o app vê o prefixo idêntico). */
var COLUNAS_EXPORT_APP = [
  'secao', 'id', 'contexto', 'polaridade', 'status', 'tecnica', 'origem_pmbok',
  'causa', 'evento', 'efeito', 'enunciado',
  'probabilidade', 'impacto_prazo', 'impacto_custo', 'impacto_escopo_qualidade', 'impacto',
  'severidade', 'faixa_regua_a', 'qualidade_dado', 'investigue',
  'estrategia', 'acao', 'dono', 'observacao_dono', 'gatilho', 'risco_residual',
  'justificativa_aceitar', 'destinatario_escalar', 'pendencia_replanejamento',
  'risco_secundario', 'severidade_risco_secundario',
  'risco_secundario_promovido_para', 'origem_risco_secundario',
  'regua_b_impacto', 'regua_b_viabilidade', 'regua_b_dados', 'regua_b_seguranca', 'regua_b_valor',
  'regua_b_prioridade', 'faixa_regua_b',
  'gatilhos_hitl', 'confirmacoes_hitl', 'validado_por', 'validado_em', 'decisao_validacao', 'fluxo_validacao',
  'elo_entrada', 'elo_processamento', 'elo_saida', 'elo_validacao', 'elo_registro'
];
var COLUNAS_EXPORT_SKILL = ['origem_item', 'origem_nota', 'base_avaliacao', 'origem_resposta'];
var COLUNAS_EXPORT = COLUNAS_EXPORT_APP.concat(COLUNAS_EXPORT_SKILL);

function linhaExport(estado, it, agoraISO) {
  var sev = severidadeDoItem(it), f = faixaA(sev);
  var q = QUALIDADE_DADO.filter(function (x) { return x.chave === it.qualidade; })[0];
  var tec = tecnicaPorId(it.tecnica);
  var devolvido = pendenteDeDono(it);
  var pb = devolvido ? null : prioridadeBDoItem(it), fb = faixaB(pb);
  var dono = analisarDono(it.dono), gats = gatilhosHITL(it), conf = it.confirmacoes || {};
  var fs_ = FAIXAS_A.filter(function (x) { return x.chave === it.riscoSecundarioFaixa; })[0];
  return {
    secao: devolvido ? 'Pendente de dono' : 'Registro de riscos',
    id: it.id,
    contexto: txt(estado.enquadramento.contexto),
    polaridade: it.polaridade === 'oportunidade' ? 'Oportunidade' : 'Ameaça',
    status: statusDe(it),
    tecnica: tec ? tec.id + ' ' + tec.tecnica : '',
    origem_pmbok: tec ? tec.origem_pmbok : '',
    causa: txt(it.causa), evento: txt(it.evento), efeito: txt(it.efeito),
    enunciado: enunciadoDe(it),
    probabilidade: ehNota(it.probabilidade) ? it.probabilidade : '',
    impacto_prazo: ehNota(it.impPrazo) ? it.impPrazo : '',
    impacto_custo: ehNota(it.impCusto) ? it.impCusto : '',
    impacto_escopo_qualidade: ehNota(it.impEscopo) ? it.impEscopo : '',
    impacto: ehNota(impactoDoItem(it)) ? impactoDoItem(it) : '',
    severidade: sev === null ? '' : sev,
    faixa_regua_a: f ? f.emoji + ' ' + f.rotulo + ' (' + f.min + '-' + f.max + ')' : '',
    qualidade_dado: q ? q.emoji + ' ' + q.rotulo : '',
    investigue: precisaInvestigar(sev, it.qualidade) ? 'Investigue' : '',
    estrategia: it.estrategia || '',
    acao: txt(it.acao),
    dono: txt(it.dono),
    observacao_dono: dono.estado === 'ok' ? '' : dono.mensagem,
    gatilho: txt(it.gatilho),
    risco_residual: txt(it.residual),
    justificativa_aceitar: txt(it.justificativa),
    destinatario_escalar: txt(it.destinatario),
    pendencia_replanejamento: (it.estrategia === 'Evitar' || it.estrategia === 'Explorar')
      ? (txt(it.replanejamento) || 'Replanejamento pendente: ' + it.estrategia + ' muda o plano do projeto') : '',
    risco_secundario: it.riscoSecundarioAvaliado && !txt(it.riscoSecundario) ? 'Avaliado: nenhum' : txt(it.riscoSecundario),
    severidade_risco_secundario: fs_ ? fs_.emoji + ' ' + fs_.rotulo : '',
    risco_secundario_promovido_para: txt(it.promovidoPara),
    origem_risco_secundario: txt(it.origemRiscoSecundario),
    regua_b_impacto: devolvido || !ehNota(it.bImpacto) ? '' : it.bImpacto,
    regua_b_viabilidade: devolvido || !ehNota(it.bViabilidade) ? '' : it.bViabilidade,
    regua_b_dados: devolvido || !ehNota(it.bDados) ? '' : it.bDados,
    regua_b_seguranca: devolvido || !ehNota(it.bSeguranca) ? '' : it.bSeguranca,
    regua_b_valor: devolvido || !ehNota(it.bValor) ? '' : it.bValor,
    regua_b_prioridade: pb === null ? '' : pb,
    faixa_regua_b: devolvido ? 'Devolvido — sem dono, o caso não recebe nota' : (fb ? fb.rotulo + ' (' + fb.min + '-' + fb.max + ')' : ''),
    gatilhos_hitl: gats.map(function (g) { return g.id + ': ' + g.texto; }).join(' / '),
    confirmacoes_hitl: gats.map(function (g) { return g.id + ' = ' + (conf[g.id] ? 'confirmado em ' + dataBR(conf[g.id]) : 'NÃO CONFIRMADO'); }).join(' / '),
    validado_por: txt(it.dono),
    validado_em: it.validadoEm ? dataBR(it.validadoEm) : '',
    decisao_validacao: it.decisao || '',
    fluxo_validacao: NOTA_COLAPSO,
    elo_entrada: eloEntrada(estado, it),
    elo_processamento: eloProcessamento(estado, it),
    elo_saida: eloSaida(it),
    elo_validacao: eloValidacao(it),
    elo_registro: eloRegistro(estado, it, agoraISO),
    origem_item: it.origem || '',
    origem_nota: it.origemNota || '',
    base_avaliacao: txt(it.baseAvaliacao),
    origem_resposta: it.origemResposta || ''
  };
}
function numeroDoId(id) { var m = /^R(\d+)$/.exec(String(id == null ? '' : id)); return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER; }
function itensOrdenados(estado) {
  return estado.itens.slice().sort(function (a, b) {
    var pa = pendenteDeDono(a) ? 1 : 0, pb = pendenteDeDono(b) ? 1 : 0;
    if (pa !== pb) return pa - pb;
    var na = numeroDoId(a.id), nb = numeroDoId(b.id);
    if (na !== nb) return na - nb;
    if (a.id === b.id) return 0;
    return a.id < b.id ? -1 : 1;
  });
}
function gerarCSV(estado, agoraISO) {
  var linhas = [COLUNAS_EXPORT.join(SEP)];
  itensOrdenados(estado).forEach(function (it) {
    var d = linhaExport(estado, it, agoraISO);
    linhas.push(COLUNAS_EXPORT.map(function (c) { return campoCSV(d[c]); }).join(SEP));
  });
  return linhas.join('\r\n') + '\r\n';
}
function mdEscapa(s) { return String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' '); }

function gerarMarkdown(estado, agoraISO) {
  var comDono = estado.itens.filter(function (it) { return !pendenteDeDono(it); });
  var semDono = estado.itens.filter(pendenteDeDono);
  var l = [];
  l.push('# Registro de riscos — ' + (txt(estado.enquadramento.contexto) || 'sessão sem contexto'));
  l.push('');
  l.push('**Sessão iniciada em:** ' + dataBR(estado.criadoEm) + '  ');
  l.push('**Exportado em:** ' + dataBR(agoraISO) + '  ');
  l.push('**Conduzida por:** ' + (txt(estado.conduzidaPor) || 'não informado') + '  ');
  l.push('**Versão das regras:** ' + VERSAO_DAS_REGRAS);
  l.push('');
  l.push('## Enquadramento — mapa inicial de oportunidades (registro de partes interessadas + declaração de escopo)');
  l.push('');
  l.push('| Coluna | Pergunta | Resposta |');
  l.push('|---|---|---|');
  COLUNAS_ENQUADRAMENTO.forEach(function (c) {
    l.push('| ' + mdEscapa(c.titulo) + ' | ' + mdEscapa(c.pergunta) + ' | ' + mdEscapa(txt(estado.enquadramento[c.chave]) || '—') + ' |');
  });
  l.push('');
  l.push('## Validação humana (HITL — risk owner + governança)');
  l.push('');
  l.push('> **Corte obrigatório (critério de saída):** ' + CORTE_OBRIGATORIO);
  l.push('');
  l.push('**Fluxo de validação da Aula 2:** ' + FLUXO_VALIDACAO);
  l.push('');
  l.push('> ⚠️ ' + NOTA_COLAPSO);
  l.push('');

  function tabelaMD(lista) {
    var out = [];
    out.push('| ID | Polaridade | Enunciado | Técnica | P | I | Severidade | Faixa | Qualidade do dado | Estratégia | Ação | Dono | Gatilho | Risco residual | Status |');
    out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    lista.forEach(function (it) {
      var sev = severidadeDoItem(it), f = faixaA(sev);
      var q = QUALIDADE_DADO.filter(function (x) { return x.chave === it.qualidade; })[0];
      var tec = tecnicaPorId(it.tecnica);
      out.push('| ' + [
        it.id, it.polaridade === 'oportunidade' ? 'Oportunidade' : 'Ameaça', mdEscapa(enunciadoDe(it)),
        tec ? tec.id + ' ' + tec.tecnica : '—',
        ehNota(it.probabilidade) ? it.probabilidade : '—', ehNota(impactoDoItem(it)) ? impactoDoItem(it) : '—',
        sev === null ? '—' : sev, f ? f.emoji + ' ' + f.rotulo : '—', q ? q.emoji + ' ' + q.rotulo : '—',
        it.estrategia || '—', mdEscapa(txt(it.acao) || '—'), mdEscapa(txt(it.dono) || '—'),
        mdEscapa(txt(it.gatilho) || '—'), mdEscapa(txt(it.residual) || '—'), statusDe(it)
      ].join(' | ') + ' |');
    });
    return out;
  }

  l.push('## Registro de riscos (Régua A — Probabilidade × Impacto)');
  l.push('');
  l.push('`' + FORMULA_A + '`');
  l.push('');
  if (comDono.length) l = l.concat(tabelaMD(comDono)); else l.push('_Nenhum item com dono da decisão humana nomeado._');
  l.push('');
  l.push('## Pendente de dono');
  l.push('');
  if (semDono.length) {
    l.push('> ' + CORTE_OBRIGATORIO + ' Os itens abaixo estão registrados mas **não podem ser encerrados**. A lacuna aparece aqui para ficar visível em vez de silenciosa.');
    l.push('');
    l = l.concat(tabelaMD(semDono));
  } else l.push('_Nenhum item pendente de dono._');
  l.push('');

  var pontuados = estado.itens.filter(function (it) { return !pendenteDeDono(it) && prioridadeBDoItem(it) !== null; })
    .sort(function (a, b) { return prioridadeBDoItem(b) - prioridadeBDoItem(a); });
  l.push('## Desempate de respostas (Régua B — fórmula da Aula 2)');
  l.push('');
  l.push('Prioriza **iniciativas e respostas**, não riscos. Régua separada da Régua A: as duas nunca são somadas.');
  l.push('');
  l.push('`' + FORMULA_B + '`');
  l.push('');
  if (pontuados.length) {
    l.push('| # | ID | Ação | Dono | I | V | D | S | Val | Prioridade | Decisão |');
    l.push('|---|---|---|---|---|---|---|---|---|---|---|');
    pontuados.forEach(function (it, i) {
      var p = prioridadeBDoItem(it), fb = faixaB(p);
      l.push('| ' + [i + 1, it.id, mdEscapa(txt(it.acao) || '—'), mdEscapa(txt(it.dono) || '—'),
        it.bImpacto, it.bViabilidade, it.bDados, it.bSeguranca, it.bValor, p, fb ? fb.rotulo : '—'].join(' | ') + ' |');
    });
  } else l.push('_Nenhuma resposta pontuada pela Régua B nesta sessão._');
  l.push('');

  var replan = estado.itens.filter(function (it) { return it.estrategia === 'Evitar' || it.estrategia === 'Explorar'; });
  l.push('## Pendências de replanejamento');
  l.push('');
  if (replan.length) {
    l.push('Regra 3 — Evitar e Explorar mudam o plano do projeto. Não são anotação no registro de riscos.');
    l.push('');
    replan.forEach(function (it) {
      l.push('- **' + it.id + '** (' + it.estrategia + '): ' + mdEscapa(txt(it.replanejamento) || 'Replanejamento pendente para: ' + (txt(it.acao) || 'a ação escolhida')));
    });
  } else l.push('_Nenhuma._');
  l.push('');

  var secundarios = estado.itens.filter(function (it) { return txt(it.riscoSecundario); });
  l.push('## Riscos secundários levantados');
  l.push('');
  if (secundarios.length) {
    l.push('Regra 4 — toda resposta pode introduzir um risco novo. Cada linha abaixo deve entrar no registro como item novo.');
    l.push('');
    secundarios.forEach(function (it) {
      var fs_ = FAIXAS_A.filter(function (x) { return x.chave === it.riscoSecundarioFaixa; })[0];
      l.push('- **' + it.id + '**: ' + mdEscapa(txt(it.riscoSecundario)) + (fs_ ? ' — severidade estimada ' + fs_.emoji + ' ' + fs_.rotulo : '') +
        (txt(it.promovidoPara) ? ' — promovido a item ' + txt(it.promovidoPara) : ''));
    });
  } else l.push('_Nenhum registrado._');
  l.push('');

  l.push('## Rastreabilidade (auditabilidade / trilha de decisão)');
  l.push('');
  l.push('> Se a recomendação não pode ser explicada, auditada ou contestada, ela não está pronta para decisões críticas.');
  l.push('');
  estado.itens.forEach(function (it) {
    l.push('### ' + it.id + ' — ' + mdEscapa(enunciadoDe(it)));
    l.push('');
    l.push('| Elo | Conteúdo |');
    l.push('|---|---|');
    l.push('| **Entrada** | ' + mdEscapa(eloEntrada(estado, it)) + ' |');
    l.push('| **Processamento** | ' + mdEscapa(eloProcessamento(estado, it)) + ' |');
    l.push('| **Saída** | ' + mdEscapa(eloSaida(it)) + ' |');
    l.push('| **Validação** | ' + mdEscapa(eloValidacao(it)) + ' |');
    l.push('| **Registro** | ' + mdEscapa(eloRegistro(estado, it, agoraISO)) + ' |');
    l.push('');
  });

  l.push('## Limites da ferramenta');
  l.push('');
  l.push('- **A ferramenta não decide.** Organiza evidência e calcula de forma consistente. A assinatura é humana.');
  l.push('- **A ferramenta não sabe do seu projeto.** Toda nota vem de quem preenche; ela não valida se a nota é honesta. Nesta sessão a IA sugeriu enunciados, notas e respostas — cada item diz a origem, e nada valeu antes de a pessoa fixar.');
  l.push('- **A ferramenta não substitui** o plano de gerenciamento de riscos, nem a análise quantitativa, nem o monitoramento contínuo.');
  l.push('- **Tudo que foi digitado passou pelo modelo que roda a skill.** Quem precisa de zero-rede usa a superfície web `docs/index.html`, que não envia nada a servidor.');
  l.push('');
  l.push('---');
  l.push('');
  l.push('Gerado pela skill `/riscos` (' + VERSAO_SKILL + ') a partir do kernel `metodo/`. ');
  l.push('Vocabulário da disciplina Formação de Consultores em IA Aplicada ao PPPM (Prof. Dr. José Bezerra, BSBr). ');
  l.push('PMI®, PMBOK® e PMP® são marcas do Project Management Institute, Inc.');
  l.push('');
  return l.join('\n');
}

function nomeArquivo(estado, ext, agora) {
  var base = (txt(estado.enquadramento.contexto) || 'sessao').toLowerCase();
  if (typeof base.normalize === 'function') base = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  base = base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'sessao';
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  return 'registro-de-riscos-' + base + '-' + agora.getFullYear() + pad(agora.getMonth() + 1) + pad(agora.getDate()) +
         '-' + pad(agora.getHours()) + pad(agora.getMinutes()) + '.' + ext;
}

/* ---------------------------------------------------------------------
   5. CLI
   --------------------------------------------------------------------- */
function acharRaiz(deArquivo) {
  var dir = path.resolve(path.dirname(deArquivo));
  for (var i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, 'metodo', 'tecnicas.csv'))) return dir;
    var pai = path.dirname(dir);
    if (pai === dir) break;
    dir = pai;
  }
  return null;
}
function carregar(caminho) {
  var estado = JSON.parse(fs.readFileSync(caminho, 'utf8'));
  estado.enquadramento = estado.enquadramento || {};
  estado.itens = Array.isArray(estado.itens) ? estado.itens : [];
  estado.itens.forEach(function (it) { it.confirmacoes = it.confirmacoes || {}; });
  var raiz = acharRaiz(caminho);
  if (raiz) CATALOGO = parseCSV(fs.readFileSync(path.join(raiz, 'metodo', 'tecnicas.csv'), 'utf8'));
  else process.stderr.write('aviso: metodo/tecnicas.csv não encontrado acima de ' + caminho + ' — técnicas sairão como "não registrada"\n');
  return estado;
}
function statusSessao(estado) {
  var itens = estado.itens.map(function (it) {
    var sev = severidadeDoItem(it), f = faixaA(sev), gats = gatilhosHITL(it);
    return {
      id: it.id, status: statusDe(it), severidade: sev, faixa: f ? f.chave : null,
      dono: txt(it.dono), donoEstado: analisarDono(it.dono).estado,
      decisao: it.decisao || '', encerrado: !!it.encerrado, validadoEm: it.validadoEm || '',
      decisaoSugerida: decisaoSugerida(it),
      gatilhos: gats.map(function (g) { return { id: g.id, texto: g.texto, confirmadoEm: it.confirmacoes[g.id] || '' }; }),
      bloqueios: bloqueiosDe(it),
      podeEncerrar: podeEncerrar(it),
      /* só falta a decisão: é o caso "encerra assim que a pessoa fixar aceite/ajuste" */
      soFaltaDecisao: !it.decisao && bloqueiosDe(it).every(function (b) { return /decisão da validação humana/.test(b); })
    };
  });
  return {
    contexto: txt(estado.enquadramento.contexto), conduzidaPor: txt(estado.conduzidaPor), etapa: estado.etapa,
    total: itens.length,
    pendentesDeDono: itens.filter(function (i) { return i.status === 'Pendente de dono'; }).map(function (i) { return i.id; }),
    encerrados: itens.filter(function (i) { return i.encerrado && i.status === 'Encerrado'; }).map(function (i) { return i.id; }),
    prontosParaEncerrar: itens.filter(function (i) { return i.podeEncerrar && !i.encerrado; }).map(function (i) { return i.id; }),
    soFaltaDecisao: itens.filter(function (i) { return i.soFaltaDecisao; }).map(function (i) { return i.id; }),
    bloqueados: itens.filter(function (i) { return !i.podeEncerrar && !i.soFaltaDecisao; }).map(function (i) { return i.id; }),
    itens: itens
  };
}

function main(argv) {
  var cmd = argv[0], arq = argv[1];
  if (!cmd || !arq || ['status', 'exportar', 'linha'].indexOf(cmd) === -1) {
    process.stderr.write('uso: node exportar.js status|exportar|linha <sessao.json> [--dir D] [ID]\n');
    return 2;
  }
  var estado = carregar(arq);
  var agora = new Date(), agoraISO = agora.toISOString();
  if (cmd === 'status') { process.stdout.write(JSON.stringify(statusSessao(estado), null, 2) + '\n'); return 0; }
  if (cmd === 'linha') {
    var it = estado.itens.filter(function (x) { return x.id === argv[2]; })[0];
    if (!it) { process.stderr.write('item não encontrado: ' + argv[2] + '\n'); return 1; }
    process.stdout.write(JSON.stringify(linhaExport(estado, it, agoraISO), null, 2) + '\n'); return 0;
  }
  var dir = path.dirname(path.resolve(arq));
  var k = argv.indexOf('--dir');
  if (k !== -1 && argv[k + 1]) dir = path.resolve(argv[k + 1]);
  if (!estado.itens.length) { process.stderr.write('registro vazio: nada a exportar (mesmo bloqueio do app)\n'); return 1; }
  var csvPath = path.join(dir, nomeArquivo(estado, 'csv', agora));
  var mdPath = path.join(dir, nomeArquivo(estado, 'md', agora));
  fs.writeFileSync(csvPath, '\uFEFF' + gerarCSV(estado, agoraISO), 'utf8');
  fs.writeFileSync(mdPath, gerarMarkdown(estado, agoraISO), 'utf8');
  var st = statusSessao(estado);
  process.stdout.write(JSON.stringify({
    csv: csvPath, md: mdPath, itens: st.total, pendentesDeDono: st.pendentesDeDono.length,
    encerrados: st.encerrados.length, colunasCSV: COLUNAS_EXPORT.length
  }, null, 2) + '\n');
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  bloqueiosDe: bloqueiosDe, podeEncerrar: podeEncerrar, statusDe: statusDe, gatilhosHITL: gatilhosHITL,
  decisaoSugerida: decisaoSugerida, linhaExport: linhaExport, gerarCSV: gerarCSV, gerarMarkdown: gerarMarkdown,
  COLUNAS_EXPORT: COLUNAS_EXPORT, COLUNAS_EXPORT_APP: COLUNAS_EXPORT_APP, campoCSV: campoCSV, neutralizarFormula: neutralizarFormula,
  statusSessao: statusSessao, carregar: carregar, parseCSV: parseCSV
};
