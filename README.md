# QuestFit

QuestFit is a personal fitness tracker that generates **adaptive daily workout quests**.  
It’s built with **Next.js**, deployable on **Vercel**, and designed to be fast, mobile-first, and fun.

---

## 🚀 Features

- **Daily quests**: smartly chosen mix of random, goal-biased, enjoyment-weighted, and corrective exercises
- **Adaptive progression**: per-exercise scaling using rolling averages of difficulty (RPE), capped for safety
- **Rep scheme variety**: rotates low-rep/high-weight, mid, and high-rep/low-weight schemes
- **Daily check-in**: “How are you feeling today?” input to bias quest difficulty and skip sore muscles
- **Logging**:
  - Sets, reps, weight, duration
  - RPE/difficulty score
  - Enjoyment score
  - “Felt it in” muscle group
  - Notes
- **Corrective logic**: uses an exercise → muscle map to detect misfires and add support work

---

## 🧠 How It Works

1. **Input**: Start each session with a quick daily check-in (fatigue + sore muscles).
2. **Quest Generation**:  
   - Filters out unsafe/sore movements  
   - Weights by goals, enjoyment, recency, and corrective needs  
   - Picks rep scheme for variety  
   - Scales each exercise using progression rules  
3. **Log Completion**: Track sets, RPE, enjoyment, and felt muscles.
4. **Update State**: Logs feed back into progression, enjoyment bias, and corrective adjustments.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (React, TypeScript)
- **Hosting**: Vercel
- **Data Storage**: LocalStorage (MVP); portable to SQLite/Supabase later
- **Config**: JSON/TS-driven for algorithm tuning

---

## 📂 Project Files

- `requirements.md` → Detailed functional spec  
- `quest_config.ts` → Configurable progression settings  
- `muscle_map.json` (future) → Primary muscles per exercise for corrective logic  

---

## 🎯 Roadmap

- [x] Spec and config files
- [ ] Core quest generation logic
- [ ] Logging UI
- [ ] Basic state persistence
- [ ] Progress/history view
- [ ] Export/import support

---

## 📝 License

Personal project — feel free to fork and adapt, no guarantees.