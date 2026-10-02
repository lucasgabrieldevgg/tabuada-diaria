// ============================================================
// 🧮 Suíte de comportamento — Tabuada Diária (caderno)
// Testa a lógica REAL do app: fatos, streak diária, quiz com
// domínio ⭐, flashcards com peso de erro e desafio 60s.
// jsdom puro, sem dependências externas além do jsdom.
// ============================================================
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const htmlSemScript = html.replace(/<script>[\s\S]*?<\/script>/, '');

let pass = 0, fail = 0;
function ok(cond, nome) {
  if (cond) { pass++; console.log('  ✓ ' + nome); }
  else { fail++; console.log('  ✗ FALHOU: ' + nome); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// carrega o app num jsdom com localStorage já populado (opcional)
function carregar(preDB) {
  const dom = new JSDOM(htmlSemScript, { url: 'http://localhost/', runScripts: 'outside-only' });
  if (preDB) dom.window.localStorage.setItem('tabuada', JSON.stringify(preDB));
  const probe = `
    ;globalThis.__T = {
      FACTS, pickFlash, masteredCount, startQuiz, startDes,
      endDes: () => endDes(),
      get flashIdx() { return flashIdx; },
      set desScore(v) { desScore = v; }
    };`;
  dom.window.eval(script + probe);
  return dom;
}

(async () => {
  console.log('— DADOS (36 fatos) —');
  {
    const dom = carregar();
    const w = dom.window;
    const FACTS = w.__T.FACTS;
    ok(FACTS.length === 36, '36 fatos (2×2 até 9×9)');
    ok(new Set(FACTS.map(f => f.key)).size === 36, 'chaves únicas');
    ok(FACTS.every(f => f.r === f.a * f.b), 'toda resposta é a × b');
    ok(new Set(FACTS.map(f => [f.a, f.b].sort().join('-'))).size === 36, 'sem par duplicado (comutatividade)');
  }

  console.log('— STREAK DIÁRIA —');
  {
    const dom = carregar(); // primeira visita
    const w = dom.window;
    const db = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db.streak === 1, 'primeira visita → streak 1');
    const hoje = new Date().toISOString().slice(0, 10);
    ok(db.lastDay === hoje, 'lastDay marcado como hoje');
  }
  {
    const ontem = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const dom = carregar({ streak: 3, lastDay: ontem }); // visitou ontem
    const w = dom.window;
    const db = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db.streak === 4, 'visitou ontem (3 dias) → hoje streak 4');
  }
  {
    const antigo = new Date(Date.now() - 5 * 864e5).toISOString().slice(0, 10);
    const dom = carregar({ streak: 9, lastDay: antigo }); // sumiu 5 dias
    const w = dom.window;
    const db = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db.streak === 1, 'sumiu 5 dias → streak reinicia em 1 (sem punição injusta)');
  }

  console.log('— NAVEGAÇÃO E TABELA —');
  {
    const dom = carregar();
    const d = dom.window.document;
    ok(d.querySelectorAll('.fact').length === 36, 'tabela renderiza 36 cards');
    d.querySelector('nav button[data-tab="quiz"]').click();
    ok(d.getElementById('quiz').classList.contains('show'), 'aba Quiz abre');
    ok(!d.getElementById('tabela').classList.contains('show'), 'aba anterior fecha');
    d.getElementById('btnHideAll').click();
    ok(d.querySelectorAll('.fact.hide-ans').length === 36, '"esconder todas" esconde 36');
    d.getElementById('btnShowAll').click();
    ok(d.querySelectorAll('.fact.hide-ans').length === 0, '"mostrar todas" revela');
    d.querySelectorAll('.fact')[5].click();
    ok(d.querySelectorAll('.fact')[5].classList.contains('hide-ans'), 'clique individual esconde/mostra 1 card');
  }

  console.log('— QUIZ (10 perguntas, domínio ⭐) —');
  {
    const dom = carregar();
    const w = dom.window, d = w.document;
    d.querySelector('nav button[data-tab="quiz"]').click();
    d.getElementById('quizStart').click();
    ok(d.querySelectorAll('.quiz-opts button').length === 4, 'pergunta com 4 alternativas');
    const vals = [...d.querySelectorAll('.quiz-opts button')].map(b => +b.dataset.v);
    ok(new Set(vals).size === 4, 'alternativas sem repetição');

    // responde as 10 certas (clica em data-v === resposta)
    for (let i = 0; i < 10; i++) {
      const [a, b] = d.querySelector('.quiz-q').textContent.trim().split('×').map(s => parseInt(s));
      const r = a * b;
      d.querySelector(`.quiz-opts button[data-v="${r}"]`).click();
      await sleep(750); // nextQ agendado em 700ms
    }
    ok(d.querySelector('.result-box .big').textContent.trim() === '10/10', 'quiz perfeito → 10/10');
    const db = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db.bestQuiz === 10, 'recorde salvo (bestQuiz 10)');
    ok(db.totalRight === 10, 'acertos totais +10');
    const ms = Object.values(db.mastery);
    ok(ms.length === 10 && ms.every(v => v === 1), 'as 10 contas ganham mastery 1 (falta 2 pra ⭐)');
    ok(w.__T.masteredCount() === 0, 'nenhuma dominada ainda (⭐ exige 3 acertos)');
  }

  console.log('— DOMÍNIO ⭐ (3 acertos viram card verde) —');
  {
    const dom = carregar({ mastery: { '2x2': 3 }, totalRight: 0, bestQuiz: null, bestDes: null, streak: 1, lastDay: new Date().toISOString().slice(0,10), flashErr: {} });
    const w = dom.window, d = w.document;
    ok(w.__T.masteredCount() === 1, 'mastery 3 → conta dominada');
    ok(d.querySelector('.fact.mastered') !== null, 'card da 2×2 ganha borda verde de dominada');
    ok(d.getElementById('stMaster').textContent === '1/36', 'placar mostra 1/36');
  }

  console.log('— QUIZ COM ERRO (mastery zera, erro entra na revisão) —');
  {
    const todas = {};
    for (let a = 2; a <= 9; a++) for (let b = a; b <= 9; b++) todas[a + 'x' + b] = 2;
    const dom = carregar({ mastery: todas, totalRight: 0, bestQuiz: null, bestDes: null, streak: 1, lastDay: new Date().toISOString().slice(0,10), flashErr: {} });
    const w = dom.window, d = w.document;
    d.querySelector('nav button[data-tab="quiz"]').click();
    d.getElementById('quizStart').click();
    let keyErrada = null;
    for (let i = 0; i < 10; i++) {
      const [a, b] = d.querySelector('.quiz-q').textContent.trim().split('×').map(s => parseInt(s));
      const r = a * b;
      if (i === 0) {
        keyErrada = a + 'x' + b; // todas estavam com mastery 2
        const errada = [...d.querySelectorAll('.quiz-opts button')].find(b2 => +b2.dataset.v !== r);
        errada.click();
        ok(d.querySelector('.quiz-feed').textContent.includes('Era ' + r), 'feed mostra a resposta certa do erro');
        await sleep(1700); // erro espera 1600ms até a próxima pergunta
      } else {
        d.querySelector(`.quiz-opts button[data-v="${r}"]`).click();
        await sleep(750);
      }
    }
    const db = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db.mastery[keyErrada] === 0, 'erro zera a mastery da conta (volta pra estaca zero)');
    ok(w.__T.masteredCount() === 9, 'as 9 acertadas chegaram a mastery 3 → dominadas');
    ok(d.getElementById('stMaster').textContent === '9/36', 'placar de dominadas reflete');
    ok(d.querySelector('.result-box').textContent.includes('Revise'), 'tela final lista contas a revisar');
    ok(db.bestQuiz === 9, 'recorde 9/10 registrado');
  }

  console.log('— FLASHCARDS (peso de erro) —');
  {
    const dom = carregar();
    const w = dom.window, d = w.document;
    d.querySelector('nav button[data-tab="flash"]').click();
    ok(/\d+\s*×\s*\d+/.test(d.getElementById('flashFront').textContent), 'flashcard mostra uma conta');
    d.getElementById('flashcard').click();
    ok(d.getElementById('flashcard').classList.contains('flipped'), 'clique vira o cartão');
    ok(d.getElementById('flashBack').textContent.trim() !== '', 'verso tem a resposta');
    const antes = JSON.parse(w.localStorage.getItem('tabuada')).totalRight;
    d.getElementById('flashRight').click();
    const db1 = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db1.totalRight === antes + 1, '"acertei" soma no total');
    d.getElementById('flashcard').click(); // desvira
    await sleep(260); // showFlash troca conteúdo após 200ms
    const keyAntes = w.__T.FACTS[w.__T.flashIdx].key;
    d.getElementById('flashWrong').click();
    const db2 = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db2.flashErr[keyAntes] >= 1, '“errei” aumenta peso da conta (aparece mais)');
    ok(w.__T.pickFlash() >= 0 && w.__T.pickFlash() < 36, 'sorteio de flashcard dentro do baralho');
  }

  console.log('— DESAFIO 60s —');
  {
    const dom = carregar();
    const w = dom.window, d = w.document;
    d.querySelector('nav button[data-tab="desafio"]').click();
    d.getElementById('desStart').click();
    ok(d.getElementById('desTime').textContent.includes('60'), 'relógio começa em 60s');
    // responde uma certa
    const [a, b] = d.querySelector('#desafioBox .quiz-q').textContent.trim().split('×').map(s => parseInt(s));
    const inp = d.getElementById('desInput');
    inp.value = String(a * b);
    inp.onkeydown({ key: 'Enter' });
    ok(d.querySelector('#desafioBox b').textContent === '1', 'acerto contabiliza no desafio');
    await sleep(2200);
    ok(/5[78]s/.test(d.getElementById('desTime').textContent), 'relógio anda (60 → 58/57s)');
    // encerra e testa recorde
    w.__T.desScore = 5; w.__T.endDes();
    ok(d.querySelector('#desafioBox').textContent.includes('5 acertos'), 'resultado final renderiza');
    ok(d.querySelector('#desafioBox').textContent.includes('NOVO RECORDE'), 'primeiro desafio vira recorde');
    const db = JSON.parse(w.localStorage.getItem('tabuada'));
    ok(db.bestDes === 5, 'bestDes persiste no storage');
  }

  console.log('— HIGIENE DA CASA —');
  {
    ok(/prefers-reduced-motion/.test(html), 'respeita prefers-reduced-motion');
    const linhas = html.split('\n').filter(l => l.includes('linear-gradient'));
    ok(linhas.length === 2 && linhas.every(l => l.includes('transparent 1px')), 'zero gradiente decorativo (só as 2 linhas do quadriculado)');
    ok(!/38bdf8|a78bfa|#7c3aed|#8b5cf6/.test(html), 'nenhuma cor da cara-de-IA (azul-roxo genérico)');
    ok(/Caveat/.test(html) && /Atkinson\+Hyperlegible/.test(html), 'tipografia com identidade (Caveat + Atkinson)');
    ok(!/(ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|AIzaSy)/.test(html), 'zero segredo no arquivo');
    ok(fs.existsSync(path.join(__dirname, '..', 'LICENSE')), 'LICENSE MIT presente');
  }

  console.log(`\n═══ RESULTADO: ${pass} ✓ · ${fail} ✗ ═══`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('CRASH:', e); process.exit(1); });
