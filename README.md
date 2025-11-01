# LinkedIn Clone – MERN Stack

A full-stack LinkedIn clone built using the MERN stack (MongoDB, Express.js, React, Node.js).  
Users can sign up, log in, create posts, and view posts from other users.

Live link:https://linkedin-clone-rouge-three.vercel.app/
------------------------------------------
Project Structure
------------------------------------------

linkedin-clone/
│
├── backend/        -> Express + MongoDB server
├── frontend/       -> React + Vite + Tailwind client
├── .gitignore
├── package.json
└── README.md

------------------------------------------
Setup Instructions
------------------------------------------

1. Clone the repository

   git clone https://github.com/amarnadh-nagireddy/linkedinClone.git
   cd linkedin-clone

2. Install dependencies

   cd backend
   npm install

   cd ../frontend
   npm install

3. Setup environment variables

   In backend/.env

   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=8000

   In frontend/.env

   VITE_API_BASE_URL=http://localhost:8000

------------------------------------------
Run the Application
------------------------------------------

# Run backend
cd backend
npm run dev

# Run frontend
cd frontend
npm run dev

Visit http://localhost:5173

------------------------------------------
Tech Stack
------------------------------------------

Frontend: React, Tailwind CSS, Vite  
Backend: Node.js, Express.js, MongoDB  
Authentication: JWT  
API Communication: REST using Axios

------------------------------------------
Scripts
------------------------------------------

# If you use concurrently (optional)
npm run dev
