[🇧🇷 Português](README.pt-BR.md)

# 🧮 Daily Times Tables

[![tests](https://github.com/lucasgabrieldevgg/tabuada-diaria/actions/workflows/ci.yml/badge.svg)](https://github.com/lucasgabrieldevgg/tabuada-diaria/actions/workflows/ci.yml)

## 🌐 Try it now
**https://lucasgabrieldevgg.github.io/tabuada-diaria/** — free, no account, works offline. Everything is saved in your browser.

> A math notebook that studies with you every day: the 36 multiplications (from 2×2 to 9×9), flashcards that insist on the ones you miss, a quiz with a ⭐ mastery system, a beat-the-clock challenge and a 7-day plan — with teacher's tricks highlighted in yellow.

## 📚 How it works

**📋 Table** — all 36 problems as cards; click to hide the answers and test yourself. The 🟢 dots show your mastery.

**🃏 Flashcards** — see the problem, think, flip the card. **Getting it wrong is no big deal**: problems you miss come back more often (×3 weight).

**🎯 Quiz** — 10 questions, 4 options. Get the same problem right 3 times and it becomes **⭐ mastered**; miss it and its progress resets. At the end, a review list.

**⏱️ Challenge** — 60 seconds, type and Enter. Your high score is saved so you can beat it tomorrow.

**💡 Tips** — the classic tricks: the 9s finger trick, "5,6,7,8" for 7×8=56, doubling for 4 and 8…

**📅 7-day plan** — from 2×2 to automatic in one week, ~10 min a day.

## 🔥 Consistency

The app tracks a **🔥 day streak** — study today and the flame keeps burning. Miss days and it restarts at 1 (no drama: quiz and challenge high scores are never lost).

## 🧪 Quality

- **55 behavior tests** (jsdom, `npm test`): daily streak (yesterday/today/missed), full quiz with mastery and reset-on-miss, weighted flashcards, timed challenge with high score — testing the app's real logic;
- **CI on GitHub Actions** on every push;
- **Zero runtime dependencies**: a single offline `index.html`.

## 🌗 Light and dark themes

The notebook has its **own dark mode** — "notebook by lamplight": night-blue paper, ghost grid, glowing red margin. The 🌙 sits in the header corner; first visit follows your system and the choice is remembered (no flash on load).

## 📦 Run locally

```
npm install   # only for the test suite
npm test      # 55 tests
npm run serve # http://localhost:8080
```

Or just open `index.html` in the browser.

## 📄 License

MIT — see [LICENSE](LICENSE).
