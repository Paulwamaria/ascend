🚀 Ascend Frontend (React + Tailwind)

Ascend is a growth-focused social platform that combines community, challenges, competition, and hope to help people level up their lives.

This repository contains the React + Tailwind CSS frontend that connects to the Ascend Django REST API.

✨ Features

🔐 JWT authentication (login & register)

🌱 Hope Feed (share wins & encouragement)

👥 Circles (community groups)

🎯 Challenges system (join, submit progress, earn points)

🏆 Leaderboard & leveling

🛡 Staff/Admin challenge creation

📱 Fully responsive UI (Tailwind CSS)

🧱 Tech Stack

React (Vite)

Tailwind CSS

TanStack React Query

Axios

React Router

Backend: Django REST API

📂 Project Structure
src/
 ├── api/          # axios setup
 ├── auth/         # AuthContext + routes
 ├── components/  # UI components
 ├── pages/       # App pages
 ├── App.jsx
 └── main.jsx

⚙️ Setup & Installation (Fedora/Linux)
1️⃣ Install dependencies
npm install

2️⃣ Create environment file
touch .env


Add:

VITE_API_BASE=http://127.0.0.1:8000/api


(or your deployed backend URL)

3️⃣ Run development server
npm run dev


Frontend runs on:

http://localhost:5173

🔐 Auth Flow (How it works)

Login → receives access + refresh token

Refresh token stored in localStorage

Access token attached automatically to API calls

Auto refresh on 401 responses

🛠 Staff Access

Only staff users can access:

/staff/challenges


To create new challenges.

Backend enforces IsAdminUser permission.

📦 Build for production
npm run build

☁️ Deployment (Vercel)

Push repo to Bitbucket/GitHub

Import project into Vercel

Add environment variable:

VITE_API_BASE=https://YOUR_BACKEND_URL/api


Deploy 🎉

🚧 Planned Improvements

Badge system & achievements

Challenge approval workflow

Notifications

Profile progress visualization

Mobile-first polish

Dark/light theme toggle

🤝 Contributing

Pull requests welcome!
Open issues for feature ideas and bugs.

🧠 Vision

Ascend is built to help people:

Connect. Compete. Grow. Rise.

One step at a time.