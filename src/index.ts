import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectToMongoDB } from './db/connectDB';
import router from './routes';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', router);
app.all('*', (req: Request, res: Response) => {
    res.status(400).json({message: 'This page does not exist...'});
});

const port: number = Number(process.env.PORT);

connectToMongoDB()

app.listen(port, () => console.log(`Server running on port ${port}`));

