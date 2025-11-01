# LinkedIn Clone Backend

This folder contains the backend server for the LinkedIn Clone built using Node.js, Express, and MongoDB.

------------------------------------------
Installation
------------------------------------------

cd backend
npm install

------------------------------------------
Environment Variables
------------------------------------------

Create a .env file in this folder with the following values:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000

------------------------------------------
Running the Server
------------------------------------------

# Start the server in development mode
npm run dev

The backend runs by default on http://localhost:8000

------------------------------------------
Folder Structure
------------------------------------------
<pre> ``` backend/ │ ├── config/ -> Database configuration ├── controllers/ -> Route logic ├── models/ -> Mongoose schemas ├── routes/ -> Express routes ├── middleware/ -> Auth middlewares ├── server.js └── .env ``` </pre>

------------------------------------------
API Overview
------------------------------------------

POST /user/signup      -> Register new user
POST /user/login       -> Login and receive token
GET  /post/            -> Fetch all posts
POST /post/            -> Create new post

------------------------------------------
Tech Stack
------------------------------------------

Node.js  
Express.js  
MongoDB (Mongoose)  
JWT Authentication
