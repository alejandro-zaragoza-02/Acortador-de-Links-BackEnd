import 'dotenv/config';
import './database/connect.js'
import express from "express";
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import linkRouter from './routes/link.route.js';
import redicRouter from './routes/redirect.route.js'
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 4000;
const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function(origin, callback){
        if(!origin || whiteList.includes(origin)){
            return callback(null, origin);
        }
        return callback('Error en los CORS origin: ' + origin + ' No autorizado!');
    },
    credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/links', linkRouter);
app.use('/', redicRouter);

app.listen(port, () => {
    console.log('Servidor iniciado:', `http://localhost:${port}`);
});