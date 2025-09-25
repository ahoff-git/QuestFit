# Functional Requirements – QuestFit

## 🧠 Quest Generation

- Generate a list of "quests" (exercises) per day based on:
  - User goals (e.g. abs, arms, back)
  - Enjoyment history (weighted preference for liked exercises)
  - Muscle fatigue/soreness input (avoid or go light on sore muscles)
  - Recovery timing (don't overuse muscles back-to-back)
  - Volume sanity checks (weekly per-muscle limits)
  - Misfiring correction (if muscles felt ≠ expected, add support work)

- Rep scheme should rotate:
  - Low rep / high weight
  - High rep / low weight
  - Medium rep / medium weight

- Bias algorithm must be:
  - Modular and tunable (configurable weights, randomization temperature)
  - Never hardcoded for percentages

## 📈 Progression Tracking

- Track performance per exercise
- Calculate a **rolling average** RPE or difficulty score (last 3–5 sessions)
- Use this to auto-scale next session’s difficulty up/down
- Support decay (de-load) after missed days or high difficulty

## 😌 User State Input

- Each day, user inputs:
  - How they feel overall (normal / easy / hard)
  - Sore muscles (to skip or downscale)
  - Notes

## 🧾 Logging

- Fields to log:
  - Exercise name
  - Sets, reps, weight, duration
  - RPE / difficulty (1–10)
  - Enjoyment score (1–5 or thumbs up/down)
  - "Felt it in" muscle group (dropdown)
  - Notes

- Logs affect:
  - Progression logic (rolling average)
  - Enjoyment weights
  - Misfire flagging

## 🧠 Muscle Map

- Maintain an exercise-to-muscle map with:
```ts
{
  exercise_id: {
    primary: [muscle_ids],
    synergists: [muscle_ids],
    common_misfires: {
      "felt_in": [likely_causes]
    }
  }
}