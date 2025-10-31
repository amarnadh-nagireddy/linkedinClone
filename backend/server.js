import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConfig.js';
const app=express();
import user from './routes/user.js';
import post from './routes/post.js';
dotenv.config();
connectDb();

app.use(express.json());

const PORT=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('API is running....');
});
app.use("/user",user);
app.use("/post",post);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
