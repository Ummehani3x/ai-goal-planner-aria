🚀 AI Goal Planner – Aria

An AI-powered goal planning app that turns any goal into a clear, actionable roadmap — powered by Gemini AI.

No saved sessions. No broken IDs. Every refresh = fresh AI thinking.

✨ Features

🧠 AI-Generated Roadmaps — Enter a goal, get a structured plan instantly

🗺️ Phase-Based Planning — Foundation → Growth → Mastery

💬 Ask Aria

Explain this step

How can I improve this?

What’s my next move?

⚡ Stateless Architecture — No database, no persistence bugs

🎯 Actionable Guidance — Short, focused, do‑today advice

✨ Premium UI/UX — Smooth animations, gradients, and micro‑interactions

🧠 How It Works

User enters a goal

Redirects to /roadmap?goal=your-goal

Backend calls Gemini AI

AI generates a fresh strategy

User interacts with Aria for deeper guidance

Every interaction calls AI directly — nothing is cached.

🛠️ Tech Stack

Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

Framer Motion

Backend

Node.js

Express.js

Gemini AI API

📁 Project Structure
client/
 ├─ src/app/
 │   ├─ page.tsx          # Landing page
 │   ├─ roadmap/page.tsx  # AI roadmap page
 │   └─ layout.tsx
 ├─ src/components/
 │   ├─ GoalInput.tsx
 │   ├─ PlanOutput.tsx
 │   └─ AriaLoader.tsx
 └─ src/lib/api.ts


server/
 ├─ routes/
 │   ├─ strategy.js
 │   └─ aria.js
 ├─ services/aiService.js
 └─ index.js
▶️ Getting Started
1️⃣ Clone the repo
git clone https://github.com/your-username/ai-goal-planner.git
2️⃣ Frontend
cd client
npm install
npm run dev

Runs on: http://localhost:3000

3️⃣ Backend
cd server
npm install
npm run dev

Runs on: http://localhost:5000

🔐 Environment Variables

Create a .env file in server/:

GEMINI_API_KEY=your_api_key_here
🎯 What I Learned

Real-world AI integration (not just UI)

Stateless backend design

Handling AI failures gracefully

Designing AI that feels alive

Building trust through UX

📌 Project Status

✅ Fully working MVP 🚧 UI polish & content pages in progress ✨ Persistence & user accounts planned (Phase 2)

👩‍💻 Author

Umm‑e‑Hani
Frontend / Full‑Stack Developer

GitHub: https://github.com/your-username

LinkedIn: https://linkedin.com/in/your-profile

⭐ If you like this project, give it a star — it helps a lot!
