# 🧮 Tabuada Diária

[![testes](https://github.com/lucasgabrieldevgg/tabuada-diaria/actions/workflows/ci.yml/badge.svg)](https://github.com/lucasgabrieldevgg/tabuada-diaria/actions/workflows/ci.yml)

**## 🌐 Teste agora
**https://lucasgabrieldevgg.github.io/tabuada-diaria/** — grátis, sem conta, funciona offline. Tudo fica salvo no teu navegador.**

> Um caderno de matemática que estuda com você todo dia: as 36 multiplicações (do 2×2 ao 9×9), flashcards que insistem nas que você erra, quiz com sistema de domínio ⭐, desafio contra o relógio e um plano de 7 dias — com os macetes de professora marcados a amarelo.

## 📚 Como funciona

**📋 Tabela** — as 36 contas em cards; clique para esconder as respostas e se testar. As bolinhas 🟢 mostram seu domínio.

**🃏 Flashcards** — veja a conta, pense, vire o cartão. **Errar não é problema**: as contas que você erra voltam mais vezes (peso ×3).

**🎯 Quiz** — 10 perguntas, 4 alternativas. Acertar 3 vezes a mesma conta ela fica **⭐ dominada**; errar zera o progresso dela. No final, a lista do que revisar.

**⏱️ Desafio** — 60 segundos, digite e Enter. Recorde seu fica salvo pra bater amanhã.

**💡 Dicas** — os macetes clássicos: truque dos dedos do 9, "5,6,7,8" do 7×8=56, dobrar do 4 e do 8…

**📅 Plano de 7 dias** — do 2×2 ao automático em uma semana, ~10 min por dia.

## 🔥 Constância

O app marca **🔥 dias seguidos** — estudou hoje, a chama continua. Sumiu dias, ela reinicia em 1 (sem drama: o recorde de quiz e desafio nunca se perde).

## 🧪 Qualidade

- **48 testes de comportamento** (jsdom, `npm test`): streak diária (ontem/hoje/sumiu), quiz completo com domínio e zerada no erro, flashcards com peso, desafio com recorde — testando a lógica real do app;
- **CI no GitHub Actions** a cada push;
- **Zero dependência em runtime**: um único `index.html` offline.

## 📦 Rodar local

```
npm install   # só pra suíte
npm test      # 48 testes
npm run serve # http://localhost:8080
```

Ou simplesmente abra `index.html` no navegador.

## 📄 Licença

MIT — veja [LICENSE](LICENSE).
