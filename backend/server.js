import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/dbConfig.js';
import user from './routes/user.js';
import post from './routes/post.js';

dotenv.config();

const app = express();
connectDb();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true, 
  })
);


app.get('/', (req, res) => {
  res.send('API is running....');
});

app.use("/user", user);
app.use("/post", post);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
