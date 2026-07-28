<div align="center">

# EduArtha

### Understand English. Learn with Clarity.

EduArtha is an AI-powered educational assistant that transforms complex English educational content into simple, easy-to-understand Hindi explanations using **Google's Gemma 4**.

Built for the **Build with Gemma 4 | AI Durg Hackathon** under the **Vaani – Voice First Translation for Bharat** track.

<br>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemma 4](https://img.shields.io/badge/Gemma-4-4285F4?style=for-the-badge)]()
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Live Demo:** https://eduartha.vercel.app/

</div>

---

# Rethinking Educational Translation

Most translation tools focus on converting words from one language to another.

EduArtha focuses on something more important—**understanding**.

Educational content often contains technical terminology and abstract concepts that become even more confusing after direct translation. EduArtha uses Google's **Gemma 4** to explain concepts in simple Hindi, helping learners understand ideas rather than memorize translated sentences.

Whether it's a textbook paragraph, lecture notes, or study material from a PDF, EduArtha acts like a patient learning companion that simplifies the learning process.

---

# What EduArtha Offers

| Feature | Description |
|----------|-------------|
| AI-Powered Explanations | Convert English educational content into simple Hindi explanations using Gemma 4 |
| PDF Support | Upload study material directly for AI-powered explanations |
| Learning Dashboard | Access your workspace through a clean and intuitive interface |
| Learning History | Revisit previously generated explanations anytime |
| Personal Settings | Manage your account and application preferences |
| Secure Authentication | Google Login and Email Login powered by Supabase |

---

# Built With

| Category | Technology |
|-----------|------------|
| Frontend | Next.js 15, React, TypeScript |
| UI | Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Next.js API Routes |
| AI | Google AI Studio API, Gemma 4 |
| Database | Supabase |
| Authentication | Supabase Auth |
| Deployment | Vercel |

---

# Application Flow

<p align="center">
<img src="./screenshots/architecture.png" width="900"/>
</p>

```text
          User Input
               │
               ▼
        Next.js Frontend
               │
               ▼
          API Routes
               │
               ▼
        Prompt Processing
               │
               ▼
 Google AI Studio API
          Gemma 4
               │
               ▼
     AI Generated Explanation
               │
               ▼
           Supabase
               │
               ▼
      Explanation History
```

---

# Application Preview

## Landing Page

![](./screenshots/landing.png)

---

## Dashboard

![](./screenshots/dashboard.png)

---

## Explanation Page

![](./screenshots/explain.png)

---

## History

![](./screenshots/history.png)

---

## Settings

![](./screenshots/settings.png)

---

# Powered by Gemma 4

EduArtha is built around **Google's Gemma 4**, enabling it to generate educational explanations instead of literal translations.

Each request follows a structured prompting pipeline where the model is instructed to:

- Identify the core concept.
- Ignore unnecessary wording.
- Explain ideas in simple Hindi.
- Preserve important English technical terms.
- Generate learner-friendly responses.

This approach allows EduArtha to provide explanations that are easier to understand while maintaining the educational context of the original content.

---

# Getting Started

Clone the repository.

```bash
git clone https://github.com/your-username/EduArtha.git
```

Navigate into the project.

```bash
cd EduArtha
```

Install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# Environment Variables

Create a `.env.local` file.

```env
GOOGLE_API_KEY=

SUPABASE_URL=

SUPABASE_ANON_KEY=
```

---

# Team

## NeuroStars

Built during the **Build with Gemma 4 | AI Durg Hackathon**.

---

# Acknowledgements

Special thanks to:

- Google DeepMind
- Google AI Studio
- Gemma 4
- Supabase
- Vercel
- Next.js

---

<div align="center">

### Education becomes meaningful when learners understand the concept—not just the language.

**EduArtha** is our step toward making quality education more accessible through AI-powered concept explanations.

</div>
