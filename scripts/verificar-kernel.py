#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verifica a paridade entre o kernel do método (metodo/) e a superfície web (docs/index.html).

O autoteste embutido em docs/index.html trava as constantes do app contra elas mesmas:
qualquer edição no HTML quebra. Mas os dois lados daquela comparação estão dentro do
mesmo arquivo, então uma edição feita NO KERNEL passa despercebida por ele — que é
justamente a direção que a restrição "o app consome o kernel e nunca o redefine" trata.

Este script fecha esse buraco. Ele lê os dois lados de verdade:

  - metodo/escalas-e-priorizacao.md  -> faixas da Régua A, pesos e faixas da Régua B
  - metodo/estrategias-de-resposta.md -> os nomes das 10 estratégias
  - metodo/governanca-hitl.md         -> os 6 gatilhos de validação humana
  - metodo/tecnicas.csv               -> o catálogo, comparado byte a byte com o embutido

Uso:
    python3 scripts/verificar-kernel.py          # a partir da raiz do repositório
    python3 scripts/verificar-kernel.py --raiz /caminho/do/repo

Sai com 0 quando tudo confere e 1 na primeira divergência encontrada.
Sem dependências além da biblioteca padrão do Python 3.
"""

import argparse
import os
import re
import sys

FALHAS = []
CONFERIDOS = []


def confere(rotulo, do_kernel, do_app):
    if do_kernel == do_app:
        CONFERIDOS.append(rotulo)
    else:
        FALHAS.append(
            "%s\n    kernel: %r\n    app:    %r" % (rotulo, do_kernel, do_app)
        )


def ler(caminho):
    with open(caminho, encoding="utf-8") as f:
        return f.read()


# ---------------------------------------------------------------- kernel


def faixas_a_do_kernel(texto):
    """| 🔴 **Alto** | 15 – 25 | ... -> [('🔴', 'Alto', 15, 25), ...]

    Compara emoji e rótulo exibido, não a chave interna: a chave do app é um
    identificador sem acento ('medio') e nunca apareceu no kernel.
    """
    achados = []
    for emoji, rotulo, lo, hi in re.findall(
        r"\|\s*(🔴|🟡|🟢)\s*\*\*([A-Za-zÀ-ÿ]+)\*\*\s*\|\s*(\d+)\s*[–-]\s*(\d+)\s*\|", texto
    ):
        achados.append((emoji, rotulo, int(lo), int(hi)))
    return achados


def pesos_b_do_kernel(texto):
    """| Impacto | 30% | ... -> {'Impacto': 30, ...}, na ordem da tabela."""
    pesos = []
    for nome, peso in re.findall(
        r"\|\s*(Impacto|Viabilidade|Dados|Segurança|Valor)\s*\|\s*(\d+)%\s*\|", texto
    ):
        pesos.append((nome, int(peso)))
    return pesos


def formula_b_do_kernel(texto):
    """Extrai os multiplicadores da própria linha da fórmula."""
    m = re.search(
        r"Prioridade\s*=\s*\(\(Impacto\s*×\s*(\d+)\)\s*\+\s*\(Viabilidade\s*×\s*(\d+)\)\s*\+\s*"
        r"\(Dados\s*×\s*(\d+)\)\s*\+\s*\(Segurança\s*×\s*(\d+)\)\s*\+\s*\(Valor\s*×\s*(\d+)\)\)\s*÷\s*(\d+)",
        texto,
    )
    if not m:
        return None
    return [int(g) for g in m.groups()]


def faixas_b_do_kernel(texto):
    """| 80 – 100 | Fazer agora | ... -> [(80, 100, 'Fazer agora'), ...]"""
    achados = []
    for lo, hi, rotulo in re.findall(
        r"\|\s*(\d+)\s*[–-]\s*(\d+)\s*\|\s*(Fazer agora|Preparar|Não priorizar)\s*\|", texto
    ):
        achados.append((int(lo), int(hi), rotulo))
    return achados


def estrategias_do_kernel(texto):
    """Nomes em negrito na primeira coluna das duas tabelas de estratégia."""
    ameacas, oportunidades = [], []
    secao = None
    for linha in texto.splitlines():
        if linha.startswith("## Ameaças"):
            secao = "a"
            continue
        if linha.startswith("## Oportunidades"):
            secao = "o"
            continue
        if linha.startswith("## "):
            secao = None
            continue
        m = re.match(r"\|\s*\*\*([A-Za-zÀ-ÿ]+)\*\*\s*\|", linha)
        if m and secao == "a":
            ameacas.append(m.group(1))
        elif m and secao == "o":
            oportunidades.append(m.group(1))
    return ameacas, oportunidades


def gatilhos_do_kernel(texto):
    """Conta os itens da lista numerada sob 'Gatilhos de validação humana obrigatória'."""
    m = re.search(
        r"## Gatilhos de validação humana obrigatória(.*?)(?=\n## )", texto, re.S
    )
    if not m:
        return []
    return re.findall(r"^\s*(\d+)\.\s+(.+)$", m.group(1), re.M)


# ------------------------------------------------------------------- app


def faixas_a_do_app(texto):
    achados = []
    for lo, hi, emoji, rotulo in re.findall(
        r"\{\s*chave:\s*'\w+',\s*min:\s*(\d+),\s*max:\s*(\d+),\s*emoji:\s*'([^']+)',"
        r"\s*rotulo:\s*'([^']+)'",
        texto,
    ):
        achados.append((emoji, rotulo, int(lo), int(hi)))
    return achados


def pesos_b_do_app(texto):
    m = re.search(
        r"var PESOS_B = \{\s*impacto:\s*(\d+),\s*viabilidade:\s*(\d+),\s*dados:\s*(\d+),"
        r"\s*seguranca:\s*(\d+),\s*valor:\s*(\d+)\s*\}",
        texto,
    )
    return [int(g) for g in m.groups()] if m else None


def criterios_b_do_app(texto):
    achados = []
    for titulo, peso in re.findall(
        r"titulo:\s*'([^']+)',\s*peso:\s*(\d+)", texto
    ):
        achados.append((titulo, int(peso)))
    return achados


def divisor_b_do_app(texto):
    m = re.search(r"PESOS_B\.valor\)\)\s*/\s*(\d+);", texto)
    return int(m.group(1)) if m else None


def faixas_b_do_app(texto):
    achados = []
    for chave, lo, hi, rotulo in re.findall(
        r"\{\s*chave:\s*'(\w+)',\s*min:\s*(\d+),\s*max:\s*(\d+),\s*rotulo:\s*'([^']+)'",
        texto,
    ):
        achados.append((int(lo), int(hi), rotulo))
    return achados


def estrategias_do_app(texto):
    def nomes(bloco):
        return re.findall(r"\{\s*nome:\s*'([^']+)'", bloco)

    m = re.search(r"ameaca:\s*\[(.*?)\n  \],", texto, re.S)
    a = nomes(m.group(1)) if m else []
    m = re.search(r"oportunidade:\s*\[(.*?)\n  \]\n\};", texto, re.S)
    o = nomes(m.group(1)) if m else []
    return a, o


def gatilhos_do_app(texto):
    m = re.search(r"function gatilhosHITL\(item\) \{(.*?)\n\}", texto, re.S)
    if not m:
        return []
    return sorted(set(re.findall(r"id:\s*'(g\d+)'", m.group(1))))


def csv_embutido(texto):
    m = re.search(
        r'<script type="text/csv" id="tecnicas-csv">\n(.*?)</script>', texto, re.S
    )
    return m.group(1) if m else None


# ------------------------------------------------------------------ main


def main():
    ap = argparse.ArgumentParser(description="Verifica a paridade entre metodo/ e docs/index.html")
    ap.add_argument("--raiz", default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    args = ap.parse_args()
    raiz = args.raiz

    caminhos = {
        "escalas": os.path.join(raiz, "metodo", "escalas-e-priorizacao.md"),
        "estrategias": os.path.join(raiz, "metodo", "estrategias-de-resposta.md"),
        "governanca": os.path.join(raiz, "metodo", "governanca-hitl.md"),
        "csv": os.path.join(raiz, "metodo", "tecnicas.csv"),
        "app": os.path.join(raiz, "docs", "index.html"),
    }
    for nome, caminho in caminhos.items():
        if not os.path.exists(caminho):
            print("ERRO: arquivo ausente: %s" % caminho, file=sys.stderr)
            return 2

    escalas = ler(caminhos["escalas"])
    estrategias = ler(caminhos["estrategias"])
    governanca = ler(caminhos["governanca"])
    csv_kernel = ler(caminhos["csv"])
    app = ler(caminhos["app"])

    # --- Régua A
    confere(
        "Régua A · faixas, emoji e rótulos (metodo/escalas-e-priorizacao.md -> FAIXAS_A)",
        faixas_a_do_kernel(escalas),
        faixas_a_do_app(app),
    )

    # --- Régua B: pesos, na fórmula, na tabela do kernel e nos dois lugares do app
    pesos_kernel = pesos_b_do_kernel(escalas)
    formula = formula_b_do_kernel(escalas)
    if formula is None:
        FALHAS.append("Régua B · não foi possível ler a fórmula em metodo/escalas-e-priorizacao.md")
    else:
        confere(
            "Régua B · pesos da tabela batem com os da fórmula, dentro do kernel",
            [p for _, p in pesos_kernel],
            formula[:5],
        )
        confere("Régua B · divisor da fórmula (kernel -> app)", formula[5], divisor_b_do_app(app))

    confere(
        "Régua B · pesos (metodo/escalas-e-priorizacao.md -> PESOS_B)",
        [p for _, p in pesos_kernel],
        pesos_b_do_app(app),
    )
    confere(
        "Régua B · critérios e pesos exibidos na UI (kernel -> CRITERIOS_B)",
        pesos_kernel,
        criterios_b_do_app(app),
    )
    confere(
        "Régua B · faixas (metodo/escalas-e-priorizacao.md -> FAIXAS_B)",
        faixas_b_do_kernel(escalas),
        faixas_b_do_app(app),
    )

    # --- Estratégias
    ka, ko = estrategias_do_kernel(estrategias)
    aa, ao = estrategias_do_app(app)
    confere("Estratégias de ameaça (metodo/estrategias-de-resposta.md -> ESTRATEGIAS.ameaca)", ka, aa)
    confere("Estratégias de oportunidade (metodo/estrategias-de-resposta.md -> ESTRATEGIAS.oportunidade)", ko, ao)

    # --- Gatilhos de HITL
    gk = gatilhos_do_kernel(governanca)
    confere(
        "Gatilhos de validação humana (metodo/governanca-hitl.md -> gatilhosHITL)",
        ["g%s" % n for n, _ in gk],
        gatilhos_do_app(app),
    )

    # --- Catálogo embutido, byte a byte
    embutido = csv_embutido(app)
    if embutido is None:
        FALHAS.append("Catálogo · bloco <script type=\"text/csv\" id=\"tecnicas-csv\"> não encontrado em docs/index.html")
    else:
        confere("Catálogo · metodo/tecnicas.csv byte a byte no bloco embutido", csv_kernel, embutido)

    # --- relatório
    largura = 74
    print("verificar-kernel · paridade entre metodo/ e docs/index.html")
    print("-" * largura)
    for rotulo in CONFERIDOS:
        print("  ok   %s" % rotulo)
    for falha in FALHAS:
        print("  FALHA %s" % falha)
    print("-" * largura)
    if FALHAS:
        print("%d divergência(s) em %d verificação(ões)." % (len(FALHAS), len(CONFERIDOS) + len(FALHAS)))
        print("O kernel em metodo/ é a fonte de verdade: ajuste docs/index.html para ele, nunca o contrário.")
        return 1
    print("OK — %d verificação(ões), nenhuma divergência entre metodo/ e docs/index.html." % len(CONFERIDOS))
    return 0


if __name__ == "__main__":
    sys.exit(main())
