import * as amqp from 'amqplib';
import { getFilesList, getFileMetadata, getAuthClient } from './google-drive-connector';

const { RABBITMQ_URL } = process.env;

try {
  runner();
} catch (err) {
  console.error(err);
}

const Queues = {
  FILES_LIST: 'FILES_LIST',
  GET_FILE: 'GET_FILE'
};

async function runner(): Promise<void> {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(Queues.FILES_LIST);
  await channel.assertQueue(Queues.GET_FILE);

  // handle request for files list
  channel.consume(Queues.FILES_LIST, async msg => {
    const payload = JSON.parse(msg.content.toString());
    console.log('Got request for files list', payload);

    const { credentials, filesExtensions } = payload;
    const auth = getAuthClient(credentials);
    const filesList = await getFilesList(filesExtensions, auth);

    channel.ack(msg);
    await channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(filesList)));
  }, { noAck: false });

  // handler request for file metadata
  channel.consume(Queues.GET_FILE, async msg => {
    const payload = JSON.parse(msg.content.toString());
    console.log('Got request for file metadata', payload);

    const { credentials, file } = payload;
    const auth = getAuthClient(credentials);
    const filesList = await getFileMetadata(file.id, auth);

    channel.ack(msg);
    await channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(filesList)));
  }, { noAck: false });
}
