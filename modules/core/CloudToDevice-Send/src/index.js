require('dotenv').config();
const { Client } = require('azure-event-hubs');

const connectionString = process.env.IOTHUB_CONNECTION_STRING;

const printError = (err) => {
    console.log(err.message);
};

const printMessage = (message) => {
    console.log('Message received: ');
    console.log(JSON.stringify(message.body));
    console.log('');
};



const client = Client.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then((partitionIds) => {
        return partitionIds.map((partitionId) => {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);