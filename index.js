import 'dotenv/config';
import './database/connect.js'
import express from "express";
import authRouter from './routes/auth.route.js'

const app = express();
const port = process.env.port ?? 4000;

app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log('Servidor iniciado:', `http://localhost:${port}`);
});