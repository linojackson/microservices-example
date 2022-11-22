import express from 'express';
import { routes } from './routes';
import { db } from "@config/db";
import { Kafka } from 'kafkajs';

db.sync();

const app = express();

const kafka = new Kafka({
    clientId: 'micro-company',
    brokers: ['brooker:9092']
})

const producer = kafka.producer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.producer = producer

    return next()
})
app.use(routes);

export { app, producer }