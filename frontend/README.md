# LinkedIn Clone Frontend

This folder contains the frontend for the LinkedIn Clone built with React, Vite, and Tailwind CSS.


Live link: https://linkedin-clone-rouge-three.vercel.app/
------------------------------------------
Installation
------------------------------------------

cd frontend
npm install

------------------------------------------
Environment Variables
------------------------------------------

Create a .env file in this folder:

VITE_API_BASE_URL=http://localhost:8000

------------------------------------------
Running the App
------------------------------------------

npm run dev

The frontend runs by default on http://localhost:5173

------------------------------------------
Folder Structure
------------------------------------------

frontend/
│
├── src/
│   ├── components/    -> Navbar, PostCard, etc.
│   ├── pages/         -> Login, Signup, Home
│   ├── context/       -> Auth context
│   ├── hooks/         -> Custom React hooks
│   └── App.jsx
│
├── index.html
├── package.json
└── vite.config.js

------------------------------------------
Tech Stack
------------------------------------------

React  
Vite  
Tailwind CSS  
Axios for API calls  
React Router for navigation
