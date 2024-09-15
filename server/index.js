import express from 'express';
const app = express();
import dotenv from 'dotenv'
import userRouter from './routes/userRouter.js'
import employeeRouter from './routes/employeeRouter.js'
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// console.log(process.env.MONGO_URI)

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.use("/auth", userRouter)
app.use("/api", employeeRouter)

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong " } = err;
    res.status(statusCode).json({ message });
  });

app.get("/", (req, res) => {
    res.send("Hello world");
})