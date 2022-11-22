import express from 'express';
import upload from 'express-fileupload';
import { routes } from './routes';
import { db } from "@config/db";
import { Kafka } from 'kafkajs';
import { request } from 'http';
import { Http2ServerRequest } from 'http2';

db.sync();

const app = express();

const kafka = new Kafka({
    clientId: 'micro-employee',
    brokers: ['brooker:9092']
})

const topic = 'microservices-topic'
const consumer = kafka.consumer({ groupId: 'micro-employee-group' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use(routes);

async function run(){
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            // const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            // console.log(`- ${prefix} ${message.key}#${message.value}`)

            await request(`/delete/company/${message.value}`)
        }
    })
}


export { app }