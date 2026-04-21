# CouncilX — Parliament AI 🏛️

> Three minds. One truth. Zero bias.

**Live Demo:** [councilx.vercel.app](https://councilx.vercel.app)

---

## About

CouncilX is an AI fairness platform that runs every query through **three independent GPT instances**. Two agents answer independently, a third evaluates both for bias and fairness, and the most unbiased response is shown to the user. Every interaction is saved as structured JSON to train a **Reward Model** — enabling reinforcement learning as a fairness layer between the LLMs.

---

## Problem Statement

Computer programs now make life-changing decisions — who gets a job, a loan, or medical care. If these systems learn from flawed historical data, they repeat and amplify those discriminatory mistakes at scale. CouncilX provides a transparent way to measure, flag, and fix bias before it impacts real people.

---

## How It Works

1. User submits a query
2. **Agent 1** and **Agent 2** respond independently
3. **Agent 3 (Evaluator)** scores both for bias, neutrality, and fairness
4. The highest-scoring response is shown to the user
5. All data (query + responses + scores) is saved as JSON
6. JSON dataset trains a **Reward Model → RLHF layer** over time

---

## Tech Stack

- **Frontend** — React + Vite
- **Styling** — Tailwind CSS
- **AI Agents** — OpenAI GPT API (3 instances)
- **Database** — Firebase Firestore
- **Data Format** — JSON (for reward model training)
- **Deployment** — Vercel

---

## Approach

**Multi-Agent Parliament** — Instead of trusting one LLM, three GPT instances deliberate on every query. The evaluator agent has no stake in answering — it only judges, removing the single point of failure in traditional AI pipelines.

**Scoring & Selection** — The evaluator scores both responses on fairness metrics. The system picks the most balanced answer and surfaces it to the user with full transparency.

**RLHF Data Pipeline** — Every interaction is stored in structured JSON, purpose-built to train a reward model. That model will eventually act as a reinforcement learning layer — nudging future responses toward fairness automatically.

---

## Roadmap

- [ ] Train initial Reward Model on collected data
- [ ] Integrate RLHF as a middleware layer
- [ ] CSV/JSON dataset upload for external bias audits
- [ ] Bias heatmaps and visual fairness reports
- [ ] Support for open-source LLMs (Mistral, LLaMA)

---

## Local Setup

```bash
git clone https://github.com/garvit-arora/parliament-ai.git
cd parliament-ai
npm install
npm run dev
```

Add a `.env` file with your `VITE_OPENAI_API_KEY` and Firebase credentials.

---

**Built by [Garvit Arora](https://github.com/garvit-arora)**
*PS: Ensuring Fairness and Detecting Bias in Automated Decisions*
