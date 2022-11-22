import { app, producer } from './app';

async function run() {
    await producer.connect()
    app.listen(3000)
    
}

run().catch(console.error);