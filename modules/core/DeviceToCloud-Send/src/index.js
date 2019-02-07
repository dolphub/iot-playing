require('dotenv').config();

const connectionString = process.env.IOTHUB_CONNECTION_STRING;

if (!process.env.IOTHUB_CONNECTION_STRING) {
    console.warn('No Connection String Found in Environment.\nExiting 1.');
    process.exit(1);
}

const targetDevice = 'testDevice';

const { Client } = require('azure-iothub');
const { Message } = require('azure-iot-common');

const serviceClient = Client.fromConnectionString(connectionString);

serviceClient.open((err) => {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Service client connected');
        serviceClient.getFeedbackReceiver(receiveFeedback);
        const message = new Message(`Hello device ${targetDevice}`);
        message.ack = 'full';
        message.messageId = "My Message ID";
        console.log('Sending message: ' + message.getData());
        serviceClient.send(targetDevice, message, printResultFor('send'));
    }
});

function receiveFeedback(err, receiver) {
    receiver.on('message', function (msg) {
        console.log('Feedback message:');
        console.log(msg.getData().toString('utf-8'));
    });
}

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}