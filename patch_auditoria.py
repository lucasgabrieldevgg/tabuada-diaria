import io

P = '/home/user/tabuada-auditoria/index.html'
r = io.open(P, encoding='utf-8').read()
orig = r

def rep(old, new, n=1):
    global r
    assert r.count(old) >= 1, 'NAO ACHOU: ' + old[:70]
    r = r.replace(old, new, n)

# ── P0-1: vars usadas pelo JS nunca definidas (feedback sem cor) ──
rep("""    --cinza:#6b7280; --sombra:rgba(30,64,175,.10); --navbg:rgba(247,245,238,.96); --trilha:#e7e5e0; --tx-tip:#374151;
  }""",
"""    --cinza:#6b7280; --sombra:rgba(30,64,175,.10); --navbg:rgba(247,245,238,.96); --trilha:#e7e5e0; --tx-tip:#374151;
    --papel3:#ffffff; --margem:rgba(220,38,38,.30); --warn:#d97706;
    --ok:var(--corretor); --bad:var(--professor); --muted:var(--cinza);
  }""")

# ── dark: equivalents ──
rep("""    --navbg:rgba(22,25,37,.96); --trilha:#2a2f42; --tx-tip:#c3cad9;
  }""",
"""    --navbg:rgba(22,25,37,.96); --trilha:#2a2f42; --tx-tip:#c3cad9;
    --papel3:#262b3f; --margem:rgba(248,113,113,.32); --warn:#fbbf24;
  }""")

# ── Craft floor: browser surfaces (o tell nº1) — seleção = marca-texto ──
rep("""  body{transition:background-color .25s,color .25s}""",
"""  body{transition:background-color .25s,color .25s}
  /* ===== PISO DE ACABAMENTO (superfícies do navegador temáticas) ===== */
  ::selection{background:var(--marcatexto); color:#713f12}
  html{scrollbar-color:var(--tinta-suave) transparent; scrollbar-width:thin}
  ::-webkit-scrollbar{width:11px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--tinta-suave); border-radius:99px; border:3px solid var(--papel)}
  :focus-visible{outline:2px dashed var(--tinta); outline-offset:3px}
  input[type=number]{font-variant-numeric:tabular-nums}
  input[type=number]::placeholder{color:var(--cinza); opacity:.7}""")

# ── P0-2: hover branco no escuro ──
rep("""  nav button:hover{border-color:var(--tinta); background:#fff}""",
"""  nav button:hover{border-color:var(--tinta); background:var(--papel3)}""")

# ── Refuse: border-left 5px azul genérico → margem vermelha da professora (espelho da margem da página) ──
rep("""    background:var(--papel2);border:1.5px solid var(--tinta-suave);border-left:5px solid var(--tinta);
    border-radius:6px;padding:15px 18px;margin-bottom:12px; box-shadow:2px 2px 0 var(--sombra);""",
"""    background:var(--papel2);border:1.5px solid var(--tinta-suave);border-left:2px solid var(--margem);
    border-radius:6px;padding:15px 18px;margin-bottom:12px; box-shadow:2px 2px 0 var(--sombra);""")

# ── P0-3: footer com cinza hardcoded (2.5:1 no claro) → var da identidade ──
rep("""  footer{text-align:center;color:#9ca3af;font-size:.82rem;padding:22px;font-style:italic}""",
"""  footer{text-align:center;color:var(--cinza);font-size:.82rem;padding:22px;font-style:italic}""")

# ── Harden: meta description ──
rep("""<title>Tabuada Diária — Estude e Domine a Multiplicação</title>""",
"""<title>Tabuada Diária — Estude e Domine a Multiplicação</title>
<meta name="description" content="Caderno de tabuada gratuito: flashcards, quiz e desafio contra o relógio para dominar a multiplicação de 2×2 a 9×9 estudando poucos minutos por dia.">""")

assert '--ok:var(--corretor)' in r and '--margem' in r
io.open(P, 'w', encoding='utf-8').write(r)
print('patch craft-floor aplicado ✓ (%d bytes, era %d)' % (len(r), len(orig)))
