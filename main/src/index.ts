import * as amqp from 'amqplib';
const { RABBITMQ_URL } = process.env;

const credentials = {
  // to get credentials use getAuthUrl() and getCredentials() from './google-auth.ts'
};

try {
  runner();
} catch (err) {
  console.error(err);
}

const Queues = {
  FILES_LIST: 'FILES_LIST',
  FILES_LIST_REPLY: 'FILES_LIST_REPLY',
  GET_FILE: 'GET_FILE',
  GET_FILE_REPLY: 'GET_FILE_REPLY'
};

async function runner(): Promise<void> {
  const filesExtensions = ['png'];

  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const payload = { credentials, filesExtensions };

  // assert all queues
  await channel.assertQueue(Queues.FILES_LIST);
  await channel.assertQueue(Queues.FILES_LIST_REPLY);
  await channel.assertQueue(Queues.GET_FILE);
  await channel.assertQueue(Queues.GET_FILE_REPLY);

  channel.consume(Queues.FILES_LIST_REPLY, async msg => {
    const filesList = JSON.parse(msg.content.toString());
    console.log('Got files list', filesList);

    // get metadata of first 10 files
    filesList
      .slice(0, 10)
      .forEach(file => {
        const payload = { file, credentials };

        channel.sendToQueue(Queues.GET_FILE, new Buffer(JSON.stringify(payload)), {
          replyTo: Queues.GET_FILE_REPLY
        })
      });
  });

  channel.consume(Queues.GET_FILE_REPLY, msg => {
    const fileMetadata = JSON.parse(msg.content.toString());
    console.log('Got File Metadata', fileMetadata);
  });

  channel.sendToQueue(Queues.FILES_LIST, new Buffer(JSON.stringify(payload)), {
    replyTo: Queues.FILES_LIST_REPLY
  });
}
