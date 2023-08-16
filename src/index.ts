import express, {Application} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import moviesRouter from "@api/routes/movies";
import {errorHandlingMiddleware} from "@api/middlewares/errorHandlingMiddleware";
import connectDatabase from "@infrastructure/db/mongoose";
import dotenv from 'dotenv';
import platformsRouter from "@api/routes/platforms";
import reviewsRouter from "@api/routes/reviews";
import {Connection} from "mongoose";

dotenv.config();

const app: Application = express();
const host = process.env.HOST || 'localhost';
const protocol = host === 'localhost' ? 'http' : 'https';
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

connectDatabase().then((connection:Connection) => {
    // eslint-disable-next-line no-console
    connection.on('error', console.error.bind(console, 'Database error:'));
});

// use Index.html as a landing page
app.use(express.static('public'));
// Routes
// app.use('/api/serverInfo', serverRouter);
app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/platforms', platformsRouter);
app.use('/api/v1', reviewsRouter);

// Error handling
app.use(errorHandlingMiddleware);

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀  The server has been successfully deployed`);
    // eslint-disable-next-line no-console
    console.log(`🛰  External communication enabled via: ${protocol}://${host}:${port}`);
});
