const amqp = require("amqplib");

async function connect() {
  try {
    const connection = await amqp.connect(process.env.AMQ_URL);
    const channel = await connection.createChannel();
    return { channel, connection };
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
}

async function assertQueue(channel, queue, options) {
  try {
    await channel.assertQueue(queue, options);
  } catch (error) {
    console.error("Queue assertion error:", error);
    throw error;
  }
}

async function sendMessageToQueue(queue, message, options = { durable: true }) {
  try {
    const { channel, connection } = await connect();
    await assertQueue(channel, queue, options);

    channel.sendToQueue(queue, Buffer.from(message));

    await channel.close();
    await connection.close();
  } catch (error) {
    throw error;
  }
}

async function receiveMessageFromQueue(queue, cb, options) {
  try {
    const { channel, connection } = await connect();
    await assertQueue(channel, queue, options);

    // Consume message
    await channel.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          await cb(msg);
          channel.ack(msg); // Acknowledge the message
        }
      },
      options
    );

    // Note: Do not close the channel and connection here as it will stop consuming messages
  } catch (error) {
    console.error("Send message error:", error);
  }
}

module.exports = { sendMessageToQueue, receiveMessageFromQueue };
